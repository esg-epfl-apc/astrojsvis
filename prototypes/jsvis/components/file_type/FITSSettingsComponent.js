import {WrapperContainer} from "../../containers/WrapperContainer";
import {FileRegistry} from "../../registries/FileRegistry";
import {FileRegistryChangeEvent} from "../../events/FileRegistryChangeEvent";
import {RegistryContainer} from "../../containers/RegistryContainer";

export class FITSSettingsComponent extends HTMLElement {

    container_id = "fits-settings-container";
    select_hdu_id = "select-hdu-file";
    table_header_id = "table-header-data";
    table_data_id = "table-data";

    file = null;
    is_current = false;

    add_to_plot_btn_id = "add-to-plot";
    remove_from_plot_btn_id = "remove-from-plot";
    save_btn_id = 'save-file-settings';

    product_type_select_id = 'product-type-select';
    arf_file_select_id = 'arf-file-select';
    rmf_file_select_id = 'rmf-file-select';

    container = '<div id="fits-settings-container" class="full-width-column" style="grid-column: 1 / span 2;">' +
        '<div class="card">' +
        '<div class="card-body">' +
        '</div>' +
        '</div>' +
        '</div>';

    select_hdu_file = '<select id="select-hdu-file" class="form-select"></select>';

    inner_container = '<div class="inner-row"></div>';

    header_column = '<div class="left-column">' +
        '<div class="card-header">Header</div>' +
        '<div class="card-body">' +
        '<div id="header-hdu-file">' +
        '</div>' +
        '</div>';

    table_header = '<table id="table-header-data" class="table table-striped">' +
        '    <thead>' +
        '    <tr>' +
        '        <th scope="col">#</th>' +
        '        <th scope="col">Name</th>' +
        '        <th scope="col">Value</th>' +
        '        <th scope="col">Comment</th>' +
        '    </tr>' +
        '    </thead>' +
        '    <tbody class="table-group-divider">' +
        '    </tbody>' +
        '</table>'

    data_column = '<div class="right-column">' +
        '<div class="card-header">Data</div>' +
        '<div class="card-body">' +
        '   <div id="data-hdu-file">' +
        '   </div>' +
        '</div>';

    table_data = '<table id="table-data" class="table table-striped">' +
        '    <thead>' +
        '       <tr>' +
        '       </tr>' +
        '    </thead>' +
        '    <tbody class="table-group-divider">' +
        '    </tbody>' +
        '</table>'

    btn_save_settings = '<button class="btn btn-success" id="save-file-settings">Save changes</button>';
    btn_add_to_plot = '<button class="btn btn-primary" id="add-to-plot">Add to plot</button>;'
    btn_remove_from_plot = '<button class="btn btn-danger" id="remove-from-plot">Remove from plot</button>';

    constructor(file, is_current) {
        super();

        this.file = file;
        this.is_current = is_current;

        this.innerHTML = '<div class="full-width-column" style="grid-column: 1 / span 2;">\n' +
            '                            <div class="card">\n' +
            '                                <div class="card-header">File settings</div>\n' +
            '                                <div class="card-body">\n' +
            ' <label for="product-type-select">Product type :</label>' +
            ' <select id="product-type-select" class="form-select"><option selected="selected" value="none">None</option><option value="lightcurve">Light Curve</option><option value="spectrum">Spectrum</option></select> ' +
            ' <label for="product-type-select" class="spectrum-settings">ARF file : </label>' +
            ' <select id="arf-file-select" class="form-select spectrum-settings"></select>' +
            ' <label for="product-type-select" class="spectrum-settings">RMF file :</label>' +
            ' <select id="rmf-file-select" class="form-select spectrum-settings"></select>' +
            ' <label for="select-hdu-file">HDU :</label>' +
            '                                    <select id="select-hdu-file" class="form-select">\n' +
            '\n' +
            '                                    </select>\n' +
            '\n' +
            '                                    <div class="inner-row">\n' +
            '                                        <div class="left-column">\n' +
            '                                            <div class="card">\n' +
            '                                                <div class="card-header">Header</div>\n' +
            '                                                <div class="card-body">\n' +
            '                                                    <div id="header-hdu-file" class="file-data-container">\n' +
            '                                                        <table id="table-header-data" class="table table-striped">\n' +
            '                                                            <thead>\n' +
            '                                                            <tr>\n' +
            '                                                                <th scope="col">#</th>\n' +
            '                                                                <th scope="col">Name</th>\n' +
            '                                                                <th scope="col">Value</th>\n' +
            '                                                                <th scope="col">Comment</th>\n' +
            '                                                            </tr>\n' +
            '                                                            </thead>\n' +
            '                                                            <tbody class="table-group-divider">\n' +
            '\n' +
            '                                                            </tbody>\n' +
            '                                                        </table>\n' +
            '                                                    </div>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <div class="right-column">\n' +
            '                                            <div class="card">\n' +
            '                                                <div class="card-header">Data</div>\n' +
            '                                                <div class="card-body">\n' +
            '                                                    <div id="data-hdu-file" class="file-data-container">\n' +
            '<table id="table-data" class="table table-striped">' +
                '    <thead>' +
                '       <tr>' +
                    '       </tr>' +
                '    </thead>' +
                '    <tbody class="table-group-divider">' +
                '    </tbody>' +
                '</table>'+
            '                                                    </div>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '\n' +
            '                                    <button class="btn btn-success" id="save-file-settings">Save changes</button>\n' +
            '                                    <button class="btn btn-primary" id="add-to-plot">Add to plot</button>\n' +
            '                                    <button class="btn btn-danger" id="remove-from-plot">Remove from plot</button>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>'

    }

    setupComponent() {
        this.setHDUSelect();
        this.setupActionButtons();
        this.setProductSettings();

        let select_hdu = document.getElementById(this.select_hdu_id);
        let hdu_index = select_hdu.value;

        this.setTables(hdu_index);

        this.setupInnerElementListeners();
    }

    setHDUSelect() {

        let select_hdu = document.getElementById(this.select_hdu_id);

        select_hdu.innerHTML = '';

        let frw = WrapperContainer.getFITSReaderWrapper();
        frw.setFile(this.file.file);

        let hdus = frw.getHDUs();

        let options = [];
        hdus.forEach((hdu) => {
            let option = document.createElement("option");

            option.value = hdu.index;
            option.text = hdu.name + ' ' + hdu.extname;

            options.push(option);
        })

        options.forEach((option) => {
            select_hdu.add(option);
        })

    }

    setupInnerElementListeners() {
        this.setHDUSelectListener();
        this.setSaveButtonListener();
        this.setProductTypeSelectListener();
        this.setARFFileSelectListener();
        this.setRMFFileSelectListener();
    }

    setupActionButtons() {

        let add_to_plot_btn = document.getElementById(this.add_to_plot_btn_id);
        let remove_from_plot_btn  = document.getElementById(this.remove_from_plot_btn_id);

        if(this.is_current) {
            add_to_plot_btn.style.display = 'none';
            remove_from_plot_btn.style.display = 'initial';
        } else {
            add_to_plot_btn.style.display = 'initial';
            remove_from_plot_btn.style.display = 'none';
        }

        add_to_plot_btn.addEventListener('click', (event) => {
            FileRegistry.addToCurrentFiles(this.file);

            this.is_current = true;

            let frce = new FileRegistryChangeEvent();

            try {
                frce.dispatchToSubscribers();
            } catch(e) {
                console.log("No subsribers for event : " + FileRegistryChangeEvent.name);
            }

            this.resetContainerForCurrentFile();

        });

        remove_from_plot_btn.addEventListener('click', (event) => {
            FileRegistry.removeFromCurrentFiles(this.file.id);

            this.is_current = false;

            let frce = new FileRegistryChangeEvent();

            try {
                frce.dispatchToSubscribers();
            } catch(e) {
                console.log("No subscribers for specified event : " + FileRegistryChangeEvent.name);
            }

            this.resetContainerForCurrentFile();
        });
    }

    setProductSettings() {
        let product_type = null;
        let rmf_file = null;
        let arf_file = null;

        if(this.file.product_type) product_type = this.file.product_type;
        if(this.file.rmf_file) rmf_file = this.file.rmf_file;
        if(this.file.arf_file) arf_file = this.file.arf_file;

        this.setProductTypeSelect(product_type);
        this.setRMFFileSelect(rmf_file);
        this.setARFFileSelect(arf_file);
    }

    setTables(hdu_index) {
        this.resetTables();

        let table_header = document.getElementById(this.table_header_id);
        let table_data = document.getElementById(this.table_data_id);

        let frw = WrapperContainer.getFITSReaderWrapper();
        frw.setFile(this.file.file);

        let hdu_cards = frw.getHeaderCardsValueFromHDU(hdu_index)

        let tbody = table_header.querySelector('tbody');

        hdu_cards.forEach(card => {

            let row = tbody.insertRow();

            let index_cell = row.insertCell(0);
            let card_cell = row.insertCell(1);
            let name_cell = row.insertCell(2);
            let description_cell = row.insertCell(3);

            index_cell.textContent = card.index;
            card_cell.textContent = card.card_name;
            name_cell.textContent = card.value;
            description_cell.textContent = card.comment;
        });


        try {

            let hdu_columns_name = frw.getColumnsNameFromHDU(hdu_index);
            let hdu_data = frw.getColumnsJSONDataFromHDU(hdu_index)

            let header_row = table_data.tHead.insertRow();
            tbody = table_data.querySelector('tbody');

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

        } catch(e) {
            console.log("DATA PARSING ERROR");
        }
    }

    resetTables() {
        let table_header = document.getElementById(this.table_header_id);
        let table_data = document.getElementById(this.table_data_id);

        let tbody = table_header.querySelector('tbody');
        tbody.innerHTML = '';

        tbody = table_data.querySelector('tbody');
        let thead = table_data.querySelector('thead');

        tbody.innerHTML = '';
        thead.innerHTML = '<tr></tr>';
    }

    setHDUSelectListener() {

        let select_element = document.getElementById(this.select_hdu_id);

        select_element.addEventListener('change', (event) => {
            this.setTables(event.target.value);
        });

    }

    setSaveButtonListener() {
        let save_settings_btn = document.getElementById(this.save_btn_id);

        save_settings_btn.addEventListener('click', (event) => {
            let product_type_select = document.getElementById(this.product_type_select_id);

            if(product_type_select.value === 'spectrum') {
                let rmf_file_select = document.getElementById(this.rmf_file_select_id);
                let arf_file_select = document.getElementById(this.arf_file_select_id);

                let rmf_file_id = rmf_file_select.value;
                let arf_file_id = arf_file_select.value;

                FileRegistry.setFileMetadata(this.file.id, {
                    rmf_file: rmf_file_id,
                    arf_file: arf_file_id
                });
            }

        })

    }

    setProductTypeSelect(value = null) {
        let product_type_select = document.getElementById(this.product_type_select_id);

        if(value) {
            product_type_select.value = 'none';
        } else {
            product_type_select.value = value;
        }
    }

    setProductTypeSelectListener() {
        let product_type_select = document.getElementById(this.product_type_select_id);

        product_type_select.addEventListener('change', (event) => {
            if(product_type_select.value === 'spectrum') {
                this.setProductSettingsVisibility('spectrum');
            } else if(product_type_select.value === 'lightcurve') {
                this.setProductSettingsVisibility('lightcurve');
            } else {
                this.setProductSettingsVisibility();
            }
        })

    }

    setRMFFileSelect(value = null) {
        let rmf_file_select = document.getElementById(this.rmf_file_select_id);

        let file_options = this.getFilesOptionsList();

        file_options.forEach((option) => {
            rmf_file_select.appendChild(option)
        });

        if(!value) {
            rmf_file_select.value = 'none';
        } else {
            rmf_file_select.value = value;
        }
    }

    setRMFFileSelectListener() {
        let rmf_file_select = document.getElementById(this.rmf_file_select_id);

    }

    setARFFileSelect(value = null) {
        let arf_file_select = document.getElementById(this.arf_file_select_id);

        let file_options = this.getFilesOptionsList();

        file_options.forEach((option) => {
            arf_file_select.appendChild(option)
        });

        if(!value) {
            arf_file_select.value = 'none';
        } else {
            arf_file_select.value = value;
        }
    }

    setARFFileSelectListener() {
        let arf_file_select = document.getElementById(this.arf_file_select_id);

    }

    setProductSettingsVisibility(settings = null) {
        let rmf_file_select = document.getElementById(this.rmf_file_select_id);
        let arf_file_select = document.getElementById(this.arf_file_select_id);

        rmf_file_select.style.display = 'none';
        arf_file_select.style.display = 'none';

        let spectrum_elements = document.getElementsByClassName('spectrum-settings');

        for (let i = 0; i < spectrum_elements.length; i++) {
            spectrum_elements[i].style.display = 'none';
        }

        if(!settings) {

        } else if(settings === 'spectrum') {
            rmf_file_select.style.display = 'block';
            arf_file_select.style.display = 'block';

            for (let i = 0; i < spectrum_elements.length; i++) {
                spectrum_elements[i].style.display = 'block';
            }
        } else if(settings === 'lightcurve') {

        }
    }

    resetContainerForCurrentFile() {
        this.setupComponent();
    }

    getFilesOptionsList() {
        let file_options = [];
        let file_list = FileRegistry.getAllFiles();

        let option = document.createElement("option");

        option.setAttribute('selected', 'true');

        option.value = 'none';
        option.text = 'None';

        file_options.push(option);

        file_list.forEach((file) => {
            option = document.createElement("option");

            option.value = file.id;
            option.text = file.file_name;

            file_options.push(option);
        })

        return file_options;
    }
}