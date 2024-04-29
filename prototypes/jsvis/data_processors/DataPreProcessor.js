class DataPreProcessor {

    dataset = null;
    settings = null;

    processsed_dataset = null;

    constructor(dataset, settings) {
        this.dataset = dataset;
        this.settings = settings;
    }

    getProcessedDataset() {

        return this.processsed_dataset;
    }

}