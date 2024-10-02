import {WrapperContainer} from "../containers/WrapperContainer";
import {FileRegistry} from "../registries/FileRegistry";
import {SpectrumProcessor} from "./SpectrumProcessor";
import {DataProcessorContainer} from "../containers/DataProcessorContainer";
import {ExpressionParser} from "../utils/ExpressionParser";
import {ColumnUtils} from "../utils/ColumnUtils";
import {curveStep} from "../../d3/js/d3.v7";

export class DataPreProcessor {

    constructor() {

    }

    getProcessedDataset(dataset_settings_object) {
        let dataset = {};

        dataset_settings_object.axis.forEach((axis) => {

            let frw = WrapperContainer.getFITSReaderWrapper();

            if(axis.file_id != null) {
                let file_object = FileRegistry.getFileById(axis.file_id);

                //let frw = WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);
            }

            let column_data;

            if(dataset_settings_object.data_type.type === 'spectrum' &&
                SpectrumProcessor.processed_columns_name.includes(axis.column_name)) {

                column_data = this.getSpectrumProcessedColumn(axis.hdu_index, axis.column_name, frw);
            } else if(axis.column_type === 'processed') {
                let column_array = [];
                let temp_column_data = [];

                let expression_array = this.parseColumnsExpression(axis.column_expression);
                let operator_array = this.parseColumnsOperators(axis.column_expression);

                expression_array.forEach((operand) => {
                    if(!operand.includes('&')) {
                        column_array.push(ColumnUtils.getColumnSettings(operand));
                    } else {
                        column_array.push(operand);
                    }
                });

                let frw = WrapperContainer.getFITSReaderWrapper();

                column_array.forEach((column) => {
                    let col_data;

                    if(typeof column === 'object') {
                        col_data = this.getProcessedColumnData(column.file_id, column.hdu_index, column.column_name, frw);
                    }  else {
                        col_data = column.replace('&', '');
                    }
                    temp_column_data.push(col_data);
                })

                let temp_processed_data = [];

                column_array.forEach((column) => {
                    let col_data;

                    if(typeof column !== 'string') {
                        col_data = this.getProcessedColumnData(column.file_id, column.hdu_index, column.column_name, frw);
                    }  else {
                        col_data = [];
                        col_data[0] = column.replace('&', '');
                    }

                    temp_column_data.push(col_data);
                    temp_processed_data.push(col_data);
                })

                let max_col_size = temp_column_data.map(column => column.length).reduce((max, current) => Math.max(max, current), 0);

                temp_processed_data.forEach((column) => {
                    if (column.length === 1) {
                        let base_value = column[0];
                        while (column.length < max_col_size) {
                            column.push(base_value);
                        }
                    }
                });

                let processed_data = this.getCustomColumnProcessedData(temp_processed_data, operator_array);

                column_data = processed_data;

            } else {
                column_data = frw.getColumnDataFromHDU(axis.hdu_index, axis.column_name);
            }

            axis.data = column_data;

        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {

                if(error_bar.file_id !== undefined) {
                    let file_object = FileRegistry.getFileById(error_bar.file_id);

                    let frw = WrapperContainer.getFITSReaderWrapper();
                    frw.setFile(file_object.file);
                }

                let column_data;

                if(dataset_settings_object.data_type.type === 'spectrum' &&
                    SpectrumProcessor.processed_columns_name.includes(error_bar.column_name)) {

                    column_data = this.getSpectrumProcessedColumn(error_bar.hdu_index, error_bar.column_name, frw)

                    if(error_bar.column_name === SpectrumProcessor.E_MID_LOG) {
                        column_data.forEach(col_data => {

                        })
                    }

                }  else if(error_bar.column_type === 'processed') {
                    let column_array = [];
                    let temp_column_data = [];

                    error_bar.column_name = error_bar.axis + '_error';

                    let expression_array = this.parseColumnsExpression(error_bar.column_expression);
                    let operator_array = this.parseColumnsOperators(error_bar.column_expression);

                    expression_array.forEach((operand) => {
                        if(!operand.includes('&')) {
                            column_array.push(ColumnUtils.getColumnSettings(operand));
                        } else {
                            column_array.push(operand);
                        }
                    });

                    let frw = WrapperContainer.getFITSReaderWrapper();

                    column_array.forEach((column) => {
                        let col_data;

                        if(typeof column === 'object') {
                            col_data = this.getProcessedColumnData(column.file_id, column.hdu_index, column.column_name, frw);
                        }  else {
                            col_data = column.replace('&', '');
                        }
                        temp_column_data.push(col_data);
                    })

                    let temp_processed_data = [];

                    column_array.forEach((column) => {
                        let col_data;

                        if(typeof column !== 'string') {
                            col_data = this.getProcessedColumnData(column.file_id, column.hdu_index, column.column_name, frw);
                        }  else {
                            col_data = [];
                            col_data[0] = column.replace('&', '');
                        }

                        temp_column_data.push(col_data);
                        temp_processed_data.push(col_data);
                    })

                    let max_col_size = temp_column_data.map(column => column.length).reduce((max, current) => Math.max(max, current), 0);

                    temp_processed_data.forEach((column) => {
                        if (column.length === 1) {
                            let base_value = column[0];
                            while (column.length < max_col_size) {
                                column.push(base_value);
                            }
                        }
                    });

                    let processed_data = this.getCustomColumnProcessedData(temp_processed_data, operator_array);

                    column_data = processed_data;
                } else {
                    let frw = WrapperContainer.getFITSReaderWrapper();
                    column_data = frw.getColumnDataFromHDU(error_bar.hdu_index, error_bar.column_name);
                }

                error_bar.data = column_data;
            })
        }

        dataset = dataset_settings_object;

        return dataset;
    }

    datasetToJSONData(dataset_settings_object) {
        let rows = [];

        dataset_settings_object.axis.forEach((axis) => {

            axis.data.forEach((value, index) => {
                if (!rows[index]) {
                    rows[index] = {};
                }
                rows[index][axis.column_name] = value;
            });

        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {

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

        let error_bar_x_values = [];
        let error_bar_y_values = [];

        let axis_x = axis.x;
        let axis_y = axis.y;

        let error_bar_x_column = error_bars.x;
        let error_bar_y_column = error_bars.y;

        let error_bars_object = {};

        dataset.forEach(function(datapoint){

            if(error_bars.x) {

                let error_bar_x = [
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
            }

            if(error_bars.y) {

                let error_bar_y = [
                    {
                        bound: parseFloat(datapoint[axis_y]) - parseFloat(datapoint[error_bar_y_column]),
                        [axis_x]: parseFloat(datapoint[axis_x])
                    },
                    {
                        bound: parseFloat(datapoint[axis_y]) + parseFloat(datapoint[error_bar_y_column]),
                        [axis_x]: parseFloat(datapoint[axis_x])
                    }
                ]

                error_bar_y_values.push(error_bar_y);
            }

        })

        if(error_bars.x) error_bars_object.x = error_bar_x_values;
        if(error_bars.y) error_bars_object.y = error_bar_y_values;

        return error_bars_object;
    }

    getProcessedColumnData(file_id, hdu_index, column_name, fits_reader_wrapper) {
        let file_object = FileRegistry.getFileById(file_id);
        fits_reader_wrapper.setFile(file_object.file);

        let col_data = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, column_name);

        return col_data;
    }

    getCustomColumnProcessedData(operands, operators) {
        let data = [];

        let expression_string;
        for(let i = 0; i < operands[0].length; i++) {
            expression_string = '';

            expression_string += operands[0][i];

            operators.forEach((operator, index) => {
                expression_string += operator + operands[index + 1][i];
            })

            console.log(expression_string);

            data.push(eval(expression_string));

        }

        return data;
    }

    getSpectrumProcessedColumn(hdu_index, column_name, fits_reader_wrapper) {
        let processed_column = [];

        let sp = DataProcessorContainer.getDataProcessorContainer().getSpectrumProcessor();

        let e_min_col = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, "E_MIN");
        let e_max_col = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, "E_MAX");

        e_min_col.forEach((e_min, index) => {
            processed_column.push(SpectrumProcessor.spectrum_col_functions[column_name](e_min, e_max_col[index]));
        })

        return processed_column;
    }

    parseColumnsExpression(expression) {
        let expression_parser = new ExpressionParser();

        let columns_array = expression_parser.parseStandardExpressionOperand(expression);

        return columns_array;
    }

    parseColumnsOperators(expression) {
        let expression_parser = new ExpressionParser();

        let operators_array = expression_parser.parseStandardExpressionOperators(expression);

        return operators_array;
    }

    processDataForRange(ranges, data, error_bars = null) {
        let temp_processed_data = [];
        let temp_processed_error_bars = {};
        let temp_error_bar_x = [];
        let temp_error_bar_y = [];
        let processed_data = [];

        data.forEach((data_point, i) => {
            let keys = Object.keys(data_point);
            let x_column = keys[0];
            let y_column = keys[1];

            if (ranges.x === null) {
                data_point.match_range_x = true;
            } else if (data_point[x_column] >= ranges.x.lower_bound && data_point[x_column] <= ranges.x.upper_bound) {
                data_point.match_range_x = true;
            } else {
                data_point.match_range_x = false;
            }

            if(ranges.y === null) {
                data_point.match_range_y = true;
            } else if(data_point[y_column] >= ranges.y.lower_bound && data_point[y_column] <= ranges.y.upper_bound) {
                data_point.match_range_y = true;
            } else {
                data_point.match_range_y = false;
            }

            if(data_point.match_range_x + data_point.match_range_y == 2) {
                temp_processed_data.push(data_point);
                if(error_bars != null) {
                    temp_error_bar_x.push(error_bars.x[i]);
                    temp_error_bar_y.push(error_bars.y[i]);
                }
            }

        })

        if(error_bars != null) {
            temp_processed_error_bars.x = temp_error_bar_x;
            temp_processed_error_bars.y = temp_error_bar_y;
            processed_data.error_bars = temp_processed_error_bars;
        }

        processed_data.data = temp_processed_data;

        return processed_data;
    }

    processDataForRangeBokeh(ranges, data, has_error_bars = false) {
        let processed_data = {};
        processed_data.x = [];
        processed_data.y = []

        if(has_error_bars) {
            processed_data.x_low = [];
            processed_data.x_up = [];
            processed_data.y_low = [];
            processed_data.y_up = [];
        }

        let temp_x = [];
        let temp_y = [];

        data.x.forEach((data_point) => {

            let temp_data_object = {};
            temp_data_object.value = data_point;

            if (ranges.x === null) {
                temp_data_object.match_range_x = true;
            } else if (data_point >= ranges.x.lower_bound && data_point <= ranges.x.upper_bound) {
                temp_data_object.match_range_x = true;
            } else {
                temp_data_object.match_range_x = false;
            }

            temp_x.push(temp_data_object);
        })

        data.y.forEach((data_point) => {

            let temp_data_object = {};
            temp_data_object.value = data_point;

            if (ranges.y === null) {
                temp_data_object.match_range_y = true;
            } else if (data_point >= ranges.y.lower_bound && data_point <= ranges.y.upper_bound) {
                temp_data_object.match_range_y = true;
            } else {
                temp_data_object.match_range_y = false;
            }

            temp_y.push(temp_data_object)
        })

        temp_x.forEach((data_point_x, i) => {
            let data_point_y = temp_y[i];

            if(data_point_x.match_range_x + data_point_y.match_range_y == 2) {
                processed_data.x.push(data_point_x.value);
                processed_data.y.push(data_point_y.value);

                if(has_error_bars) {
                    processed_data.y_low.push(data.y_low[i]);
                    processed_data.y_up.push(data.y_up[i]);
                    processed_data.x_low.push(data.x_low[i]);
                    processed_data.x_up.push(data.x_up[i]);
                }
            }
        })

        return processed_data;
    }

}