class DataPreProcessor {

    constructor() {

    }

    getProcessedDataset(dataset_settings_object) {
        let dataset = {};

        console.log(dataset_settings_object);

        dataset_settings_object.axis.forEach((axis) => {
            console.log(axis);

            let file_object = FileRegistry.getFileById(axis.file_id);
            console.log(file_object);

            let frw = WrapperContainer.getFITSReaderWrapper();
            frw.setFile(file_object.file);

            let column_data = frw.getColumnDataFromHDU(axis.hdu_index, axis.column_name);
            console.log(column_data);

            axis.data = column_data;

        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {
                console.log(error_bar);

                let file_object = FileRegistry.getFileById(error_bar.file_id);
                console.log(file_object);

                let frw = WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);

                let column_data = frw.getColumnDataFromHDU(error_bar.hdu_index, error_bar.column_name);
                console.log(column_data);

                error_bar.data = column_data;
            })
        }

        dataset = dataset_settings_object;

        return dataset;
    }

    datasetToJSONData(dataset_settings_object) {
        console.log(dataset_settings_object);

        let rows = [];

        dataset_settings_object.axis.forEach((axis) => {
            console.log(axis);

            axis.data.forEach((value, index) => {
                if (!rows[index]) {
                    rows[index] = {};
                }
                rows[index][axis.column_name] = value;
            });

        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {
                console.log(error_bar);

                error_bar.data.forEach((value, index) => {
                    if (!rows[index]) {
                        rows[index] = {};
                    }
                    rows[index][error_bar.column_name] = value;
                });

            })
        }

        return rows;
    }

    processErrorBarDataJSON(dataset, axis, error_bars) {

        console.log("ERROR BAR PROCESSING")

        let error_bar_x_values = [];
        let error_bar_y_values = [];

        let axis_x = axis.x;
        let axis_y = axis.y;

        let error_bar_x_column = error_bars.x;
        let error_bar_y_column = error_bars.y;

        console.log(axis_x);
        console.log(axis_y);

        console.log(error_bars.x);
        console.log(error_bars.y);

        console.log(error_bar_x_column);
        console.log(error_bar_y_column);

        dataset.forEach(function(datapoint){
            let error_bar_x = [
                {
                    bound: parseFloat(datapoint[axis_y]) - parseFloat(datapoint[error_bar_y_column]),
                    [axis_x]: parseFloat(datapoint[axis_x])
                },
                {
                    bound: parseFloat(datapoint[axis_y]) + parseFloat(datapoint[error_bar_y_column]),
                    [axis_x]: parseFloat(datapoint[axis_x])
                }
            ]

            let error_bar_y = [
                {
                    bound: parseFloat(datapoint[axis_x]) - parseFloat(datapoint[error_bar_x_column]),
                    [axis_y]: parseFloat(datapoint[axis_y])
                },
                {
                    bound: parseFloat(datapoint[axis_x]) + parseFloat(datapoint[error_bar_x_column]),
                    [axis_y]: parseFloat(datapoint[axis_y])
                }
            ]

            error_bar_x_values.push(error_bar_x);
            error_bar_y_values.push(error_bar_y);
        })

        return { x: error_bar_x_values, y: error_bar_y_values }
    }

}