class D3Wrapper {

    static library = "d3";

    static specific_settings = ['d3-options'];

    container;
    container_id;

    settings_object;

    graph_list = [];

    constructor(container_id, dataset, settings_object) {
        this._setupListeners();

        this.container_id = container_id;
        this._setContainer();

        this.settings_object = settings_object;

        let graph_object = new d3Graph(this.container, dataset);
        this.graph_list.push(graph_object);
    }

    _setupListeners() {
        document.addEventListener('settings-changed', this.handleSettingsChangedEvent.bind(this));
        document.addEventListener('visualization-generation', this.handleVisualizationGenerationEvent.bind(this));
    }

    handleSettingsChangedEvent(event) {
        let settings_object = event.detail.settings_object;
    }

    handleVisualizationGenerationEvent(event) {
        let settings_object = event.detail.settings_object;
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
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

    processData() {
        let data = null;

        let dpc = DataProcessorContainer.getDataProcessorContainer();
        let data_processor;

        if(this.settings_object.data_type === 'light-curve') {

            data_processor = dpc.getLightCurveProcessor();

        } else if(this.settings_object.data_type === 'spectrum') {

            data_processor = dpc.getSpectrumProcessor();

        }

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