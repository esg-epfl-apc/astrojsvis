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

            let data_type = this.settings_object.getDataTypeSettings();
            let hdu = this.settings_object.getHDUsSettings();
            let axis = this.settings_object.getAxisSettings();
            let scales = this.settings_object.getScalesSettings();

            let has_error_bars = false;
            let error_bars = this.settings_object.getErrorBarsSettings();

            if(error_bars !== null) {
                has_error_bars = true;
            }

            let data = this.getProcessedData(data_type.type, hdu['hdu_index'], axis, error_bars);

            console.log(data);

            let visualization = VisualizationContainer.getD3Visualization();

            if(has_error_bars) {
                error_bars = data.error_bars;
            }

            visualization.initializeSettings(data.main, axis, scales, error_bars, false, null);

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