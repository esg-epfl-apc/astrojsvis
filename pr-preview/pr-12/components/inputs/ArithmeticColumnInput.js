import {FileRegistry} from "../../registries/FileRegistry";
import {WrapperContainer} from "../../containers/WrapperContainer";
import {RegistryContainer} from "../../containers/RegistryContainer";
import {ArithmeticColumnChangeEvent} from "../../events/ArithmeticColumnChangeEvent";
import {CustomColumnRegistry} from "../../registries/CustomColumnRegistry";

export class ArithmeticColumnInput extends HTMLElement {

    static column_display_id = 'column-display-list';
    static column_create_button_id = 'column-edit-button';
    static column_main_input_id = 'column-main-input';
    static column_list_id = 'column-input-list';
    static input_expression = 'input-expression';

    static button_commands = ['C', '<--', '-->', 'V']

    column_display = "<ul id='column-display-list'></ul>";
    column_create_button = "<button id='column-edit-button' class='btn btn-primary'>Create column</button>";
    column_main_input = "<div id='column-main-input'>" +
        "<div id='input-display'><input id='input-expression' type='text'></div>" +
        "<div id='input-container' class='column-input-container'>" +
        "<div id='input-keyboard' class='column-input-keyboard'>" +
        "<div class='button-grid'>" +
        "<button class='btn btn-secondary'>+</button>" +
        "<button class='btn btn-secondary'>-</button>" +
        "<button class='btn btn-secondary'>*</button>" +
        "<button class='btn btn-secondary'>/</button>" +
        "</div>" +
        "<div class='button-grid'>" +
        "<button class='btn btn-secondary'>(</button>" +
        "<button class='btn btn-secondary'>)</button>" +
        "<button class='btn btn-secondary'>pow2()</button>" +
        "<button class='btn btn-secondary'>pow3()</button>" +
        "</div>" +
        "<div class='button-grid'>" +
        "<button class='btn btn-secondary'>sqrt()</button>" +
        "<button class='btn btn-secondary'>min()</button>" +
        "<button class='btn btn-secondary'>max()</button>" +
        "<button class='btn btn-secondary'>mean()</button>" +
        "</div>" +
        "<div class='button-grid'>" +
        "<button class='btn btn-secondary'>log()</button>" +
        "<button class='btn btn-secondary'><--</button>" +
        "<button class='btn btn-secondary'>--></button>" +
        "<button class='btn btn-danger'>C</button>" +
        "<button class='btn btn-success'>V</button>" +
        "</div>" +
        "</div>" +
        "<div id='input-columns'>" +
        "<ul id='column-input-list'></ul>" +
        "</div>" +
        "</div>" +
        "</div>"

    display_formula = '';
    inner_formula = '';

    constructor() {
        super();

        this.innerHTML = this.column_display + this.column_main_input + this.column_create_button;

        this.handleFileChangeEvent = this.handleFileChangeEvent.bind(this);


        this._setupInnerElementsListeners();
        this._setupExternalListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('file-registry-change', this.handleFileChangeEvent);
    }

    _setupInnerElementsListeners() {
        this._setCreateButtonListener();
        this._setKeyboardListener();
    }

    _setCreateButtonListener() {
        let create_button = document.getElementById(ArithmeticColumnInput.column_create_button_id);

        create_button.addEventListener('click', (e) => {
            let display_main_input = document.getElementById(ArithmeticColumnInput.column_main_input_id);
            display_main_input.classList.toggle('visible');
        })
    }

    handleFileChangeEvent(event) {
        let current_file_list = FileRegistry.getCurrentFilesList();
        let columns = [];

        this._resetColumnInput();

        current_file_list.forEach((file) => {

            if(file.type === 'fits') {
                let fits_reader_wrapper = WrapperContainer.getFITSReaderWrapper();

                fits_reader_wrapper.setFile(file.file);
                let fits_columns = fits_reader_wrapper.getAllColumns();

                fits_columns.forEach((fits_column) => {
                    let column = {...fits_column, file_id: file.id};
                    columns.push(column);
                })

            }
        })

        let columns_by_file = columns.reduce((acc, column) => {
            if (!acc[column.file_id]) {
                acc[column.file_id] = [];
            }
            acc[column.file_id].push(column);
            return acc;
        }, {});

        let li_group_list = [];

        let i = 1;
        for (let file_id in columns_by_file) {
            if (columns_by_file.hasOwnProperty(file_id)) {
                let file = FileRegistry.getFileById(file_id);
                let file_name = file.file_name;

                let frw = WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file.file);

                li_group_list.push(this.createColumnsList(columns_by_file[file_id], frw));
            }
            i++;
        }

        this.setColumnInput(li_group_list);
        this._setColumnInputListener();
    }

    executeCommand(command) {
        let input_display = document.getElementById(ArithmeticColumnInput.input_expression);

        switch (command) {

            case 'C':
                input_display.value = '';

                break;

            case 'V':
                let column = {
                    expression: input_display.value
                };

                /*
                let custom_column_registry = RegistryContainer.getCustomColumnRegistry();
                custom_column_registry.addToAvailableColumns(column);
                */

                CustomColumnRegistry.addToAvailableColumns(column);

                this.addColumnToDisplay(input_display.value);

                let acce = new ArithmeticColumnChangeEvent();
                acce.dispatchToSubscribers();

                break;

            case '<--':

                break;

            case '-->':

                break;

        }
    }

    createColumnsList(file_columns, fits_reader_wrapper) {

        let li_group = [];

        file_columns.forEach(column => {
            let li = document.createElement("li");

            let hdu_type = fits_reader_wrapper.getHeaderCardValueByNameFromHDU(column.hdu_index, 'XTENSION');
            let hdu_extname = fits_reader_wrapper.getHeaderCardValueByNameFromHDU(column.hdu_index, 'EXTNAME');
            let name = hdu_type+'-'+hdu_extname+' '+column.name;

            if(column.is_from_header) {
                name += '(HEADER)';
            }

            if(column.is_processed) {
                li.innerHTML = name;
                li.setAttribute('dataset-id',`${column.from_file}.${column.hdu_index}$${column.name}`);
            } else {
                li.innerHTML = name;
                li.setAttribute('data-id',`${column.file_id}.${column.hdu_index}$${column.name}`);
            }

            li_group.push(li);
        });

        return li_group;
    }

    setColumnInput(li_group_list) {
        let ul_columns = document.getElementById(ArithmeticColumnInput.column_list_id);

        li_group_list.forEach((li_group) => {
            li_group.forEach((li) => {
                ul_columns.appendChild(li);
            })
        })
    }

    _setKeyboardListener() {
        let buttons = document.querySelectorAll('div.button-grid button');
        let input_display = document.getElementById(ArithmeticColumnInput.input_expression);

        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                let operator = button.textContent;

                if(!ArithmeticColumnInput.button_commands.includes(operator)) {
                    input_display.value += operator;
                } else {
                    this.executeCommand(operator);
                }
            });
        });
    }

    _resetColumnInput() {
        let column_list = document.getElementById(ArithmeticColumnInput.column_list_id);
        column_list.innerHTML = '';
    }

    _setColumnInputListener() {
        let lis = document.querySelectorAll('ul#column-input-list li');
        let input_display = document.getElementById(ArithmeticColumnInput.input_expression);

        lis.forEach(function(li) {
            li.addEventListener('click', (e) => {
                let column_id = li.getAttribute('data-id');
                 input_display.value += column_id;
            });
        });
    }

    addColumnToDisplay(expression) {
        let column_display = document.getElementById(ArithmeticColumnInput.column_display_id);

        let li_expression = document.createElement('li');
        li_expression.innerHTML = expression +' <button class="btn btn-danger">X</button>';
        li_expression.setAttribute('data-column', expression);

        column_display.appendChild(li_expression);
    }

}