class Image {

    static EXTENSION = 'IMAGE';

    static bitpix_offset_table = {

    }
    
    #hdu;
    data;

    header_start_pos = null;
    header_data_start_pos = null;
    header_data_stop_pos = null;

    bitpix = null;
    width = null;
    height = null;

    #fileArrayBuffer = null;

    constructor(hdu, header_start_pos, header_data_start_pos, fileArrayBuffer) {
        this.#hdu = hdu;
        this.header_start_pos = header_start_pos;
        this.header_data_start_pos = header_data_start_pos;
        this.#fileArrayBuffer = fileArrayBuffer;
        this.#setImageInfo();
    }

    #setImageInfo() {
        this.width = this.#hdu['NAXIS1'];
        this.height = this.#hdu['NAXIS2'];

        this.bitpix = this.#hdu['BITPIX'];
    }

    #setStopPosition() {
        this.header_data_stop_pos = this.width * this.height * (Math.abs(this.bitpix) / 8);
    }

    #parseData() {
        let pos = this.header_data_start_pos;
        let data = [];

        this.data = data;
    }

}