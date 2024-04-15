class VisualizationSettings {

    static default_settings = {
        library: '',
        data_type: '',
        axis: {},
        scales: {},
        error_bars: {}
    }

    settings = null;

    constructor(settings_object = null) {
        if(settings_object) {
            this.settings = JSON.parse(JSON.stringify(settings_object))
        } else {
            this.settings = JSON.parse(JSON.stringify(VisualizationSettings.default_settings))
        }
    }

    setLibrarySettings(library) {
        this.settings.library = library;
    }

    getLibrarySettings() {

    }

    setDataType(data_type) {
        this.settings.data_type = data_type;
    }

    getDataTypeSettings() {

    }

    getLightCurveSettings() {

    }

    getSpectrumSettings() {

    }

    setAxisSettings(axis) {
        this.settings.axis = axis;
    }

    getAxisSettings() {

    }

    setScalesSettings(scales) {
        this.settings.scales = scales;
    }

    getScalesSettings() {

    }

    setErrorBarsSettings(error_bars) {
        this.settings.error_bars = error_bars;
    }

    getErrorBarsSettings() {

    }

    getAdditionalDatasetsSettings() {

    }
}