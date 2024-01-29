class LightCurveHelper {

    data = [];
    data_errors = [];

    static #timeIndex = 0;
    static #timeErrorIndex = 1;
    static #rateIndex = 2;
    static #rateErrorIndex = 3;

    static #timeErrorDefaultValue = -1;
    static #rateErrorDefaultValue = -1;

    static #infinityDefaultValue = "";

    static #noDataValue = 'nan';
    static #infinityValue = 'infinity';

    static ERROR_BARS_RATE = 'error_bars_rate'
    static ERROR_BARS_TIME = 'error_bars_time'

    constructor(rawData) {
        this.raw_data = rawData;
        this.#parseRawData();
    }

    #parseRawData() {
        for(let i = 0; i < this.raw_data.length; i++) {
            if(this.raw_data[i][LightCurve.#rateIndex].toString()
                .toLowerCase() !== LightCurve.#noDataValue) {

                if (this.raw_data[LightCurve.#rateErrorIndex] === LightCurve.#noDataValue) {

                    this.raw_data[LightCurve.#rateErrorIndex] = LightCurve.#rateErrorDefaultValue;
                }
                if (this.raw_data[LightCurve.#timeErrorIndex].toString()
                        .toLowerCase() === LightCurve.#noDataValue) {

                    this.raw_data[LightCurve.#timeErrorIndex] = LightCurve.#timeErrorDefaultValue;
                }

                this.#setDataRow(this.raw_data[LightCurve.#timeIndex],
                    this.raw_data[LightCurve.#rateIndex],
                    this.raw_data[LightCurve.#timeErrorIndex],
                    this.raw_data[LightCurve.#rateErrorIndex]
                );

                this.#setDataErrorsRow(this.raw_data[LightCurve.#timeErrorIndex],
                    this.raw_data[LightCurve.#rateErrorIndex],
                    this.raw_data[LightCurve.#timeErrorIndex],
                    this.raw_data[LightCurve.#rateErrorIndex]
                );

            }
        }
    }

    #setDataRow(rate, time_error, rate_error) {
        let row = [rate, time_error, rate_error];
        this.data.push(row)
    }

    #setDataErrorsRow(rate_error, time_error) {
        let row = [rate_error, time_error, rate_error]
        this.data_errors.push(row)
    }

    getData() {
        return this.data;
    }

    getDataErrors() {
        return this.data_errors;
    }

    getScale() {
        const min_time = this.raw_data.reduce((prev, curr) => (prev && prev.time < curr.time) ? prev : curr)
        const max_time = this.raw_data.reduce((prev, curr) => (prev && prev.time > curr.time) ? prev : curr)

        const min_rate = this.raw_data.reduce((prev, curr) => (prev && parseFloat(prev.rate) - parseFloat(prev.rate_error) < curr.rate) ? prev : curr)
        const max_rate = this.raw_data.reduce((prev, curr) => (prev && parseFloat(prev.rate) + parseFloat(prev.rate_error) > curr.rate) ? prev : curr)

        let scale = {
            x_min : parseFloat(min_time.time) * 0.99999999999,
            x_max : parseFloat(max_time.time) * 1.00000000001,
            y_min : min_rate.rate * 0.97,
            y_max : max_rate.rate * 1.025
        }

        return scale;
    }

    getErrorBars() {
        let error_bars = [];
        let error_bars_rate = [];
        let error_bars_time = [];

        this.raw_data.forEach(function(datapoint){
            let error_bar_rate = [
                {
                    rate_bound: parseFloat(datapoint.rate) - parseFloat(datapoint.rate_error),
                    time: parseFloat(datapoint.time)
                },
                {
                    rate_bound: parseFloat(datapoint.rate) + parseFloat(datapoint.rate_error),
                    time: parseFloat(datapoint.time)
                }
            ]

            let error_bar_time = [
                {
                    time_bound: parseFloat(datapoint.time) - parseFloat(datapoint.time_error),
                    rate: parseFloat(datapoint.rate)
                },
                {
                    time_bound: parseFloat(datapoint.time) + parseFloat(datapoint.time_error),
                    rate: parseFloat(datapoint.rate)
                }
            ]

            error_bars_rate.push(error_bar_rate);
            error_bars_time.push(error_bar_time);
        })

        error_bars[LightCurveHelper.ERROR_BARS_RATE] = error_bars_rate;
        error_bars[LightCurveHelper.ERROR_BARS_TIME] =error_bars_time;

        return error_bars;
    }

    getUnit() {

    }

}