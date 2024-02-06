class FITSPrototype {

    file_name = null;
    file_array_buffer = null;

    headers = [];

    constructor(file_name, file_array_buffer) {
        this.file_name = file_name;
        this.file_array_buffer = file_array_buffer;

        let file_pos = 0;
        let header = new Header(null, null, file_pos, this.file_array_buffer)

        console.log(header.properties);
        console.log(header.type);

        this.headers.push(header)

        if(header.hasData()) {
            //no support for primary header data
        }

        file_pos = Utils.getNextBlockPosition(header.stop_position);

        while(file_pos < this.file_array_buffer.byteLength) {
            header = new Header(null, null, file_pos, this.file_array_buffer)
            console.log(header.properties);
            console.log(header.type);

            this.headers.push(header);

            if(header.hasData()) {
                if(header.type == Header.BINARY_TABLE_HEADER) {
                    let binary_table = new BinaryTable(header.properties,
                        file_pos,
                        Utils.getNextBlockPosition(header.stop_position),
                        this.file_array_buffer);

                    console.log(binary_table.data);

                    file_pos = Utils.getNextBlockPosition(binary_table.header_data_stop_pos)

                } else {
                    //not supported
                    file_pos = Utils.getNextBlockPosition(header.stop_position);
                }
            } else {
                file_pos = Utils.getNextBlockPosition(header.stop_position);
            }
        }

    }

    create_csv_from_data(data) {

    }

    create_json_from_data(data) {
        //let json_string = JSON.stringify(data);
    }

    debug_readPrimaryHeader() {

        let primaryHeader = new Header(this.fileName, Header.PRIMARY_HEADER);

        let headerPos = 0;
        let stopCard = false;

        let hdus = [];

        for (headerPos = 0; !stopCard && headerPos < this.fileArrayBuffer.byteLength; headerPos += 80) {
            let card = String.fromCharCode.apply(null, new Uint8Array(this.fileArrayBuffer, headerPos, 80));

            //console.log (card);

            if (card.match(/^END */)) {
                headerPos += 80;
                stopCard = true;
            } else {
                let key = card.substring (0, 8);
                key = key.replace (/ *$/, "");

                let val = card.substring (10);
                val = val.replace (/^ */, "");
                val = val.replace (/\/.*$/, "");
                val = val.replace (/ *$/, "");
                if (val.indexOf ("'") >= 0)
                    val = val.substring (1, val.length-1);
                else if (val.indexOf ("T") >= 0)
                    val = true;
                else if (val.indexOf ("F") >= 0)
                    val = false;
                else if (val.indexOf (".") >= 0)
                    val = parseFloat (val);
                else
                    val = parseInt (val);

                //console.log(key + ' ' + val)

                hdus[key] = val;
            }

        }

        console.log(hdus);

        if(hdus['NAXIS'] !== 0) {
            this.readHeaderData(primaryHeader, headerPos)
        } else {
            this.readExtensionHeader(headerPos)
        }

    }

    debug_readExtensionHeader(headerPos) {

        let header = new Header(this.fileName)

        let hdus = [];

        if(headerPos % 2880 != 0) {
            headerPos += 2880 - headerPos % 2880;
        }

        let start_pos = headerPos;

        let arbitraryHeaderLength = headerPos + 6400

        for (headerPos; headerPos < arbitraryHeaderLength; headerPos += 80) {
            let card = String.fromCharCode.apply(null, new Uint8Array(this.fileArrayBuffer, headerPos, 80));

            //console.log (card);

            if (card.match(/^END */)) {
                headerPos += 80;
                break;
            }

            let key = card.substring (0, 8);
            key = key.replace (/ *$/, "");

            let val = card.substring (10);
            val = val.replace (/^ */, "");
            val = val.replace (/ *$/, "");
            if (val.indexOf ("'") >= 0)
                val = val.substring (1, val.length-1);
            else if (val.indexOf ("T") >= 0)
                val = true;
            else if (val.indexOf ("F") >= 0)
                val = false;
            else if (val.indexOf (".") >= 0)
                val = parseFloat (val);
            else
                val = parseInt (val);

            console.log(key)
            console.log(val)
            hdus[key] = val;

        }

        //console.log(hdus);

        header.setProperties(hdus);

        console.log(header);

        let data_start_pos = Utils.getNextBlockPosition(headerPos);

        let bintable = new BinaryTable(header, start_pos, data_start_pos, this.fileArrayBuffer)

        console.log(bintable.data);

        //this.readHeaderData(header, headerPos)
        //this.readHeaderDataCustom(header, headerPos)
    }

    debug_readHeaderData(header, pos) {

        if(pos % 2880 != 0) {
            pos += 2880 - pos % 2880;
        }

        console.log(header.properties['BITPIX'])
        let bitpix = header.properties['BITPIX']
        console.log(header.properties['NAXIS'])
        console.log(header.properties['NAXIS1'])
        let naxis1 = header.properties['NAXIS1']
        console.log(header.properties['NAXIS2'])
        let naxis2 = header.properties['NAXIS2']
        console.log(header.properties['XTENSION'])
        let headerType = header.properties['XTENSION']

        let row_size_byte = naxis1;
        let nb_row = naxis2;

        let table_size = naxis1 * naxis2;

        let stop_pos = pos + table_size;

        if(headerType === 'BINTABLE' || 1) {

            let columns = [];
            let nb_columns = 0;

            if('TFIELDS' in header.properties.keys()) {
                nb_columns = header.properties['TFIELDS']
            } else {
                let i = 1;

                for(i; i < 999; i++) {

                    //console.log(header.properties.keys())

                    if(header.properties['TFORM'+i]) {

                    } else {
                        nb_columns = i -1;
                        break;
                    }
                }
            }

            console.log(nb_columns);

            let dataview = new DataView(this.fileArrayBuffer, pos);

            let j = 0

            for (pos; pos < stop_pos; pos += naxis1) {

                let i = 0

                for(i; i < nb_columns; i++) {
                    //let val = String.fromCharCode.apply(null, new Uint8Array(this.fileArrayBuffer, pos, 1));

                    //console.log("Start offset" + curr_offset)

                    if (i == 0) {

                        let curr_offset = j * naxis1;

                        let val = dataview.getInt16(curr_offset);
                        curr_offset += 2;

                        let val1 = dataview.getFloat32(curr_offset);
                        curr_offset += 4;

                        let val2 = dataview.getFloat32(curr_offset);
                        curr_offset += 4;

                        let val3 = dataview.getFloat32(curr_offset);
                        curr_offset += 4;

                        let val4 = dataview.getInt16(curr_offset);
                        curr_offset += 2;

                        let val5 = dataview.getInt16(curr_offset);

                        console.log(val)
                        console.log(val1)
                        console.log(val2)
                        console.log(val3)
                        console.log(val4)
                        console.log(val5)
                    }
                }

                j++;

            }

        }

    }

    debug_readHeaderDataCustom(header, pos) {

        console.log(pos);

        if(pos % 2880 != 0) {
            pos += 2880 - pos % 2880;
        }

        console.log(pos);

        console.log(header.properties['BITPIX'])
        let bitpix = header.properties['BITPIX']
        console.log(header.properties['NAXIS'])
        console.log(header.properties['NAXIS1'])
        let naxis1 = header.properties['NAXIS1']
        console.log(header.properties['NAXIS2'])
        let naxis2 = header.properties['NAXIS2']
        console.log(header.properties['XTENSION'])
        let headerType = header.properties['XTENSION']

        let row_size_byte = naxis1;
        let nb_row = naxis2;

        let table_size = naxis1 * naxis2;

        let stop_pos = pos + table_size;

        if(headerType === 'BINTABLE' || 1) {

            let columns = [];
            let nb_columns = 0;

            if('TFIELDS' in header.properties.keys()) {
                nb_columns = header.properties['TFIELDS']
            } else {
                let i = 1;

                for(i; i < 999; i++) {

                    //console.log(header.properties.keys())

                    if(header.properties['TFORM'+i]) {

                    } else {
                        nb_columns = i -1;
                        break;
                    }
                }
            }

            console.log(nb_columns);

            let dataview = new DataView(this.fileArrayBuffer, pos);

            let j = 0

            for (pos; pos < stop_pos; pos += naxis1) {

                let i = 0

                for(i; i < nb_columns; i++) {
                    //let val = String.fromCharCode.apply(null, new Uint8Array(this.fileArrayBuffer, pos, 1));

                    //console.log("Start offset" + curr_offset)

                    if (i == 0) {

                        let curr_offset = j * naxis1;

                        //let valA = new Float64Array(this.fileArrayBuffer, pos, 1);
                        let val = dataview.getFloat64(curr_offset);
                        curr_offset += 8;
                        let val1 = dataview.getFloat64(curr_offset);
                        curr_offset += 8;
                        let val2 = dataview.getFloat32(curr_offset);
                        curr_offset += 4;
                        let val3 = dataview.getFloat32(curr_offset);
                        curr_offset += 4;
                        let val4 = dataview.getFloat32(curr_offset);

                        //console.log(valA);
                        console.log(val);
                        console.log(val1);
                        console.log(val2);
                        console.log(val3);
                        console.log(val4);
                    }
                }

                j++;

            }

        }

    }

}