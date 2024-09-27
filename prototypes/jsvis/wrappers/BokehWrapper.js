import {ConfigurationEvent} from "../events/ConfigurationEvent";
import {DataProcessorContainer} from "../containers/DataProcessorContainer";
import {VisualizationContainer} from "../containers/VisualizationContainer";
import {WrapperContainer} from "../containers/WrapperContainer";
import {SettingsConfiguration} from "../settings/SettingsConfiguration";

export class BokehWrapper {

    static container_id = 'visualization-container';

    static library = 'bokeh';

    static title = {
        'light-curve': 'Light curve',
        'spectrum': 'spectrum'
    }

    static specific_settings = {
        'bokeh-settings': {
            display: true,
            'bokeh-options': {
                tools: {
                    display: false
                }
            }
        }
    };

    container = null;

    configuration_object = null;

    constructor() {
        //this._setContainer();
        //this._setupListeners();
    }

    setup() {
        this._setContainer();
        this._setupListeners();
    }

    _setContainer() {
        this.container = document.getElementById(BokehWrapper.container_id);
    }

    _resetContainer() {
        this.container.innerHTML = "";
    }

    _setupListeners() {
        document.addEventListener('settings-changed', this.handleSettingsChangedEvent.bind(this));
        document.addEventListener('visualization-generation', this.handleVisualizationGenerationEvent.bind(this));
    }

    handleSettingsChangedEvent(event) {
        let settings_object = event.detail.settings_object;

        let library_settings = settings_object.getLibrarySettings();

        if(library_settings.library === BokehWrapper.library) {
            this.createConfigurationObject();

            if(this.configuration_object !== null) {
                let configuration_event = new ConfigurationEvent(this.configuration_object);

                configuration_event.dispatchToSubscribers();
            }
        }
    }

    handleVisualizationGenerationEvent(event) {
        this.settings_object = event.detail.settings_object;

        let library_settings = this.settings_object.getLibrarySettings();

        if(library_settings.library === BokehWrapper.library) {

            this._resetContainer();

            let dataset_settings = {};

            let columns = this.settings_object.getColumnsSettings();

            let axis = this.settings_object.getAxisSettings();
            let axis_settings = [];

            for(let axis_column in axis) {
                let axis_column_object = this._getColumnSettings(axis[axis_column]);
                axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                axis_settings.push(axis_column_object);
            }

            dataset_settings.axis = axis_settings;
            dataset_settings.data_type = this.settings_object.getDataTypeSettings();

            let error_bars = this.settings_object.getErrorBarsSettings();
            let has_error_bars = false;

            if(error_bars !== null) {

                let error_bars_settings = [];
                for(let axis_column in error_bars) {
                    let axis_column_object;

                    if(columns[axis_column+'_error'].column_type === 'standard') {
                        axis_column_object = this._getColumnSettings(error_bars[axis_column]);
                        axis_column_object = {...axis_column_object, ...{axis: axis_column}, ...{'column_type': 'standard'}}
                    } else if(columns[axis_column+'_error'].column_type === 'processed') {
                        axis_column_object = this._getCustomColumnSettings(error_bars[axis_column]);
                        axis_column_object = {...axis_column_object, ...{axis: axis_column}, ...{'column_type': 'processed'}}
                    } else {
                        axis_column_object = this._getColumnSettings(error_bars[axis_column]);
                        axis_column_object = {...axis_column_object, ...{axis: axis_column}, ...{'column_type': 'standard'}}
                    }

                    error_bars_settings.push(axis_column_object);
                }

                dataset_settings.error_bars = error_bars_settings;
            }

            let dpp = DataProcessorContainer.getDataProcessorContainer().getDataPreProcessor();

            let processed_data = dpp.getProcessedDataset(dataset_settings);

            let data_type = this.settings_object.getDataTypeSettings();

            let scales = this.settings_object.getScalesSettings();


            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};
            let labels = axis;

            processed_data.axis[0].data = processed_data.axis[0].data.map(value => isNaN(value) ? 0 : value);
            processed_data.axis[1].data = processed_data.axis[1].data.map(value => isNaN(value) ? 0 : value);


            let data = {x: processed_data.axis[0].data, y: processed_data.axis[1].data};

            if(error_bars) {

                let error_bars_object = {};

                processed_data.error_bars.forEach((error_bar) => {
                    error_bar.data = error_bar.data.map(value => !isFinite(value) ? 0 : value);
                    error_bar.data = error_bar.data.map(value => isNaN(value) ? 0 : value);

                    error_bars_object[error_bar.axis] = error_bar.column_name;

                    if(error_bar.axis === 'x') {
                        data.dx = error_bar.data;
                    } else if(error_bar.axis === 'y') {
                        data.dy = error_bar.data;
                    }
                })

                /*
                error_bars = {x: processed_data.error_bars[0].column_name, y: processed_data.error_bars[1].column_name};

                processed_data.error_bars[0].data = processed_data.error_bars[0].data.map(value => !isFinite(value) ? 0 : value);
                processed_data.error_bars[1].data = processed_data.error_bars[1].data.map(value => !isFinite(value) ? 0 : value);

                data.dx = processed_data.error_bars[0].data.map(value => isNaN(value) ? 0 : value);
                data.dy = processed_data.error_bars[1].data.map(value => isNaN(value) ? 0 : value);
                */

                let asymmetric_uncertainties = false;

                if(data_type === 'spectrum') {
                    asymmetric_uncertainties = true;
                }

                data = this._processErrorBarData(data, asymmetric_uncertainties);

                has_error_bars = true;
            }

            let ranges = this.settings_object.getRangesSettings();
            let custom_range_data = null;

            if(ranges != null) {

                if(has_error_bars) {
                    custom_range_data = dpp.processDataForRangeBokeh(ranges, data, true);
                } else {
                    custom_range_data = dpp.processDataForRangeBokeh(ranges, data);
                }

                data = custom_range_data;
            }

            let visualization = VisualizationContainer.getBokehVisualization();

            visualization.initializeSettings(data, labels, scales, BokehWrapper.title['data_type'], error_bars, ranges);

            visualization.initializeGraph();
        }
    }

    _getCustomColumnSettings(column_settings) {
        return {
            column_expression: column_settings
        };
    }

    _getColumnSettings(column_settings) {
        let settings = column_settings.split('$');

        let column_location = settings[0].split('.');
        let column_name = settings[1] || '';

        let file_id = column_location[0];
        let hdu_index = column_location.length > 1 ? column_location[1] : '';

        return {
            file_id: file_id,
            hdu_index: hdu_index,
            column_name: column_name
        };
    }

    _processErrorBarData(data, asymetric_uncertainties = false) {

        let div_factor= 2;

        if(asymetric_uncertainties) {
            div_factor = 1;
        }

        if(data.dx) {
            let x_low = [];
            let x_up = [];

            for(let i in data.dx) {
                x_low[i] = data.x[i] - data.dx[i] / div_factor;
                x_up[i] = data.x[i] + data.dx[i] / div_factor;
            }

            data.x_low = x_low;
            data.x_up = x_up;

            delete data.dx;
        }

        if(data.dy) {
            let y_low = [];
            let y_up = [];

            for(let i in data.dy) {
                y_low[i] = data.y[i] - data.dy[i];
                y_up[i] = data.y[i] + data.dy[i];
            }

            data.y_low = y_low;
            data.y_up = y_up;

            delete data.dy;

        }

        /*
        let y_low = [], y_up = [], x_low = [], x_up = [];

        for (let i in data.dy) {
            y_low[i] = data.y[i] - data.dy[i];
            y_up[i] = data.y[i] + data.dy[i];
            x_low[i] = data.x[i] - data.dx[i] / div_factor;
            x_up[i] = data.x[i] + data.dx[i] / div_factor;
        }

        data.y_low = y_low;
        data.y_up = y_up;
        data.x_low = x_low;
        data.x_up = x_up;

        delete data.dy;
        delete data.dx;
        */

        return data;
    }

    createConfigurationObject() {
        this.configuration_object = SettingsConfiguration.getConfigurationObject(BokehWrapper.specific_settings);
    }

}