class Header {

    static PRIMARY_HEADER = 'primary';
    static IMAGE_HEADER = 'image';
    static BINARY_TABLE_HEADER = 'binary_table';
    static ASCII_TABLE_HEADER = 'ascii_table';

    static BLOCK_SIZE = 2880; //byte
    static CARD_SIZE = 80; //byte

    type = null;
    properties = null;
    start_position = null;
    stop_position = null;
    size = null; // byte

    file_array_buffer = null;

    constructor(type = null, properties = null, start_position, file_array_buffer) {
        this.type = type;
        this.properties = properties;
        this.start_position = start_position;
        this.file_array_buffer = file_array_buffer;

        if(this.properties == null) {
            this.properties = this.#getHeaderData();

            if(this.properties['SIMPLE']) {
                this.type = Header.PRIMARY_HEADER;
            } else if(this.properties['XTENSION'].includes('BINTABLE')) {
                this.type = Header.BINARY_TABLE_HEADER;
            } else if(this.properties['XTENSION'].includes('TABLE')) {
                this.type = Header.ASCII_TABLE_HEADER;
            } else if(this.properties['XTENSION'].includes('IMAGE')) {
                this.type = Header.IMAGE_HEADER;
            } else {
                console.log("Error with header type")
            }
        }

    }

    setProperties(properties) {
        this.properties = properties;
    }

    /**
     * if the header doesn't define any axis we can assume there's no data associated with it
     * and that next block will be another header
     **/
    hasData() {
        return this.properties['NAXIS'] !== 0;
    }

    #getHeaderData() {
        let headerPos = this.start_position;
        let stopCard = false;

        let hdus = [];

        for (headerPos; !stopCard && headerPos < this.file_array_buffer.byteLength; headerPos += Header.CARD_SIZE) {
            let card = String.fromCharCode.apply(null, new Uint8Array(this.file_array_buffer, headerPos, Header.CARD_SIZE));

            if (card.match(/^END */)) {
                headerPos += Header.CARD_SIZE;
                stopCard = true;
            } else {
                let key = card.substring (0, 8);
                key = key.replace (/ *$/, "");

                let val = card.substring (10);
                val = val.replace(/^ */, "");
                val = val.replace(/\/.*$/, "");
                val = val.replace(/ *$/, "");
                if (val.indexOf("'") >= 0)
                    val = val.substring(1, val.length-1);
                else if (val.indexOf("T") >= 0)
                    val = true;
                else if (val.indexOf("F") >= 0)
                    val = false;
                else if (val.indexOf(".") >= 0)
                    val = parseFloat(val);
                else
                    val = parseInt(val);

                hdus[key] = val;
            }

        }

        this.stop_position = headerPos;

        return hdus;
    }

}