class BinaryTable {

    static EXTENSION = 'BINTABLE';
    static #fits_max_col = 999;

    static #offset_table = {
        L: 1,
        B: 1,
        I: 2,
        J: 4,
        K: 8,
        A: 1,
        E: 4,
        D: 8,
        C: 8,
        M: 16
    }

    #hdu;
    data;

    header_start_pos = null;
    header_data_start_pos = null;
    header_data_stop_pos = null;

    nb_col = 0;
    columns_metadata = [];

    row_size_byte = 0;
    nb_row = 0;
    table_size = 0;

    #fileArrayBuffer = null;

    constructor(hdu, header_start_pos, header_data_start_pos, fileArrayBuffer) {
        this.#hdu = hdu;
        this.header_start_pos = header_start_pos;
        this.header_data_start_pos = header_data_start_pos;
        this.#fileArrayBuffer = fileArrayBuffer;
        this.#setTableInfo();
    }

    #setTableInfo() {
        let naxis1 = this.#hdu['NAXIS1'];
        let naxis2 = this.#hdu['NAXIS2'];

        this.row_size_byte = naxis1;
        this.nb_row = naxis2;

        this.table_size = this.row_size_byte * this.nb_row;

        this.#setColumnNumber();

        if (this.nb_col && this.nb_col > 0) {
            this.#setColumnMetaData();
            this.#setStopPosition();
            this.#parseData();
        }
    }

    #setColumnNumber() {
        if('TFIELDS' in this.#hdu.keys()) {
            this.nb_col = this.#hdu['TFIELDS']
        } else {
            for(let i = 1; i < BinaryTable.#fits_max_col; i++) {

                if(this.#hdu['TFORM'+i]) {

                } else {
                    this.nb_col = i -1;
                    break;
                }
            }
        }
    }

    #setColumnMetaData() {
        for(let i = 1; i <= this.nb_col; i++) {

            let col_type = this.#hdu['TFORM'+i];
            col_type = col_type.slice(1,2);
            
            let col_unit = null;
            let col_unit_type = null;

            if(this.#hdu['TUNIT'+1]) {
                col_unit = this.#hdu['TUNIT'+i];
            }

            if(this.#hdu['TTYPE'+1]) {
                col_unit_type = this.#hdu['TTYPE'+i];
            }

            this.columns_metadata.push({'type': col_type,
                'unit': col_unit,
                'Unit_type': col_unit_type});
        }
    }

    #setStopPosition() {
         this.header_data_stop_pos =
            this.header_data_start_pos + this.table_size;
    }

    #parseData() {
        let pos = this.header_data_start_pos;
        let stop_pos = this.header_data_stop_pos;
        let data = [];

        let dataview = new DataView(this.#fileArrayBuffer, pos);

        let j = 0

        for (pos; pos < stop_pos; pos += this.row_size_byte) {

            let i = 0
            let curr_offset = j * this.row_size_byte;
            let data_row = [];

            for(i; i < this.nb_col; i++) {

                let col_metadata = this.columns_metadata[i];

                let val = this.getValueFromType(dataview, col_metadata.type, curr_offset)
                curr_offset += BinaryTable.#offset_table[col_metadata.type];

                data_row.push(val);
            }

            data.push(data_row);
            j++;
        }

        this.data = data;
    }

    getValueFromType(dataview, type, offset) {
        let val = null;

        switch(type) {

            case 'B':
                val = dataview.getUint8(offset)
                break

            case 'L':
                val = !!dataview.getUint8(offset)
                break

            case 'I':
                val = dataview.getInt16(offset)
                break

            case 'J':
                val = dataview.getInt32(offset)
                break

            case 'K':
                val = dataview.getBigInt64(offset)
                break

            case 'E':
                val = dataview.getFloat32(offset)
                break

            case 'A':
                val = String.fromCharCode.apply(null, new Uint8Array(this.#fileArrayBuffer, offset, 1))
                break

            case 'D':
                val = dataview.getFloat64(offset)
                break

            default:
                console.log('Unsupported data type')

        }

        return val;

    }

}