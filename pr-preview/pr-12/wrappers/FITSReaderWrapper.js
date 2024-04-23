class FITSReaderWrapper {

    file_path = null;
    file = null;

    static BINTABLE = 'BINTABLE';
    static TABLE = 'TABLE';

    constructor(file_path) {

        if(FITSReaderWrapper.is_path_valid(file_path)) {
            this.file_path = file_path;
            this._getFile()
        } else {
            console.log("Invalid file path");
            throw new InvalidURLError("Invalid file path : " + file_path);
        }
    }

    _getFile() {

        return fetch(this.file_path)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then((buffer) => this._readFile(buffer));
    }

    _readFile(arrayBuffer) {
        try {
            this.file = window.FITSReader.parseFITS(arrayBuffer);

            this.sendFITSLoadedEvent()

        } catch(e) {
            console.log("Error initializing interface")
        }
    }

    getHDU(hdu_index) {
        console.log(this.file.hdus.length);
        console.log(hdu_index);

        console.log(this.file.hdus);

        if(hdu_index >= 0 && hdu_index < this.file.hdus.length) {
            return this.file.hdus[hdu_index];
        } else {
            return null;
        }
    }

    getHDUs() {

        let HDUs = [];
        let hdu_object;
        let type;

        this.file.hdus.forEach(function(hdu, index) {

            if (hdu.header.primary === true) {
                type = "PRIMARY";
            } else {
                type = hdu.header.get('XTENSION');
            }

            hdu_object = {
                "name": type,
                "index": index
            };

            HDUs.push(hdu_object);
        })

        return HDUs;
    }

    getNumberOfColumnFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);

        let header = hdu.header;
        let data = hdu.data;

        let type = header.get('XTENSION');

        let column_number = null;

        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {
            column_number = data.cols;
        } else {
            throw new HDUNotTabularError("Selected HDU is not tabular");
        }

        return column_number;
    }

    getColumnArrayFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);

        let header = hdu.header;
        let data = hdu.data;

        let type = header.get('XTENSION');

        let column_array = [];

        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {
            column_array = data.columns;
        } else {
            throw new HDUNotTabularError("Selected HDU is not tabular");
        }

        return column_array;
    }

    getColumnsNameFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);

        let header = hdu.header;
        let data = hdu.data;

        let type = hdu.header.get('XTENSION');

        let columns = [];
        let column_name;

        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {
            data.columns.forEach(function (column) {
                column_name = column;

                columns.push(column_name);
            })
        } else {
            throw new HDUNotTabularError("Selected HDU is not tabular");
        }

        return columns;
    }

    getColumnsJSONDataFromHDU(hdu_index) {

        let hdu = this.file.getHDU(hdu_index);

        let header = hdu.header;
        let data = hdu.data;

        let type = hdu.header.get('XTENSION');

        let columns_data_json = [];
        let raw_columns_data_array = [];
        let column_data;

        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {
            data.columns.forEach(function(column) {

                data.getColumn(column, function(col){
                    console.log("FRW data col")
                    console.log(col);
                    column_data = col;
                })

                raw_columns_data_array[column] = column_data;
            })

            let column_names = Object.keys(raw_columns_data_array);

            for (let i = 0; i < raw_columns_data_array[column_names[0]].length; i++) {

                let column_json_data_object = {};

                console.log("Data json");
                console.log(i);

                column_names.forEach((column_name) => {
                    console.log(i);
                    console.log("JSON Object");
                    console.log(column_json_data_object);
                    console.log("Raw data : " + raw_columns_data_array[column_name][i]);
                    column_json_data_object[column_name] = raw_columns_data_array[column_name][i];
                });

                columns_data_json.push(column_json_data_object);
            }

        } else {
            throw new HDUNotTabularError("Selected HDU is not tabular");
        }

        return columns_data_json;
    }

    getHeaderFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);
        let header = hdu.header;

        return header;
    }

    getDataFromHDU(hdu_index) {
        console.log(this.file);
        let hdu = this.file.getHDU(hdu_index);
        console.log(hdu);

        let data = hdu.data;

        return data;
    }

    getHeaderCardValueByNameFromHDU(hdu_index, card_name) {
        let hdu = this.file.getHDU(hdu_index);
        let header = hdu.header;

        let value = header.get(card_name);

        return value;
    }

    getHeaderCardsValueFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);

        const cards_array = [];

        Object.entries(hdu.header.cards).forEach(function(item) {
            let item_value_array = item[1];

            if(typeof item_value_array === 'object' && !Array.isArray(item_value_array)) {
                item_value_array['card_name'] = item[0];
                cards_array.push(item_value_array);
            }
        })

        let sorted_hdu_cards = cards_array.sort((a, b) => a.index - b.index);

        return sorted_hdu_cards;
    }

    isHDUTabular(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);
        let header = hdu.header;

        let type = header.get('XTENSION');

        let is_tabular = false;

        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {
            is_tabular = true;
        }

        return is_tabular;
    }

    sendFITSLoadedEvent() {
        let fle = new FITSLoadedEvent(this);

        fle.dispatchToSubscribers();

        //fle.dispatchToMainRoot();
        //fle.dispatchToTarget(document.getElementById('select-header-hdus'));
    }

    static is_path_valid(path) {
        let is_valid = false;

        if(FITSReaderWrapper._isPathValid(path) || FITSReaderWrapper._isURLValid(path)) {
            is_valid = true;
        }

        return is_valid;
    }

    static _isURLValid(url) {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(url);
    }

    static _isPathValid(path) {
        const pathRegex = /^(\/[a-zA-Z0-9._-]+)+\/?$/;
        return pathRegex.test(path);
    }

}