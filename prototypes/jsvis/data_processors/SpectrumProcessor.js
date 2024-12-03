export class SpectrumProcessor {

    static processed_columns_name = ['E_HALF_WIDTH', 'E_MID', 'E_MID_LOG'];

    static D_E = 'E_HALF_WIDTH';
    static E_MID = 'E_MID';
    static E_MID_LOG = 'E_MID_LOG';

    static spectrum_col_functions = {
        E_HALF_WIDTH: SpectrumProcessor.getEnergyHalfWidth,
        E_MID: SpectrumProcessor.getEnergyMidPoint,
        E_MID_LOG: SpectrumProcessor.getEnergyMidPointLog,
    }

    constructor() {

    }

    //D_E
    static getEnergyHalfWidth(e_min, e_max) {
        return ((e_max - e_min) / 2);
    }

    //E_MID
    static getEnergyMidPoint(e_min, e_max) {
        return ((e_max + e_min) / 2);
    }

    //E_MID_LOG
    static getEnergyMidPointLog(e_min, e_max) {
        return Math.sqrt(e_max * e_min);
    }

    static getAsymetricEneryErrorBar(e_min, e_max, e_mid) {
        let e_error_up = e_max - e_mid;
        let e_error_down = e_mid - e_min;

        return {'e_error_up': e_error_up, 'e_error_down': e_error_down};
    }

}