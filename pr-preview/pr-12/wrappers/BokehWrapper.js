class BokehWrapper {

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
                    display : false
                }
            }
        }
    };

    container = null;

    configuration_object = null;

    constructor() {
        this._setContainer();
        this._setupListeners();
    }

    _setContainer() {
        console.log(document.getElementById(BokehWrapper.container_id));
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

        console.log(settings_object);

        let library_settings = settings_object.getLibrarySettings();

        console.log(library_settings);

        if(library_settings.library === BokehWrapper.library) {
            this.createConfigurationObject();

            console.log(this.configuration_object);

            if(this.configuration_object !== null) {
                let configuration_event = new ConfigurationEvent(this.configuration_object);

                console.log(configuration_event);

                configuration_event.dispatchToSubscribers();
            }
        }
    }

    handleVisualizationGenerationEvent(event) {
        this.settings_object = event.detail.settings_object;

        console.log(this.settings_object);

        let library_settings = this.settings_object.getLibrarySettings();

        if(library_settings.library === BokehWrapper.library) {

            this._resetContainer();

            let data_type = this.settings_object.getDataTypeSettings();
            let hdu = this.settings_object.getHDUsSettings();

            let axis = this.settings_object.getAxisSettings();
            let labels = axis;

            let scales = this.settings_object.getScalesSettings();

            let has_error_bars = false;
            let error_bars = this.settings_object.getErrorBarsSettings();

            if(error_bars !== null) {
                has_error_bars = true;
            }

            let data = this.getProcessedData(data_type.type, hdu['hdu_index'], axis, error_bars);

            let visualization = VisualizationContainer.getBokehVisualization();

            visualization.initializeSettings(data, labels, scales, BokehWrapper.title['data_type'], error_bars);

            visualization.initializeGraph();
        }
    }

    getProcessedData(data_type, hdu_index, axis, error_bars) {
        let data = null;

        let dpc = DataProcessorContainer.getDataProcessorContainer();
        let data_processor;

        let frw = WrapperContainer.getFITSReaderWrapper();

        if(data_type === 'light-curve') {
            data_processor = dpc.getLightCurveProcessor(frw, hdu_index);
        } else if(data_type === 'spectrum') {
            data_processor = dpc.getSpectrumProcessor(frw, hdu_index);
        }

        data = data_processor.processDataRawJSON(axis, error_bars);

        console.log("Data bokeh");
        console.log(error_bars);
        console.log(data);

        if(error_bars) {
            data = this._processErrorBarData(data);
        }

        return data;
    }

    _processErrorBarData(data) {

        let y_low = [], y_up = [], x_low = [], x_up = [];

        console.log("Bokeh wrapper process data");
        console.log(data.dy);
        console.log(data.timedel);

        //let timedel = data.timedel[0];

        for (let i in data.dy) {
            y_low[i] = data.y[i] - data.dy[i];
            y_up[i] = data.y[i] + data.dy[i];
            x_low[i] = data.x[i] - data.timedel[i] / 2;
            x_up[i] = data.x[i] + data.timedel[i] / 2;
        }

        data.y_low = y_low;
        data.y_up = y_up;
        data.x_low = x_low;
        data.x_up = x_up;

        delete data.dy;
        delete data.timedel;

        return data;
    }

    createConfigurationObject() {
        this.configuration_object = SettingsConfiguration.getConfigurationObject(BokehWrapper.specific_settings);
    }

}