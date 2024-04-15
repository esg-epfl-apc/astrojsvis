class BokehWrapper {

    static library = 'bokeh';

    static specific_settings = ['bokeh-options'];

    constructor() {
        this._setupListeners();
    }

    _setupListeners() {
        document.addEventListener('settings-changed', this.handleSettingsChangedEvent.bind(this));
        document.addEventListener('visualization-generation', this.handleVisualizationGenerationEvent.bind(this));
    }

    handleSettingsChangedEvent(event) {
        let settings_object = event.detail.settings_object;

        console.log(settings_object);
    }

    handleVisualizationGenerationEvent(event) {
        let settings_object = event.detail.settings_object;
    }

}