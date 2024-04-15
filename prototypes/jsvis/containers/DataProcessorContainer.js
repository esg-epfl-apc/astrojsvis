class DataProcessorContainer {

    constructor() {

    }

    getLightCurveProcessor() {
        return new LightCurveProcessor();
    }

    getSpectrumProcessor() {
        return new SpectrumProcessor();
    }

    static getDataProcessorContainer() {
        return new DataProcessorContainer();
    }

}