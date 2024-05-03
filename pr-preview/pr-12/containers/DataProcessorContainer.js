class DataProcessorContainer {

    constructor() {

    }

    getDataPreProcessor() {
        return new DataPreProcessor();
    }

    getLightCurveProcessor(fits_reader_wrapper, hdu_index) {
        return new LightCurveProcessor(fits_reader_wrapper, hdu_index);
    }

    getSpectrumProcessor() {
        return new SpectrumProcessor();
    }

    static getDataProcessorContainer() {
        return new DataProcessorContainer();
    }

}