class SettingsContainer {

    constructor() {

    }

    getVisualizationSettingsObject() {
        return new VisualizationSettings();
    }

    getSettingsConfigurationObject() {
        return new SettingsConfiguration();
    }

    static getSettingsContainer() {
        return new SettingsContainer();
    }

}