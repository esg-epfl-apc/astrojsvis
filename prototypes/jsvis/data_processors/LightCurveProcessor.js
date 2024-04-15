class LightCurveProcessor {

    static binning_types = {
        'TIME_BASED': 'time_based',
        'EQUAL_COUNT': 'equal_count'
    }

    static bin_value_methods = [
        'mean',
        'weightedmean',
        'median',
        'wmedian',
        'stddev',
        'meddev',
        'kurtosis',
        'skewness',
        'max',
        'min',
        'sum'
    ]

    hdu;
    binning_type;
    method;

    constructor() {

    }

    setHDU(hdu) {
        this.hdu = hdu;
    }

    _checkColumns() {

    }

    setBinningType(binning_type) {
        this.binning_type = binning_type
    }

    setBinValueMethod(method) {
        this.method = method;
    }

    getBinsForMethod(rate_column, fracexp_column, bins, method) {
        let processed_bins = [];

        bins.forEach((bin) => {
            let times = [];
            let rates = [];
            let fracexps = [];

            bin.forEach(({ time, rate, fracexp }) => {
                times.push(time);
                rates.push(rate);
                fracexps.push(fracexp);
            });

            let bin_rate_max = Math.max(...rates);
            let bin_rate_min = Math.min(...rates);
            let bin_rate_mean = rates.reduce((total, value) => total + value, 0) / rates.length;
            let bin_rate_sum = rates.reduce((total, value) => total + value, 0);

        })

        return processed_bins;
    }

    getRateFracexpWeightedMeanBinnedData(rate_column, fracexp_column, bin_size) {
        let num_data_points = rate_column.length;
        let num_bins = Math.ceil(num_data_points / bin_size);

        let binned_rates = [];

        for (let i = 0; i < num_bins; i++) {
            let start_pos = i * bin_size;
            let end_pos = Math.min(start_pos + bin_size, rate_column.length);

            let weighted_sum = 0;
            let num_data_points_bin = 0;

            for(let j = start_pos; j < end_pos; j++) {
                weighted_sum += rate_column[j] * fracexp_column[j];
                num_data_points_bin++;
            }

            let bin_rate_value = weighted_sum / num_data_points_bin;
            binned_rates.push(bin_rate_value);
        }

        return binned_rates;
    }

    getMedianDate(dates) {
        let sorted_dates = dates.sort((a, b) => a - b);

        let median_index = Math.floor(sorted_dates.length / 2);

        if (sorted_dates.length % 2 !== 0) {
            return sorted_dates[median_index];
        } else {

        }
    }

    getErrorBars() {

    }

    getDurationInSeconds(time_column) {
        let lowest_time = Math.min(...time_column);
        let highest_time = Math.max(...time_column);

        let duration_seconds = (highest_time - lowest_time) * 86400;

        return duration_seconds;
    }

}