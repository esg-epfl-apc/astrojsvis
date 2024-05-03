class DataComponent extends HTMLElement {

    container_id;
    container

    static component_id = "data_component";
    static select_hdus_id = "select-data-hdus";
    static table_id = "table-data";

    fits_reader_wrapper = null;

    constructor(container_id) {
        super();
        this.container_id = container_id;
        this._setContainer();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleFileChangeEvent = this.handleFileChangeEvent.bind(this);
        this.handleSelectChangeEvent = this.handleSelectChangeEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
        this.addEventListener('file-registry-change', this.handleFileChangeEvent);
    }

    _setupInnerListeners() {
        this.addEventListener('select-change', this.handleSelectChangeEvent);
    }

    _setupInnerElementsListeners() {
        this._setSelectListener();
    }

    _setSelectListener() {
        const select_element = document.getElementById(DataComponent.select_hdus_id);

        select_element.addEventListener('change', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('select-change', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    hdu_index: select_element.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });

    }

    handleFITSLoadedEvent(event) {
        this.fits_reader_wrapper = event.detail['fits_reader_wrapper'];

        let hdus = this.fits_reader_wrapper.getHDUs();
        this.setSelect(hdus);

        if(this.fits_reader_wrapper.isHDUTabular(hdus[0].index)) {
            let hdu_columns_name = this.fits_reader_wrapper.getColumnsNameFromHDU(hdus[0].index);
            let hdu_data = this.fits_reader_wrapper.getDataFromHDU(hdus[0].index)

            this.setTable(hdu_columns_name, hdu_data);
        } else {
            this.resetTable();
        }
    }

    handleFileChangeEvent() {
        let current_file_list = FileRegistry.getCurrentFilesList();
        let columns = [];

        console.log(current_file_list);

        current_file_list.forEach((file) => {

            console.log(file);

            if(file.type === 'fits') {
                let fits_reader_wrapper = WrapperContainer.getFITSReaderWrapper();

                fits_reader_wrapper.setFile(file.file);
                let fits_columns = fits_reader_wrapper.getAllColumns();

                fits_columns.forEach((fits_column) => {
                    let column = {...fits_column, file_id: file.id};
                    columns.push(column);
                })

            } else if(file.type === 'csv') {

            }
        })

        console.log(columns);

        let columns_by_file = columns.reduce((acc, column) => {
            if (!acc[column.file_id]) {
                acc[column.file_id] = [];
            }
            acc[column.file_id].push(column);
            return acc;
        }, {});

        console.log("Columns by file");
        console.log(columns_by_file);

        let select_options = [];

        let i = 1;
        for (let file_id in columns_by_file) {
            if (columns_by_file.hasOwnProperty(file_id)) {
                console.log(columns_by_file[file_id]);
                console.log(i);
                let file = FileRegistry.getFileById(file_id);
                let file_name = file.file_name;

                let frw = WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file.file);

                select_options.push(this._createFileColumnsOptionsGroup(columns_by_file[file_id], file_name, 'opt-group', frw));
            }
            i++;
        }

        console.log(select_options);

        this._setSelect(select_options);
    }

    handleSelectChangeEvent(event) {
        event.stopPropagation();
        let hdu_index = event.detail.hdu_index;

        if(this.fits_reader_wrapper.isHDUTabular(hdu_index)) {
            let hdu_columns_name = this.fits_reader_wrapper.getColumnsNameFromHDU(hdu_index);
            let hdu_data = this.fits_reader_wrapper.getColumnsJSONDataFromHDU(hdu_index)

            this.setTable(hdu_columns_name, hdu_data);
        } else {
            this.resetTable();
        }
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

    setSelect(hdus) {
        this.resetSelect();

        let select = document.getElementById(DataComponent.select_hdus_id);

        let options = this._createHDUsOptions(hdus);

        options.forEach(function(option) {
            select.add(option);
        });
    }

    _setSelect(option_groups) {
        this.resetSelect();

        let select = document.getElementById(DataComponent.select_hdus_id);

        option_groups.forEach((option_group) => {
            select.add(option_group);
        });

    }

    resetSelect() {
        let select = document.getElementById(DataComponent.select_hdus_id);
        select.innerHTML = '';
    }

    _createHDUsOptions(HDUs) {
        let options = [];
        let option;

        HDUs.forEach(function(hdu, index) {
            option = document.createElement("option");

            if(index === 0) option.setAttribute('selected', 'true');

            option.value = hdu.index;
            option.text = hdu.name;

            options.push(option);
        })

        return options;
    }

    _createFileColumnsOptionsGroup(file_columns, group_name, group_class, fits_reader_wrapper) {

        let opt_group = document.createElement("optgroup");
        opt_group.label = group_name;
        opt_group.className += group_class;

        file_columns.forEach(column => {
            let option = document.createElement("option");

            let hdu_type = fits_reader_wrapper.getHeaderCardValueByNameFromHDU(column.hdu_index, 'XTENSION');
            let hdu_extname = fits_reader_wrapper.getHeaderCardValueByNameFromHDU(column.hdu_index, 'EXTNAME');
            let name = hdu_type+'-'+hdu_extname+' '+column.name;

            if(column.is_from_header) {
                name += '(HEADER)';
            }

            option.text = name;
            option.value = `${column.file_id}.${column.hdu_index}$${column.name}`;
            opt_group.appendChild(option);
        });

        return opt_group
    }

    setTable(hdu_columns_name, hdu_data) {
        this.resetTable();

        console.log(hdu_data);

        let table_element = document.getElementById(DataComponent.table_id);

        let thead = table_element.querySelector('thead');
        let tbody = table_element.querySelector('tbody');

        let header_row = table_element.tHead.insertRow();
        hdu_columns_name.forEach((column) => {
            let header_cell = document.createElement('th');
            header_cell.textContent = column;
            header_row.appendChild(header_cell);
        });

        hdu_data.forEach(data_point => {
            const row = tbody.insertRow();
            for (let key in data_point) {
                if (Object.hasOwnProperty.call(data_point, key)) {
                    let cell = row.insertCell();
                    cell.textContent = data_point[key];
                }
            }
        });

    }

    resetTable() {
        let table_element = document.getElementById(DataComponent.table_id);

        let thead = table_element.querySelector('thead');
        let tbody = table_element.querySelector('tbody');

        thead.innerHTML = '';
        tbody.innerHTML = '';
    }
}