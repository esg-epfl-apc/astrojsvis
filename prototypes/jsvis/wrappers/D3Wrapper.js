class D3Wrapper {

    static library = "d3";
    static container_id = "visualization-container";

    static specific_settings = {
        'd3-settings': {
            display: true,
            'd3-options': {
                'has_line': true
            }
        }
    };

    container;
    container_id;

    settings_object;
    configuration_object = null;

    graph_list = [];

    constructor(container_id = D3Wrapper.container_id) {
        this._setupListeners();

        this.container_id = container_id;
        this._setContainer();


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

        if(library_settings.library === D3Wrapper.library) {
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

        if(library_settings.library === D3Wrapper.library) {

            this.resetContainer();

            let dataset_settings = {};

            let data_type = this.settings_object.getDataTypeSettings();
            let hdu = this.settings_object.getHDUsSettings();
            let axis = this.settings_object.getAxisSettings();

            dataset_settings.data_type = data_type;

            let axis_settings = [];
            for(let axis_column in axis) {
                let axis_column_object = this._getColumnSettings(axis[axis_column]);
                axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                axis_settings.push(axis_column_object);
            }

            dataset_settings.axis = axis_settings;

            let scales = this.settings_object.getScalesSettings();

            let has_error_bars = false;
            let error_bars = this.settings_object.getErrorBarsSettings();

            console.log('ERROR BAR CHECK');

            if(error_bars !== null) {
                has_error_bars = true;

                console.log(error_bars);

                let error_bars_settings = [];
                for(let axis_column in error_bars) {
                    let axis_column_object = this._getColumnSettings(error_bars[axis_column]);
                    axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                    error_bars_settings.push(axis_column_object);
                }

                dataset_settings.error_bars = error_bars_settings;
            }

            let dpp = DataProcessorContainer.getDataProcessorContainer().getDataPreProcessor();

            let processed_data = dpp.getProcessedDataset(dataset_settings);

            let processed_json_data = dpp.datasetToJSONData(processed_data);

            //let data = this.getProcessedData(data_type.type, hdu['hdu_index'], axis, error_bars);
            //let data = this.getProcessedData(data_type.type, 1, axis, error_bars);

            //console.log(data);

            let visualization = VisualizationContainer.getD3Visualization();

            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};

            if(has_error_bars) {
                //error_bars = data.error_bars;

                console.log('ERROR BARS');
                error_bars = {x: processed_data.error_bars[0].column_name, y: processed_data.error_bars[1].column_name};

                error_bars = dpp.processErrorBarDataJSON(processed_json_data, axis, error_bars)
            }

            let ranges = this.settings_object.getRangesSettings();
            let has_custom_range = false;
            let custom_range_data = null;

            if(ranges != null) {
                has_custom_range = true;

                if(has_error_bars) {
                    custom_range_data = dpp.processDataForRange(ranges, processed_json_data, error_bars);
                    processed_json_data = custom_range_data.data;
                    error_bars = custom_range_data.error_bars;
                } else {
                    custom_range_data = dpp.processDataForRange(ranges, processed_json_data);
                    processed_json_data = custom_range_data.data;
                }

            }

            //console.log(data.main);
            console.log("GRAPH DATA");
            console.log(error_bars);

            console.log(processed_json_data);
            console.log(axis);
            console.log(scales);

            console.log("CUSTOM RANGE");
            console.log(custom_range_data);

            //visualization.initializeSettings(data.main, axis, scales, error_bars, false, null);
            visualization.initializeSettings(processed_json_data, axis, scales, error_bars, false, null);

            visualization.initializeGraph();
        }

    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

    createConfigurationObject() {
        this.configuration_object = SettingsConfiguration.getConfigurationObject(D3Wrapper.specific_settings);
    }

    createGraph(index) {
        this.resetContainer();

        let processedSettings = this.processSettings();

        let data = this.processData();

        let is_graph_set = this.graph_list[index].initializeSettings(
            processedSettings.axis,
            processedSettings.scales,
            processedSettings.error_bars,
            processedSettings.has_line,
            processedSettings.additional_plots,

        );

        if(is_graph_set) {
            this.graph_list[index].initializeGraph();
        }
    }

    processSettings() {
        let processedSettings = {
            'axis' : '',
            'scales': '',
            'error_bars': null,
            'has_line': false,
            'additional_plots' : null
        }

        return processedSettings;
    }

    getProcessedData(data_type, hdu_index, axis, error_bars) {
        let data = null;

        let dpc = DataProcessorContainer.getDataProcessorContainer();
        let data_processor;

        console.log("Data: " + dpc);

        let frw = WrapperContainer.getFITSReaderWrapper();

        if(data_type === 'light-curve') {

            console.log("light curve")

            data_processor = dpc.getLightCurveProcessor(frw, hdu_index);

        } else if(data_type === 'spectrum') {

            data_processor = dpc.getSpectrumProcessor(frw, hdu_index);

        }

        data = data_processor.processDataJSON(axis, error_bars);

        return data;
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

    getGraphByIndex(index) {
        return this.graph_list[index]
    }

    getAllDisplayedGraph() {
        let displayed_graphs = [];

        this.graph_list.forEach(function(graph) {
            if(graph.initialized) {
                displayed_graphs.push(graph);
            }
        })

        return displayed_graphs;
    }

}