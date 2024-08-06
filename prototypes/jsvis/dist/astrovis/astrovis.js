(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Astrovis"] = factory();
	else
		root["Astrovis"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./components/FileComponent.js":
/*!*************************************!*\
  !*** ./components/FileComponent.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileComponent: () => (/* binding */ FileComponent)
/* harmony export */ });
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events/FileRegistryChangeEvent */ "./events/FileRegistryChangeEvent.js");
/* harmony import */ var _file_type_FITSSettingsComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./file_type/FITSSettingsComponent */ "./components/file_type/FITSSettingsComponent.js");





class FileComponent extends HTMLElement {

    static component_id = "file_component";
    static select_file = "select-file";
    static input_file_url = "file-input-url";
    static input_file_local = "file-input-local";
    static input_file_type = "select-file-type";
    static load_button = "load-file";

    static available_files_list_id = 'available-files-list';
    static current_files_list_id = 'current-files-list';

    static file_settings_container_id = 'file-settings-container';

    static save_button_id = 'save-file-settings';
    static add_button_id = 'add-to-plot'
    static remove_button_id = 'remove-from-plot'

    container_id;
    container;

    fits_reader_wrapper = null;

    constructor(container_id) {
        super();
        this.container_id = container_id;
        this._setContainer();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleSelectChangeEvent = this.handleSelectChangeEvent.bind(this);
        this.handleLoadFileEvent = this.handleLoadFileEvent.bind(this);
        this.handleFileLoadedEvent = this.handleFileLoadedEvent.bind(this);
        this.handleFileRegistryChangeEvent = this.handleFileRegistryChangeEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
        this.addEventListener('file-loaded', this.handleFileLoadedEvent)
        this.addEventListener('file-registry-change', this.handleFileRegistryChangeEvent)
    }

    _setupInnerListeners() {
        this.addEventListener('select-change', this.handleSelectChangeEvent);
        this.addEventListener('load-file', this.handleLoadFileEvent);
    }

    _setupInnerElementsListeners() {
        this._setLoadLocalFileButtonListener();
        this._setFilesListsListeners();
    }

    _setLoadLocalFileButtonListener() {
        let file_input = document.getElementById(FileComponent.input_file_local);
        let type_input = document.getElementById(FileComponent.input_file_type);

        let file_type = type_input.value;

        file_input.addEventListener('change', function(event) {
            let file = event.target.files[0];

            if(file_type === 'fits') {
                file.arrayBuffer().then(arrayBuffer => {
                    let fits_reader_wrapper = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();

                    fits_reader_wrapper.initializeFromBuffer(arrayBuffer, file.name);

                }).catch(error => {
                    console.error('Error reading file as ArrayBuffer:', error);
                });
            } else if(file_type === 'csv') {
                let reader = new FileReader();
                reader.onload = function(event) {
                    let csv_file = event.target.result;
                };
            }

        });

    }

    _setFilesListsListeners() {
        let list_available = document.getElementById(FileComponent.available_files_list_id);
        let list_current = document.getElementById(FileComponent.current_files_list_id);

        let buttons_available = list_available.querySelectorAll("button");
        let buttons_current = list_current.querySelectorAll("button");

        let buttons = Array.from(buttons_available).concat(Array.from(buttons_current));

        buttons.forEach(button => {
            button.addEventListener("click", () => {

                button.classList.toggle("active");

                let aria_current = button.getAttribute("aria-current");
                if (aria_current && aria_current === "true") {
                    button.removeAttribute("aria-current");
                    this.clearFileSettingsPanel();
                } else {
                    button.setAttribute("aria-current", "true");

                    let file = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(button.getAttribute("data-id"));
                    this.setFileSettingsPanel(file);
                }

                let buttons_to_filter = Array.from(buttons);

                let filtered_buttons = buttons_to_filter.filter(list_button => list_button !== button);

                filtered_buttons.forEach(filtered_button => {
                    filtered_button.classList.remove('active');
                    filtered_button.removeAttribute('aria-current');
                })

            });
        });
    }

    _setFileSettingsButtonsListeners() {
        let save_button = document.getElementById(FileComponent.save_button_id);
        let add_button = document.getElementById(FileComponent.add_button_id);

        save_button.addEventListener('click', (event) => {

        });

        add_button.addEventListener('click', (event) => {
            let btn = event.target;
            let file_id = btn.getAttribute('data-id');

            let file = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(file_id);

            _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.addToCurrentFiles(file);

            this.updateCurrentFilesList();
            this.updateAvailableFilesList();

            let frce = new _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent();
            frce.dispatchToSubscribers();
        });
    }

    handleFITSLoadedEvent(event) {
        this.fits_reader_wrapper = event.detail['fits_reader_wrapper'];
        let file_path = this.fits_reader_wrapper.getFilePath();

        this._addFileToSelect(file_path);
    }

    handleFileLoadedEvent(event) {
        _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.addToAvailableFiles(event.detail);

        this.updateAvailableFilesList();
        this._setFilesListsListeners();
    }

    handleFileRegistryChangeEvent(event) {
        this.updateAvailableFilesList();
        this.updateCurrentFilesList();

        this._setFilesListsListeners();
    }

    handleLoadFileEvent(event) {

    }

    updateFilesLists() {
        this.updateAvailableFilesList();
        this.updateCurrentFilesList();
    }

    updateAvailableFilesList() {
        let available_files_list_element = document.getElementById(FileComponent.available_files_list_id);

        available_files_list_element.innerHTML = '';

        let file_elements = this._createFileSelection('available');

        file_elements.forEach((file_element) => {
            available_files_list_element.appendChild(file_element);
        })
    }

    updateCurrentFilesList() {
        let current_files_list_element = document.getElementById(FileComponent.current_files_list_id);

        current_files_list_element.innerHTML = '';

        let file_elements = this._createFileSelection('current');

        file_elements.forEach((file_element) => {
            current_files_list_element.appendChild(file_element);
        })
    }

    clearFileSettingsPanel() {
        let file_settings_component_container = document.getElementById(FileComponent.file_settings_container_id);
        file_settings_component_container.innerHTML = '';
    }

    setFileSettingsPanel(file) {
        this.clearFileSettingsPanel();

        if(file.type === 'fits') {

            let is_current = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.isFileCurrent(file.id);

            let file_settings_component = new _file_type_FITSSettingsComponent__WEBPACK_IMPORTED_MODULE_3__.FITSSettingsComponent(file, is_current);

            let file_settings_component_container = document.getElementById(FileComponent.file_settings_container_id);
            file_settings_component_container.appendChild(file_settings_component);

            file_settings_component.setupComponent();
        }

    }

    _addFileToSelect(file) {
        let file_option = this._createSelectOption(file);
        let select = document.getElementById(FileComponent.select_file);

        select.add(file_option);
    }

    _createFileSelection(list = 'available') {
        let files;

        if(list === 'available') {
            files = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getAvailableFilesList();
        } else {
            files = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getCurrentFilesList();
        }

        let selection_elements = [];

        let file_selection;
        files.forEach((available_file) => {
            let file_uid = available_file.id+'.'+available_file.file_name;

            file_selection = document.createElement("button");
            file_selection.setAttribute("type", "button");
            file_selection.setAttribute("class", "available-file-selection list-group-item list-group-item-action");
            file_selection.setAttribute("data-id", available_file.id);
            file_selection.textContent = file_uid;

            selection_elements.push(file_selection);
        })

        return selection_elements;
    }

    _createSelectOption(file_path) {
        let option = document.createElement("option");

        option.value = file_path;
        option.text = file_path;

        return option;
    }

    handleSelectChangeEvent(event) {
        event.stopPropagation();
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

}

/***/ }),

/***/ "./components/SettingsComponent.js":
/*!*****************************************!*\
  !*** ./components/SettingsComponent.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsComponent: () => (/* binding */ SettingsComponent)
/* harmony export */ });
/* harmony import */ var _containers_SettingsContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/SettingsContainer */ "./containers/SettingsContainer.js");
/* harmony import */ var _events_SettingsChangedEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../events/SettingsChangedEvent */ "./events/SettingsChangedEvent.js");
/* harmony import */ var _events_VisualizationGenerationEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events/VisualizationGenerationEvent */ "./events/VisualizationGenerationEvent.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/ColumnUtils */ "./utils/ColumnUtils.js");
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/RegistryContainer */ "./containers/RegistryContainer.js");
/* harmony import */ var _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../events/FileRegistryChangeEvent */ "./events/FileRegistryChangeEvent.js");
/* harmony import */ var _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../registries/CustomColumnRegistry */ "./registries/CustomColumnRegistry.js");










class SettingsComponent extends HTMLElement {

    container_id;
    container

    static component_id = "settings_component";
    static container_id = "settings-component";

    static select_library_id = "select-library";

    static select_data_type_id = "select-data-type";

    static light_curve_settings_id = "light-curve-settings"
    static spectrum_settings_id = "spectrum-settings"

    static select_hdus_id = "select-hdus";

    static calculation_radio_class = "calculation-radio";

    static select_axis_x_id = "select-axis-x";
    static select_axis_y_id = "select-axis-y";

    static select_error_bar_x_id = "select-axis-x-error-bar";
    static select_error_bar_y_id = "select-axis-y-error-bar";

    static supported_data_types = ['generic', 'light-curve', 'spectrum'];

    fits_reader_wrapper = null;
    settings_object = null;

    constructor() {
        super();

        this.container_id = SettingsComponent.container_id;
        this._setContainer();

        this.settings_object = _containers_SettingsContainer__WEBPACK_IMPORTED_MODULE_0__.SettingsContainer.getSettingsContainer().getVisualizationSettingsObject();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleConfigurationEvent = this.handleConfigurationEvent.bind(this);

        this.handleLibraryChangeEvent = this.handleLibraryChangeEvent.bind(this);
        this.handleDataTypeChangeEvent = this.handleDataTypeChangeEvent.bind(this);
        this.handleHDUsChangeEvent = this.handleHDUsChangeEvent.bind(this);
        this.handleGenerateEvent = this.handleGenerateEvent.bind(this);
        this.handleFileChangeEvent = this.handleFileChangeEvent.bind(this);
        this.handleArithmeticColumnChangeEvent = this.handleArithmeticColumnChangeEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
        this.addEventListener('configuration', this.handleConfigurationEvent);
        this.addEventListener('file-registry-change', this.handleFileChangeEvent);
    }

    _setupInnerListeners() {
        this.addEventListener('select-library-change', this.handleLibraryChangeEvent);
        this.addEventListener('select-data-type-change', this.handleDataTypeChangeEvent);
        this.addEventListener('select-hdus-change', this.handleHDUsChangeEvent);
        this.addEventListener('button-generate-click', this.handleGenerateEvent);
        this.addEventListener('arithmetic-column-change', this.handleArithmeticColumnChangeEvent);
    }

    _setupInnerElementsListeners() {
        this._setSelectLibraryListener();
        this._setSelectDataTypeListener()
        this._setSelectHDUsListener();
        this._setSelectAxisListener();
        this._setGenerateButtonListener();
        this._setCalculationRadioListeners();
    }

    handleFITSLoadedEvent(event) {
        this.fits_reader_wrapper = event.detail['fits_reader_wrapper'];

        let hdus = this.fits_reader_wrapper.getHDUs();
        this._setSelectHDUs(hdus);

        if(this.fits_reader_wrapper.isHDUTabular(hdus[0].index)) {
            let hdu_columns_name = this.fits_reader_wrapper.getColumnsNameFromHDU(hdus[0].index);

            this._setSelectAxis(hdu_columns_name);
            this._setSelectErrorBars(hdu_columns_name);

        } else {
            this._resetSelectAxis();
            this._resetSelectErrorBars()
        }

    }

    handleConfigurationEvent(event) {
        let configuration_object = event.detail.configuration_object;

        this.updateSettings(configuration_object);
    }

    handleLibraryChangeEvent(event) {
        event.stopPropagation();

        this.updateSettingsObject();

        let settings_changed_event = new _events_SettingsChangedEvent__WEBPACK_IMPORTED_MODULE_1__.SettingsChangedEvent(this.settings_object);
        settings_changed_event.dispatch();
    }

    handleDataTypeChangeEvent(event) {
        event.stopPropagation();
        let data_type = event.detail.data_type;

        if(SettingsComponent.supported_data_types.includes(data_type)) {
            this.updateSettingsObject();

            switch(data_type) {

                case 'light-curve':
                    document.getElementById(SettingsComponent.light_curve_settings_id).style.display = 'block';
                    document.getElementById(SettingsComponent.spectrum_settings_id).style.display = 'none';
                    break;

                case 'spectrum':
                    document.getElementById(SettingsComponent.spectrum_settings_id).style.display = 'block';
                    document.getElementById(SettingsComponent.light_curve_settings_id).style.display = 'none';
                    break;

                default:
                    document.getElementById(SettingsComponent.spectrum_settings_id).style.display = 'none';
                    document.getElementById(SettingsComponent.light_curve_settings_id).style.display = 'none';
            }

        }

    }

    handleHDUsChangeEvent(event) {
        event.stopPropagation();
        let hdu_index = event.detail.hdu_index;

        if(this.fits_reader_wrapper.isHDUTabular(hdu_index)) {
            let hdu_columns_name = this.fits_reader_wrapper.getColumnsNameFromHDU(hdu_index);

            this._setSelectAxis(hdu_columns_name);
            this._setSelectErrorBars(hdu_columns_name);

        } else {
            this._resetSelectAxis();
            this._resetSelectErrorBars()
        }
    }

    handleGenerateEvent(event) {
        event.stopPropagation();

        this.settings_object.reset();

        this.updateSettingsObject();

        let visualization_generation_event = new _events_VisualizationGenerationEvent__WEBPACK_IMPORTED_MODULE_2__.VisualizationGenerationEvent(this.settings_object);
        visualization_generation_event.dispatch();

    }

    handleFileChangeEvent(event) {
        let current_file_list = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getCurrentFilesList();
        let columns = [];

        current_file_list.forEach((file) => {

            if(file.type === 'fits') {
                let fits_reader_wrapper = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();

                if(file.product_type !== 'spectrum') {
                    fits_reader_wrapper.setFile(file.file);
                } else {
                    fits_reader_wrapper.setFileFromFileObject(file);
                }

                let fits_columns = fits_reader_wrapper.getAllColumns();

                fits_columns.forEach((fits_column) => {
                    let column = {...fits_column, file_id: file.id};
                    columns.push(column);
                })

            } else if(file.type === 'csv') {

            }
        })

        let columns_by_file = columns.reduce((acc, column) => {
            if (!acc[column.file_id]) {
                acc[column.file_id] = [];
            }
            acc[column.file_id].push(column);
            return acc;
        }, {});

        let select_options = [];

        let i = 1;
        for (let file_id in columns_by_file) {
            if (columns_by_file.hasOwnProperty(file_id)) {
                let file = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getFileById(file_id);
                let file_name = file.file_name;

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file.file);

                select_options.push(this._createFileColumnsOptionsGroup(columns_by_file[file_id], file_name, 'opt-group', frw));
            }
            i++;
        }

        this._setSelectGroupAxis(select_options);

        select_options.unshift(this._createGenericColumnOptionsGroup());
        this._setSelectGroupErrorBars(select_options);
    }

    handleArithmeticColumnChangeEvent(event) {
        let columns_opt_groups = this._createColumnsOptGroups();
        console.log(columns_opt_groups);
        this._setSelectGroupAxis(columns_opt_groups);
        //console.log(event);
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    _resetContainer() {
        this.container.innerHTML = "";
    }

    _setSelectHDUs(hdus) {
        this._resetSelectHDUs();

        let select = document.getElementById(SettingsComponent.select_hdus_id);

        let options = this._createHDUsOptions(hdus);

        options.forEach(function(option) {
            select.add(option);
        });
    }

    _resetSelectHDUs() {
        let select = document.getElementById(SettingsComponent.select_hdus_id);
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

            if(column.is_processed) {
                option.text = name;
                option.value = `${column.from_file}.${column.hdu_index}$${column.name}`;
            } else {
                option.text = name;
                option.value = `${column.file_id}.${column.hdu_index}$${column.name}`;
            }
            
            opt_group.appendChild(option);
        });

        return opt_group
    }

    _createGenericColumnOptionsGroup(is_axis = false) {
        let opt_group = document.createElement("optgroup");
        opt_group.label = "Generic columns";
        opt_group.className += "generic";

        let option = document.createElement("option");

        option.text = 'None';
        option.value = `none`;

        if(!is_axis) {
            opt_group.appendChild(option);
        }

        let custom_columns = _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_8__.CustomColumnRegistry.getAvailableColumnsList();

        if(custom_columns.length > 0) {
            custom_columns.forEach((custom_column) => {
                option = document.createElement("option");
                option.text = custom_column.expression;
                option.value = custom_column.expression;

                option.setAttribute("data-column-type", "processed");

                opt_group.appendChild(option);
            })
        }

        return opt_group;
    }

    _setSelectAxis(columns) {
        this._resetSelectAxis();

        let select_axis_x = document.getElementById(SettingsComponent.select_axis_x_id);
        let select_axis_y = document.getElementById(SettingsComponent.select_axis_y_id);

        let select_axis = [select_axis_x, select_axis_y];

        let options = this._createColumnsOptions(columns);

        options.forEach(function(option) {
            select_axis.forEach(function(select) {
                let cloned_option = option.cloneNode(true);
                select.add(cloned_option);
            })
        });
    }

    _setSelectGroupAxis(columns_optgroup) {
        this._resetSelectAxis();

        let select_axis_x = document.getElementById(SettingsComponent.select_axis_x_id);
        let select_axis_y = document.getElementById(SettingsComponent.select_axis_y_id);

        let select_axis = [select_axis_x, select_axis_y];

        columns_optgroup.forEach((column_optgroup) => {
            select_axis.forEach((select) => {
                let cloned_optgroup = column_optgroup.cloneNode(true);
                select.add(cloned_optgroup);
            })
        })

    }

    _resetSelectAxis() {
        let select_axis_x = document.getElementById(SettingsComponent.select_axis_x_id);
        let select_axis_y = document.getElementById(SettingsComponent.select_axis_y_id);

        select_axis_x.innerHTML = '';
        select_axis_y.innerHTML = '';
    }

    _setSelectErrorBars(columns) {
        this._resetSelectErrorBars();

        let select_error_bar_x = document.getElementById(SettingsComponent.select_error_bar_x_id);
        let select_error_bar_y = document.getElementById(SettingsComponent.select_error_bar_y_id);

        let select_error_bars = [select_error_bar_x, select_error_bar_y];

        let options = this._createColumnsOptions(columns);

        options.forEach(function(option) {
            select_error_bars.forEach(function(select) {
                let cloned_option = option.cloneNode(true);
                select.add(cloned_option);
            })
        });
    }

    _setSelectGroupErrorBars(columns_optgroup) {
        this._resetSelectErrorBars();

        let select_error_bar_x = document.getElementById(SettingsComponent.select_error_bar_x_id);
        let select_error_bar_y = document.getElementById(SettingsComponent.select_error_bar_y_id);

        let select_error_bars = [select_error_bar_x, select_error_bar_y];

        columns_optgroup.forEach((column_optgroup) => {
            select_error_bars.forEach((select) => {
                let cloned_optgroup = column_optgroup.cloneNode(true);
                select.add(cloned_optgroup);
            })
        })
    }

    _resetSelectErrorBars() {
        let select_error_bar_x = document.getElementById(SettingsComponent.select_error_bar_x_id);
        let select_error_bar_y = document.getElementById(SettingsComponent.select_error_bar_y_id);

        select_error_bar_x.innerHTML = '';
        select_error_bar_y.innerHTML = '';
    }

    _createColumnsOptions(columns) {
        let options = [];
        let option;

        columns.forEach(function(column) {

            option = document.createElement("option");

            option.value = column;
            option.text = column;

            options.push(option);
        })

        return options;
    }

    _createColumnsOptGroups() {

        let current_file_list = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getCurrentFilesList();
        let columns = [];

        current_file_list.forEach((file) => {

            if(file.type === 'fits') {
                let fits_reader_wrapper = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();

                if(file.product_type !== 'spectrum') {
                    fits_reader_wrapper.setFile(file.file);
                } else {
                    fits_reader_wrapper.setFileFromFileObject(file);
                }

                let fits_columns = fits_reader_wrapper.getAllColumns();

                fits_columns.forEach((fits_column) => {
                    let column = {...fits_column, file_id: file.id};
                    columns.push(column);
                })

            } else if(file.type === 'csv') {

            }
        })

        let columns_by_file = columns.reduce((acc, column) => {
            if (!acc[column.file_id]) {
                acc[column.file_id] = [];
            }
            acc[column.file_id].push(column);
            return acc;
        }, {});

        let select_options = [];

        let i = 1;
        for (let file_id in columns_by_file) {
            if (columns_by_file.hasOwnProperty(file_id)) {
                let file = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getFileById(file_id);
                let file_name = file.file_name;

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file.file);

                select_options.push(this._createFileColumnsOptionsGroup(columns_by_file[file_id], file_name, 'opt-group', frw));
            }
            i++;
        }

        select_options.unshift(this._createGenericColumnOptionsGroup(true));

        return select_options;
    }

    _setSelectLibraryListener() {
        let select_library = document.getElementById(SettingsComponent.select_library_id);

        select_library.addEventListener('change', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('select-library-change', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    library: select_library.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });
    }

    _setSelectDataTypeListener() {
        let select_data_type = document.getElementById(SettingsComponent.select_data_type_id);

        select_data_type.addEventListener('change', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('select-data-type-change', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    data_type: select_data_type.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });
    }

    _setSelectHDUsListener() {
        let select_hdus = document.getElementById(SettingsComponent.select_hdus_id);

        select_hdus.addEventListener('change', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('select-hdus-change', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    hdu_index: select_hdus.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });
    }

    _setSelectAxisListener() {
        let select_axis_x = document.getElementById(SettingsComponent.select_axis_x_id);
        let select_axis_y = document.getElementById(SettingsComponent.select_axis_y_id);

        let select_error_bar_x = document.getElementById(SettingsComponent.select_error_bar_x_id);
        let select_error_bar_y = document.getElementById(SettingsComponent.select_error_bar_y_id);

        select_axis_x.addEventListener('change', (e) => {
            let column_id = e.target.value;

            let data_type = document.getElementById(SettingsComponent.select_data_type_id).value;

            if(data_type === 'light-curve') {

                let column_descriptor = _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(column_id)

                let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getFileById(column_descriptor.file_id);

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);

                let columns_name= frw.getAllColumns();

                if(column_descriptor.column_name.toUpperCase() === 'RATE' &&
                    columns_name.some(column => {
                        return column.name.toUpperCase() === 'ERROR' && parseInt(column.hdu_index) === parseInt(column_descriptor.hdu_index)
                    })) {

                    Array.from(select_error_bar_x.options).forEach((option) => {
                        let option_column_descriptor = _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(option.value);

                        if(option_column_descriptor.file_id === column_descriptor.file_id &&
                            option_column_descriptor.hdu_index === column_descriptor.hdu_index &&
                            option_column_descriptor.column_name.toUpperCase() === 'ERROR')

                            select_error_bar_x.value = option.value;
                    })
                }

                if(column_descriptor.column_name.toUpperCase() === 'TIME' &&
                    columns_name.some(column => {
                        return column.name.toUpperCase() === 'TIMEDEL' && parseInt(column.hdu_index) === parseInt(column_descriptor.hdu_index)
                    })) {

                    Array.from(select_error_bar_x.options).forEach((option) => {
                        let option_column_descriptor = _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(option.value);

                        if (option_column_descriptor.file_id === column_descriptor.file_id &&
                            option_column_descriptor.hdu_index === column_descriptor.hdu_index &&
                            option_column_descriptor.column_name.toUpperCase() === 'TIMEDEL')

                            select_error_bar_x.value = option.value;
                    })
                }
            }

        })

        select_axis_y.addEventListener('change', (e) => {
            let column_id = e.target.value;

            let data_type = document.getElementById(SettingsComponent.select_data_type_id).value;

            if(data_type === 'light-curve') {

                let column_descriptor= _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(column_id)

                let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_3__.FileRegistry.getFileById(column_descriptor.file_id);

                let frw= _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_4__.WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);

                let columns_name= frw.getAllColumns();

                if(column_descriptor.column_name.toUpperCase() === 'RATE' &&
                    columns_name.some(column => {
                        return column.name.toUpperCase() === 'ERROR' && parseInt(column.hdu_index) === parseInt(column_descriptor.hdu_index)
                    })) {

                    Array.from(select_error_bar_y.options).forEach((option) => {
                        let option_column_descriptor = _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(option.value);

                        if(option_column_descriptor.file_id === column_descriptor.file_id &&
                            option_column_descriptor.hdu_index === column_descriptor.hdu_index &&
                            option_column_descriptor.column_name.toUpperCase() === 'ERROR')

                            select_error_bar_y.value = option.value;
                    })
                }

                if(column_descriptor.column_name.toUpperCase() === 'TIME' &&
                    columns_name.some(column => {
                        return column.name.toUpperCase() === 'TIMEDEL' && parseInt(column.hdu_index) === parseInt(column_descriptor.hdu_index)
                    })) {

                    Array.from(select_error_bar_y.options).forEach((option) => {
                        let option_column_descriptor = _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(option.value);

                        if (option_column_descriptor.file_id === column_descriptor.file_id &&
                            option_column_descriptor.hdu_index === column_descriptor.hdu_index &&
                            option_column_descriptor.column_name.toUpperCase() === 'TIMEDEL')

                            select_error_bar_y.value = option.value;
                    })
                }
            }

        })

    }

    _setCalculationRadioListeners() {
        let radio_buttons = document.querySelectorAll('.' + SettingsComponent.calculation_radio_class);
        radio_buttons.forEach(radio_button => {
            radio_button.addEventListener('change', event => {

            });
        });
    }

    _setGenerateButtonListener() {
        let button_generate = document.getElementById('button-generate');

        button_generate.addEventListener('click', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('button-generate-click', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {

                }
            });

            this.dispatchEvent(custom_change_event);
        });
    }

    updateSettings(configuration) {
        for (let [setting, values] of Object.entries(configuration)) {

            let setting_element = document.getElementById(setting);
            if (setting_element) {

                if (values.display === true) {
                    setting_element.style.display = 'block';
                } else {
                    setting_element.style.display = 'none';
                }
            } else {

            }
        }
    }

    updateSettingsObject() {
        let values = this._extractFormValues();

        let library = {};
        library.library = values['select-library'].value;
        this.settings_object.setLibrarySettings(library);

        let hdu = {};
        hdu['hdu_index'] = values['select-hdus'].value;
        this.settings_object.setHDUsSettings(hdu);

        let data_type = {};

        data_type.type = values['select-data-type'].value;
        this.settings_object.setDataTypeSettings(data_type);

        if(values['select-axis-x'] && values['select-axis-y']) {
            let axis = {};
            let columns = {};
            columns.x = {};
            columns.y = {};
            let scales = {};

            console.log(values['select-axis-x']);

            columns.x.column_type = 'standard';
            columns.y.column_type = 'standard';

            if(values['select-axis-x'].column_type === 'processed') {
                columns.x.column_type = 'processed';
            }

            if(values['select-axis-y'].column_type === 'processed') {
                columns.y.column_type = 'processed';
            }

            axis.x = values['select-axis-x'].value;
            axis.y = values['select-axis-y'].value;

            console.log(axis);

            scales.x = values['select-axis-x-scale'].value;
            scales.y = values['select-axis-y-scale'].value;

            this.settings_object.setAxisSettings(axis);
            this.settings_object.setColumnsSettings(columns);
            this.settings_object.setScalesSettings(scales);
        }

        if(values['has-error-bars-checkbox']) {
            if(values['has-error-bars-checkbox'].checked === true) {
                let error_bars = {};

                if(values['select-axis-x-error-bar'] !== undefined) {
                    error_bars.x = values['select-axis-x-error-bar'].value;
                } else {
                    delete error_bars.x
                }

                if(values['select-axis-y-error-bar'] !== undefined) {
                    error_bars.y = values['select-axis-y-error-bar'].value;
                } else {
                    delete error_bars.y
                }

                this.settings_object.setErrorBarsSettings(error_bars);
            }
        }

        if(values['has-x-range-checkbox'].checked === true || values['has-y-range-checkbox'].checked === true) {

            let ranges = {
                x: {},
                y: {}
            };

            if(values['has-x-range-checkbox'].checked === true) {
                ranges['x'].lower_bound = values['x-lower-bound'].value;
                ranges['x'].upper_bound = values['x-higher-bound'].value;
            } else {
                ranges['x'] = null;
            }

            if(values['has-y-range-checkbox'].checked === true) {
                ranges['y'].lower_bound = values['y-lower-bound'].value;
                ranges['y'].upper_bound = values['y-higher-bound'].value;
            } else {
                ranges['y'] = null;
            }

            this.settings_object.setRangesSettings(ranges);
        } else {
            this.settings_object.setRangesSettings(null);
        }

    }

    _extractFormValues() {

        let form_values = {};

        let selects = this.container.querySelectorAll('.form-select');

        selects.forEach(select => {
            let id = select.id;
            let classes = select.className.split(' ');
            let value = select.value;

            let selected_option = select.options[select.selectedIndex];

            let column_type = "standard";
            column_type = selected_option.dataset.columnType;

            if(window.getComputedStyle(select, null).getPropertyValue("display") !== 'none' && value !== 'none') {
                form_values[id] = {classes, value, column_type};
            }
        });

        let checkboxes = this.container.querySelectorAll('.form-checkbox');

        checkboxes.forEach(checkbox => {

            let id = checkbox.id;
            let classes = checkbox.className.split(' ');
            let checked = checkbox.checked;

            form_values[id] = {classes, checked};
        });

        let inputs = this.container.querySelectorAll('.form-input');

        inputs.forEach(input => {
            let id = input.id;
            let classes = input.className.split(' ');
            let value = input.value;

            form_values[id] = {classes, value};
        })

        return form_values;
    }

}

/***/ }),

/***/ "./components/VisualizationComponent.js":
/*!**********************************************!*\
  !*** ./components/VisualizationComponent.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationComponent: () => (/* binding */ VisualizationComponent)
/* harmony export */ });
class VisualizationComponent extends HTMLElement {

    container_id;
    container

    constructor(container_id) {
        super();

        this.container_id = container_id;
        this._setContainer();
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

}

/***/ }),

/***/ "./components/file_type/CSVSettingsComponent.js":
/*!******************************************************!*\
  !*** ./components/file_type/CSVSettingsComponent.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSVSettingsComponent: () => (/* binding */ CSVSettingsComponent)
/* harmony export */ });
class CSVSettingsComponent extends HTMLElement {

    constructor(file_id) {
        super();
    }

}

/***/ }),

/***/ "./components/file_type/FITSSettingsComponent.js":
/*!*******************************************************!*\
  !*** ./components/file_type/FITSSettingsComponent.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FITSSettingsComponent: () => (/* binding */ FITSSettingsComponent)
/* harmony export */ });
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../events/FileRegistryChangeEvent */ "./events/FileRegistryChangeEvent.js");
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../containers/RegistryContainer */ "./containers/RegistryContainer.js");





class FITSSettingsComponent extends HTMLElement {

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

        let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();
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
            _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.addToCurrentFiles(this.file);

            this.is_current = true;

            let frce = new _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent();

            try {
                frce.dispatchToSubscribers();
            } catch(e) {
                console.log("No subsribers for event : " + _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent.name);
            }

            this.resetContainerForCurrentFile();

        });

        remove_from_plot_btn.addEventListener('click', (event) => {
            _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.removeFromCurrentFiles(this.file.id);

            this.is_current = false;

            let frce = new _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent();

            try {
                frce.dispatchToSubscribers();
            } catch(e) {
                console.log("No subscribers for specified event : " + _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent.name);
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

        let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();
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

                _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.setFileMetadata(this.file.id, {
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
        let file_list = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getAllFiles();

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

/***/ }),

/***/ "./components/inputs/ArithmeticColumnInput.js":
/*!****************************************************!*\
  !*** ./components/inputs/ArithmeticColumnInput.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArithmeticColumnInput: () => (/* binding */ ArithmeticColumnInput)
/* harmony export */ });
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../containers/RegistryContainer */ "./containers/RegistryContainer.js");
/* harmony import */ var _events_ArithmeticColumnChangeEvent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../events/ArithmeticColumnChangeEvent */ "./events/ArithmeticColumnChangeEvent.js");
/* harmony import */ var _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../registries/CustomColumnRegistry */ "./registries/CustomColumnRegistry.js");






class ArithmeticColumnInput extends HTMLElement {

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
        let current_file_list = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_0__.FileRegistry.getCurrentFilesList();
        let columns = [];

        this._resetColumnInput();

        current_file_list.forEach((file) => {

            if(file.type === 'fits') {
                let fits_reader_wrapper = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_1__.WrapperContainer.getFITSReaderWrapper();

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
                let file = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_0__.FileRegistry.getFileById(file_id);
                let file_name = file.file_name;

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_1__.WrapperContainer.getFITSReaderWrapper();
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

                _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_4__.CustomColumnRegistry.addToAvailableColumns(column);

                this.addColumnToDisplay(input_display.value);

                let acce = new _events_ArithmeticColumnChangeEvent__WEBPACK_IMPORTED_MODULE_3__.ArithmeticColumnChangeEvent();
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

/***/ }),

/***/ "./containers/DataProcessorContainer.js":
/*!**********************************************!*\
  !*** ./containers/DataProcessorContainer.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataProcessorContainer: () => (/* binding */ DataProcessorContainer)
/* harmony export */ });
/* harmony import */ var _data_processors_DataPreProcessor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data_processors/DataPreProcessor.js */ "./data_processors/DataPreProcessor.js");
/* harmony import */ var _data_processors_LightCurveProcessor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data_processors/LightCurveProcessor.js */ "./data_processors/LightCurveProcessor.js");
/* harmony import */ var _data_processors_SpectrumProcessor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../data_processors/SpectrumProcessor.js */ "./data_processors/SpectrumProcessor.js");




class DataProcessorContainer {

    constructor() {

    }

    getDataPreProcessor() {
        return new _data_processors_DataPreProcessor_js__WEBPACK_IMPORTED_MODULE_0__.DataPreProcessor();
    }

    getLightCurveProcessor(fits_reader_wrapper, hdu_index) {
        return new _data_processors_LightCurveProcessor_js__WEBPACK_IMPORTED_MODULE_1__.LightCurveProcessor(fits_reader_wrapper, hdu_index);
    }

    getSpectrumProcessor() {
        return new _data_processors_SpectrumProcessor_js__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor();
    }

    static getDataProcessorContainer() {
        return new DataProcessorContainer();
    }

}

/***/ }),

/***/ "./containers/RegistryContainer.js":
/*!*****************************************!*\
  !*** ./containers/RegistryContainer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegistryContainer: () => (/* binding */ RegistryContainer)
/* harmony export */ });
/* harmony import */ var _registries_EventSubscribersRegistry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../registries/EventSubscribersRegistry.js */ "./registries/EventSubscribersRegistry.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registries/FileRegistry */ "./registries/FileRegistry.js");



class RegistryContainer {

    static file_registry = null;
    static column_registry = null;

    constructor() {

    }

    getEventSubscribersRegistry() {
        return new _registries_EventSubscribersRegistry_js__WEBPACK_IMPORTED_MODULE_0__.EventSubscribersRegistry();
    }

    getFileRegistry() {
        return RegistryContainer.file_registry;
    }

    static setFileRegistry(file_registry) {
        RegistryContainer.file_registry = file_registry;
    }

    static getRegistryContainer() {
        return new RegistryContainer();
    }

    static setCustomColumnRegistry(column_registry) {
        RegistryContainer.column_registry = column_registry;
    }

    static getCustomColumnRegistry() {
        return RegistryContainer.column_registry;
    }

}

/***/ }),

/***/ "./containers/SettingsContainer.js":
/*!*****************************************!*\
  !*** ./containers/SettingsContainer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsContainer: () => (/* binding */ SettingsContainer)
/* harmony export */ });
/* harmony import */ var _settings_VisualizationSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings/VisualizationSettings.js */ "./settings/VisualizationSettings.js");
/* harmony import */ var _settings_SettingsConfiguration_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../settings/SettingsConfiguration.js */ "./settings/SettingsConfiguration.js");



class SettingsContainer {

    constructor() {

    }

    getVisualizationSettingsObject() {
        return new _settings_VisualizationSettings_js__WEBPACK_IMPORTED_MODULE_0__.VisualizationSettings();
    }

    getSettingsConfigurationObject() {
        return new _settings_SettingsConfiguration_js__WEBPACK_IMPORTED_MODULE_1__.SettingsConfiguration();
    }

    static getSettingsContainer() {
        return new SettingsContainer();
    }

}

/***/ }),

/***/ "./containers/VisualizationContainer.js":
/*!**********************************************!*\
  !*** ./containers/VisualizationContainer.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationContainer: () => (/* binding */ VisualizationContainer)
/* harmony export */ });
/* harmony import */ var _visualizations_BokehGraph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../visualizations/BokehGraph */ "./visualizations/BokehGraph.js");
/* harmony import */ var _visualizations_D3Graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../visualizations/D3Graph */ "./visualizations/D3Graph.js");



class VisualizationContainer {

    static bokeh_graph = null;
    static d3_graph = null;

    static visualization_container = '#visualization-container'

    constructor() {

    }

    static setBokehVisualization(bokeh_visualization) {
        VisualizationContainer.bokeh_visualization = bokeh_visualization;
    }

    static setD3Visualization(d3_visualization) {
        VisualizationContainer.d3_visualization = d3_visualization;
    }

    static getBokehVisualization() {
        if(VisualizationContainer.bokeh_visualization !== null) {
            return VisualizationContainer.bokeh_visualization;
        } else {
            return new _visualizations_BokehGraph__WEBPACK_IMPORTED_MODULE_0__.BokehGraph(VisualizationContainer.visualization_container);
        }
    }

    static getD3Visualization() {
        if(VisualizationContainer.d3_visualization !== null) {
            return VisualizationContainer.d3_visualization;
        } else {
            return new _visualizations_D3Graph__WEBPACK_IMPORTED_MODULE_1__.D3Graph(VisualizationContainer.visualization_container);
        }
    }

}

/***/ }),

/***/ "./containers/WrapperContainer.js":
/*!****************************************!*\
  !*** ./containers/WrapperContainer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WrapperContainer: () => (/* binding */ WrapperContainer)
/* harmony export */ });
/* harmony import */ var _wrappers_FITSReaderWrapper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrappers/FITSReaderWrapper.js */ "./wrappers/FITSReaderWrapper.js");
/* harmony import */ var _wrappers_BokehWrapper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../wrappers/BokehWrapper.js */ "./wrappers/BokehWrapper.js");
/* harmony import */ var _wrappers_D3Wrapper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../wrappers/D3Wrapper.js */ "./wrappers/D3Wrapper.js");




class WrapperContainer {

    static fits_reader_wrapper = null;
    static bokeh_wrapper = null;
    static d3_wrapper = null;

    static visualization_container = 'visualization-container'

    constructor() {

    }

    static setFITSReaderWrapper(fits_reader_wrapper) {
        WrapperContainer.fits_reader_wrapper = fits_reader_wrapper;
    }

    static setBokehWrapper(bokeh_wrapper) {
        WrapperContainer.bokeh_wrapper = bokeh_wrapper;
    }

    static setD3Wrapper(d3_wrapper) {
        WrapperContainer.d3_wrapper = d3_wrapper;
    }

    static getFITSReaderWrapper() {
        if(WrapperContainer.fits_reader_wrapper !== null) {
            return WrapperContainer.fits_reader_wrapper;
        } else {
            return new _wrappers_FITSReaderWrapper_js__WEBPACK_IMPORTED_MODULE_0__.FITSReaderWrapper('');
        }
    }

    static getBokehWrapper() {
        if(WrapperContainer.bokeh_wrapper !== null) {
            return WrapperContainer.bokeh_wrapper;
        } else {
            return new _wrappers_BokehWrapper_js__WEBPACK_IMPORTED_MODULE_1__.BokehWrapper(WrapperContainer.visualization_container);
        }
    }

    static getD3Wrapper() {
        if(WrapperContainer.d3_wrapper !== null) {
            return WrapperContainer.d3_wrapper;
        } else {
            return new _wrappers_D3Wrapper_js__WEBPACK_IMPORTED_MODULE_2__.D3Wrapper(WrapperContainer.visualization_container);
        }
    }

}

/***/ }),

/***/ "./data_processors/DataPreProcessor.js":
/*!*********************************************!*\
  !*** ./data_processors/DataPreProcessor.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataPreProcessor: () => (/* binding */ DataPreProcessor)
/* harmony export */ });
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SpectrumProcessor */ "./data_processors/SpectrumProcessor.js");
/* harmony import */ var _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../containers/DataProcessorContainer */ "./containers/DataProcessorContainer.js");
/* harmony import */ var _utils_ExpressionParser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/ExpressionParser */ "./utils/ExpressionParser.js");
/* harmony import */ var _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/ColumnUtils */ "./utils/ColumnUtils.js");







class DataPreProcessor {

    constructor() {

    }

    getProcessedDataset(dataset_settings_object) {
        let dataset = {};

        console.log('DATAPREPROCESSOR');
        console.log(dataset_settings_object);

        dataset_settings_object.axis.forEach((axis) => {
            console.log("AXIS");
            console.log(axis.file_id);

            let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();

            if(axis.file_id != null) {
                let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(axis.file_id);

                //let frw = WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);
            }

            let column_data;

            if(dataset_settings_object.data_type.type === 'spectrum' &&
                _SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor.processed_columns_name.includes(axis.column_name)) {

                column_data = this.getSpectrumProcessedColumn(axis.hdu_index, axis.column_name, frw);
            } else if(axis.column_type === 'processed') {
                let column_array = [];
                let temp_column_data = [];

                console.log("Custom Column");
                console.log(axis);

                let expression_array = this.parseColumnsExpression(axis.column_expression);
                let operator_array = this.parseColumnsOperators(axis.column_expression);

                expression_array.forEach((operand) => {
                    column_array.push(_utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_5__.ColumnUtils.getColumnSettings(operand));
                });

                console.log(column_array);

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();

                column_array.forEach((column) => {
                    console.log(column);
                    let col_data = this.getProcessedColumnData(column.file_id, column.hdu_index, column.column_name, frw);

                    temp_column_data.push(col_data);
                    console.log(temp_column_data);
                })

                let processed_data = this.getCustomColumnProcessedData(temp_column_data, operator_array);

                console.log(this.getCustomColumnProcessedData(temp_column_data, operator_array));
                console.log(processed_data);

                column_data = processed_data;

            } else {
                column_data = frw.getColumnDataFromHDU(axis.hdu_index, axis.column_name);
                console.log(column_data);
            }

            console.log(column_data);

            axis.data = column_data;

            console.log(axis.data);
        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {

                let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(error_bar.file_id);

                let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();
                frw.setFile(file_object.file);

                let column_data;

                if(dataset_settings_object.data_type.type === 'spectrum' &&
                    _SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor.processed_columns_name.includes(error_bar.column_name)) {

                    column_data = this.getSpectrumProcessedColumn(error_bar.hdu_index, error_bar.column_name, frw)

                    if(error_bar.column_name === _SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor.E_MID_LOG) {
                        column_data.forEach(col_data => {

                        })
                    }

                } else {
                    column_data = frw.getColumnDataFromHDU(error_bar.hdu_index, error_bar.column_name);
                }

                error_bar.data = column_data;
            })
        }

        console.log(dataset_settings_object);

        dataset = dataset_settings_object;

        console.log(dataset);

        return dataset;
    }

    datasetToJSONData(dataset_settings_object) {
        let rows = [];

        console.log("JSON DATA");
        console.log(dataset_settings_object);

        dataset_settings_object.axis.forEach((axis) => {

            axis.data.forEach((value, index) => {
                if (!rows[index]) {
                    rows[index] = {};
                }
                rows[index][axis.column_name] = value;
            });

        })

        if(dataset_settings_object.hasOwnProperty('error_bars')) {
            dataset_settings_object.error_bars.forEach((error_bar) => {

                error_bar.data.forEach((value, index) => {
                    if (!rows[index]) {
                        rows[index] = {};
                    }
                    rows[index][error_bar.column_name] = value;
                });

            })
        }

        return rows;
    }

    processErrorBarDataJSON(dataset, axis, error_bars) {

        console.log(error_bars);
        console.log(dataset);

        let error_bar_x_values = [];
        let error_bar_y_values = [];

        let axis_x = axis.x;
        let axis_y = axis.y;

        let error_bar_x_column = error_bars.x;
        let error_bar_y_column = error_bars.y;

        let error_bars_object = {};

        dataset.forEach(function(datapoint){

            if(error_bars.x) {

                console.log("X");
                console.log(datapoint[axis_x]);
                console.log(error_bar_x_column);

                let error_bar_x = [
                    {
                        bound: parseFloat(datapoint[axis_x]) - parseFloat(datapoint[error_bar_x_column]),
                        [axis_y]: parseFloat(datapoint[axis_y])
                    },
                    {
                        bound: parseFloat(datapoint[axis_x]) + parseFloat(datapoint[error_bar_x_column]),
                        [axis_y]: parseFloat(datapoint[axis_y])
                    }
                ]

                error_bar_x_values.push(error_bar_x);
            }

            if(error_bars.y) {

                console.log("Y");
                console.log(datapoint[axis_x]);
                console.log(error_bar_y_column);

                let error_bar_y = [
                    {
                        bound: parseFloat(datapoint[axis_y]) - parseFloat(datapoint[error_bar_y_column]),
                        [axis_x]: parseFloat(datapoint[axis_x])
                    },
                    {
                        bound: parseFloat(datapoint[axis_y]) + parseFloat(datapoint[error_bar_y_column]),
                        [axis_x]: parseFloat(datapoint[axis_x])
                    }
                ]

                error_bar_y_values.push(error_bar_y);
            }

        })

        if(error_bars.x) error_bars_object.x = error_bar_x_values;
        if(error_bars.y) error_bars_object.y = error_bar_y_values;

        return error_bars_object;
    }

    getProcessedColumnData(file_id, hdu_index, column_name, fits_reader_wrapper) {
        let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(file_id);
        fits_reader_wrapper.setFile(file_object.file);

        let col_data = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, column_name);

        return col_data;
    }

    getCustomColumnProcessedData(operands, operators) {
        let data = [];

        console.log(operands);
        console.log(operators);

        let expression_string;
        for(let i = 0; i < operands[0].length; i++) {
            expression_string = '';

            expression_string += operands[0][i];

            operators.forEach((operator, index) => {
                expression_string += operator + operands[index + 1][i];
            })

            data.push(eval(expression_string));

        }

        console.log(expression_string);
        console.log(data);

        return data;
    }

    getSpectrumProcessedColumn(hdu_index, column_name, fits_reader_wrapper) {
        let processed_column = [];

        let sp = _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_3__.DataProcessorContainer.getDataProcessorContainer().getSpectrumProcessor();

        let e_min_col = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, "E_MIN");
        let e_max_col = fits_reader_wrapper.getColumnDataFromHDU(hdu_index, "E_MAX");

        e_min_col.forEach((e_min, index) => {
            processed_column.push(_SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor.spectrum_col_functions[column_name](e_min, e_max_col[index]));
        })

        return processed_column;
    }

    parseColumnsExpression(expression) {
        let expression_parser = new _utils_ExpressionParser__WEBPACK_IMPORTED_MODULE_4__.ExpressionParser();

        let columns_array = expression_parser.parseStandardExpressionOperand(expression);

        console.log("Expression parsing")
        console.log(columns_array);

        return columns_array;
    }

    parseColumnsOperators(expression) {
        let expression_parser = new _utils_ExpressionParser__WEBPACK_IMPORTED_MODULE_4__.ExpressionParser();

        let operators_array = expression_parser.parseStandardExpressionOperators(expression);

        return operators_array;
    }

    processDataForRange(ranges, data, error_bars = null) {
        let temp_processed_data = [];
        let temp_processed_error_bars = {};
        let temp_error_bar_x = [];
        let temp_error_bar_y = [];
        let processed_data = [];

        data.forEach((data_point, i) => {
            let keys = Object.keys(data_point);
            let x_column = keys[0];
            let y_column = keys[1];

            if (ranges.x === null) {
                data_point.match_range_x = true;
            } else if (data_point[x_column] >= ranges.x.lower_bound && data_point[x_column] <= ranges.x.upper_bound) {
                data_point.match_range_x = true;
            } else {
                data_point.match_range_x = false;
            }

            if(ranges.y === null) {
                data_point.match_range_y = true;
            } else if(data_point[y_column] >= ranges.y.lower_bound && data_point[y_column] <= ranges.y.upper_bound) {
                data_point.match_range_y = true;
            } else {
                data_point.match_range_y = false;
            }

            if(data_point.match_range_x + data_point.match_range_y == 2) {
                temp_processed_data.push(data_point);
                if(error_bars != null) {
                    temp_error_bar_x.push(error_bars.x[i]);
                    temp_error_bar_y.push(error_bars.y[i]);
                }
            }

        })

        if(error_bars != null) {
            temp_processed_error_bars.x = temp_error_bar_x;
            temp_processed_error_bars.y = temp_error_bar_y;
            processed_data.error_bars = temp_processed_error_bars;
        }

        processed_data.data = temp_processed_data;

        return processed_data;
    }

    processDataForRangeBokeh(ranges, data, has_error_bars = false) {
        let processed_data = {};
        processed_data.x = [];
        processed_data.y = []

        if(has_error_bars) {
            processed_data.x_low = [];
            processed_data.x_up = [];
            processed_data.y_low = [];
            processed_data.y_up = [];
        }

        let temp_x = [];
        let temp_y = [];

        data.x.forEach((data_point) => {

            let temp_data_object = {};
            temp_data_object.value = data_point;

            if (ranges.x === null) {
                temp_data_object.match_range_x = true;
            } else if (data_point >= ranges.x.lower_bound && data_point <= ranges.x.upper_bound) {
                temp_data_object.match_range_x = true;
            } else {
                temp_data_object.match_range_x = false;
            }

            temp_x.push(temp_data_object);
        })

        data.y.forEach((data_point) => {

            let temp_data_object = {};
            temp_data_object.value = data_point;

            if (ranges.y === null) {
                temp_data_object.match_range_y = true;
            } else if (data_point >= ranges.y.lower_bound && data_point <= ranges.y.upper_bound) {
                temp_data_object.match_range_y = true;
            } else {
                temp_data_object.match_range_y = false;
            }

            temp_y.push(temp_data_object)
        })

        temp_x.forEach((data_point_x, i) => {
            let data_point_y = temp_y[i];

            if(data_point_x.match_range_x + data_point_y.match_range_y == 2) {
                processed_data.x.push(data_point_x.value);
                processed_data.y.push(data_point_y.value);

                if(has_error_bars) {
                    processed_data.y_low.push(data.y_low[i]);
                    processed_data.y_up.push(data.y_up[i]);
                    processed_data.x_low.push(data.x_low[i]);
                    processed_data.x_up.push(data.x_up[i]);
                }
            }
        })

        return processed_data;
    }

}

/***/ }),

/***/ "./data_processors/LightCurveProcessor.js":
/*!************************************************!*\
  !*** ./data_processors/LightCurveProcessor.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LightCurveProcessor: () => (/* binding */ LightCurveProcessor)
/* harmony export */ });
class LightCurveProcessor {

    static header_cards = [
        'TIMEREF',
        'TIMEDEL',
        'MJDREF',
        'TSTART',
        'TSTOP',
        'TELAPSE',
        'E_MIN',
        'E_MAX',
        'E_UNIT']

    static columns_names = {
        time: 'TIME',
        timedel: 'TIMEDEL',
        rate: 'RATE',
        error: 'ERROR',
        fracexp: 'FRACEXP'
    }

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

    static min_columns_number = 2;
    static mandatory_columns = ['RATE'];
    static replacement_columns = ['TIMEDEL'];

    hdu;
    hdu_index = null;

    binning_type;
    method;

    fits_reader_wrapper;
    header_values = {};

    constructor(fits_reader_wrapper, hdu_index) {
        this.fits_reader_wrapper = fits_reader_wrapper;
        this.hdu_index = hdu_index;

        this._setHDU();
    }

    _setHDU() {
        this.hdu = this.fits_reader_wrapper.getHDU(this.hdu_index);
    }

    setHDU(hdu, hdu_index) {
        this.hdu = hdu;
        this.hdu_index = hdu_index;
    }

    processDataRawJSON(axis, error_bars = null) {
        //let raw_fits_data = this.hdu.data;
        let raw_fits_data = this.fits_reader_wrapper.getDataFromHDU(this.hdu_index);
        let data = {};

        let x;
        let y;

        let x_column = axis.x;
        let y_column = axis.y;

        raw_fits_data.getColumn(x_column, function(col){x = col});
        raw_fits_data.getColumn(y_column, function(col){y = col});

        data.x = x;
        data.y = y;

        if(error_bars) {

            let dy;

            let error_bar_x_column = error_bars.x;
            let error_bar_y_column = error_bars.y;

            raw_fits_data.getColumn(error_bar_y_column, function(col) {dy = col});

            data.dy = dy;
            //data.timedel = this.getTimedel(error_bar_x_column);
            //data.timedel = this.fits_reader_wrapper.getHeaderFromHDU(this.hdu_index).get("TIMEDEL");

            raw_fits_data.getColumn(error_bar_x_column, function(col) {data.timedel = col});

        }

        return data;
    }

    processDataJSON(axis, error_bars = null) {
        let raw_fits_data = this.hdu.data;
        let light_curve_data = {};

        if(!this._checkColumns()) {
            throw new Error("");
        }

        light_curve_data.main = this.fits_reader_wrapper.getColumnsJSONDataFromHDU(this.hdu_index);

        if(error_bars) {
            light_curve_data.error_bars = this._processErrorBarsDataJSON(error_bars, axis, light_curve_data.main);
        }

        return light_curve_data;
    }

    _processErrorBarsDataJSON(error_bars, axis, data) {
        let error_bar_x_values = [];
        let error_bar_y_values = [];

        let axis_x = axis.x;
        let axis_y = axis.y;

        let error_bar_x_column = error_bars.x;
        let error_bar_y_column = error_bars.y;

        data.forEach(function(datapoint){
            let error_bar_x = [
                {
                    bound: parseFloat(datapoint[axis_y]) - parseFloat(datapoint[error_bar_y_column]),
                    [axis_x]: parseFloat(datapoint[axis_x])
                },
                {
                    bound: parseFloat(datapoint[axis_y]) + parseFloat(datapoint[error_bar_y_column]),
                    [axis_x]: parseFloat(datapoint[axis_x])
                }
            ]

            let error_bar_y = [
                {
                    bound: parseFloat(datapoint[axis_x]) - parseFloat(datapoint[error_bar_x_column]),
                    [axis_y]: parseFloat(datapoint[axis_y])
                },
                {
                    bound: parseFloat(datapoint[axis_x]) + parseFloat(datapoint[error_bar_x_column]),
                    [axis_y]: parseFloat(datapoint[axis_y])
                }
            ]

            error_bar_x_values.push(error_bar_x);
            error_bar_y_values.push(error_bar_y);
        })

        return {x: error_bar_x_values, y: error_bar_y_values}
    }

    _checkColumns(required_nb_columns) {
        let is_checked = true;

        let columns_number = this.fits_reader_wrapper.getNumberOfColumnFromHDU(this.hdu_index)
        let columns_name = this.fits_reader_wrapper.getColumnsNameFromHDU(this.hdu_index)

        if(columns_number < required_nb_columns || !columns_name.includes(LightCurveProcessor.columns_names.rate)) {
            is_checked = false;
        }

        return is_checked;
    }

    getTimedel(error_bar_x = null) {
        let timedel;

        if(this.fits_reader_wrapper.getColumnsNameFromHDU(this.hdu_index).includes("TIMEDEL")) {
            data.getColumn(error_bar_x, function (col) {timedel = col});
        } else {
            let header = this.fits_reader_wrapper.getHeaderFromHDU(this.hdu_index);
            timedel = header.get("TIMEDEL");
        }

        return timedel;
    }

    _getValueFromHDUHeader() {
        let card_value;
        LightCurveProcessor.header_cards.forEach((card_name) => {
            card_value = null;

            card_value = this.fits_reader_wrapper.getHeaderCardValueByNameFromHDU(this.hdu_index, card_name)
            this.header_values[card_name] = card_value;
        })
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

    getDurationInSeconds(time_column) {
        let lowest_time = Math.min(...time_column);
        let highest_time = Math.max(...time_column);

        let duration_seconds = (highest_time - lowest_time) * 86400;

        return duration_seconds;
    }

}

/***/ }),

/***/ "./data_processors/SpectrumProcessor.js":
/*!**********************************************!*\
  !*** ./data_processors/SpectrumProcessor.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpectrumProcessor: () => (/* binding */ SpectrumProcessor)
/* harmony export */ });
class SpectrumProcessor {

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

/***/ }),

/***/ "./errors/EventNotFoundInRegistryError.js":
/*!************************************************!*\
  !*** ./errors/EventNotFoundInRegistryError.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventNotFoundInRegistryError: () => (/* binding */ EventNotFoundInRegistryError)
/* harmony export */ });
class EventNotFoundInRegistryError extends Error {
    constructor(message) {
        super(message);
        this.name = "EventNotFoundInRegistryError";
    }
}

/***/ }),

/***/ "./errors/HDUNotTabularError.js":
/*!**************************************!*\
  !*** ./errors/HDUNotTabularError.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HDUNotTabularError: () => (/* binding */ HDUNotTabularError)
/* harmony export */ });
class HDUNotTabularError extends Error {
    constructor(message) {
        super(message);
        this.name = "HDUNotTabularError";
    }
}

/***/ }),

/***/ "./errors/InvalidURLError.js":
/*!***********************************!*\
  !*** ./errors/InvalidURLError.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InvalidURLError: () => (/* binding */ InvalidURLError)
/* harmony export */ });
class InvalidURLError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidURLError";
    }
}

/***/ }),

/***/ "./errors/NoEventSubscriberError.js":
/*!******************************************!*\
  !*** ./errors/NoEventSubscriberError.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NoEventSubscriberError: () => (/* binding */ NoEventSubscriberError)
/* harmony export */ });
class NoEventSubscriberError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoEventSubscriberError";
    }
}

/***/ }),

/***/ "./errors/NoEventToDispatchError.js":
/*!******************************************!*\
  !*** ./errors/NoEventToDispatchError.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NoEventToDispatchError: () => (/* binding */ NoEventToDispatchError)
/* harmony export */ });
class NoEventToDispatchError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoEventToDispatch";
    }
}

/***/ }),

/***/ "./events/ArithmeticColumnChangeEvent.js":
/*!***********************************************!*\
  !*** ./events/ArithmeticColumnChangeEvent.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArithmeticColumnChangeEvent: () => (/* binding */ ArithmeticColumnChangeEvent)
/* harmony export */ });
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/RegistryContainer */ "./containers/RegistryContainer.js");


class ArithmeticColumnChangeEvent {

    static defaultOptions = {
        bubbles: true,
        composed: true
    };

    static name = "arithmetic-column-change";
    static main_root_id = 'jsvis-main';
    static main_root_element = null;

    event = null;

    constructor(detail = {}, options = {}) {

        this.detail = { ...detail };
        this.options = { ...ArithmeticColumnChangeEvent.defaultOptions, ...options };

        this.event = new CustomEvent(ArithmeticColumnChangeEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToTarget(target) {
        target.dispatchEvent(this.event);
    }

    dispatchToMainRoot() {
        if(ArithmeticColumnChangeEvent.main_root_element === null) {
            ArithmeticColumnChangeEvent.main_root_element = document.getElementById(ArithmeticColumnChangeEvent.main_root_id);
        }
        
        document.dispatchEvent(this.event);
    }

    dispatchToSubscribers() {
        let esr = _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__.RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(ArithmeticColumnChangeEvent.name);

        let subscriber_element = null;
        subscribers_id.forEach((subscriber_id) => {
            subscriber_element = document.getElementById(subscriber_id);
            subscriber_element.dispatchEvent(this.event);
        })
    }
}


/***/ }),

/***/ "./events/ConfigurationEvent.js":
/*!**************************************!*\
  !*** ./events/ConfigurationEvent.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigurationEvent: () => (/* binding */ ConfigurationEvent)
/* harmony export */ });
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/RegistryContainer */ "./containers/RegistryContainer.js");


class ConfigurationEvent {

    static defaultOptions = {
        bubbles: true,
        composed: false,
        cancelable: true
    };

    static name = "configuration";

    event = null;

    constructor(configuration_object, detail = {}, options = {}) {

        this.detail = { ...detail, ...{'configuration_object': configuration_object}};
        this.options = { ...ConfigurationEvent.defaultOptions, ...options };

        this.event = new CustomEvent(ConfigurationEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToSubscribers() {
        let esr = _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__.RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(ConfigurationEvent.name)

        let subscriber_element = null;
        subscribers_id.forEach((subscriber_id) => {
            subscriber_element = document.getElementById(subscriber_id);
            subscriber_element.dispatchEvent(this.event);
        })
    }
}


/***/ }),

/***/ "./events/FileLoadedEvent.js":
/*!***********************************!*\
  !*** ./events/FileLoadedEvent.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileLoadedEvent: () => (/* binding */ FileLoadedEvent)
/* harmony export */ });
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/RegistryContainer */ "./containers/RegistryContainer.js");


class FileLoadedEvent {

    static defaultOptions = {
        bubbles: true,
        composed: false
    };

    static name = "file-loaded";
    static main_root_id = 'jsvis-main';
    static main_root_element = null;

    event = null;

    constructor(detail = {}, options = {}) {

        this.detail = { ...detail };
        this.options = { ...FileLoadedEvent.defaultOptions, ...options };

        this.event = new CustomEvent(FileLoadedEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToTarget(target) {
        target.dispatchEvent(this.event);
    }

    dispatchToMainRoot() {
        if(FileLoadedEvent.main_root_element === null) {
            FileLoadedEvent.main_root_element = document.getElementById(FileLoadedEvent.main_root_id);
        }

        document.dispatchEvent(this.event);
    }

    dispatchToSubscribers() {
        let esr = _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__.RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(FileLoadedEvent.name)

        let subscriber_element = null;
        subscribers_id.forEach((subscriber_id) => {
            subscriber_element = document.getElementById(subscriber_id);
            subscriber_element.dispatchEvent(this.event);
        })
    }
}


/***/ }),

/***/ "./events/FileRegistryChangeEvent.js":
/*!*******************************************!*\
  !*** ./events/FileRegistryChangeEvent.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileRegistryChangeEvent: () => (/* binding */ FileRegistryChangeEvent)
/* harmony export */ });
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../containers/RegistryContainer */ "./containers/RegistryContainer.js");
/* harmony import */ var _errors_NoEventSubscriberError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors/NoEventSubscriberError */ "./errors/NoEventSubscriberError.js");



class FileRegistryChangeEvent {

    static defaultOptions = {
        bubbles: true,
        composed: true
    };

    static name = "file-registry-change";
    static main_root_id = 'jsvis-main';
    static main_root_element = null;

    event = null;

    constructor(detail = {}, options = {}) {

        this.detail = { ...detail };
        this.options = { ...FileRegistryChangeEvent.defaultOptions, ...options };

        this.event = new CustomEvent(FileRegistryChangeEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToTarget(target) {
        target.dispatchEvent(this.event);
    }

    dispatchToMainRoot() {
        if(FileRegistryChangeEvent.main_root_element === null) {
            FileRegistryChangeEvent.main_root_element = document.getElementById(FileRegistryChangeEvent.main_root_id);
        }
        
        document.dispatchEvent(this.event);
    }

    dispatchToSubscribers() {
        let esr = _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_0__.RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(FileRegistryChangeEvent.name);

        let subscriber_element = null;
        try {
            subscribers_id.forEach((subscriber_id) => {
                subscriber_element = document.getElementById(subscriber_id);
                subscriber_element.dispatchEvent(this.event);
            })
        } catch(e) {
            if(subscribers_id.length <= 0) {
                throw new _errors_NoEventSubscriberError__WEBPACK_IMPORTED_MODULE_1__.NoEventSubscriberError();
            }
        }
    }
}


/***/ }),

/***/ "./events/SettingsChangedEvent.js":
/*!****************************************!*\
  !*** ./events/SettingsChangedEvent.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsChangedEvent: () => (/* binding */ SettingsChangedEvent)
/* harmony export */ });
/* harmony import */ var _errors_NoEventToDispatchError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors/NoEventToDispatchError */ "./errors/NoEventToDispatchError.js");


class SettingsChangedEvent {

    static defaultOptions = {
        bubbles: true,
        composed: false,
        cancelable: true
    };

    static name = "settings-changed";

    event = null;

    constructor(settings_object, detail = {}, options = {}) {

        this.detail = { ...detail, ...{'settings_object': settings_object}};
        this.options = { ...SettingsChangedEvent.defaultOptions, ...options };

        this.event = new CustomEvent(SettingsChangedEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatch() {
        if(this.event !== null) {
            document.dispatchEvent(this.event);
        } else {
            throw new _errors_NoEventToDispatchError__WEBPACK_IMPORTED_MODULE_0__.NoEventToDispatchError("No event to dispatch");
        }
    }
}


/***/ }),

/***/ "./events/VisualizationGenerationEvent.js":
/*!************************************************!*\
  !*** ./events/VisualizationGenerationEvent.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationGenerationEvent: () => (/* binding */ VisualizationGenerationEvent)
/* harmony export */ });
/* harmony import */ var _errors_NoEventToDispatchError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors/NoEventToDispatchError */ "./errors/NoEventToDispatchError.js");


class VisualizationGenerationEvent {

    static defaultOptions = {
        bubbles: true,
        composed: false,
        cancelable: true
    };

    static name = "visualization-generation";

    event = null;

    constructor(settings_object, detail = {}, options = {}) {

        this.detail = { ...detail, ...{'settings_object': settings_object}};
        this.options = { ...VisualizationGenerationEvent.defaultOptions, ...options };

        this.event = new CustomEvent(VisualizationGenerationEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatch() {
        if(this.event !== null) {
            document.dispatchEvent(this.event);
        } else {
            throw new _errors_NoEventToDispatchError__WEBPACK_IMPORTED_MODULE_0__.NoEventToDispatchError("No event to dispatch");
        }
    }
}


/***/ }),

/***/ "./registries/CustomColumnRegistry.js":
/*!********************************************!*\
  !*** ./registries/CustomColumnRegistry.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomColumnRegistry: () => (/* binding */ CustomColumnRegistry)
/* harmony export */ });
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/StringUtils */ "./utils/StringUtils.js");
/* harmony import */ var _utils_ColumnUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ColumnUtils */ "./utils/ColumnUtils.js");
/* harmony import */ var _events_ArithmeticColumnChangeEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events/ArithmeticColumnChangeEvent */ "./events/ArithmeticColumnChangeEvent.js");




class CustomColumnRegistry {

    static columns = [];
    static column_counter = 0;

    constructor() {

    }

    static getAvailableColumnsList() {
        CustomColumnRegistry.columns = CustomColumnRegistry.columns.filter(obj => obj !== undefined);
        return CustomColumnRegistry.columns;
    }

    static addToAvailableColumns(column_to_add) {
        let column = { ...column_to_add,
            id: CustomColumnRegistry.column_counter,
        };

        CustomColumnRegistry.columns.push(column);

        CustomColumnRegistry.column_counter++;
    }

    static removeFromAvailableColumns(column_id) {
        CustomColumnRegistry.columns = CustomColumnRegistry.columns.filter(column => column.id !== parseInt(column_id));
    }

    static getColumnById(column_id) {
        let column = null;
        column = CustomColumnRegistry.columns.filter(column => column.id === parseInt(column_id));

        return column;
    }

    static sendRegistryChangeEvent() {
        let acce = new _events_ArithmeticColumnChangeEvent__WEBPACK_IMPORTED_MODULE_2__.ArithmeticColumnChangeEvent();
        acce.dispatchToSubscribers();
    }

}

/***/ }),

/***/ "./registries/EventSubscribersRegistry.js":
/*!************************************************!*\
  !*** ./registries/EventSubscribersRegistry.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventSubscribersRegistry: () => (/* binding */ EventSubscribersRegistry)
/* harmony export */ });
/* harmony import */ var _errors_EventNotFoundInRegistryError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors/EventNotFoundInRegistryError */ "./errors/EventNotFoundInRegistryError.js");


class EventSubscribersRegistry {

    static events_subscribers = {
        'fits-loaded': ['settings-component', 'file-component'],
        'configuration': ['settings-component'],
        'file-loaded': ['file-component'],
        'file-selected': ['settings-component', 'arithmetic-column-component'],
        'file-registry-change': ['settings-component', 'file-component', 'arithmetic-column-component'],
        'arithmetic-column-change': ['settings-component']
    }

    constructor() {

    }

    getSubscribersForEvent(event_name) {
        if(EventSubscribersRegistry.events_subscribers.hasOwnProperty(event_name)) {
            return EventSubscribersRegistry.events_subscribers[event_name];
        } else {
            throw new _errors_EventNotFoundInRegistryError__WEBPACK_IMPORTED_MODULE_0__.EventNotFoundInRegistryError("Event not found : " + event_name);
        }
    }

}

/***/ }),

/***/ "./registries/FileRegistry.js":
/*!************************************!*\
  !*** ./registries/FileRegistry.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileRegistry: () => (/* binding */ FileRegistry)
/* harmony export */ });
/* harmony import */ var _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events/FileRegistryChangeEvent */ "./events/FileRegistryChangeEvent.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/StringUtils */ "./utils/StringUtils.js");



class FileRegistry {

    static available_files = [];

    static current_files = [];

    static file_counter = 0;

    constructor() {

    }

    static getAvailableFilesList() {
        FileRegistry.available_files = FileRegistry.available_files.filter(obj => obj !== undefined);
        return FileRegistry.available_files;
    }

    static getCurrentFilesList() {
        FileRegistry.current_files = FileRegistry.current_files.filter(obj => obj !== undefined);
        return FileRegistry.current_files;
    }

    static addToAvailableFiles(file_to_add) {
        let file = { ...file_to_add,
            id: FileRegistry.file_counter,
            file_name: _utils_StringUtils__WEBPACK_IMPORTED_MODULE_1__.StringUtils.cleanFileName(file_to_add.file_name)
        };

        FileRegistry.available_files.push(file);

        FileRegistry.file_counter++;
    }

    static _addToAvailableFiles(file) {
        FileRegistry.available_files.push(file);
    }

    static moveToAvailableFiles(file) {
        FileRegistry.available_files.push(file);
    }

    static removeFromAvailableFiles(file_id) {
        FileRegistry.available_files = FileRegistry.available_files.filter(file => file.id !== parseInt(file_id));
    }

    static addToCurrentFiles(file) {
        FileRegistry.current_files.push(file);
        FileRegistry.removeFromAvailableFiles(file.id);
    }

    static removeFromCurrentFiles(file_id) {
        let file = FileRegistry.current_files.find(file => file.id === parseInt(file_id));

        FileRegistry.current_files = FileRegistry.current_files.filter(file => file.id !== parseInt(file_id));
        FileRegistry.moveToAvailableFiles(file);
    }

    static getAllFiles() {
        let available_files = FileRegistry.getAvailableFilesList();
        let current_files = FileRegistry.getCurrentFilesList();

        let files = available_files.concat(current_files);

        return files;
    }

    static getFileById(file_id) {
        let file_array = [...FileRegistry.available_files, ...FileRegistry.current_files];

        let file = file_array.find(file => file.id === parseInt(file_id));
        return file;
    }

    static getFileByName(file_name) {
        let file_array = [...FileRegistry.available_files, ...FileRegistry.current_files];

        let file = file_array.find(file => file.file_name === file_name);
        return file;
    }

    static isFileCurrent(file_id) {
        let is_current = false;

        if(FileRegistry.current_files.some(file => file.id === parseInt(file_id))) {
            is_current = true;
        }

        return is_current;
    }

    static setFileMetadata(file_id, metadata) {
        let files = FileRegistry.getAllFiles();

        let file = files.filter(file => file.id !== parseInt(file_id));

        file = { ...file, ...metadata };

        if(FileRegistry.isFileCurrent(file_id)) {
            FileRegistry.removeFromCurrentFiles(file_id);
            FileRegistry.addToCurrentFiles(file);
        } else {
            FileRegistry.removeFromAvailableFiles(file_id);
            FileRegistry._addToAvailableFiles(file);
        }
    }

    static sendRegistryChangeEvent() {
        let frce = new _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_0__.FileRegistryChangeEvent();
        frce.dispatchToSubscribers();
    }

}

/***/ }),

/***/ "./settings/SettingsConfiguration.js":
/*!*******************************************!*\
  !*** ./settings/SettingsConfiguration.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsConfiguration: () => (/* binding */ SettingsConfiguration)
/* harmony export */ });
/* harmony import */ var _utils_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/ObjectUtils */ "./utils/ObjectUtils.js");


class SettingsConfiguration {

    static default_configuration = {
        'library-settings': {
            display: true,
            selected: 'none'
        },
        'bokeh-settings': {
            display: false,
            'bokeh-options': {
                tools: {
                    display : false
                }
            }
        },
        'd3-settings': {
            display: false,
            'd3-options': {

            }
        },
        'data-type-settings': {
            display: true,
            selected: 'generic'
        },
        'light-curve-settings': {
            display: false,
            'light-curve-options': {

            }
        },
        'spectrum-settings': {
            display: false,
            'spectrum-options': {

            }
        },
        'hdus-settings': {
            display: false
        },
        'axis-settings': {
            display: true
        },
        'error-bars-settings': {
            display: true
        },
        'binning-settings': {
            display: true
        },
        'additional-dataset-settings': {
            display: true
        }
    }

    configuration = null;

    constructor(configuration_object = null) {
        if(configuration_object) {
            this.configuration = JSON.parse(JSON.stringify(SettingsConfiguration.default_configuration));
        } else {
            this.configuration = JSON.parse(JSON.stringify(configuration_object));
        }
    }

    getConfigurationObject(wrapper_configuration) {
        let configuration = null;

        configuration = _utils_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.ObjectUtils.deep_merge(SettingsConfiguration.default_configuration, wrapper_configuration);

        return configuration;
    }

    static getConfigurationObject(wrapper_configuration) {
        let configuration = null;

        configuration = _utils_ObjectUtils__WEBPACK_IMPORTED_MODULE_0__.ObjectUtils.deep_merge(SettingsConfiguration.default_configuration, wrapper_configuration);

        return configuration;
    }

}

/***/ }),

/***/ "./settings/VisualizationSettings.js":
/*!*******************************************!*\
  !*** ./settings/VisualizationSettings.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationSettings: () => (/* binding */ VisualizationSettings)
/* harmony export */ });
class VisualizationSettings {

    static default_settings = {
        library: '',
        data_type: '',
        axis: {},
        scales: {},
        error_bars: {}
    }

    settings = {};

    settings_library = null;
    settings_data_type = null;
    settings_hdus = null;
    settings_axis = null;
    settings_columns = null;
    settings_scales = null;
    settings_error_bars = null;

    constructor(settings_object = null) {
        if(settings_object) {
            this.settings = JSON.parse(JSON.stringify(settings_object))
        } else {
            this.settings = JSON.parse(JSON.stringify(VisualizationSettings.default_settings))
        }
    }

    setLibrarySettings(library) {
        this.settings_library = library;
    }

    getLibrarySettings() {
        if(this.settings_library) {
            return this.settings_library;
        } else {
            return null;
        }
    }

    setDataTypeSettings(data_type) {
        this.settings_data_type = data_type;
    }

    getDataTypeSettings() {
        if(this.settings_data_type) {
            return this.settings_data_type;
        } else {
            return null;
        }
    }

    getLightCurveSettings() {

    }

    getSpectrumSettings() {

    }

    setHDUsSettings(hdus) {
        this.settings_hdus = hdus;
    }

    getHDUsSettings() {
        if(this.settings_hdus !== null) {
            return this.settings_hdus;
        } else {
            return null;
        }
    }

    setAxisSettings(axis) {
        this.settings_axis = axis;
    }

    getAxisSettings() {
        if(this.settings_axis) {
            return this.settings_axis;
        } else {
            return null;
        }
    }

    setColumnsSettings(columns) {
        this.settings_columns = columns;
    }

    getColumnsSettings() {
        if(this.settings_columns) {
            return this.settings_columns;
        } else {
            return null;
        }
    }

    setScalesSettings(scales) {
        this.settings_scales = scales;
    }

    getScalesSettings() {
        if(this.settings_scales) {
            return this.settings_scales;
        } else {
            return null;
        }
    }

    setErrorBarsSettings(error_bars) {
        this.settings_error_bars = error_bars;
    }

    getErrorBarsSettings() {
        if(this.settings_error_bars) {
            return this.settings_error_bars;
        } else {
            return null;
        }
    }

    setRangesSettings(ranges) {
        this.settings_ranges = ranges;
    }

    getRangesSettings() {
        return this.settings_ranges;
    }

    getAdditionalDatasetsSettings() {

    }

    reset() {
        this.settings_library = null;
        this.settings_data_type = null;
        this.settings_hdus = null;
        this.settings_axis = null;
        this.settings_scales = null;
        this.settings_error_bars = null;
    }
}

/***/ }),

/***/ "./utils/ColumnUtils.js":
/*!******************************!*\
  !*** ./utils/ColumnUtils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColumnUtils: () => (/* binding */ ColumnUtils)
/* harmony export */ });
class ColumnUtils {

    static getColumnSettings(column_settings) {
        let settings = column_settings.split('$');

        let column_location = settings[0].split('.');
        let column_name = settings[1] || '';

        let file_id = column_location[0];
        let hdu_index = column_location.length > 1 ? column_location[1] : '';

        return {
            file_id: file_id,
            hdu_index: hdu_index,
            column_name: column_name
        };
    }

}

/***/ }),

/***/ "./utils/ExpressionParser.js":
/*!***********************************!*\
  !*** ./utils/ExpressionParser.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpressionParser: () => (/* binding */ ExpressionParser)
/* harmony export */ });
class ExpressionParser {

    static standard_functions = ['Math.sqrt',
        'Math.abs',
        'Math.cos',
        'Math.sin',
        'Math.max',
        'Math.min',
        'Math.pow',
        'Math.log',
        'Math.round'
    ];

    static custom_functions = [];

    expression = null;
    blocks = [];

    constructor(expression = null) {
        this.expression = expression;
    }

    setExpression(expression) {
        this.expression = expression;
    }

    parseStandardExpressionOperand(expression) {
        const operator_regex = /[\+\-\*\/]/g;

        let parts = expression.split(operator_regex);

        let filtered_parts = parts.filter(part => part.trim() !== '');

        return filtered_parts;
    }

    parseStandardExpressionOperators(expression) {
        const operator_regex = /[\+\-\*\/]/g;

        const operators = expression.match(operator_regex);

        return operators;
    }

    parseExpression() {
        if(this.expression) {

            for(let i = 0; this.expression.length; i++) {

                let curr_char = this.expression[i];

            }

        }
    }

    basicExpressionEvaluation() {
        let expression_result = null;

        try {
            expression_result = eval(this.expression);
        } catch(e) {

        }

        return expression_result;
    }

    customExpressionEvaluation() {

    }

    checkExpression() {

        let expression_type = 'standard';

        const regex_is_operator_number = /[+\-*/0-9.]+/;

        let expression_parts = this.expression.split(/\s+/);

        expression_parts.forEach(part => {
            if (!regex_is_operator_number.test(part)) {
                if (ExpressionParser.standard_functions.includes(part)) {

                } else if (ExpressionParser.custom_functions.includes(part)) {
                    expression_type = 'custom';
                } else {
                    expression_type = null;
                    return expression_type;
                }
            }
        });

        return expression_type;
    }

}

/***/ }),

/***/ "./utils/ObjectUtils.js":
/*!******************************!*\
  !*** ./utils/ObjectUtils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObjectUtils: () => (/* binding */ ObjectUtils)
/* harmony export */ });
class ObjectUtils {

    static deep_merge(base_object, merging_object) {
        let merged_object = {};

        for (let key in base_object) {
            if (base_object.hasOwnProperty(key)) {
                merged_object[key] = base_object[key];
            }
        }

        for (let key in merging_object) {
            if (merging_object.hasOwnProperty(key)) {
                if(Array.isArray(merging_object[key])) {

                } else if (merged_object.hasOwnProperty(key) && typeof merging_object[key] === 'object') {
                    merged_object[key] = ObjectUtils.deep_merge(merged_object[key], merging_object[key]);
                } else {
                    merged_object[key] = merging_object[key];
                }
            }
        }

        return merged_object;
    }

}

/***/ }),

/***/ "./utils/StringUtils.js":
/*!******************************!*\
  !*** ./utils/StringUtils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StringUtils: () => (/* binding */ StringUtils)
/* harmony export */ });
class StringUtils {

    static cleanFileName(str) {
        if (str.startsWith('.') || str.startsWith('/')) {
            str = str.substring(1);

            return StringUtils.cleanFileName(str);
        } else {
            return str;
        }
    }

}

/***/ }),

/***/ "./visualizations/BokehGraph.js":
/*!**************************************!*\
  !*** ./visualizations/BokehGraph.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BokehGraph: () => (/* binding */ BokehGraph)
/* harmony export */ });
class BokehGraph {

    container_id = null;
    container = null;

    static plt = Bokeh.Plotting;

    static scale_functions = {
        "linear": Bokeh.LinearScale,
        "log": Bokeh.LogScale
    }

    source = null;

    y_error_bar;
    x_error_bar;

    columns;
    data_table;

    static supported_tool_array = [
        "pan",
        "box_zoom",
        "wheel_zoom",
        "hover",
        "crosshair",
        "reset",
        "save",
        "lasso_select",
        "poly_select",
        "tap",
        "examine,",
        "undo",
        "redo"];

    static default_tool_array = [
        "pan",
        "box_zoom",
        "wheel_zoom",
        "hover",
        "crosshair",
        "reset",
        "save"];

    static default_tool_string = "pan,box_zoom,wheel_zoom,hover,crosshair,reset,save";

    tool_array = [];
    tool_string = "";

    has_data_table = false;

    constructor(container_id = '#visualization-container') {
        this.container_id = container_id;
        this._setContainer();
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id);
    }

    initializeSettings(data, labels, scales, title, error_bars = null, custom_range = null) {
        this.setupSource(data);

        if(error_bars) {
            this.setupPlot(title, data['y_low'], data['y_up']);
        } else {
            if(custom_range) {
                let x_low = [];
                let x_up = [];

                let y_low = [];
                let y_up = [];

                if(custom_range.x !== null) {
                    custom_range.x.lower_bound !== null ? x_low.push(custom_range.x.lower_bound) : x_low = data['x'];
                    custom_range.x.upper_bound !== null ? x_up.push(custom_range.x.upper_bound) : x_up = data['x'];
                } else {
                    x_low = data['x'];
                    x_up = data['x'];
                }

                if(custom_range.y !== null) {
                    custom_range.y.lower_bound !== null ? y_low.push(custom_range.y.lower_bound) : y_low = data['y'];
                    custom_range.y.upper_bound !== null ? y_up.push(custom_range.y.upper_bound) : y_up = data['y'];
                } else {
                    y_low = data['y'];
                    y_up = data['y'];
                }

                this.setupPlot(title, y_low, y_up, x_low, x_up)
            } else {
                this.setupPlot(title, data['y'], data['y']);
            }

        }

        this.setupData();
        this.setupScales(scales);
        this.setupLabels(labels);

        if(error_bars) {
            this.setupErrorBars();
        }
    }

    initializeGraph() {

        if(this.has_data_table) {
            BokehGraph.plt.show(new Bokeh.Column({children: [p, data_table]}), "#graph-container");
        } else {
            BokehGraph.plt.show(this.plot, this.container_id);
        }
    }

    setupPlot(title, y_range_low, y_range_up, x_range_low = null, x_range_up= null) {

        if(x_range_low) {
            this.plot = BokehGraph.plt.figure({
                title: title,
                tools: BokehGraph.default_tool_string,
                width: 800,
                height: 600,
            });
        } else {
            this.plot = BokehGraph.plt.figure({
                title: title,
                tools: BokehGraph.default_tool_string,
                width: 800,
                height: 600,
            });
        }
    }

    setupSource(data_sources) {
        this.source = new Bokeh.ColumnDataSource({
            data: data_sources
        });
    }

    setupData() {
        const circles = this.plot.circle({ field: "x" }, { field: "y" }, {
            source: this.source,
            size: 4,
            fill_color: "navy",
            line_color: null,
        });
    }

    setupErrorBars() {
        this.y_error_bar = new Bokeh.Whisker({
            dimension: "height",
            source: this.source,
            base: {field: "x"},
            lower: {field: "y_low"},
            upper: {field: "y_up"},
            line_color: "navy",
            lower_head: null,
            upper_head: null,
        });

        this.x_error_bar = new Bokeh.Whisker({
            dimension: "width",
            source: this.source,
            base: {field: "y"},
            lower: {field: "x_low"},
            upper: {field: "x_up"},
            line_color: "navy",
            lower_head: null,
            upper_head: null,
        });

        this.plot.add_layout(this.y_error_bar);
        this.plot.add_layout(this.x_error_bar);
    }

    setupScales (scales) {
        if(scales) {
            this.plot.x_scale = new BokehGraph.scale_functions[scales.x]();
            this.plot.y_scale = new BokehGraph.scale_functions[scales.y]();
        }
    }

    setupLabels(labels) {
        this.plot.xaxis.axis_label = labels.x;
        this.plot.yaxis.axis_label = labels.y;
    }

    setupColumns(labels, columns) {
        this.columns = [
            new Bokeh.Tables.TableColumn({field: 'x', title: labels.x}),
            new Bokeh.Tables.TableColumn({field: 'y', title: labels.y})
        ]
    }

    setupDataTable() {
        this.data_table = new Bokeh.Tables.DataTable({
            source: this.source,
            columns: this.columns,
            width: 800,
        });
    }

    createToolArray(tool_array) {
        this.tool_array = tool_array;
    }

    addToolToToolArray(tool_name) {
        if (!this.tool_array.includes(tool_name) && BokehGraph.supported_tool_array.includes(tool_name)) {
            this.tool_array.push(tool_name);
        }
    }

    removeToolFromToolArray(tool_name) {
        this.tool_array = this.tool_array.filter(str => str !== tool_name);
    }

    setToolStringFromToolArray() {
        this.tool_string = this.tool_array.join(',');
    }

}

/***/ }),

/***/ "./visualizations/D3Graph.js":
/*!***********************************!*\
  !*** ./visualizations/D3Graph.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D3Graph: () => (/* binding */ D3Graph)
/* harmony export */ });
class D3Graph {

    x_scale;
    x_scale_type;

    y_scale;
    y_scale_type;

    x_axis;
    x_axis_data_col;

    y_axis;
    y_axis_data_col;

    dataset;
    svg; plot; clip; zoom_rect;

    zoom;

    line_container; path;

    container;
    container_id;

    margin = {top: 10, right: 30, bottom: 30, left: 60};
    width = 800 - this.margin.left - this.margin.right;
    height = 400 - this.margin.top - this.margin.bottom;

    has_error_bars = false;
    x_axis_data_col_error_bar;
    y_axis_data_col_error_bar;

    has_line = false;

    has_multiple_plots = false;
    additional_plots = [];

    initialized;

    static scale_functions = {
        "linear": d3.scaleLinear,
        "log": d3.scaleLog
    };

    static default_scales = {
        "x": 'linear',
        "y": 'linear'
    }

    static default_axis_tick_format = ".2f";

    constructor(container_id = 'visualization-container', dataset = null) {
        this.container_id = container_id;
        this.dataset = dataset;

        this._setContainer();

        this._updateChart = this._updateChart.bind(this);

        this.initialized = false;
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id);
    }

    initializeSettings(data,
                       axis,
                       scales = D3Graph.default_scales,
                       error_bars = null,
                       has_line = false,
                       additional_plots = null) {

        let is_set = false;

        try {

            this.dataset = data;

            this.x_axis_data_col = axis['x'];
            this.y_axis_data_col = axis['y'];

            this.x_scale_type = scales['x'];
            this.y_scale_type = scales['y'];

            if(error_bars) {
                this.has_error_bars = true;
                this.error_bars = error_bars;

                console.log(error_bars);

                this.x_axis_data_col_error_bar = axis['x'].value;
                this.y_axis_data_col_error_bar = axis['y'].value;

            } else {
                this.has_error_bars = false;
            }

            if (additional_plots) {
                this.has_multiple_plots = true;
                this.additional_plots = [];

                let additional_plots_temp = [];
                additional_plots.forEach(function (plot) {
                    additional_plots_temp.push(plot);
                });

                this.additional_plots = additional_plots_temp;
            }

            this.has_line = has_line;

            is_set = true;

        } catch(e) {
            console.log("Error during graph settings process")
        }

        return is_set;
    }

    initializeGraph() {
        try {
            this._setSVGContainer();

            this._setXScale();
            this._setYScale();

            this._setXAxis();
            this._setXAxisLabel();

            this._setYAxis();
            this._setYAxisLabel()

            this._setDataPlot();

            this._setZoomBehavior();

            if(this.has_error_bars) {
                this._setErrorBars(this.error_bars);
            }

            if(this.has_line) {
                this._setAxisLine();
            }

            if(this.has_multiple_plots) {
                this._setAdditionalPlots();
            }

            this.initialized = true;
        } catch(e) {
            console.log("Error during graph initialization");
            this.initialized = false;
        }

        return this.initialized;
    }

    _setSVGContainer() {

        let full_width = this._getFullWidth();
        let full_height = this._getFullHeight();

        this.svg = d3.select(this.container)
            .append("svg")
            .attr("width", full_width)
            .attr("height", full_height)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    _setXScale() {
        this.x_scale = D3Graph.scale_functions[this.x_scale_type]()
            .domain(d3.extent(this.dataset, d => d[this.x_axis_data_col]))
            .range([ 0, this.width ]);
    }

    _setYScale() {
        this.y_scale = D3Graph.scale_functions[this.y_scale_type]()
            .domain(d3.extent(this.dataset, d => d[this.y_axis_data_col]))
            .range([ this.height, 0]);
    }

    _setXAxis(tick_format = D3Graph.default_axis_tick_format) {
         this.x_axis = this.svg.append("g")
            .attr("id", "x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x_scale)
                .tickFormat(d3.format(tick_format)))
            .call(g => g.selectAll(".tick line").clone()
                .attr("class", "tick-line")
                .attr("y2", -this.height)
                .attr("stroke-opacity", 0.2))
    }

    _setYAxis(tick_format = D3Graph.default_axis_tick_format) {
        this.y_axis = this.svg.append("g")
            .attr("id", "y")
            .call(d3.axisLeft(this.y_scale)
                .tickFormat(d3.format(tick_format)))
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", this.width)
                .attr("stroke-opacity", 0.2));
    }

    _setXAxisLabel() {
        this.x_axis.select(".tick:last-of-type text").clone()
            .attr("id", "x-label")
            .attr("y", -11)
            .attr("x", 2)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(this.x_axis_data_col);
    }

    _setYAxisLabel() {
        this.y_axis.select(".tick:last-of-type text").clone()
            .attr("id", "y-label")
            .attr("x", 3)
            .attr("y", -5)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(this.y_axis_data_col);
    }

    _setDataPlot() {

        let x = this.x_scale;
        let y = this.y_scale;

        let x_col_data = this.x_axis_data_col;
        let y_col_data = this.y_axis_data_col;

        this.clip = this.svg.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", this.width )
            .attr("height", this.height )
            .attr("x", 0)
            .attr("y", 0);

        this.plot = this.svg.append('g')
            .attr("clip-path", "url(#clip)")
            .attr("id", "data-plot")

        this.plot
            .selectAll("circle")
            .data(this.dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[x_col_data]); } )
            .attr("cy", function (d) { return y(d[y_col_data]); } )
            .attr("r", 4)
            .style("fill", "transparent")
            .style("stroke", "black")
            .style("opacity", 1)
    }

    _setAdditionalPlots() {
        let plot;
        for(let i = 0; i < this.additional_plots.length, i++;) {
            plot = this.additional_plots[i];
        }
    }

    _setErrorBars(error_bars) {

        this.error_bars = error_bars;

        if(error_bars.y) {
            let line_error_bar_x = d3.line()
                .x(d => this.x_scale(d[this.x_axis_data_col]))
                .y(d => this.y_scale(d.bound));

            error_bars.y.forEach((error_bar) => {
                d3.select('#data-plot').append("path")
                    .attr("class", "error-bar-x")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_x(error_bar));
            })
        }

        if(error_bars.x) {
            let line_error_bar_y = d3.line()
                .x(d => this.x_scale(d.bound))
                .y(d => this.y_scale(d[this.y_axis_data_col]));

            error_bars.x.forEach((error_bar) => {
                d3.select('#data-plot').append("path")
                    .attr("class", "error-bar-x")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_y(error_bar));
            })
        }
    }

    _setAxisLine() {
        let line = d3.line()
            .curve(d3.curveCatmullRom)
            .x(d => this.x_axis(d[this.x_axis_data_col]))
            .y(d => this.y_axis(d[this.y_axis_data_col]));

        this.line_container = this.svg.append("g")
            .attr("id", "path-container")
            .attr("clip-path", "url(#clip)");

        this.path = this.line_container.append("path")
            .attr("id", "path")
            .attr("fill", "none").attr("stroke", "steelblue")
            .attr("d", line(data));
    }

    _setZoomBehavior() {

        this.zoom = d3.zoom()
            .scaleExtent([.5, 20])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", this._updateChart);

        this.zoom_rect = this.svg.append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .call(this.zoom);

    }

    _updateChart(e) {

        let rescaled_x = e.transform.rescaleX(this.x_scale);
        let rescaled_y = e.transform.rescaleY(this.y_scale);

        this.x_axis.call(d3.axisBottom(rescaled_x).tickFormat(d3.format(D3Graph.default_axis_tick_format)))
        this.y_axis.call(d3.axisLeft(rescaled_y).tickFormat(d3.format(D3Graph.default_axis_tick_format)))

        this.svg.selectAll(".tick-line").remove();
        this.svg.selectAll("#y-label").remove();
        this.svg.selectAll("#x-label").remove();
        this.svg.selectAll(".error-bar-x").remove();

        this.x_axis.selectAll(".tick line").clone()
            .attr("class", "tick-line")
            .attr("y2", -this.height)
            .attr("stroke-opacity", 0.2)

        this.y_axis.selectAll(".tick line").clone()
            .attr("class", "tick-line")
            .attr("x2", this.width)
            .attr("stroke-opacity", 0.2)

        this._setXAxisLabel();
        this._setYAxisLabel();

        let x_data_col = this.x_axis_data_col;
        let y_data_col = this.y_axis_data_col;

        this.svg.selectAll("circle")
            .data(this.dataset)
            .transition()
            .duration(150)
            .attr("cx", function (d) { return rescaled_x(d[x_data_col]); } )
            .attr("cy", function (d) { return rescaled_y(d[y_data_col]); } )

        if(this.has_line) {
            this.svg.selectAll("path").remove();
            this._setAxisLine();
        }

        if(this.has_error_bars) {

            if(this.error_bars.y) {
                let line_error_bar_x = d3.line()
                    .x(d => rescaled_x(d[this.x_axis_data_col]))
                    .y(d => rescaled_y(d.bound));

                this.error_bars.y.forEach((error_bar) => {
                    d3.select('#data-plot').append("path")
                        .attr("class", "error-bar-x")
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("d", line_error_bar_x(error_bar));
                })
            }

            if(this.error_bars.x) {
                let line_error_bar_y = d3.line()
                    .x(d => rescaled_x(d.bound))
                    .y(d => rescaled_y(d[this.y_axis_data_col]));

                this.error_bars.x.forEach((error_bar) => {
                    d3.select('#data-plot').append("path")
                        .attr("class", "error-bar-x")
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("d", line_error_bar_y(error_bar));
                })
            }
        }

    }

    _getFullWidth() {
        return this.width + this.margin.left + this.margin.right
    }

    _getFullHeight() {
        return this.height + this.margin.top + this.margin.bottom
    }
}

/***/ }),

/***/ "./wrappers/BokehWrapper.js":
/*!**********************************!*\
  !*** ./wrappers/BokehWrapper.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BokehWrapper: () => (/* binding */ BokehWrapper)
/* harmony export */ });
/* harmony import */ var _events_ConfigurationEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events/ConfigurationEvent */ "./events/ConfigurationEvent.js");
/* harmony import */ var _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../containers/DataProcessorContainer */ "./containers/DataProcessorContainer.js");
/* harmony import */ var _containers_VisualizationContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../containers/VisualizationContainer */ "./containers/VisualizationContainer.js");
/* harmony import */ var _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../containers/WrapperContainer */ "./containers/WrapperContainer.js");
/* harmony import */ var _settings_SettingsConfiguration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../settings/SettingsConfiguration */ "./settings/SettingsConfiguration.js");






class BokehWrapper {

    static container_id = 'visualization-container';

    static library = 'bokeh';

    static title = {
        'light-curve': 'Light curve',
        'spectrum': 'spectrum'
    }

    static specific_settings = {
        'bokeh-settings': {
            display: true,
            'bokeh-options': {
                tools: {
                    display: false
                }
            }
        }
    };

    container = null;

    configuration_object = null;

    constructor() {
        this._setContainer();
        this._setupListeners();
    }

    _setContainer() {
        this.container = document.getElementById(BokehWrapper.container_id);
    }

    _resetContainer() {
        this.container.innerHTML = "";
    }

    _setupListeners() {
        document.addEventListener('settings-changed', this.handleSettingsChangedEvent.bind(this));
        document.addEventListener('visualization-generation', this.handleVisualizationGenerationEvent.bind(this));
    }

    handleSettingsChangedEvent(event) {
        let settings_object = event.detail.settings_object;

        let library_settings = settings_object.getLibrarySettings();

        if(library_settings.library === BokehWrapper.library) {
            this.createConfigurationObject();

            if(this.configuration_object !== null) {
                let configuration_event = new _events_ConfigurationEvent__WEBPACK_IMPORTED_MODULE_0__.ConfigurationEvent(this.configuration_object);

                configuration_event.dispatchToSubscribers();
            }
        }
    }

    handleVisualizationGenerationEvent(event) {
        this.settings_object = event.detail.settings_object;

        let library_settings = this.settings_object.getLibrarySettings();

        if(library_settings.library === BokehWrapper.library) {

            this._resetContainer();

            let dataset_settings = {};

            let axis = this.settings_object.getAxisSettings();
            let axis_settings = [];

            for(let axis_column in axis) {
                let axis_column_object = this._getColumnSettings(axis[axis_column]);
                axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                axis_settings.push(axis_column_object);
            }

            dataset_settings.axis = axis_settings;
            dataset_settings.data_type = this.settings_object.getDataTypeSettings();

            let error_bars = this.settings_object.getErrorBarsSettings();
            let has_error_bars = false;

            if(error_bars !== null) {

                let error_bars_settings = [];
                for(let axis_column in error_bars) {
                    let axis_column_object = this._getColumnSettings(error_bars[axis_column]);
                    axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                    error_bars_settings.push(axis_column_object);
                }

                dataset_settings.error_bars = error_bars_settings;
            }

            let dpp = _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_1__.DataProcessorContainer.getDataProcessorContainer().getDataPreProcessor();

            let processed_data = dpp.getProcessedDataset(dataset_settings);

            let data_type = this.settings_object.getDataTypeSettings();

            let scales = this.settings_object.getScalesSettings();


            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};
            let labels = axis;

            processed_data.axis[0].data = processed_data.axis[0].data.map(value => isNaN(value) ? 0 : value);
            processed_data.axis[1].data = processed_data.axis[1].data.map(value => isNaN(value) ? 0 : value);


            let data = {x: processed_data.axis[0].data, y: processed_data.axis[1].data};

            if(error_bars) {

                console.log(processed_data.error_bars);

                let error_bars_object = {};

                processed_data.error_bars.forEach((error_bar) => {
                    error_bar.data = error_bar.data.map(value => !isFinite(value) ? 0 : value);
                    error_bar.data = error_bar.data.map(value => isNaN(value) ? 0 : value);

                    error_bars_object[error_bar.axis] = error_bar.column_name;

                    if(error_bar.axis === 'x') {
                        data.dx = error_bar.data;
                    } else if(error_bar.axis === 'y') {
                        data.dy = error_bar.data;
                    }
                })

                /*
                error_bars = {x: processed_data.error_bars[0].column_name, y: processed_data.error_bars[1].column_name};

                processed_data.error_bars[0].data = processed_data.error_bars[0].data.map(value => !isFinite(value) ? 0 : value);
                processed_data.error_bars[1].data = processed_data.error_bars[1].data.map(value => !isFinite(value) ? 0 : value);

                data.dx = processed_data.error_bars[0].data.map(value => isNaN(value) ? 0 : value);
                data.dy = processed_data.error_bars[1].data.map(value => isNaN(value) ? 0 : value);
                */

                let asymmetric_uncertainties = false;

                if(data_type === 'spectrum') {
                    asymmetric_uncertainties = true;
                }

                data = this._processErrorBarData(data, asymmetric_uncertainties);

                has_error_bars = true;
            }

            let ranges = this.settings_object.getRangesSettings();
            let custom_range_data = null;

            if(ranges != null) {

                if(has_error_bars) {
                    custom_range_data = dpp.processDataForRangeBokeh(ranges, data, true);
                } else {
                    custom_range_data = dpp.processDataForRangeBokeh(ranges, data);
                }

                data = custom_range_data;
            }

            let visualization = _containers_VisualizationContainer__WEBPACK_IMPORTED_MODULE_2__.VisualizationContainer.getBokehVisualization();

            visualization.initializeSettings(data, labels, scales, BokehWrapper.title['data_type'], error_bars, ranges);

            visualization.initializeGraph();
        }
    }

    _getColumnSettings(column_settings) {
        let settings = column_settings.split('$');

        let column_location = settings[0].split('.');
        let column_name = settings[1] || '';

        let file_id = column_location[0];
        let hdu_index = column_location.length > 1 ? column_location[1] : '';

        return {
            file_id: file_id,
            hdu_index: hdu_index,
            column_name: column_name
        };
    }

    _processErrorBarData(data, asymetric_uncertainties = false) {

        let div_factor= 2;

        if(asymetric_uncertainties) {
            div_factor = 1;
        }

        if(data.dx) {
            let x_low = [];
            let x_up = [];

            for(let i in data.dx) {
                x_low[i] = data.x[i] - data.dx[i] / div_factor;
                x_up[i] = data.x[i] + data.dx[i] / div_factor;
            }

            data.x_low = x_low;
            data.x_up = x_up;

            delete data.dx;
        }

        if(data.dy) {
            let y_low = [];
            let y_up = [];

            for(let i in data.dy) {
                y_low[i] = data.y[i] - data.dy[i];
                y_up[i] = data.y[i] + data.dy[i];
            }

            data.y_low = y_low;
            data.y_up = y_up;

            delete data.dy;

        }

        /*
        let y_low = [], y_up = [], x_low = [], x_up = [];

        for (let i in data.dy) {
            y_low[i] = data.y[i] - data.dy[i];
            y_up[i] = data.y[i] + data.dy[i];
            x_low[i] = data.x[i] - data.dx[i] / div_factor;
            x_up[i] = data.x[i] + data.dx[i] / div_factor;
        }

        data.y_low = y_low;
        data.y_up = y_up;
        data.x_low = x_low;
        data.x_up = x_up;

        delete data.dy;
        delete data.dx;
        */

        return data;
    }

    createConfigurationObject() {
        this.configuration_object = _settings_SettingsConfiguration__WEBPACK_IMPORTED_MODULE_4__.SettingsConfiguration.getConfigurationObject(BokehWrapper.specific_settings);
    }

}

/***/ }),

/***/ "./wrappers/D3Wrapper.js":
/*!*******************************!*\
  !*** ./wrappers/D3Wrapper.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D3Wrapper: () => (/* binding */ D3Wrapper)
/* harmony export */ });
/* harmony import */ var _events_ConfigurationEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events/ConfigurationEvent */ "./events/ConfigurationEvent.js");
/* harmony import */ var _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../containers/DataProcessorContainer */ "./containers/DataProcessorContainer.js");
/* harmony import */ var _containers_VisualizationContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../containers/VisualizationContainer */ "./containers/VisualizationContainer.js");
/* harmony import */ var _settings_SettingsConfiguration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../settings/SettingsConfiguration */ "./settings/SettingsConfiguration.js");





class D3Wrapper {

    static library = "d3";
    static container_id = "visualization-container";

    static specific_settings = {
        'd3-settings': {
            display: true,
            'd3-options': {
                'has_line': true,
                display: false
            }
        }
    };

    container;
    container_id;

    settings_object;
    configuration_object = null;

    constructor(container_id = D3Wrapper.container_id) {
        this._setupListeners();

        this.container_id = container_id;
        this._setContainer();
    }

    _setupListeners() {
        document.addEventListener('settings-changed', this.handleSettingsChangedEvent.bind(this));
        document.addEventListener('visualization-generation', this.handleVisualizationGenerationEvent.bind(this));
    }

    handleSettingsChangedEvent(event) {

        let settings_object = event.detail.settings_object;

        let library_settings = settings_object.getLibrarySettings();

        if(library_settings.library === D3Wrapper.library) {
            this.createConfigurationObject();

            if(this.configuration_object !== null) {
                let configuration_event = new _events_ConfigurationEvent__WEBPACK_IMPORTED_MODULE_0__.ConfigurationEvent(this.configuration_object);
                configuration_event.dispatchToSubscribers();
            }
        }

    }

    handleVisualizationGenerationEvent(event) {

        console.log("Graph generation");
        console.log(event);

        this.settings_object = event.detail.settings_object;

        let library_settings = this.settings_object.getLibrarySettings();

        if(library_settings.library === D3Wrapper.library) {

            this.resetContainer();

            let dataset_settings = {};

            let data_type = this.settings_object.getDataTypeSettings();
            let axis = this.settings_object.getAxisSettings();
            let columns = this.settings_object.getColumnsSettings();
            let scales = this.settings_object.getScalesSettings();
            let error_bars = this.settings_object.getErrorBarsSettings();
            let ranges = this.settings_object.getRangesSettings();

            let has_error_bars = false;

            dataset_settings.data_type = data_type;

            console.log("COLUMNS");
            console.log(columns);
            console.log(axis);

            let axis_settings = [];
            for(let axis_column in axis) {

                console.log(columns[axis_column]);

                let axis_column_object;

                if(columns[axis_column].column_type === 'standard') {
                    console.log("Standard");
                    axis_column_object = this._getColumnSettings(axis[axis_column]);
                    axis_column_object = {...axis_column_object, ...columns[axis_column], ...{axis: axis_column}}
                } else if(columns[axis_column].column_type === 'processed') {
                    console.log("Custom column settings object");
                    axis_column_object = this._getCustomColumnSettings(axis[axis_column]);
                    axis_column_object = {...axis_column_object, ...columns[axis_column], ...{axis: axis_column}}
                } else {
                    console.log("Default");
                    axis_column_object = this._getColumnSettings(axis[axis_column]);
                    axis_column_object = {...axis_column_object, ...columns[axis_column], ...{axis: axis_column}}
                }

                axis_settings.push(axis_column_object);
            }

            console.log("AXIS SETTINGS");
            console.log(axis_settings);

            dataset_settings.axis = axis_settings;

            if(error_bars !== null) {
                has_error_bars = true;

                let error_bars_settings = [];
                for(let axis_column in error_bars) {
                    let axis_column_object = this._getColumnSettings(error_bars[axis_column]);
                    axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                    error_bars_settings.push(axis_column_object);
                }

                dataset_settings.error_bars = error_bars_settings;
            }

            let dpp = _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_1__.DataProcessorContainer.getDataProcessorContainer().getDataPreProcessor();

            let processed_data = dpp.getProcessedDataset(dataset_settings);

            console.log(processed_data);

            let processed_json_data = dpp.datasetToJSONData(processed_data);

            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};

            if(has_error_bars) {
                let error_bars_object = {};

                processed_data.error_bars.forEach((error_bar) => {
                    error_bars_object[error_bar.axis] = error_bar.column_name;
                })

                error_bars = dpp.processErrorBarDataJSON(processed_json_data, axis, error_bars_object)
            }

            if(ranges != null) {
                let custom_range_data = null;

                if(has_error_bars) {
                    custom_range_data = dpp.processDataForRange(ranges, processed_json_data, error_bars);
                    processed_json_data = custom_range_data.data;
                    error_bars = custom_range_data.error_bars;
                } else {
                    custom_range_data = dpp.processDataForRange(ranges, processed_json_data);
                    processed_json_data = custom_range_data.data;
                }
            }

            let visualization = _containers_VisualizationContainer__WEBPACK_IMPORTED_MODULE_2__.VisualizationContainer.getD3Visualization();

            visualization.initializeSettings(processed_json_data, axis, scales, error_bars, false, null);
            visualization.initializeGraph();
        }

    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

    createConfigurationObject() {
        this.configuration_object = _settings_SettingsConfiguration__WEBPACK_IMPORTED_MODULE_3__.SettingsConfiguration.getConfigurationObject(D3Wrapper.specific_settings);
    }

    _getCustomColumnSettings(column_settings) {
        console.log("_getCustomColumnSettings");
        console.log(column_settings);

        return {
            column_expression: column_settings
        };
    }

    _getColumnSettings(column_settings) {
        let settings = column_settings.split('$');

        let column_location = settings[0].split('.');
        let column_name = settings[1] || '';

        let file_id = column_location[0];
        let hdu_index = column_location.length > 1 ? column_location[1] : '';

        return {
            file_id: file_id,
            hdu_index: hdu_index,
            column_name: column_name
        };
    }

}

/***/ }),

/***/ "./wrappers/FITSReaderWrapper.js":
/*!***************************************!*\
  !*** ./wrappers/FITSReaderWrapper.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FITSReaderWrapper: () => (/* binding */ FITSReaderWrapper)
/* harmony export */ });
/* harmony import */ var _errors_InvalidURLError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors/InvalidURLError */ "./errors/InvalidURLError.js");
/* harmony import */ var _errors_HDUNotTabularError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors/HDUNotTabularError */ "./errors/HDUNotTabularError.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/StringUtils */ "./utils/StringUtils.js");
/* harmony import */ var _events_FileLoadedEvent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../events/FileLoadedEvent */ "./events/FileLoadedEvent.js");






class FITSReaderWrapper {

    file_path = null;
    file = null;

    static BINTABLE = 'BINTABLE';
    static TABLE = 'TABLE';

    constructor(file_path = null) {
        if(file_path) {
            console.log(file_path);
            if (FITSReaderWrapper.is_path_valid(file_path)) {
                this.file_path = file_path;
                this._getFile()
            } else {
                throw new _errors_InvalidURLError__WEBPACK_IMPORTED_MODULE_0__.InvalidURLError("Invalid file path : " + file_path);
            }
        }
    }

    initializeFromPath(file_path) {
        if(FITSReaderWrapper.is_path_valid(file_path)) {
            this.file_path = file_path;
            this._getFile()
        } else {
            throw new _errors_InvalidURLError__WEBPACK_IMPORTED_MODULE_0__.InvalidURLError("Invalid file path : " + file_path);
        }

    }

    initializeFromBuffer(array_buffer, file_name) {
        this.file_path = file_name;
        this._readFile(array_buffer);
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

            this.sendFITSLoadedEvents();

        } catch(e) {
            console.log("Error initializing interface")
        }
    }

    getFilePath() {
        return this.file_path;
    }

    setFile(file) {
        this.file = file;
    }

    setFileFromFileObject(file_object) {
        this.file = file_object.file;
        this.arf_file = file_object.arf_file_id;
        this.rmf_file = file_object.rmf_file_id;
    }

    getHDU(hdu_index) {
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
        let extname = '';

        this.file.hdus.forEach(function(hdu, index) {

            if (hdu.header.primary === true) {
                type = "PRIMARY";
            } else {
                type = hdu.header.get('XTENSION');
                extname = hdu.header.get('EXTNAME');
            }

            hdu_object = {
                "name": type,
                "index": index,
                "extname": extname
            };

            HDUs.push(hdu_object);
        })

        return HDUs;
    }

    getTabularHDUs() {
        let tabular_hdus_index = [];

        this.file.hdus.forEach(function(hdu, index) {
            if (hdu.header.primary !== true) {
                if(hdu.header.get('XTENSION') === "TABLE" || hdu.header.get('XTENSION') === "BINTABLE") {
                    tabular_hdus_index.push(index);
                }
            }
        })

        return tabular_hdus_index;
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
            throw new _errors_HDUNotTabularError__WEBPACK_IMPORTED_MODULE_1__.HDUNotTabularError("Selected HDU is not tabular");
        }

        return column_number;
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
            throw new _errors_HDUNotTabularError__WEBPACK_IMPORTED_MODULE_1__.HDUNotTabularError("Selected HDU is not tabular");
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

                try {
                    data.getColumn(column, function (col) {
                        column_data = col;
                    })
                } catch(e) {

                }

                raw_columns_data_array[column] = column_data;
            })

            let column_names = Object.keys(raw_columns_data_array);

            for (let i = 0; i < raw_columns_data_array[column_names[0]].length; i++) {

                let column_json_data_object = {};

                column_names.forEach((column_name) => {
                    column_json_data_object[column_name] = raw_columns_data_array[column_name][i];
                });

                columns_data_json.push(column_json_data_object);
            }

        } else {
            throw new _errors_HDUNotTabularError__WEBPACK_IMPORTED_MODULE_1__.HDUNotTabularError("Selected HDU is not tabular");
        }

        return columns_data_json;
    }

    getColumnDataFromHDU(hdu_index, column_name) {
        let hdu = this.file.getHDU(hdu_index);

        let header = hdu.header;
        let data = hdu.data;

        let type = hdu.header.get('XTENSION');

        let col_data = [];
        if(type === FITSReaderWrapper.BINTABLE || type === FITSReaderWrapper.TABLE) {

            data.getColumn(column_name, function(col){
                if(col[0] === undefined) {
                    let header_col_data = hdu.header.get(column_name);
                    col = col.map(() => header_col_data);
                }

                col_data = col;
            })

        } else {
            throw new _errors_HDUNotTabularError__WEBPACK_IMPORTED_MODULE_1__.HDUNotTabularError("Selected HDU is not tabular");
        }

        return col_data;
    }

    getHeaderFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);
        let header = hdu.header;

        return header;
    }

    getDataFromHDU(hdu_index) {
        let hdu = this.file.getHDU(hdu_index);
        let data = hdu.data;

        return data;
    }

    getHeaderCardValueByNameFromHDU(hdu_index, card_name) {
        let hdu = this.file.getHDU(hdu_index);
        let header = hdu.header;

        let value = header.get(card_name);

        if(value === undefined) {
            value = '';
        }

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

    _isHDUTabular(hdu) {
        let extension = hdu.header.get('XTENSION');
        return extension === FITSReaderWrapper.BINTABLE || extension === FITSReaderWrapper.TABLE;
    }

    getAllColumns() {
        let columns = [];

        this.file.hdus.forEach((hdu, index) => {

            if(this._isHDUTabular(hdu)) {
                let columns_name = this.getColumnsNameFromHDU(index);

                columns_name.forEach((column_name) => {
                    let column = {
                        name: column_name,
                        hdu_index: index,
                        is_from_header: false
                    }

                    columns.push(column);
                })

                if(hdu.header.get('TIMEDEL') !== null) {
                    let column = {
                        name: 'TIMEDEL',
                        hdu_index: index,
                        is_from_header: true
                    }

                    columns.push(column);
                }

                if(hdu.header.get('ANCRFILE') !== null) {
                    let ancrfile = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_2__.FileRegistry.getFileByName(
                        _utils_StringUtils__WEBPACK_IMPORTED_MODULE_3__.StringUtils.cleanFileName(hdu.header.get('ANCRFILE'))
                    );

                    if(ancrfile !== undefined) {
                        let frw = new FITSReaderWrapper();
                        frw.setFile(ancrfile.file);
                    }

                } else if(this.arf_file) {

                    let ancrfile = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_2__.FileRegistry.getFileById(this.arf_file);

                    if(ancrfile !== undefined) {
                        let frw = new FITSReaderWrapper();
                        frw.setFile(ancrfile.file);
                    }

                }

                if(hdu.header.get('RESPFILE') !== null) {
                    let respfile = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_2__.FileRegistry.getFileByName(
                        _utils_StringUtils__WEBPACK_IMPORTED_MODULE_3__.StringUtils.cleanFileName(hdu.header.get('RESPFILE'))
                    );

                    if(respfile !== undefined) {
                        let frw = new FITSReaderWrapper();

                        frw.setFile(respfile.file);

                        let hdus_index = frw.getTabularHDUs();

                        let has_e_min_max = false;
                        hdus_index.forEach((hdu_index) => {
                            let columns_name = frw.getColumnsNameFromHDU(hdu_index);
                            if (columns_name.includes("E_MIN") && columns_name.includes("E_MAX")) {
                                has_e_min_max = true;
                                let e_min_max_hdus_index = hdu_index;

                                let column = {
                                    name: 'E_HALF_WIDTH',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                                column = {
                                    name: 'E_MID',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                                column = {
                                    name: 'E_MID_LOG',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                            }
                        })

                    }

                } else if(this.rmf_file) {
                    let respfile = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_2__.FileRegistry.getFileById(this.rmf_file);

                    if(respfile !== undefined) {
                        let frw = new FITSReaderWrapper();

                        frw.setFile(respfile.file);

                        let hdus_index = frw.getTabularHDUs();

                        let has_e_min_max = false;
                        hdus_index.forEach((hdu_index) => {
                            let columns_name = frw.getColumnsNameFromHDU(hdu_index);
                            if (columns_name.includes("E_MIN") && columns_name.includes("E_MAX")) {
                                has_e_min_max = true;
                                let e_min_max_hdus_index = hdu_index;

                                let column = {
                                    name: 'E_HALF_WIDTH',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                                column = {
                                    name: 'E_MID',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                                column = {
                                    name: 'E_MID_LOG',
                                    hdu_index: hdu_index,
                                    is_from_header: false,
                                    is_processed: true,
                                    from_file: respfile.id
                                }

                                columns.push(column);

                            }
                        })

                    }
                }
            }
        })

        return columns;
    }

    sendFITSLoadedEvents() {
        let filele = new _events_FileLoadedEvent__WEBPACK_IMPORTED_MODULE_4__.FileLoadedEvent({
            file_name: this.file_path,
            type: 'fits',
            file: this.file
        });

        filele.dispatchToSubscribers();
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wrappers_FITSReaderWrapper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrappers/FITSReaderWrapper.js */ "./wrappers/FITSReaderWrapper.js");
/* harmony import */ var _wrappers_BokehWrapper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrappers/BokehWrapper.js */ "./wrappers/BokehWrapper.js");
/* harmony import */ var _wrappers_D3Wrapper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wrappers/D3Wrapper.js */ "./wrappers/D3Wrapper.js");
/* harmony import */ var _containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./containers/WrapperContainer.js */ "./containers/WrapperContainer.js");
/* harmony import */ var _containers_VisualizationContainer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./containers/VisualizationContainer.js */ "./containers/VisualizationContainer.js");
/* harmony import */ var _components_FileComponent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/FileComponent.js */ "./components/FileComponent.js");
/* harmony import */ var _components_SettingsComponent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/SettingsComponent.js */ "./components/SettingsComponent.js");
/* harmony import */ var _components_VisualizationComponent_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/VisualizationComponent.js */ "./components/VisualizationComponent.js");
/* harmony import */ var _components_file_type_FITSSettingsComponent_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/file_type/FITSSettingsComponent.js */ "./components/file_type/FITSSettingsComponent.js");
/* harmony import */ var _components_file_type_CSVSettingsComponent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/file_type/CSVSettingsComponent.js */ "./components/file_type/CSVSettingsComponent.js");
/* harmony import */ var _visualizations_D3Graph__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./visualizations/D3Graph */ "./visualizations/D3Graph.js");
/* harmony import */ var _visualizations_BokehGraph__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./visualizations/BokehGraph */ "./visualizations/BokehGraph.js");
/* harmony import */ var _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./registries/FileRegistry */ "./registries/FileRegistry.js");
/* harmony import */ var _containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./containers/RegistryContainer */ "./containers/RegistryContainer.js");
/* harmony import */ var _components_inputs_ArithmeticColumnInput__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/inputs/ArithmeticColumnInput */ "./components/inputs/ArithmeticColumnInput.js");
/* harmony import */ var _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./registries/CustomColumnRegistry */ "./registries/CustomColumnRegistry.js");

















let file_path = window.location.href + "_test_files/spiacs_lc_query.fits";

let fits_reader_wrapper = new _wrappers_FITSReaderWrapper_js__WEBPACK_IMPORTED_MODULE_0__.FITSReaderWrapper(file_path);

let bokeh_wrapper = new _wrappers_BokehWrapper_js__WEBPACK_IMPORTED_MODULE_1__.BokehWrapper();

let d3_wrapper = new _wrappers_D3Wrapper_js__WEBPACK_IMPORTED_MODULE_2__.D3Wrapper();

_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setBokehWrapper(bokeh_wrapper);
_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setD3Wrapper(d3_wrapper);

_containers_VisualizationContainer_js__WEBPACK_IMPORTED_MODULE_4__.VisualizationContainer.setBokehVisualization(new _visualizations_BokehGraph__WEBPACK_IMPORTED_MODULE_11__.BokehGraph());
_containers_VisualizationContainer_js__WEBPACK_IMPORTED_MODULE_4__.VisualizationContainer.setD3Visualization(new _visualizations_D3Graph__WEBPACK_IMPORTED_MODULE_10__.D3Graph());

_containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_13__.RegistryContainer.setFileRegistry(new _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_12__.FileRegistry());
_containers_RegistryContainer__WEBPACK_IMPORTED_MODULE_13__.RegistryContainer.setCustomColumnRegistry(new _registries_CustomColumnRegistry__WEBPACK_IMPORTED_MODULE_15__.CustomColumnRegistry());

customElements.define('file-component', _components_FileComponent_js__WEBPACK_IMPORTED_MODULE_5__.FileComponent);
customElements.define('settings-component', _components_SettingsComponent_js__WEBPACK_IMPORTED_MODULE_6__.SettingsComponent);
customElements.define('visualization-component', _components_VisualizationComponent_js__WEBPACK_IMPORTED_MODULE_7__.VisualizationComponent);
customElements.define('fits-component', _components_file_type_FITSSettingsComponent_js__WEBPACK_IMPORTED_MODULE_8__.FITSSettingsComponent);
customElements.define('csv-component', _components_file_type_CSVSettingsComponent_js__WEBPACK_IMPORTED_MODULE_9__.CSVSettingsComponent);
customElements.define('arithmetic-column-component', _components_inputs_ArithmeticColumnInput__WEBPACK_IMPORTED_MODULE_14__.ArithmeticColumnInput);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MscUVBQWdCOztBQUVwRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDcFpPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdEQUF3RCxRQUFRO0FBQ2hFLHdEQUF3RCxRQUFROztBQUVoRTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsdUVBQXVFLFNBQVM7O0FBRWhGO0FBQ0E7QUFDQTs7QUFFQSx1RUFBdUUsbUJBQW1COztBQUUxRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCxnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3REFBd0QsY0FBYztBQUN0RSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLHFCQUFxQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1DQUFtQyxhQUFhO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxVQUFVOztBQUVWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDclJPOztBQUVQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDeENPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNMTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDTE87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ0xPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNMTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0xrRTs7QUFFM0Q7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLDJCQUEyQixjQUFjOztBQUV6Qyx3QkFBd0I7QUFDeEIseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLDRFQUFpQjtBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaERrRTs7QUFFM0Q7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxpREFBaUQsY0FBYzs7QUFFL0Qsd0JBQXdCLGVBQWU7QUFDdkMseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSxrQkFBa0IsNEVBQWlCO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ2tFOztBQUUzRDs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsMkJBQTJCLGNBQWM7O0FBRXpDLHdCQUF3QjtBQUN4Qix5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiw0RUFBaUI7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRGtFO0FBQ007O0FBRWpFOztBQUVQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSwyQkFBMkIsY0FBYzs7QUFFekMsd0JBQXdCO0FBQ3hCLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiw0RUFBaUI7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQSwwQkFBMEIsa0ZBQXNCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkR3RTs7QUFFakU7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSw0Q0FBNEMsY0FBYzs7QUFFMUQsd0JBQXdCLGVBQWU7QUFDdkMseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNCQUFzQixrRkFBc0I7QUFDNUM7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEMwRTs7QUFFbkU7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSw0Q0FBNEMsY0FBYzs7QUFFMUQsd0JBQXdCLGVBQWU7QUFDdkMseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNCQUFzQixrRkFBc0I7QUFDNUM7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ2lEO0FBQ0E7QUFDaUM7O0FBRTNFOztBQUVQO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVCQUF1Qiw0RkFBMkI7QUFDbEQ7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDNUNvRjs7QUFFN0U7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0JBQXNCLDhGQUE0QjtBQUNsRDtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDekIwRTtBQUN6Qjs7QUFFMUM7O0FBRVA7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSx1QkFBdUIsMkRBQVc7QUFDbEM7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsb0ZBQXVCO0FBQzlDO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ2xIaUQ7O0FBRTFDOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3QkFBd0IsMkRBQVc7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3QkFBd0IsMkRBQVc7O0FBRW5DO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDbEZPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzVJTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDbEJPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCLHdCQUF3Qjs7QUFFbkQ7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVOztBQUVWOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNoR087O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMxQk87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNaTzs7QUFFUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGtEQUFrRCwwQkFBMEI7QUFDNUUsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSwyQ0FBMkMsWUFBWSxJQUFJLFlBQVk7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QixvQkFBb0IsZUFBZTtBQUNuQyxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixXQUFXO0FBQzlCLG9CQUFvQixlQUFlO0FBQ25DLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLDRCQUE0QjtBQUN0RSwwQ0FBMEMsNEJBQTRCO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQzVOTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxNQUFNLE1BQU07O0FBRXJCOztBQUVBLG9CQUFvQjs7QUFFcEI7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBOztBQUVBOztBQUVBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsMkJBQTJCO0FBQ2xFLHVDQUF1QywyQkFBMkI7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHNDQUFzQztBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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Q2xCO0FBQ1E7QUFDVTtBQUNRO0FBQ0Y7QUFDbEM7QUFDTTtBQUNGO0FBQ1U7QUFDZTtBQUNUOztBQUV2RTs7QUFFQSw4QkFBOEIsNkVBQWlCOztBQUUvQyx3QkFBd0IsbUVBQVk7O0FBRXBDLHFCQUFxQiw2REFBUzs7QUFFOUIsNkVBQWdCO0FBQ2hCLDZFQUFnQjtBQUNoQiw2RUFBZ0I7O0FBRWhCLHlGQUFzQiwyQkFBMkIsbUVBQVU7QUFDM0QseUZBQXNCLHdCQUF3Qiw2REFBTzs7QUFFckQsNkVBQWlCLHFCQUFxQixtRUFBWTtBQUNsRCw2RUFBaUIsNkJBQTZCLG1GQUFvQjs7QUFFbEUsd0NBQXdDLHVFQUFhO0FBQ3JELDRDQUE0QywrRUFBaUI7QUFDN0QsaURBQWlELHlGQUFzQjtBQUN2RSx3Q0FBd0MsaUdBQXFCO0FBQzdELHVDQUF1QywrRkFBb0I7QUFDM0QscURBQXFELDRGQUFxQiIsInNvdXJjZXMiOlsid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvRmlsZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvU2V0dGluZ3NDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL1Zpc3VhbGl6YXRpb25Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9DU1ZTZXR0aW5nc0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvZmlsZV90eXBlL0ZJVFNTZXR0aW5nc0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvaW5wdXRzL0FyaXRobWV0aWNDb2x1bW5JbnB1dC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvUmVnaXN0cnlDb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb250YWluZXJzL1NldHRpbmdzQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZGF0YV9wcm9jZXNzb3JzL0RhdGFQcmVQcm9jZXNzb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9kYXRhX3Byb2Nlc3NvcnMvTGlnaHRDdXJ2ZVByb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2RhdGFfcHJvY2Vzc29ycy9TcGVjdHJ1bVByb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9FdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXJyb3JzL0hEVU5vdFRhYnVsYXJFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9JbnZhbGlkVVJMRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9lcnJvcnMvTm9FdmVudFN1YnNjcmliZXJFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9Ob0V2ZW50VG9EaXNwYXRjaEVycm9yLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL0FyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9ldmVudHMvRmlsZUxvYWRlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1NldHRpbmdzQ2hhbmdlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1Zpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9yZWdpc3RyaWVzL0N1c3RvbUNvbHVtblJlZ2lzdHJ5LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vcmVnaXN0cmllcy9FdmVudFN1YnNjcmliZXJzUmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3NldHRpbmdzL1NldHRpbmdzQ29uZmlndXJhdGlvbi5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3NldHRpbmdzL1Zpc3VhbGl6YXRpb25TZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3V0aWxzL0NvbHVtblV0aWxzLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdXRpbHMvRXhwcmVzc2lvblBhcnNlci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3V0aWxzL09iamVjdFV0aWxzLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdXRpbHMvU3RyaW5nVXRpbHMuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi92aXN1YWxpemF0aW9ucy9Cb2tlaEdyYXBoLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdmlzdWFsaXphdGlvbnMvRDNHcmFwaC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3dyYXBwZXJzL0Jva2VoV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3dyYXBwZXJzL0QzV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3dyYXBwZXJzL0ZJVFNSZWFkZXJXcmFwcGVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkFzdHJvdmlzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFzdHJvdmlzXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsImltcG9ydCB7V3JhcHBlckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lclwiO1xuaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuaW1wb3J0IHtGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9GaWxlUmVnaXN0cnlDaGFuZ2VFdmVudFwiO1xuaW1wb3J0IHtGSVRTU2V0dGluZ3NDb21wb25lbnR9IGZyb20gXCIuL2ZpbGVfdHlwZS9GSVRTU2V0dGluZ3NDb21wb25lbnRcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBzdGF0aWMgY29tcG9uZW50X2lkID0gXCJmaWxlX2NvbXBvbmVudFwiO1xuICAgIHN0YXRpYyBzZWxlY3RfZmlsZSA9IFwic2VsZWN0LWZpbGVcIjtcbiAgICBzdGF0aWMgaW5wdXRfZmlsZV91cmwgPSBcImZpbGUtaW5wdXQtdXJsXCI7XG4gICAgc3RhdGljIGlucHV0X2ZpbGVfbG9jYWwgPSBcImZpbGUtaW5wdXQtbG9jYWxcIjtcbiAgICBzdGF0aWMgaW5wdXRfZmlsZV90eXBlID0gXCJzZWxlY3QtZmlsZS10eXBlXCI7XG4gICAgc3RhdGljIGxvYWRfYnV0dG9uID0gXCJsb2FkLWZpbGVcIjtcblxuICAgIHN0YXRpYyBhdmFpbGFibGVfZmlsZXNfbGlzdF9pZCA9ICdhdmFpbGFibGUtZmlsZXMtbGlzdCc7XG4gICAgc3RhdGljIGN1cnJlbnRfZmlsZXNfbGlzdF9pZCA9ICdjdXJyZW50LWZpbGVzLWxpc3QnO1xuXG4gICAgc3RhdGljIGZpbGVfc2V0dGluZ3NfY29udGFpbmVyX2lkID0gJ2ZpbGUtc2V0dGluZ3MtY29udGFpbmVyJztcblxuICAgIHN0YXRpYyBzYXZlX2J1dHRvbl9pZCA9ICdzYXZlLWZpbGUtc2V0dGluZ3MnO1xuICAgIHN0YXRpYyBhZGRfYnV0dG9uX2lkID0gJ2FkZC10by1wbG90J1xuICAgIHN0YXRpYyByZW1vdmVfYnV0dG9uX2lkID0gJ3JlbW92ZS1mcm9tLXBsb3QnXG5cbiAgICBjb250YWluZXJfaWQ7XG4gICAgY29udGFpbmVyO1xuXG4gICAgZml0c19yZWFkZXJfd3JhcHBlciA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJfaWQgPSBjb250YWluZXJfaWQ7XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50ID0gdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3RDaGFuZ2VFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0Q2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVMb2FkRmlsZUV2ZW50ID0gdGhpcy5oYW5kbGVMb2FkRmlsZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUxvYWRlZEV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlTG9hZGVkRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCA9IHRoaXMuaGFuZGxlRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLl9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLl9zZXR1cElubmVyRWxlbWVudHNMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBfc2V0dXBFeHRlcm5hbExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmaXRzLWxvYWRlZCcsIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmaWxlLWxvYWRlZCcsIHRoaXMuaGFuZGxlRmlsZUxvYWRlZEV2ZW50KVxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbGUtcmVnaXN0cnktY2hhbmdlJywgdGhpcy5oYW5kbGVGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudClcbiAgICB9XG5cbiAgICBfc2V0dXBJbm5lckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3QtY2hhbmdlJywgdGhpcy5oYW5kbGVTZWxlY3RDaGFuZ2VFdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbG9hZC1maWxlJywgdGhpcy5oYW5kbGVMb2FkRmlsZUV2ZW50KTtcbiAgICB9XG5cbiAgICBfc2V0dXBJbm5lckVsZW1lbnRzTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLl9zZXRMb2FkTG9jYWxGaWxlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0RmlsZXNMaXN0c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIF9zZXRMb2FkTG9jYWxGaWxlQnV0dG9uTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBmaWxlX2lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5pbnB1dF9maWxlX2xvY2FsKTtcbiAgICAgICAgbGV0IHR5cGVfaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmlucHV0X2ZpbGVfdHlwZSk7XG5cbiAgICAgICAgbGV0IGZpbGVfdHlwZSA9IHR5cGVfaW5wdXQudmFsdWU7XG5cbiAgICAgICAgZmlsZV9pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgbGV0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXNbMF07XG5cbiAgICAgICAgICAgIGlmKGZpbGVfdHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgZmlsZS5hcnJheUJ1ZmZlcigpLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZml0c19yZWFkZXJfd3JhcHBlciA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLmluaXRpYWxpemVGcm9tQnVmZmVyKGFycmF5QnVmZmVyLCBmaWxlLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWFkaW5nIGZpbGUgYXMgQXJyYXlCdWZmZXI6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGZpbGVfdHlwZSA9PT0gJ2NzdicpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNzdl9maWxlID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgX3NldEZpbGVzTGlzdHNMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0X2F2YWlsYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuYXZhaWxhYmxlX2ZpbGVzX2xpc3RfaWQpO1xuICAgICAgICBsZXQgbGlzdF9jdXJyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5jdXJyZW50X2ZpbGVzX2xpc3RfaWQpO1xuXG4gICAgICAgIGxldCBidXR0b25zX2F2YWlsYWJsZSA9IGxpc3RfYXZhaWxhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgIGxldCBidXR0b25zX2N1cnJlbnQgPSBsaXN0X2N1cnJlbnQucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcblxuICAgICAgICBsZXQgYnV0dG9ucyA9IEFycmF5LmZyb20oYnV0dG9uc19hdmFpbGFibGUpLmNvbmNhdChBcnJheS5mcm9tKGJ1dHRvbnNfY3VycmVudCkpO1xuXG4gICAgICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgICAgIGxldCBhcmlhX2N1cnJlbnQgPSBidXR0b24uZ2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIpO1xuICAgICAgICAgICAgICAgIGlmIChhcmlhX2N1cnJlbnQgJiYgYXJpYV9jdXJyZW50ID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyRmlsZVNldHRpbmdzUGFuZWwoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwidHJ1ZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChidXR0b24uZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RmlsZVNldHRpbmdzUGFuZWwoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbnNfdG9fZmlsdGVyID0gQXJyYXkuZnJvbShidXR0b25zKTtcblxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZF9idXR0b25zID0gYnV0dG9uc190b19maWx0ZXIuZmlsdGVyKGxpc3RfYnV0dG9uID0+IGxpc3RfYnV0dG9uICE9PSBidXR0b24pO1xuXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRfYnV0dG9ucy5mb3JFYWNoKGZpbHRlcmVkX2J1dHRvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkX2J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRfYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50Jyk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRGaWxlU2V0dGluZ3NCdXR0b25zTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgc2F2ZV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LnNhdmVfYnV0dG9uX2lkKTtcbiAgICAgICAgbGV0IGFkZF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmFkZF9idXR0b25faWQpO1xuXG4gICAgICAgIHNhdmVfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWRkX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGxldCBmaWxlX2lkID0gYnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuXG4gICAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChmaWxlX2lkKTtcblxuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LmFkZFRvQ3VycmVudEZpbGVzKGZpbGUpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmxlRmlsZXNMaXN0KCk7XG5cbiAgICAgICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG4gICAgICAgICAgICBmcmNlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVGSVRTTG9hZGVkRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyID0gZXZlbnQuZGV0YWlsWydmaXRzX3JlYWRlcl93cmFwcGVyJ107XG4gICAgICAgIGxldCBmaWxlX3BhdGggPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0RmlsZVBhdGgoKTtcblxuICAgICAgICB0aGlzLl9hZGRGaWxlVG9TZWxlY3QoZmlsZV9wYXRoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVGaWxlTG9hZGVkRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmFkZFRvQXZhaWxhYmxlRmlsZXMoZXZlbnQuZGV0YWlsKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuICAgICAgICB0aGlzLl9zZXRGaWxlc0xpc3RzTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVBdmFpbGFibGVGaWxlc0xpc3QoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50RmlsZXNMaXN0KCk7XG5cbiAgICAgICAgdGhpcy5fc2V0RmlsZXNMaXN0c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGhhbmRsZUxvYWRGaWxlRXZlbnQoZXZlbnQpIHtcblxuICAgIH1cblxuICAgIHVwZGF0ZUZpbGVzTGlzdHMoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmxlRmlsZXNMaXN0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudEZpbGVzTGlzdCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUF2YWlsYWJsZUZpbGVzTGlzdCgpIHtcbiAgICAgICAgbGV0IGF2YWlsYWJsZV9maWxlc19saXN0X2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmF2YWlsYWJsZV9maWxlc19saXN0X2lkKTtcblxuICAgICAgICBhdmFpbGFibGVfZmlsZXNfbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2VsZW1lbnRzID0gdGhpcy5fY3JlYXRlRmlsZVNlbGVjdGlvbignYXZhaWxhYmxlJyk7XG5cbiAgICAgICAgZmlsZV9lbGVtZW50cy5mb3JFYWNoKChmaWxlX2VsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGF2YWlsYWJsZV9maWxlc19saXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZV9lbGVtZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVDdXJyZW50RmlsZXNMaXN0KCkge1xuICAgICAgICBsZXQgY3VycmVudF9maWxlc19saXN0X2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmN1cnJlbnRfZmlsZXNfbGlzdF9pZCk7XG5cbiAgICAgICAgY3VycmVudF9maWxlc19saXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGZpbGVfZWxlbWVudHMgPSB0aGlzLl9jcmVhdGVGaWxlU2VsZWN0aW9uKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgZmlsZV9lbGVtZW50cy5mb3JFYWNoKChmaWxlX2VsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRfZmlsZXNfbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGZpbGVfZWxlbWVudCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2xlYXJGaWxlU2V0dGluZ3NQYW5lbCgpIHtcbiAgICAgICAgbGV0IGZpbGVfc2V0dGluZ3NfY29tcG9uZW50X2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuZmlsZV9zZXR0aW5nc19jb250YWluZXJfaWQpO1xuICAgICAgICBmaWxlX3NldHRpbmdzX2NvbXBvbmVudF9jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuXG4gICAgc2V0RmlsZVNldHRpbmdzUGFuZWwoZmlsZSkge1xuICAgICAgICB0aGlzLmNsZWFyRmlsZVNldHRpbmdzUGFuZWwoKTtcblxuICAgICAgICBpZihmaWxlLnR5cGUgPT09ICdmaXRzJykge1xuXG4gICAgICAgICAgICBsZXQgaXNfY3VycmVudCA9IEZpbGVSZWdpc3RyeS5pc0ZpbGVDdXJyZW50KGZpbGUuaWQpO1xuXG4gICAgICAgICAgICBsZXQgZmlsZV9zZXR0aW5nc19jb21wb25lbnQgPSBuZXcgRklUU1NldHRpbmdzQ29tcG9uZW50KGZpbGUsIGlzX2N1cnJlbnQpO1xuXG4gICAgICAgICAgICBsZXQgZmlsZV9zZXR0aW5nc19jb21wb25lbnRfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5maWxlX3NldHRpbmdzX2NvbnRhaW5lcl9pZCk7XG4gICAgICAgICAgICBmaWxlX3NldHRpbmdzX2NvbXBvbmVudF9jb250YWluZXIuYXBwZW5kQ2hpbGQoZmlsZV9zZXR0aW5nc19jb21wb25lbnQpO1xuXG4gICAgICAgICAgICBmaWxlX3NldHRpbmdzX2NvbXBvbmVudC5zZXR1cENvbXBvbmVudCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfYWRkRmlsZVRvU2VsZWN0KGZpbGUpIHtcbiAgICAgICAgbGV0IGZpbGVfb3B0aW9uID0gdGhpcy5fY3JlYXRlU2VsZWN0T3B0aW9uKGZpbGUpO1xuICAgICAgICBsZXQgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5zZWxlY3RfZmlsZSk7XG5cbiAgICAgICAgc2VsZWN0LmFkZChmaWxlX29wdGlvbik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUZpbGVTZWxlY3Rpb24obGlzdCA9ICdhdmFpbGFibGUnKSB7XG4gICAgICAgIGxldCBmaWxlcztcblxuICAgICAgICBpZihsaXN0ID09PSAnYXZhaWxhYmxlJykge1xuICAgICAgICAgICAgZmlsZXMgPSBGaWxlUmVnaXN0cnkuZ2V0QXZhaWxhYmxlRmlsZXNMaXN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWxlcyA9IEZpbGVSZWdpc3RyeS5nZXRDdXJyZW50RmlsZXNMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VsZWN0aW9uX2VsZW1lbnRzID0gW107XG5cbiAgICAgICAgbGV0IGZpbGVfc2VsZWN0aW9uO1xuICAgICAgICBmaWxlcy5mb3JFYWNoKChhdmFpbGFibGVfZmlsZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbGVfdWlkID0gYXZhaWxhYmxlX2ZpbGUuaWQrJy4nK2F2YWlsYWJsZV9maWxlLmZpbGVfbmFtZTtcblxuICAgICAgICAgICAgZmlsZV9zZWxlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgZmlsZV9zZWxlY3Rpb24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIGZpbGVfc2VsZWN0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXZhaWxhYmxlLWZpbGUtc2VsZWN0aW9uIGxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tYWN0aW9uXCIpO1xuICAgICAgICAgICAgZmlsZV9zZWxlY3Rpb24uc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBhdmFpbGFibGVfZmlsZS5pZCk7XG4gICAgICAgICAgICBmaWxlX3NlbGVjdGlvbi50ZXh0Q29udGVudCA9IGZpbGVfdWlkO1xuXG4gICAgICAgICAgICBzZWxlY3Rpb25fZWxlbWVudHMucHVzaChmaWxlX3NlbGVjdGlvbik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbl9lbGVtZW50cztcbiAgICB9XG5cbiAgICBfY3JlYXRlU2VsZWN0T3B0aW9uKGZpbGVfcGF0aCkge1xuICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICBvcHRpb24udmFsdWUgPSBmaWxlX3BhdGg7XG4gICAgICAgIG9wdGlvbi50ZXh0ID0gZmlsZV9wYXRoO1xuXG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgfVxuXG4gICAgaGFuZGxlU2VsZWN0Q2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcl9pZClcbiAgICB9XG5cbiAgICByZXNldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG5cbn0iLCJpbXBvcnQge1NldHRpbmdzQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9TZXR0aW5nc0NvbnRhaW5lclwiO1xuaW1wb3J0IHtTZXR0aW5nc0NoYW5nZWRFdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9TZXR0aW5nc0NoYW5nZWRFdmVudFwiO1xuaW1wb3J0IHtWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL1Zpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnRcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7V3JhcHBlckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lclwiO1xuaW1wb3J0IHtDb2x1bW5VdGlsc30gZnJvbSBcIi4uL3V0aWxzL0NvbHVtblV0aWxzXCI7XG5pbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuaW1wb3J0IHtGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9GaWxlUmVnaXN0cnlDaGFuZ2VFdmVudFwiO1xuaW1wb3J0IHtDdXN0b21Db2x1bW5SZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvQ3VzdG9tQ29sdW1uUmVnaXN0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgY29udGFpbmVyX2lkO1xuICAgIGNvbnRhaW5lclxuXG4gICAgc3RhdGljIGNvbXBvbmVudF9pZCA9IFwic2V0dGluZ3NfY29tcG9uZW50XCI7XG4gICAgc3RhdGljIGNvbnRhaW5lcl9pZCA9IFwic2V0dGluZ3MtY29tcG9uZW50XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2xpYnJhcnlfaWQgPSBcInNlbGVjdC1saWJyYXJ5XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2RhdGFfdHlwZV9pZCA9IFwic2VsZWN0LWRhdGEtdHlwZVwiO1xuXG4gICAgc3RhdGljIGxpZ2h0X2N1cnZlX3NldHRpbmdzX2lkID0gXCJsaWdodC1jdXJ2ZS1zZXR0aW5nc1wiXG4gICAgc3RhdGljIHNwZWN0cnVtX3NldHRpbmdzX2lkID0gXCJzcGVjdHJ1bS1zZXR0aW5nc1wiXG5cbiAgICBzdGF0aWMgc2VsZWN0X2hkdXNfaWQgPSBcInNlbGVjdC1oZHVzXCI7XG5cbiAgICBzdGF0aWMgY2FsY3VsYXRpb25fcmFkaW9fY2xhc3MgPSBcImNhbGN1bGF0aW9uLXJhZGlvXCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2F4aXNfeF9pZCA9IFwic2VsZWN0LWF4aXMteFwiO1xuICAgIHN0YXRpYyBzZWxlY3RfYXhpc195X2lkID0gXCJzZWxlY3QtYXhpcy15XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2Vycm9yX2Jhcl94X2lkID0gXCJzZWxlY3QtYXhpcy14LWVycm9yLWJhclwiO1xuICAgIHN0YXRpYyBzZWxlY3RfZXJyb3JfYmFyX3lfaWQgPSBcInNlbGVjdC1heGlzLXktZXJyb3ItYmFyXCI7XG5cbiAgICBzdGF0aWMgc3VwcG9ydGVkX2RhdGFfdHlwZXMgPSBbJ2dlbmVyaWMnLCAnbGlnaHQtY3VydmUnLCAnc3BlY3RydW0nXTtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBudWxsO1xuICAgIHNldHRpbmdzX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IFNldHRpbmdzQ29tcG9uZW50LmNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QgPSBTZXR0aW5nc0NvbnRhaW5lci5nZXRTZXR0aW5nc0NvbnRhaW5lcigpLmdldFZpc3VhbGl6YXRpb25TZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50ID0gdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDb25maWd1cmF0aW9uRXZlbnQgPSB0aGlzLmhhbmRsZUNvbmZpZ3VyYXRpb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlTGlicmFyeUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlSERVc0NoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVIRFVzQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50ID0gdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQgPSB0aGlzLmhhbmRsZUFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBJbm5lckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIF9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpdHMtbG9hZGVkJywgdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbmZpZ3VyYXRpb24nLCB0aGlzLmhhbmRsZUNvbmZpZ3VyYXRpb25FdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1yZWdpc3RyeS1jaGFuZ2UnLCB0aGlzLmhhbmRsZUZpbGVDaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0LWxpYnJhcnktY2hhbmdlJywgdGhpcy5oYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdC1kYXRhLXR5cGUtY2hhbmdlJywgdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3QtaGR1cy1jaGFuZ2UnLCB0aGlzLmhhbmRsZUhEVXNDaGFuZ2VFdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uLWdlbmVyYXRlLWNsaWNrJywgdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdhcml0aG1ldGljLWNvbHVtbi1jaGFuZ2UnLCB0aGlzLmhhbmRsZUFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0TGlicmFyeUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdERhdGFUeXBlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLl9zZXRTZWxlY3RIRFVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0QXhpc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldEdlbmVyYXRlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0Q2FsY3VsYXRpb25SYWRpb0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGhhbmRsZUZJVFNMb2FkZWRFdmVudChldmVudCkge1xuICAgICAgICB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIgPSBldmVudC5kZXRhaWxbJ2ZpdHNfcmVhZGVyX3dyYXBwZXInXTtcblxuICAgICAgICBsZXQgaGR1cyA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRIRFVzKCk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdEhEVXMoaGR1cyk7XG5cbiAgICAgICAgaWYodGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmlzSERVVGFidWxhcihoZHVzWzBdLmluZGV4KSkge1xuICAgICAgICAgICAgbGV0IGhkdV9jb2x1bW5zX25hbWUgPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdXNbMF0uaW5kZXgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RBeGlzKGhkdV9jb2x1bW5zX25hbWUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0U2VsZWN0RXJyb3JCYXJzKGhkdV9jb2x1bW5zX25hbWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0RXJyb3JCYXJzKClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlQ29uZmlndXJhdGlvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uX29iamVjdCA9IGV2ZW50LmRldGFpbC5jb25maWd1cmF0aW9uX29iamVjdDtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzKGNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgIGxldCBzZXR0aW5nc19jaGFuZ2VkX2V2ZW50ID0gbmV3IFNldHRpbmdzQ2hhbmdlZEV2ZW50KHRoaXMuc2V0dGluZ3Nfb2JqZWN0KTtcbiAgICAgICAgc2V0dGluZ3NfY2hhbmdlZF9ldmVudC5kaXNwYXRjaCgpO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGFUeXBlQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxldCBkYXRhX3R5cGUgPSBldmVudC5kZXRhaWwuZGF0YV90eXBlO1xuXG4gICAgICAgIGlmKFNldHRpbmdzQ29tcG9uZW50LnN1cHBvcnRlZF9kYXRhX3R5cGVzLmluY2x1ZGVzKGRhdGFfdHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3NPYmplY3QoKTtcblxuICAgICAgICAgICAgc3dpdGNoKGRhdGFfdHlwZSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGlnaHQtY3VydmUnOlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5saWdodF9jdXJ2ZV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNwZWN0cnVtX3NldHRpbmdzX2lkKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3NwZWN0cnVtJzpcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc3BlY3RydW1fc2V0dGluZ3NfaWQpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5saWdodF9jdXJ2ZV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zcGVjdHJ1bV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQubGlnaHRfY3VydmVfc2V0dGluZ3NfaWQpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlSERVc0NoYW5nZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gZXZlbnQuZGV0YWlsLmhkdV9pbmRleDtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuaXNIRFVUYWJ1bGFyKGhkdV9pbmRleCkpIHtcbiAgICAgICAgICAgIGxldCBoZHVfY29sdW1uc19uYW1lID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbnNOYW1lRnJvbUhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RBeGlzKGhkdV9jb2x1bW5zX25hbWUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0U2VsZWN0RXJyb3JCYXJzKGhkdV9jb2x1bW5zX25hbWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0RXJyb3JCYXJzKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUdlbmVyYXRlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QucmVzZXQoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzT2JqZWN0KCk7XG5cbiAgICAgICAgbGV0IHZpc3VhbGl6YXRpb25fZ2VuZXJhdGlvbl9ldmVudCA9IG5ldyBWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KHRoaXMuc2V0dGluZ3Nfb2JqZWN0KTtcbiAgICAgICAgdmlzdWFsaXphdGlvbl9nZW5lcmF0aW9uX2V2ZW50LmRpc3BhdGNoKCk7XG5cbiAgICB9XG5cbiAgICBoYW5kbGVGaWxlQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRfZmlsZV9saXN0ID0gRmlsZVJlZ2lzdHJ5LmdldEN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVfbGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICBpZihmaWxlLnByb2R1Y3RfdHlwZSAhPT0gJ3NwZWN0cnVtJykge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGUoZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGVGcm9tRmlsZU9iamVjdChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZml0c19jb2x1bW5zID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX2NvbHVtbnMuZm9yRWFjaCgoZml0c19jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHsuLi5maXRzX2NvbHVtbiwgZmlsZV9pZDogZmlsZS5pZH07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZihmaWxlLnR5cGUgPT09ICdjc3YnKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sdW1uc19ieV9maWxlID0gY29sdW1ucy5yZWR1Y2UoKGFjYywgY29sdW1uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY1tjb2x1bW4uZmlsZV9pZF0pIHtcbiAgICAgICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBsZXQgc2VsZWN0X29wdGlvbnMgPSBbXTtcblxuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIGZvciAobGV0IGZpbGVfaWQgaW4gY29sdW1uc19ieV9maWxlKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uc19ieV9maWxlLmhhc093blByb3BlcnR5KGZpbGVfaWQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZmlsZV9pZCk7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfbmFtZSA9IGZpbGUuZmlsZV9uYW1lO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlLmZpbGUpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0X29wdGlvbnMucHVzaCh0aGlzLl9jcmVhdGVGaWxlQ29sdW1uc09wdGlvbnNHcm91cChjb2x1bW5zX2J5X2ZpbGVbZmlsZV9pZF0sIGZpbGVfbmFtZSwgJ29wdC1ncm91cCcsIGZydykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0R3JvdXBBeGlzKHNlbGVjdF9vcHRpb25zKTtcblxuICAgICAgICBzZWxlY3Rfb3B0aW9ucy51bnNoaWZ0KHRoaXMuX2NyZWF0ZUdlbmVyaWNDb2x1bW5PcHRpb25zR3JvdXAoKSk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdEdyb3VwRXJyb3JCYXJzKHNlbGVjdF9vcHRpb25zKTtcbiAgICB9XG5cbiAgICBoYW5kbGVBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGNvbHVtbnNfb3B0X2dyb3VwcyA9IHRoaXMuX2NyZWF0ZUNvbHVtbnNPcHRHcm91cHMoKTtcbiAgICAgICAgY29uc29sZS5sb2coY29sdW1uc19vcHRfZ3JvdXBzKTtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0R3JvdXBBeGlzKGNvbHVtbnNfb3B0X2dyb3Vwcyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpO1xuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJfaWQpXG4gICAgfVxuXG4gICAgX3Jlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RIRFVzKGhkdXMpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RIRFVzKCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9oZHVzX2lkKTtcblxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuX2NyZWF0ZUhEVXNPcHRpb25zKGhkdXMpO1xuXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHNlbGVjdC5hZGQob3B0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3Jlc2V0U2VsZWN0SERVcygpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9oZHVzX2lkKTtcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIF9jcmVhdGVIRFVzT3B0aW9ucyhIRFVzKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0gW107XG4gICAgICAgIGxldCBvcHRpb247XG5cbiAgICAgICAgSERVcy5mb3JFYWNoKGZ1bmN0aW9uKGhkdSwgaW5kZXgpIHtcbiAgICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgICAgIGlmKGluZGV4ID09PSAwKSBvcHRpb24uc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICd0cnVlJyk7XG5cbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGhkdS5pbmRleDtcbiAgICAgICAgICAgIG9wdGlvbi50ZXh0ID0gaGR1Lm5hbWU7XG5cbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIF9jcmVhdGVGaWxlQ29sdW1uc09wdGlvbnNHcm91cChmaWxlX2NvbHVtbnMsIGdyb3VwX25hbWUsIGdyb3VwX2NsYXNzLCBmaXRzX3JlYWRlcl93cmFwcGVyKSB7XG5cbiAgICAgICAgbGV0IG9wdF9ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRncm91cFwiKTtcbiAgICAgICAgb3B0X2dyb3VwLmxhYmVsID0gZ3JvdXBfbmFtZTtcbiAgICAgICAgb3B0X2dyb3VwLmNsYXNzTmFtZSArPSBncm91cF9jbGFzcztcblxuICAgICAgICBmaWxlX2NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgICAgIGxldCBoZHVfdHlwZSA9IGZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0SGVhZGVyQ2FyZFZhbHVlQnlOYW1lRnJvbUhEVShjb2x1bW4uaGR1X2luZGV4LCAnWFRFTlNJT04nKTtcbiAgICAgICAgICAgIGxldCBoZHVfZXh0bmFtZSA9IGZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0SGVhZGVyQ2FyZFZhbHVlQnlOYW1lRnJvbUhEVShjb2x1bW4uaGR1X2luZGV4LCAnRVhUTkFNRScpO1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBoZHVfdHlwZSsnLScraGR1X2V4dG5hbWUrJyAnK2NvbHVtbi5uYW1lO1xuXG4gICAgICAgICAgICBpZihjb2x1bW4uaXNfZnJvbV9oZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcoSEVBREVSKSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbHVtbi5pc19wcm9jZXNzZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24udGV4dCA9IG5hbWU7XG4gICAgICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gYCR7Y29sdW1uLmZyb21fZmlsZX0uJHtjb2x1bW4uaGR1X2luZGV4fSQke2NvbHVtbi5uYW1lfWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdGlvbi50ZXh0ID0gbmFtZTtcbiAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUgPSBgJHtjb2x1bW4uZmlsZV9pZH0uJHtjb2x1bW4uaGR1X2luZGV4fSQke2NvbHVtbi5uYW1lfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9wdF9ncm91cC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb3B0X2dyb3VwXG4gICAgfVxuXG4gICAgX2NyZWF0ZUdlbmVyaWNDb2x1bW5PcHRpb25zR3JvdXAoaXNfYXhpcyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBvcHRfZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0Z3JvdXBcIik7XG4gICAgICAgIG9wdF9ncm91cC5sYWJlbCA9IFwiR2VuZXJpYyBjb2x1bW5zXCI7XG4gICAgICAgIG9wdF9ncm91cC5jbGFzc05hbWUgKz0gXCJnZW5lcmljXCI7XG5cbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgb3B0aW9uLnRleHQgPSAnTm9uZSc7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGBub25lYDtcblxuICAgICAgICBpZighaXNfYXhpcykge1xuICAgICAgICAgICAgb3B0X2dyb3VwLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VzdG9tX2NvbHVtbnMgPSBDdXN0b21Db2x1bW5SZWdpc3RyeS5nZXRBdmFpbGFibGVDb2x1bW5zTGlzdCgpO1xuXG4gICAgICAgIGlmKGN1c3RvbV9jb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGN1c3RvbV9jb2x1bW5zLmZvckVhY2goKGN1c3RvbV9jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgICAgIG9wdGlvbi50ZXh0ID0gY3VzdG9tX2NvbHVtbi5leHByZXNzaW9uO1xuICAgICAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGN1c3RvbV9jb2x1bW4uZXhwcmVzc2lvbjtcblxuICAgICAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbHVtbi10eXBlXCIsIFwicHJvY2Vzc2VkXCIpO1xuXG4gICAgICAgICAgICAgICAgb3B0X2dyb3VwLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdF9ncm91cDtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0QXhpcyhjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0QXhpcygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfYXhpc194ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc195ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9heGlzID0gW3NlbGVjdF9heGlzX3gsIHNlbGVjdF9heGlzX3ldO1xuXG4gICAgICAgIGxldCBvcHRpb25zID0gdGhpcy5fY3JlYXRlQ29sdW1uc09wdGlvbnMoY29sdW1ucyk7XG5cbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgc2VsZWN0X2F4aXMuZm9yRWFjaChmdW5jdGlvbihzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xvbmVkX29wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmFkZChjbG9uZWRfb3B0aW9uKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RHcm91cEF4aXMoY29sdW1uc19vcHRncm91cCkge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3lfaWQpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfYXhpcyA9IFtzZWxlY3RfYXhpc194LCBzZWxlY3RfYXhpc195XTtcblxuICAgICAgICBjb2x1bW5zX29wdGdyb3VwLmZvckVhY2goKGNvbHVtbl9vcHRncm91cCkgPT4ge1xuICAgICAgICAgICAgc2VsZWN0X2F4aXMuZm9yRWFjaCgoc2VsZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRncm91cCA9IGNvbHVtbl9vcHRncm91cC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmFkZChjbG9uZWRfb3B0Z3JvdXApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIF9yZXNldFNlbGVjdEF4aXMoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc194ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc195ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2F4aXNfeC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2VsZWN0X2F4aXNfeS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0RXJyb3JCYXJzKGNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RFcnJvckJhcnMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl94X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJzID0gW3NlbGVjdF9lcnJvcl9iYXJfeCwgc2VsZWN0X2Vycm9yX2Jhcl95XTtcblxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuX2NyZWF0ZUNvbHVtbnNPcHRpb25zKGNvbHVtbnMpO1xuXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHNlbGVjdF9lcnJvcl9iYXJzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5hZGQoY2xvbmVkX29wdGlvbik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0R3JvdXBFcnJvckJhcnMoY29sdW1uc19vcHRncm91cCkge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEVycm9yQmFycygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl95ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl95X2lkKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2JhcnMgPSBbc2VsZWN0X2Vycm9yX2Jhcl94LCBzZWxlY3RfZXJyb3JfYmFyX3ldO1xuXG4gICAgICAgIGNvbHVtbnNfb3B0Z3JvdXAuZm9yRWFjaCgoY29sdW1uX29wdGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBzZWxlY3RfZXJyb3JfYmFycy5mb3JFYWNoKChzZWxlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xvbmVkX29wdGdyb3VwID0gY29sdW1uX29wdGdyb3VwLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZWxlY3QuYWRkKGNsb25lZF9vcHRncm91cCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIF9yZXNldFNlbGVjdEVycm9yQmFycygpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3lfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2VsZWN0X2Vycm9yX2Jhcl95LmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIF9jcmVhdGVDb2x1bW5zT3B0aW9ucyhjb2x1bW5zKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0gW107XG4gICAgICAgIGxldCBvcHRpb247XG5cbiAgICAgICAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbikge1xuXG4gICAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBjb2x1bW47XG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGNvbHVtbjtcblxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbHVtbnNPcHRHcm91cHMoKSB7XG5cbiAgICAgICAgbGV0IGN1cnJlbnRfZmlsZV9saXN0ID0gRmlsZVJlZ2lzdHJ5LmdldEN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVfbGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICBpZihmaWxlLnByb2R1Y3RfdHlwZSAhPT0gJ3NwZWN0cnVtJykge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGUoZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGVGcm9tRmlsZU9iamVjdChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZml0c19jb2x1bW5zID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX2NvbHVtbnMuZm9yRWFjaCgoZml0c19jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHsuLi5maXRzX2NvbHVtbiwgZmlsZV9pZDogZmlsZS5pZH07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZihmaWxlLnR5cGUgPT09ICdjc3YnKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sdW1uc19ieV9maWxlID0gY29sdW1ucy5yZWR1Y2UoKGFjYywgY29sdW1uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY1tjb2x1bW4uZmlsZV9pZF0pIHtcbiAgICAgICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBsZXQgc2VsZWN0X29wdGlvbnMgPSBbXTtcblxuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIGZvciAobGV0IGZpbGVfaWQgaW4gY29sdW1uc19ieV9maWxlKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uc19ieV9maWxlLmhhc093blByb3BlcnR5KGZpbGVfaWQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZmlsZV9pZCk7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfbmFtZSA9IGZpbGUuZmlsZV9uYW1lO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlLmZpbGUpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0X29wdGlvbnMucHVzaCh0aGlzLl9jcmVhdGVGaWxlQ29sdW1uc09wdGlvbnNHcm91cChjb2x1bW5zX2J5X2ZpbGVbZmlsZV9pZF0sIGZpbGVfbmFtZSwgJ29wdC1ncm91cCcsIGZydykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0X29wdGlvbnMudW5zaGlmdCh0aGlzLl9jcmVhdGVHZW5lcmljQ29sdW1uT3B0aW9uc0dyb3VwKHRydWUpKTtcblxuICAgICAgICByZXR1cm4gc2VsZWN0X29wdGlvbnM7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdExpYnJhcnlMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9saWJyYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2xpYnJhcnlfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9saWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC1saWJyYXJ5LWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBsaWJyYXJ5OiBzZWxlY3RfbGlicmFyeS52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2NoYW5nZV9ldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3REYXRhVHlwZUxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgc2VsZWN0X2RhdGFfdHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9kYXRhX3R5cGVfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9kYXRhX3R5cGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgY3VzdG9tX2NoYW5nZV9ldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0LWRhdGEtdHlwZS1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29tcG9zZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YV90eXBlOiBzZWxlY3RfZGF0YV90eXBlLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEhEVXNMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9oZHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2hkdXNfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9oZHVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC1oZHVzLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IHNlbGVjdF9oZHVzLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEF4aXNMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9heGlzX3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfYXhpc194X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9heGlzX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfYXhpc195X2lkKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl94X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2F4aXNfeC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbHVtbl9pZCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgICAgICBsZXQgZGF0YV90eXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2RhdGFfdHlwZV9pZCkudmFsdWU7XG5cbiAgICAgICAgICAgIGlmKGRhdGFfdHlwZSA9PT0gJ2xpZ2h0LWN1cnZlJykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbl9kZXNjcmlwdG9yID0gQ29sdW1uVXRpbHMuZ2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uX2lkKVxuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfb2JqZWN0ID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlX29iamVjdC5maWxlKTtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWU9IGZydy5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBpZihjb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnUkFURScgJiZcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uc19uYW1lLnNvbWUoY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW4ubmFtZS50b1VwcGVyQ2FzZSgpID09PSAnRVJST1InICYmIHBhcnNlSW50KGNvbHVtbi5oZHVfaW5kZXgpID09PSBwYXJzZUludChjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RfZXJyb3JfYmFyX3gub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yID0gQ29sdW1uVXRpbHMuZ2V0Q29sdW1uU2V0dGluZ3Mob3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgPT09IGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ID09PSBjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0VSUk9SJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihjb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVElNRScgJiZcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uc19uYW1lLnNvbWUoY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW4ubmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVElNRURFTCcgJiYgcGFyc2VJbnQoY29sdW1uLmhkdV9pbmRleCkgPT09IHBhcnNlSW50KGNvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleClcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcblxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHNlbGVjdF9lcnJvcl9iYXJfeC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IgPSBDb2x1bW5VdGlscy5nZXRDb2x1bW5TZXR0aW5ncyhvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgPT09IGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ID09PSBjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RJTUVERUwnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0X2Vycm9yX2Jhcl94LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIHNlbGVjdF9heGlzX3kuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5faWQgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgICAgICAgICAgbGV0IGRhdGFfdHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9kYXRhX3R5cGVfaWQpLnZhbHVlO1xuXG4gICAgICAgICAgICBpZihkYXRhX3R5cGUgPT09ICdsaWdodC1jdXJ2ZScpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fZGVzY3JpcHRvcj0gQ29sdW1uVXRpbHMuZ2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uX2lkKVxuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfb2JqZWN0ID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydz0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGZpbGVfb2JqZWN0LmZpbGUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbnNfbmFtZT0gZnJ3LmdldEFsbENvbHVtbnMoKTtcblxuICAgICAgICAgICAgICAgIGlmKGNvbHVtbl9kZXNjcmlwdG9yLmNvbHVtbl9uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdSQVRFJyAmJlxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zX25hbWUuc29tZShjb2x1bW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdFUlJPUicgJiYgcGFyc2VJbnQoY29sdW1uLmhkdV9pbmRleCkgPT09IHBhcnNlSW50KGNvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleClcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcblxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHNlbGVjdF9lcnJvcl9iYXJfeS5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IgPSBDb2x1bW5VdGlscy5nZXRDb2x1bW5TZXR0aW5ncyhvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuZmlsZV9pZCA9PT0gY29sdW1uX2Rlc2NyaXB0b3IuZmlsZV9pZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggPT09IGNvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnRVJST1InKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0X2Vycm9yX2Jhcl95LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGNvbHVtbl9kZXNjcmlwdG9yLmNvbHVtbl9uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUSU1FJyAmJlxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zX25hbWUuc29tZShjb2x1bW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUSU1FREVMJyAmJiBwYXJzZUludChjb2x1bW4uaGR1X2luZGV4KSA9PT0gcGFyc2VJbnQoY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4KVxuICAgICAgICAgICAgICAgICAgICB9KSkge1xuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oc2VsZWN0X2Vycm9yX2Jhcl95Lm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvciA9IENvbHVtblV0aWxzLmdldENvbHVtblNldHRpbmdzKG9wdGlvbi52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuZmlsZV9pZCA9PT0gY29sdW1uX2Rlc2NyaXB0b3IuZmlsZV9pZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggPT09IGNvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVElNRURFTCcpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RfZXJyb3JfYmFyX3kudmFsdWUgPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBfc2V0Q2FsY3VsYXRpb25SYWRpb0xpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHJhZGlvX2J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIFNldHRpbmdzQ29tcG9uZW50LmNhbGN1bGF0aW9uX3JhZGlvX2NsYXNzKTtcbiAgICAgICAgcmFkaW9fYnV0dG9ucy5mb3JFYWNoKHJhZGlvX2J1dHRvbiA9PiB7XG4gICAgICAgICAgICByYWRpb19idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldEdlbmVyYXRlQnV0dG9uTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBidXR0b25fZ2VuZXJhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLWdlbmVyYXRlJyk7XG5cbiAgICAgICAgYnV0dG9uX2dlbmVyYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgY3VzdG9tX2NoYW5nZV9ldmVudCA9IG5ldyBDdXN0b21FdmVudCgnYnV0dG9uLWdlbmVyYXRlLWNsaWNrJywge1xuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbXBvc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGN1c3RvbV9jaGFuZ2VfZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVTZXR0aW5ncyhjb25maWd1cmF0aW9uKSB7XG4gICAgICAgIGZvciAobGV0IFtzZXR0aW5nLCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNvbmZpZ3VyYXRpb24pKSB7XG5cbiAgICAgICAgICAgIGxldCBzZXR0aW5nX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZXR0aW5nKTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5nX2VsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMuZGlzcGxheSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ19lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU2V0dGluZ3NPYmplY3QoKSB7XG4gICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLl9leHRyYWN0Rm9ybVZhbHVlcygpO1xuXG4gICAgICAgIGxldCBsaWJyYXJ5ID0ge307XG4gICAgICAgIGxpYnJhcnkubGlicmFyeSA9IHZhbHVlc1snc2VsZWN0LWxpYnJhcnknXS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0TGlicmFyeVNldHRpbmdzKGxpYnJhcnkpO1xuXG4gICAgICAgIGxldCBoZHUgPSB7fTtcbiAgICAgICAgaGR1WydoZHVfaW5kZXgnXSA9IHZhbHVlc1snc2VsZWN0LWhkdXMnXS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0SERVc1NldHRpbmdzKGhkdSk7XG5cbiAgICAgICAgbGV0IGRhdGFfdHlwZSA9IHt9O1xuXG4gICAgICAgIGRhdGFfdHlwZS50eXBlID0gdmFsdWVzWydzZWxlY3QtZGF0YS10eXBlJ10udmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldERhdGFUeXBlU2V0dGluZ3MoZGF0YV90eXBlKTtcblxuICAgICAgICBpZih2YWx1ZXNbJ3NlbGVjdC1heGlzLXgnXSAmJiB2YWx1ZXNbJ3NlbGVjdC1heGlzLXknXSkge1xuICAgICAgICAgICAgbGV0IGF4aXMgPSB7fTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5zID0ge307XG4gICAgICAgICAgICBjb2x1bW5zLnggPSB7fTtcbiAgICAgICAgICAgIGNvbHVtbnMueSA9IHt9O1xuICAgICAgICAgICAgbGV0IHNjYWxlcyA9IHt9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZXNbJ3NlbGVjdC1heGlzLXgnXSk7XG5cbiAgICAgICAgICAgIGNvbHVtbnMueC5jb2x1bW5fdHlwZSA9ICdzdGFuZGFyZCc7XG4gICAgICAgICAgICBjb2x1bW5zLnkuY29sdW1uX3R5cGUgPSAnc3RhbmRhcmQnO1xuXG4gICAgICAgICAgICBpZih2YWx1ZXNbJ3NlbGVjdC1heGlzLXgnXS5jb2x1bW5fdHlwZSA9PT0gJ3Byb2Nlc3NlZCcpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLnguY29sdW1uX3R5cGUgPSAncHJvY2Vzc2VkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVzWydzZWxlY3QtYXhpcy15J10uY29sdW1uX3R5cGUgPT09ICdwcm9jZXNzZWQnKSB7XG4gICAgICAgICAgICAgICAgY29sdW1ucy55LmNvbHVtbl90eXBlID0gJ3Byb2Nlc3NlZCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXMueCA9IHZhbHVlc1snc2VsZWN0LWF4aXMteCddLnZhbHVlO1xuICAgICAgICAgICAgYXhpcy55ID0gdmFsdWVzWydzZWxlY3QtYXhpcy15J10udmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGF4aXMpO1xuXG4gICAgICAgICAgICBzY2FsZXMueCA9IHZhbHVlc1snc2VsZWN0LWF4aXMteC1zY2FsZSddLnZhbHVlO1xuICAgICAgICAgICAgc2NhbGVzLnkgPSB2YWx1ZXNbJ3NlbGVjdC1heGlzLXktc2NhbGUnXS52YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0QXhpc1NldHRpbmdzKGF4aXMpO1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0Q29sdW1uc1NldHRpbmdzKGNvbHVtbnMpO1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0U2NhbGVzU2V0dGluZ3Moc2NhbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHZhbHVlc1snaGFzLWVycm9yLWJhcnMtY2hlY2tib3gnXSkge1xuICAgICAgICAgICAgaWYodmFsdWVzWydoYXMtZXJyb3ItYmFycy1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFycyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgaWYodmFsdWVzWydzZWxlY3QtYXhpcy14LWVycm9yLWJhciddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFycy54ID0gdmFsdWVzWydzZWxlY3QtYXhpcy14LWVycm9yLWJhciddLnZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlcnJvcl9iYXJzLnhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZih2YWx1ZXNbJ3NlbGVjdC1heGlzLXktZXJyb3ItYmFyJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzLnkgPSB2YWx1ZXNbJ3NlbGVjdC1heGlzLXktZXJyb3ItYmFyJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGVycm9yX2JhcnMueVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldEVycm9yQmFyc1NldHRpbmdzKGVycm9yX2JhcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodmFsdWVzWydoYXMteC1yYW5nZS1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUgfHwgdmFsdWVzWydoYXMteS1yYW5nZS1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHtcbiAgICAgICAgICAgICAgICB4OiB7fSxcbiAgICAgICAgICAgICAgICB5OiB7fVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYodmFsdWVzWydoYXMteC1yYW5nZS1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3gnXS5sb3dlcl9ib3VuZCA9IHZhbHVlc1sneC1sb3dlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneCddLnVwcGVyX2JvdW5kID0gdmFsdWVzWyd4LWhpZ2hlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3gnXSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlc1snaGFzLXktcmFuZ2UtY2hlY2tib3gnXS5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWyd5J10ubG93ZXJfYm91bmQgPSB2YWx1ZXNbJ3ktbG93ZXItYm91bmQnXS52YWx1ZTtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3knXS51cHBlcl9ib3VuZCA9IHZhbHVlc1sneS1oaWdoZXItYm91bmQnXS52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWyd5J10gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRSYW5nZXNTZXR0aW5ncyhyYW5nZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0UmFuZ2VzU2V0dGluZ3MobnVsbCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9leHRyYWN0Rm9ybVZhbHVlcygpIHtcblxuICAgICAgICBsZXQgZm9ybV92YWx1ZXMgPSB7fTtcblxuICAgICAgICBsZXQgc2VsZWN0cyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLXNlbGVjdCcpO1xuXG4gICAgICAgIHNlbGVjdHMuZm9yRWFjaChzZWxlY3QgPT4ge1xuICAgICAgICAgICAgbGV0IGlkID0gc2VsZWN0LmlkO1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBzZWxlY3QuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBzZWxlY3QudmFsdWU7XG5cbiAgICAgICAgICAgIGxldCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tzZWxlY3Quc2VsZWN0ZWRJbmRleF07XG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5fdHlwZSA9IFwic3RhbmRhcmRcIjtcbiAgICAgICAgICAgIGNvbHVtbl90eXBlID0gc2VsZWN0ZWRfb3B0aW9uLmRhdGFzZXQuY29sdW1uVHlwZTtcblxuICAgICAgICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUoc2VsZWN0LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKSAhPT0gJ25vbmUnICYmIHZhbHVlICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgdmFsdWUsIGNvbHVtbl90eXBlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGNoZWNrYm94ZXMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybS1jaGVja2JveCcpO1xuXG4gICAgICAgIGNoZWNrYm94ZXMuZm9yRWFjaChjaGVja2JveCA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpZCA9IGNoZWNrYm94LmlkO1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBjaGVja2JveC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCBjaGVja2VkID0gY2hlY2tib3guY2hlY2tlZDtcblxuICAgICAgICAgICAgZm9ybV92YWx1ZXNbaWRdID0ge2NsYXNzZXMsIGNoZWNrZWR9O1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgaW5wdXRzID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0taW5wdXQnKTtcblxuICAgICAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSBpbnB1dC5pZDtcbiAgICAgICAgICAgIGxldCBjbGFzc2VzID0gaW5wdXQuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICAgICAgZm9ybV92YWx1ZXNbaWRdID0ge2NsYXNzZXMsIHZhbHVlfTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZm9ybV92YWx1ZXM7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFZpc3VhbGl6YXRpb25Db21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBjb250YWluZXJfaWQ7XG4gICAgY29udGFpbmVyXG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IGNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcl9pZClcbiAgICB9XG5cbiAgICByZXNldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ1NWU2V0dGluZ3NDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlX2lkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtXcmFwcGVyQ29udGFpbmVyfSBmcm9tIFwiLi4vLi4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyXCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uLy4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50fSBmcm9tIFwiLi4vLi4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50XCI7XG5pbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgRklUU1NldHRpbmdzQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgY29udGFpbmVyX2lkID0gXCJmaXRzLXNldHRpbmdzLWNvbnRhaW5lclwiO1xuICAgIHNlbGVjdF9oZHVfaWQgPSBcInNlbGVjdC1oZHUtZmlsZVwiO1xuICAgIHRhYmxlX2hlYWRlcl9pZCA9IFwidGFibGUtaGVhZGVyLWRhdGFcIjtcbiAgICB0YWJsZV9kYXRhX2lkID0gXCJ0YWJsZS1kYXRhXCI7XG5cbiAgICBmaWxlID0gbnVsbDtcbiAgICBpc19jdXJyZW50ID0gZmFsc2U7XG5cbiAgICBhZGRfdG9fcGxvdF9idG5faWQgPSBcImFkZC10by1wbG90XCI7XG4gICAgcmVtb3ZlX2Zyb21fcGxvdF9idG5faWQgPSBcInJlbW92ZS1mcm9tLXBsb3RcIjtcbiAgICBzYXZlX2J0bl9pZCA9ICdzYXZlLWZpbGUtc2V0dGluZ3MnO1xuXG4gICAgcHJvZHVjdF90eXBlX3NlbGVjdF9pZCA9ICdwcm9kdWN0LXR5cGUtc2VsZWN0JztcbiAgICBhcmZfZmlsZV9zZWxlY3RfaWQgPSAnYXJmLWZpbGUtc2VsZWN0JztcbiAgICBybWZfZmlsZV9zZWxlY3RfaWQgPSAncm1mLWZpbGUtc2VsZWN0JztcblxuICAgIGNvbnRhaW5lciA9ICc8ZGl2IGlkPVwiZml0cy1zZXR0aW5ncy1jb250YWluZXJcIiBjbGFzcz1cImZ1bGwtd2lkdGgtY29sdW1uXCIgc3R5bGU9XCJncmlkLWNvbHVtbjogMSAvIHNwYW4gMjtcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JztcblxuICAgIHNlbGVjdF9oZHVfZmlsZSA9ICc8c2VsZWN0IGlkPVwic2VsZWN0LWhkdS1maWxlXCIgY2xhc3M9XCJmb3JtLXNlbGVjdFwiPjwvc2VsZWN0Pic7XG5cbiAgICBpbm5lcl9jb250YWluZXIgPSAnPGRpdiBjbGFzcz1cImlubmVyLXJvd1wiPjwvZGl2Pic7XG5cbiAgICBoZWFkZXJfY29sdW1uID0gJzxkaXYgY2xhc3M9XCJsZWZ0LWNvbHVtblwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+SGVhZGVyPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiaGVhZGVyLWhkdS1maWxlXCI+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG5cbiAgICB0YWJsZV9oZWFkZXIgPSAnPHRhYmxlIGlkPVwidGFibGUtaGVhZGVyLWRhdGFcIiBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj4nICtcbiAgICAgICAgJyAgICA8dGhlYWQ+JyArXG4gICAgICAgICcgICAgPHRyPicgK1xuICAgICAgICAnICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj4jPC90aD4nICtcbiAgICAgICAgJyAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+TmFtZTwvdGg+JyArXG4gICAgICAgICcgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlZhbHVlPC90aD4nICtcbiAgICAgICAgJyAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+Q29tbWVudDwvdGg+JyArXG4gICAgICAgICcgICAgPC90cj4nICtcbiAgICAgICAgJyAgICA8L3RoZWFkPicgK1xuICAgICAgICAnICAgIDx0Ym9keSBjbGFzcz1cInRhYmxlLWdyb3VwLWRpdmlkZXJcIj4nICtcbiAgICAgICAgJyAgICA8L3Rib2R5PicgK1xuICAgICAgICAnPC90YWJsZT4nXG5cbiAgICBkYXRhX2NvbHVtbiA9ICc8ZGl2IGNsYXNzPVwicmlnaHQtY29sdW1uXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5EYXRhPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+JyArXG4gICAgICAgICcgICA8ZGl2IGlkPVwiZGF0YS1oZHUtZmlsZVwiPicgK1xuICAgICAgICAnICAgPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuXG4gICAgdGFibGVfZGF0YSA9ICc8dGFibGUgaWQ9XCJ0YWJsZS1kYXRhXCIgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+JyArXG4gICAgICAgICcgICAgPHRoZWFkPicgK1xuICAgICAgICAnICAgICAgIDx0cj4nICtcbiAgICAgICAgJyAgICAgICA8L3RyPicgK1xuICAgICAgICAnICAgIDwvdGhlYWQ+JyArXG4gICAgICAgICcgICAgPHRib2R5IGNsYXNzPVwidGFibGUtZ3JvdXAtZGl2aWRlclwiPicgK1xuICAgICAgICAnICAgIDwvdGJvZHk+JyArXG4gICAgICAgICc8L3RhYmxlPidcblxuICAgIGJ0bl9zYXZlX3NldHRpbmdzID0gJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBpZD1cInNhdmUtZmlsZS1zZXR0aW5nc1wiPlNhdmUgY2hhbmdlczwvYnV0dG9uPic7XG4gICAgYnRuX2FkZF90b19wbG90ID0gJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBpZD1cImFkZC10by1wbG90XCI+QWRkIHRvIHBsb3Q8L2J1dHRvbj47J1xuICAgIGJ0bl9yZW1vdmVfZnJvbV9wbG90ID0gJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIGlkPVwicmVtb3ZlLWZyb20tcGxvdFwiPlJlbW92ZSBmcm9tIHBsb3Q8L2J1dHRvbj4nO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZSwgaXNfY3VycmVudCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgICAgIHRoaXMuaXNfY3VycmVudCA9IGlzX2N1cnJlbnQ7XG5cbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImZ1bGwtd2lkdGgtY29sdW1uXCIgc3R5bGU9XCJncmlkLWNvbHVtbjogMSAvIHNwYW4gMjtcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPkZpbGUgc2V0dGluZ3M8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj5cXG4nICtcbiAgICAgICAgICAgICcgPGxhYmVsIGZvcj1cInByb2R1Y3QtdHlwZS1zZWxlY3RcIj5Qcm9kdWN0IHR5cGUgOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAnIDxzZWxlY3QgaWQ9XCJwcm9kdWN0LXR5cGUtc2VsZWN0XCIgY2xhc3M9XCJmb3JtLXNlbGVjdFwiPjxvcHRpb24gc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiIHZhbHVlPVwibm9uZVwiPk5vbmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwibGlnaHRjdXJ2ZVwiPkxpZ2h0IEN1cnZlPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInNwZWN0cnVtXCI+U3BlY3RydW08L29wdGlvbj48L3NlbGVjdD4gJyArXG4gICAgICAgICAgICAnIDxsYWJlbCBmb3I9XCJwcm9kdWN0LXR5cGUtc2VsZWN0XCIgY2xhc3M9XCJzcGVjdHJ1bS1zZXR0aW5nc1wiPkFSRiBmaWxlIDogPC9sYWJlbD4nICtcbiAgICAgICAgICAgICcgPHNlbGVjdCBpZD1cImFyZi1maWxlLXNlbGVjdFwiIGNsYXNzPVwiZm9ybS1zZWxlY3Qgc3BlY3RydW0tc2V0dGluZ3NcIj48L3NlbGVjdD4nICtcbiAgICAgICAgICAgICcgPGxhYmVsIGZvcj1cInByb2R1Y3QtdHlwZS1zZWxlY3RcIiBjbGFzcz1cInNwZWN0cnVtLXNldHRpbmdzXCI+Uk1GIGZpbGUgOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAnIDxzZWxlY3QgaWQ9XCJybWYtZmlsZS1zZWxlY3RcIiBjbGFzcz1cImZvcm0tc2VsZWN0IHNwZWN0cnVtLXNldHRpbmdzXCI+PC9zZWxlY3Q+JyArXG4gICAgICAgICAgICAnIDxsYWJlbCBmb3I9XCJzZWxlY3QtaGR1LWZpbGVcIj5IRFUgOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdC1oZHUtZmlsZVwiIGNsYXNzPVwiZm9ybS1zZWxlY3RcIj5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXItcm93XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0LWNvbHVtblwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5IZWFkZXI8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXItaGR1LWZpbGVcIiBjbGFzcz1cImZpbGUtZGF0YS1jb250YWluZXJcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cInRhYmxlLWhlYWRlci1kYXRhXCIgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk5hbWU8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5WYWx1ZTwvdGg+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPkNvbW1lbnQ8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3M9XCJ0YWJsZS1ncm91cC1kaXZpZGVyXCI+XFxuJyArXG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHQtY29sdW1uXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPkRhdGE8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkYXRhLWhkdS1maWxlXCIgY2xhc3M9XCJmaWxlLWRhdGEtY29udGFpbmVyXCI+XFxuJyArXG4gICAgICAgICAgICAnPHRhYmxlIGlkPVwidGFibGUtZGF0YVwiIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICcgICAgICAgPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICAgIDwvdHI+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8L3RoZWFkPicgK1xuICAgICAgICAgICAgICAgICcgICAgPHRib2R5IGNsYXNzPVwidGFibGUtZ3JvdXAtZGl2aWRlclwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgPC90Ym9keT4nICtcbiAgICAgICAgICAgICAgICAnPC90YWJsZT4nK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgaWQ9XCJzYXZlLWZpbGUtc2V0dGluZ3NcIj5TYXZlIGNoYW5nZXM8L2J1dHRvbj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgaWQ9XCJhZGQtdG8tcGxvdFwiPkFkZCB0byBwbG90PC9idXR0b24+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgaWQ9XCJyZW1vdmUtZnJvbS1wbG90XCI+UmVtb3ZlIGZyb20gcGxvdDwvYnV0dG9uPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PidcblxuICAgIH1cblxuICAgIHNldHVwQ29tcG9uZW50KCkge1xuICAgICAgICB0aGlzLnNldEhEVVNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNldHVwQWN0aW9uQnV0dG9ucygpO1xuICAgICAgICB0aGlzLnNldFByb2R1Y3RTZXR0aW5ncygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfaGR1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zZWxlY3RfaGR1X2lkKTtcbiAgICAgICAgbGV0IGhkdV9pbmRleCA9IHNlbGVjdF9oZHUudmFsdWU7XG5cbiAgICAgICAgdGhpcy5zZXRUYWJsZXMoaGR1X2luZGV4KTtcblxuICAgICAgICB0aGlzLnNldHVwSW5uZXJFbGVtZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgc2V0SERVU2VsZWN0KCkge1xuXG4gICAgICAgIGxldCBzZWxlY3RfaGR1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zZWxlY3RfaGR1X2lkKTtcblxuICAgICAgICBzZWxlY3RfaGR1LmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgIGZydy5zZXRGaWxlKHRoaXMuZmlsZS5maWxlKTtcblxuICAgICAgICBsZXQgaGR1cyA9IGZydy5nZXRIRFVzKCk7XG5cbiAgICAgICAgbGV0IG9wdGlvbnMgPSBbXTtcbiAgICAgICAgaGR1cy5mb3JFYWNoKChoZHUpID0+IHtcbiAgICAgICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBoZHUuaW5kZXg7XG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGhkdS5uYW1lICsgJyAnICsgaGR1LmV4dG5hbWU7XG5cbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB9KVxuXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICBzZWxlY3RfaGR1LmFkZChvcHRpb24pO1xuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2V0dXBJbm5lckVsZW1lbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuc2V0SERVU2VsZWN0TGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRTYXZlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRQcm9kdWN0VHlwZVNlbGVjdExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0QVJGRmlsZVNlbGVjdExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0Uk1GRmlsZVNlbGVjdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgc2V0dXBBY3Rpb25CdXR0b25zKCkge1xuXG4gICAgICAgIGxldCBhZGRfdG9fcGxvdF9idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFkZF90b19wbG90X2J0bl9pZCk7XG4gICAgICAgIGxldCByZW1vdmVfZnJvbV9wbG90X2J0biAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnJlbW92ZV9mcm9tX3Bsb3RfYnRuX2lkKTtcblxuICAgICAgICBpZih0aGlzLmlzX2N1cnJlbnQpIHtcbiAgICAgICAgICAgIGFkZF90b19wbG90X2J0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgcmVtb3ZlX2Zyb21fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZF90b19wbG90X2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgcmVtb3ZlX2Zyb21fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZF90b19wbG90X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LmFkZFRvQ3VycmVudEZpbGVzKHRoaXMuZmlsZSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNfY3VycmVudCA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZnJjZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc3Vic3JpYmVycyBmb3IgZXZlbnQgOiBcIiArIEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q29udGFpbmVyRm9yQ3VycmVudEZpbGUoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZW1vdmVfZnJvbV9wbG90X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21DdXJyZW50RmlsZXModGhpcy5maWxlLmlkKTtcblxuICAgICAgICAgICAgdGhpcy5pc19jdXJyZW50ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZnJjZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc3Vic2NyaWJlcnMgZm9yIHNwZWNpZmllZCBldmVudCA6IFwiICsgRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzZXRDb250YWluZXJGb3JDdXJyZW50RmlsZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRQcm9kdWN0U2V0dGluZ3MoKSB7XG4gICAgICAgIGxldCBwcm9kdWN0X3R5cGUgPSBudWxsO1xuICAgICAgICBsZXQgcm1mX2ZpbGUgPSBudWxsO1xuICAgICAgICBsZXQgYXJmX2ZpbGUgPSBudWxsO1xuXG4gICAgICAgIGlmKHRoaXMuZmlsZS5wcm9kdWN0X3R5cGUpIHByb2R1Y3RfdHlwZSA9IHRoaXMuZmlsZS5wcm9kdWN0X3R5cGU7XG4gICAgICAgIGlmKHRoaXMuZmlsZS5ybWZfZmlsZSkgcm1mX2ZpbGUgPSB0aGlzLmZpbGUucm1mX2ZpbGU7XG4gICAgICAgIGlmKHRoaXMuZmlsZS5hcmZfZmlsZSkgYXJmX2ZpbGUgPSB0aGlzLmZpbGUuYXJmX2ZpbGU7XG5cbiAgICAgICAgdGhpcy5zZXRQcm9kdWN0VHlwZVNlbGVjdChwcm9kdWN0X3R5cGUpO1xuICAgICAgICB0aGlzLnNldFJNRkZpbGVTZWxlY3Qocm1mX2ZpbGUpO1xuICAgICAgICB0aGlzLnNldEFSRkZpbGVTZWxlY3QoYXJmX2ZpbGUpO1xuICAgIH1cblxuICAgIHNldFRhYmxlcyhoZHVfaW5kZXgpIHtcbiAgICAgICAgdGhpcy5yZXNldFRhYmxlcygpO1xuXG4gICAgICAgIGxldCB0YWJsZV9oZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhYmxlX2hlYWRlcl9pZCk7XG4gICAgICAgIGxldCB0YWJsZV9kYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YWJsZV9kYXRhX2lkKTtcblxuICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICBmcncuc2V0RmlsZSh0aGlzLmZpbGUuZmlsZSk7XG5cbiAgICAgICAgbGV0IGhkdV9jYXJkcyA9IGZydy5nZXRIZWFkZXJDYXJkc1ZhbHVlRnJvbUhEVShoZHVfaW5kZXgpXG5cbiAgICAgICAgbGV0IHRib2R5ID0gdGFibGVfaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG5cbiAgICAgICAgaGR1X2NhcmRzLmZvckVhY2goY2FyZCA9PiB7XG5cbiAgICAgICAgICAgIGxldCByb3cgPSB0Ym9keS5pbnNlcnRSb3coKTtcblxuICAgICAgICAgICAgbGV0IGluZGV4X2NlbGwgPSByb3cuaW5zZXJ0Q2VsbCgwKTtcbiAgICAgICAgICAgIGxldCBjYXJkX2NlbGwgPSByb3cuaW5zZXJ0Q2VsbCgxKTtcbiAgICAgICAgICAgIGxldCBuYW1lX2NlbGwgPSByb3cuaW5zZXJ0Q2VsbCgyKTtcbiAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvbl9jZWxsID0gcm93Lmluc2VydENlbGwoMyk7XG5cbiAgICAgICAgICAgIGluZGV4X2NlbGwudGV4dENvbnRlbnQgPSBjYXJkLmluZGV4O1xuICAgICAgICAgICAgY2FyZF9jZWxsLnRleHRDb250ZW50ID0gY2FyZC5jYXJkX25hbWU7XG4gICAgICAgICAgICBuYW1lX2NlbGwudGV4dENvbnRlbnQgPSBjYXJkLnZhbHVlO1xuICAgICAgICAgICAgZGVzY3JpcHRpb25fY2VsbC50ZXh0Q29udGVudCA9IGNhcmQuY29tbWVudDtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgaGR1X2NvbHVtbnNfbmFtZSA9IGZydy5nZXRDb2x1bW5zTmFtZUZyb21IRFUoaGR1X2luZGV4KTtcbiAgICAgICAgICAgIGxldCBoZHVfZGF0YSA9IGZydy5nZXRDb2x1bW5zSlNPTkRhdGFGcm9tSERVKGhkdV9pbmRleClcblxuICAgICAgICAgICAgbGV0IGhlYWRlcl9yb3cgPSB0YWJsZV9kYXRhLnRIZWFkLmluc2VydFJvdygpO1xuICAgICAgICAgICAgdGJvZHkgPSB0YWJsZV9kYXRhLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG5cbiAgICAgICAgICAgIGhkdV9jb2x1bW5zX25hbWUuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGhlYWRlcl9jZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJfY2VsbC50ZXh0Q29udGVudCA9IGNvbHVtbjtcbiAgICAgICAgICAgICAgICBoZWFkZXJfcm93LmFwcGVuZENoaWxkKGhlYWRlcl9jZWxsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBoZHVfZGF0YS5mb3JFYWNoKGRhdGFfcG9pbnQgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gdGJvZHkuaW5zZXJ0Um93KCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGFfcG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGFfcG9pbnQsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBkYXRhX3BvaW50W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiREFUQSBQQVJTSU5HIEVSUk9SXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRUYWJsZXMoKSB7XG4gICAgICAgIGxldCB0YWJsZV9oZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhYmxlX2hlYWRlcl9pZCk7XG4gICAgICAgIGxldCB0YWJsZV9kYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YWJsZV9kYXRhX2lkKTtcblxuICAgICAgICBsZXQgdGJvZHkgPSB0YWJsZV9oZWFkZXIucXVlcnlTZWxlY3RvcigndGJvZHknKTtcbiAgICAgICAgdGJvZHkuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgdGJvZHkgPSB0YWJsZV9kYXRhLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG4gICAgICAgIGxldCB0aGVhZCA9IHRhYmxlX2RhdGEucXVlcnlTZWxlY3RvcigndGhlYWQnKTtcblxuICAgICAgICB0Ym9keS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhlYWQuaW5uZXJIVE1MID0gJzx0cj48L3RyPic7XG4gICAgfVxuXG4gICAgc2V0SERVU2VsZWN0TGlzdGVuZXIoKSB7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zZWxlY3RfaGR1X2lkKTtcblxuICAgICAgICBzZWxlY3RfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGFibGVzKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgc2V0U2F2ZUJ1dHRvbkxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgc2F2ZV9zZXR0aW5nc19idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnNhdmVfYnRuX2lkKTtcblxuICAgICAgICBzYXZlX3NldHRpbmdzX2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3RfdHlwZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb2R1Y3RfdHlwZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgICAgICBpZihwcm9kdWN0X3R5cGVfc2VsZWN0LnZhbHVlID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJtZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucm1mX2ZpbGVfc2VsZWN0X2lkKTtcbiAgICAgICAgICAgICAgICBsZXQgYXJmX2ZpbGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcmZfZmlsZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHJtZl9maWxlX2lkID0gcm1mX2ZpbGVfc2VsZWN0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGxldCBhcmZfZmlsZV9pZCA9IGFyZl9maWxlX3NlbGVjdC52YWx1ZTtcblxuICAgICAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5zZXRGaWxlTWV0YWRhdGEodGhpcy5maWxlLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgIHJtZl9maWxlOiBybWZfZmlsZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgYXJmX2ZpbGU6IGFyZl9maWxlX2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHNldFByb2R1Y3RUeXBlU2VsZWN0KHZhbHVlID0gbnVsbCkge1xuICAgICAgICBsZXQgcHJvZHVjdF90eXBlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucHJvZHVjdF90eXBlX3NlbGVjdF9pZCk7XG5cbiAgICAgICAgaWYodmFsdWUpIHtcbiAgICAgICAgICAgIHByb2R1Y3RfdHlwZV9zZWxlY3QudmFsdWUgPSAnbm9uZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9kdWN0X3R5cGVfc2VsZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQcm9kdWN0VHlwZVNlbGVjdExpc3RlbmVyKCkge1xuICAgICAgICBsZXQgcHJvZHVjdF90eXBlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucHJvZHVjdF90eXBlX3NlbGVjdF9pZCk7XG5cbiAgICAgICAgcHJvZHVjdF90eXBlX3NlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmKHByb2R1Y3RfdHlwZV9zZWxlY3QudmFsdWUgPT09ICdzcGVjdHJ1bScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByb2R1Y3RTZXR0aW5nc1Zpc2liaWxpdHkoJ3NwZWN0cnVtJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYocHJvZHVjdF90eXBlX3NlbGVjdC52YWx1ZSA9PT0gJ2xpZ2h0Y3VydmUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9kdWN0U2V0dGluZ3NWaXNpYmlsaXR5KCdsaWdodGN1cnZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvZHVjdFNldHRpbmdzVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2V0Uk1GRmlsZVNlbGVjdCh2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgbGV0IHJtZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucm1mX2ZpbGVfc2VsZWN0X2lkKTtcblxuICAgICAgICBsZXQgZmlsZV9vcHRpb25zID0gdGhpcy5nZXRGaWxlc09wdGlvbnNMaXN0KCk7XG5cbiAgICAgICAgZmlsZV9vcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgcm1mX2ZpbGVfc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbilcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoIXZhbHVlKSB7XG4gICAgICAgICAgICBybWZfZmlsZV9zZWxlY3QudmFsdWUgPSAnbm9uZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBybWZfZmlsZV9zZWxlY3QudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFJNRkZpbGVTZWxlY3RMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHJtZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucm1mX2ZpbGVfc2VsZWN0X2lkKTtcblxuICAgIH1cblxuICAgIHNldEFSRkZpbGVTZWxlY3QodmFsdWUgPSBudWxsKSB7XG4gICAgICAgIGxldCBhcmZfZmlsZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFyZl9maWxlX3NlbGVjdF9pZCk7XG5cbiAgICAgICAgbGV0IGZpbGVfb3B0aW9ucyA9IHRoaXMuZ2V0RmlsZXNPcHRpb25zTGlzdCgpO1xuXG4gICAgICAgIGZpbGVfb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgIGFyZl9maWxlX3NlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKCF2YWx1ZSkge1xuICAgICAgICAgICAgYXJmX2ZpbGVfc2VsZWN0LnZhbHVlID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJmX2ZpbGVfc2VsZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRBUkZGaWxlU2VsZWN0TGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBhcmZfZmlsZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFyZl9maWxlX3NlbGVjdF9pZCk7XG5cbiAgICB9XG5cbiAgICBzZXRQcm9kdWN0U2V0dGluZ3NWaXNpYmlsaXR5KHNldHRpbmdzID0gbnVsbCkge1xuICAgICAgICBsZXQgcm1mX2ZpbGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ybWZfZmlsZV9zZWxlY3RfaWQpO1xuICAgICAgICBsZXQgYXJmX2ZpbGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcmZfZmlsZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgIHJtZl9maWxlX3NlbGVjdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBhcmZfZmlsZV9zZWxlY3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICBsZXQgc3BlY3RydW1fZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzcGVjdHJ1bS1zZXR0aW5ncycpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY3RydW1fZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNwZWN0cnVtX2VsZW1lbnRzW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZighc2V0dGluZ3MpIHtcblxuICAgICAgICB9IGVsc2UgaWYoc2V0dGluZ3MgPT09ICdzcGVjdHJ1bScpIHtcbiAgICAgICAgICAgIHJtZl9maWxlX3NlbGVjdC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGFyZl9maWxlX3NlbGVjdC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjdHJ1bV9lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNwZWN0cnVtX2VsZW1lbnRzW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoc2V0dGluZ3MgPT09ICdsaWdodGN1cnZlJykge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldENvbnRhaW5lckZvckN1cnJlbnRGaWxlKCkge1xuICAgICAgICB0aGlzLnNldHVwQ29tcG9uZW50KCk7XG4gICAgfVxuXG4gICAgZ2V0RmlsZXNPcHRpb25zTGlzdCgpIHtcbiAgICAgICAgbGV0IGZpbGVfb3B0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgZmlsZV9saXN0ID0gRmlsZVJlZ2lzdHJ5LmdldEFsbEZpbGVzKCk7XG5cbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9ICdub25lJztcbiAgICAgICAgb3B0aW9uLnRleHQgPSAnTm9uZSc7XG5cbiAgICAgICAgZmlsZV9vcHRpb25zLnB1c2gob3B0aW9uKTtcblxuICAgICAgICBmaWxlX2xpc3QuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gZmlsZS5pZDtcbiAgICAgICAgICAgIG9wdGlvbi50ZXh0ID0gZmlsZS5maWxlX25hbWU7XG5cbiAgICAgICAgICAgIGZpbGVfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGZpbGVfb3B0aW9ucztcbiAgICB9XG59IiwiaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuLi8uLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuaW1wb3J0IHtXcmFwcGVyQ29udGFpbmVyfSBmcm9tIFwiLi4vLi4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyXCI7XG5pbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuaW1wb3J0IHtBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnR9IGZyb20gXCIuLi8uLi9ldmVudHMvQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50XCI7XG5pbXBvcnQge0N1c3RvbUNvbHVtblJlZ2lzdHJ5fSBmcm9tIFwiLi4vLi4vcmVnaXN0cmllcy9DdXN0b21Db2x1bW5SZWdpc3RyeVwiO1xuXG5leHBvcnQgY2xhc3MgQXJpdGhtZXRpY0NvbHVtbklucHV0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgc3RhdGljIGNvbHVtbl9kaXNwbGF5X2lkID0gJ2NvbHVtbi1kaXNwbGF5LWxpc3QnO1xuICAgIHN0YXRpYyBjb2x1bW5fY3JlYXRlX2J1dHRvbl9pZCA9ICdjb2x1bW4tZWRpdC1idXR0b24nO1xuICAgIHN0YXRpYyBjb2x1bW5fbWFpbl9pbnB1dF9pZCA9ICdjb2x1bW4tbWFpbi1pbnB1dCc7XG4gICAgc3RhdGljIGNvbHVtbl9saXN0X2lkID0gJ2NvbHVtbi1pbnB1dC1saXN0JztcbiAgICBzdGF0aWMgaW5wdXRfZXhwcmVzc2lvbiA9ICdpbnB1dC1leHByZXNzaW9uJztcblxuICAgIHN0YXRpYyBidXR0b25fY29tbWFuZHMgPSBbJ0MnLCAnPC0tJywgJy0tPicsICdWJ11cblxuICAgIGNvbHVtbl9kaXNwbGF5ID0gXCI8dWwgaWQ9J2NvbHVtbi1kaXNwbGF5LWxpc3QnPjwvdWw+XCI7XG4gICAgY29sdW1uX2NyZWF0ZV9idXR0b24gPSBcIjxidXR0b24gaWQ9J2NvbHVtbi1lZGl0LWJ1dHRvbicgY2xhc3M9J2J0biBidG4tcHJpbWFyeSc+Q3JlYXRlIGNvbHVtbjwvYnV0dG9uPlwiO1xuICAgIGNvbHVtbl9tYWluX2lucHV0ID0gXCI8ZGl2IGlkPSdjb2x1bW4tbWFpbi1pbnB1dCc+XCIgK1xuICAgICAgICBcIjxkaXYgaWQ9J2lucHV0LWRpc3BsYXknPjxpbnB1dCBpZD0naW5wdXQtZXhwcmVzc2lvbicgdHlwZT0ndGV4dCc+PC9kaXY+XCIgK1xuICAgICAgICBcIjxkaXYgaWQ9J2lucHV0LWNvbnRhaW5lcicgY2xhc3M9J2NvbHVtbi1pbnB1dC1jb250YWluZXInPlwiICtcbiAgICAgICAgXCI8ZGl2IGlkPSdpbnB1dC1rZXlib2FyZCcgY2xhc3M9J2NvbHVtbi1pbnB1dC1rZXlib2FyZCc+XCIgK1xuICAgICAgICBcIjxkaXYgY2xhc3M9J2J1dHRvbi1ncmlkJz5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPis8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPi08L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPio8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPi88L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPC9kaXY+XCIgK1xuICAgICAgICBcIjxkaXYgY2xhc3M9J2J1dHRvbi1ncmlkJz5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPig8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPik8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPnBvdzIoKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+cG93MygpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdidXR0b24tZ3JpZCc+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5zcXJ0KCk8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPm1pbigpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5tYXgoKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+bWVhbigpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdidXR0b24tZ3JpZCc+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5sb2coKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+PC0tPC9idXR0b24+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz4tLT48L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1kYW5nZXInPkM8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zdWNjZXNzJz5WPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8L2Rpdj5cIiArXG4gICAgICAgIFwiPGRpdiBpZD0naW5wdXQtY29sdW1ucyc+XCIgK1xuICAgICAgICBcIjx1bCBpZD0nY29sdW1uLWlucHV0LWxpc3QnPjwvdWw+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8L2Rpdj5cIiArXG4gICAgICAgIFwiPC9kaXY+XCJcblxuICAgIGRpc3BsYXlfZm9ybXVsYSA9ICcnO1xuICAgIGlubmVyX2Zvcm11bGEgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy5jb2x1bW5fZGlzcGxheSArIHRoaXMuY29sdW1uX21haW5faW5wdXQgKyB0aGlzLmNvbHVtbl9jcmVhdGVfYnV0dG9uO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcblxuXG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1yZWdpc3RyeS1jaGFuZ2UnLCB0aGlzLmhhbmRsZUZpbGVDaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0Q3JlYXRlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIF9zZXRDcmVhdGVCdXR0b25MaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IGNyZWF0ZV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuY29sdW1uX2NyZWF0ZV9idXR0b25faWQpO1xuXG4gICAgICAgIGNyZWF0ZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGRpc3BsYXlfbWFpbl9pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5jb2x1bW5fbWFpbl9pbnB1dF9pZCk7XG4gICAgICAgICAgICBkaXNwbGF5X21haW5faW5wdXQuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGhhbmRsZUZpbGVDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBsZXQgY3VycmVudF9maWxlX2xpc3QgPSBGaWxlUmVnaXN0cnkuZ2V0Q3VycmVudEZpbGVzTGlzdCgpO1xuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX3Jlc2V0Q29sdW1uSW5wdXQoKTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVfbGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGUoZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICBsZXQgZml0c19jb2x1bW5zID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX2NvbHVtbnMuZm9yRWFjaCgoZml0c19jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHsuLi5maXRzX2NvbHVtbiwgZmlsZV9pZDogZmlsZS5pZH07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sdW1uc19ieV9maWxlID0gY29sdW1ucy5yZWR1Y2UoKGFjYywgY29sdW1uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY1tjb2x1bW4uZmlsZV9pZF0pIHtcbiAgICAgICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBsZXQgbGlfZ3JvdXBfbGlzdCA9IFtdO1xuXG4gICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgZm9yIChsZXQgZmlsZV9pZCBpbiBjb2x1bW5zX2J5X2ZpbGUpIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5zX2J5X2ZpbGUuaGFzT3duUHJvcGVydHkoZmlsZV9pZCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChmaWxlX2lkKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZV9uYW1lID0gZmlsZS5maWxlX25hbWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGZpbGUuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBsaV9ncm91cF9saXN0LnB1c2godGhpcy5jcmVhdGVDb2x1bW5zTGlzdChjb2x1bW5zX2J5X2ZpbGVbZmlsZV9pZF0sIGZydykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDb2x1bW5JbnB1dChsaV9ncm91cF9saXN0KTtcbiAgICAgICAgdGhpcy5fc2V0Q29sdW1uSW5wdXRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgbGV0IGlucHV0X2Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuaW5wdXRfZXhwcmVzc2lvbik7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ0MnOlxuICAgICAgICAgICAgICAgIGlucHV0X2Rpc3BsYXkudmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdWJzpcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBpbnB1dF9kaXNwbGF5LnZhbHVlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2x1bW5fcmVnaXN0cnkgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRDdXN0b21Db2x1bW5SZWdpc3RyeSgpO1xuICAgICAgICAgICAgICAgIGN1c3RvbV9jb2x1bW5fcmVnaXN0cnkuYWRkVG9BdmFpbGFibGVDb2x1bW5zKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIEN1c3RvbUNvbHVtblJlZ2lzdHJ5LmFkZFRvQXZhaWxhYmxlQ29sdW1ucyhjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb2x1bW5Ub0Rpc3BsYXkoaW5wdXRfZGlzcGxheS52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYWNjZSA9IG5ldyBBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQoKTtcbiAgICAgICAgICAgICAgICBhY2NlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzwtLSc6XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnLS0+JzpcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb2x1bW5zTGlzdChmaWxlX2NvbHVtbnMsIGZpdHNfcmVhZGVyX3dyYXBwZXIpIHtcblxuICAgICAgICBsZXQgbGlfZ3JvdXAgPSBbXTtcblxuICAgICAgICBmaWxlX2NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgICAgbGV0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXG4gICAgICAgICAgICBsZXQgaGR1X3R5cGUgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUoY29sdW1uLmhkdV9pbmRleCwgJ1hURU5TSU9OJyk7XG4gICAgICAgICAgICBsZXQgaGR1X2V4dG5hbWUgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUoY29sdW1uLmhkdV9pbmRleCwgJ0VYVE5BTUUnKTtcbiAgICAgICAgICAgIGxldCBuYW1lID0gaGR1X3R5cGUrJy0nK2hkdV9leHRuYW1lKycgJytjb2x1bW4ubmFtZTtcblxuICAgICAgICAgICAgaWYoY29sdW1uLmlzX2Zyb21faGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnKEhFQURFUiknO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb2x1bW4uaXNfcHJvY2Vzc2VkKSB7XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0gbmFtZTtcbiAgICAgICAgICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGFzZXQtaWQnLGAke2NvbHVtbi5mcm9tX2ZpbGV9LiR7Y29sdW1uLmhkdV9pbmRleH0kJHtjb2x1bW4ubmFtZX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0gbmFtZTtcbiAgICAgICAgICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLGAke2NvbHVtbi5maWxlX2lkfS4ke2NvbHVtbi5oZHVfaW5kZXh9JCR7Y29sdW1uLm5hbWV9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpX2dyb3VwLnB1c2gobGkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbGlfZ3JvdXA7XG4gICAgfVxuXG4gICAgc2V0Q29sdW1uSW5wdXQobGlfZ3JvdXBfbGlzdCkge1xuICAgICAgICBsZXQgdWxfY29sdW1ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5jb2x1bW5fbGlzdF9pZCk7XG5cbiAgICAgICAgbGlfZ3JvdXBfbGlzdC5mb3JFYWNoKChsaV9ncm91cCkgPT4ge1xuICAgICAgICAgICAgbGlfZ3JvdXAuZm9yRWFjaCgobGkpID0+IHtcbiAgICAgICAgICAgICAgICB1bF9jb2x1bW5zLmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgX3NldEtleWJvYXJkTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGl2LmJ1dHRvbi1ncmlkIGJ1dHRvbicpO1xuICAgICAgICBsZXQgaW5wdXRfZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5pbnB1dF9leHByZXNzaW9uKTtcblxuICAgICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSBidXR0b24udGV4dENvbnRlbnQ7XG5cbiAgICAgICAgICAgICAgICBpZighQXJpdGhtZXRpY0NvbHVtbklucHV0LmJ1dHRvbl9jb21tYW5kcy5pbmNsdWRlcyhvcGVyYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRfZGlzcGxheS52YWx1ZSArPSBvcGVyYXRvcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kKG9wZXJhdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3Jlc2V0Q29sdW1uSW5wdXQoKSB7XG4gICAgICAgIGxldCBjb2x1bW5fbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5jb2x1bW5fbGlzdF9pZCk7XG4gICAgICAgIGNvbHVtbl9saXN0LmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIF9zZXRDb2x1bW5JbnB1dExpc3RlbmVyKCkge1xuICAgICAgICBsZXQgbGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndWwjY29sdW1uLWlucHV0LWxpc3QgbGknKTtcbiAgICAgICAgbGV0IGlucHV0X2Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuaW5wdXRfZXhwcmVzc2lvbik7XG5cbiAgICAgICAgbGlzLmZvckVhY2goZnVuY3Rpb24obGkpIHtcbiAgICAgICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2lkID0gbGkuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgICAgIGlucHV0X2Rpc3BsYXkudmFsdWUgKz0gY29sdW1uX2lkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZENvbHVtblRvRGlzcGxheShleHByZXNzaW9uKSB7XG4gICAgICAgIGxldCBjb2x1bW5fZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5jb2x1bW5fZGlzcGxheV9pZCk7XG5cbiAgICAgICAgbGV0IGxpX2V4cHJlc3Npb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaV9leHByZXNzaW9uLmlubmVySFRNTCA9IGV4cHJlc3Npb24gKycgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCI+WDwvYnV0dG9uPic7XG4gICAgICAgIGxpX2V4cHJlc3Npb24uc2V0QXR0cmlidXRlKCdkYXRhLWNvbHVtbicsIGV4cHJlc3Npb24pO1xuXG4gICAgICAgIGNvbHVtbl9kaXNwbGF5LmFwcGVuZENoaWxkKGxpX2V4cHJlc3Npb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IERhdGFQcmVQcm9jZXNzb3IgfSBmcm9tICcuLi9kYXRhX3Byb2Nlc3NvcnMvRGF0YVByZVByb2Nlc3Nvci5qcydcbmltcG9ydCB7IExpZ2h0Q3VydmVQcm9jZXNzb3IgfSBmcm9tICcuLi9kYXRhX3Byb2Nlc3NvcnMvTGlnaHRDdXJ2ZVByb2Nlc3Nvci5qcydcbmltcG9ydCB7IFNwZWN0cnVtUHJvY2Vzc29yIH0gZnJvbSAnLi4vZGF0YV9wcm9jZXNzb3JzL1NwZWN0cnVtUHJvY2Vzc29yLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGF0YVByb2Nlc3NvckNvbnRhaW5lciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGdldERhdGFQcmVQcm9jZXNzb3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0YVByZVByb2Nlc3NvcigpO1xuICAgIH1cblxuICAgIGdldExpZ2h0Q3VydmVQcm9jZXNzb3IoZml0c19yZWFkZXJfd3JhcHBlciwgaGR1X2luZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlnaHRDdXJ2ZVByb2Nlc3NvcihmaXRzX3JlYWRlcl93cmFwcGVyLCBoZHVfaW5kZXgpO1xuICAgIH1cblxuICAgIGdldFNwZWN0cnVtUHJvY2Vzc29yKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNwZWN0cnVtUHJvY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0YVByb2Nlc3NvckNvbnRhaW5lcigpO1xuICAgIH1cblxufSIsImltcG9ydCB7IEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSB9IGZyb20gJy4uL3JlZ2lzdHJpZXMvRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5LmpzJ1xuaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuXG5leHBvcnQgY2xhc3MgUmVnaXN0cnlDb250YWluZXIge1xuXG4gICAgc3RhdGljIGZpbGVfcmVnaXN0cnkgPSBudWxsO1xuICAgIHN0YXRpYyBjb2x1bW5fcmVnaXN0cnkgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5KCk7XG4gICAgfVxuXG4gICAgZ2V0RmlsZVJlZ2lzdHJ5KCkge1xuICAgICAgICByZXR1cm4gUmVnaXN0cnlDb250YWluZXIuZmlsZV9yZWdpc3RyeTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RmlsZVJlZ2lzdHJ5KGZpbGVfcmVnaXN0cnkpIHtcbiAgICAgICAgUmVnaXN0cnlDb250YWluZXIuZmlsZV9yZWdpc3RyeSA9IGZpbGVfcmVnaXN0cnk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJlZ2lzdHJ5Q29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ2lzdHJ5Q29udGFpbmVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEN1c3RvbUNvbHVtblJlZ2lzdHJ5KGNvbHVtbl9yZWdpc3RyeSkge1xuICAgICAgICBSZWdpc3RyeUNvbnRhaW5lci5jb2x1bW5fcmVnaXN0cnkgPSBjb2x1bW5fcmVnaXN0cnk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEN1c3RvbUNvbHVtblJlZ2lzdHJ5KCkge1xuICAgICAgICByZXR1cm4gUmVnaXN0cnlDb250YWluZXIuY29sdW1uX3JlZ2lzdHJ5O1xuICAgIH1cblxufSIsImltcG9ydCB7IFZpc3VhbGl6YXRpb25TZXR0aW5ncyB9IGZyb20gJy4uL3NldHRpbmdzL1Zpc3VhbGl6YXRpb25TZXR0aW5ncy5qcydcbmltcG9ydCB7IFNldHRpbmdzQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3NldHRpbmdzL1NldHRpbmdzQ29uZmlndXJhdGlvbi5qcydcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29udGFpbmVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0VmlzdWFsaXphdGlvblNldHRpbmdzT2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFZpc3VhbGl6YXRpb25TZXR0aW5ncygpO1xuICAgIH1cblxuICAgIGdldFNldHRpbmdzQ29uZmlndXJhdGlvbk9iamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXR0aW5nc0NvbmZpZ3VyYXRpb24oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0U2V0dGluZ3NDb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0dGluZ3NDb250YWluZXIoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCb2tlaEdyYXBoIH0gZnJvbSAnLi4vdmlzdWFsaXphdGlvbnMvQm9rZWhHcmFwaCdcbmltcG9ydCB7IEQzR3JhcGggfSBmcm9tICcuLi92aXN1YWxpemF0aW9ucy9EM0dyYXBoJ1xuXG5leHBvcnQgY2xhc3MgVmlzdWFsaXphdGlvbkNvbnRhaW5lciB7XG5cbiAgICBzdGF0aWMgYm9rZWhfZ3JhcGggPSBudWxsO1xuICAgIHN0YXRpYyBkM19ncmFwaCA9IG51bGw7XG5cbiAgICBzdGF0aWMgdmlzdWFsaXphdGlvbl9jb250YWluZXIgPSAnI3Zpc3VhbGl6YXRpb24tY29udGFpbmVyJ1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0Qm9rZWhWaXN1YWxpemF0aW9uKGJva2VoX3Zpc3VhbGl6YXRpb24pIHtcbiAgICAgICAgVmlzdWFsaXphdGlvbkNvbnRhaW5lci5ib2tlaF92aXN1YWxpemF0aW9uID0gYm9rZWhfdmlzdWFsaXphdGlvbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RDNWaXN1YWxpemF0aW9uKGQzX3Zpc3VhbGl6YXRpb24pIHtcbiAgICAgICAgVmlzdWFsaXphdGlvbkNvbnRhaW5lci5kM192aXN1YWxpemF0aW9uID0gZDNfdmlzdWFsaXphdGlvbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Qm9rZWhWaXN1YWxpemF0aW9uKCkge1xuICAgICAgICBpZihWaXN1YWxpemF0aW9uQ29udGFpbmVyLmJva2VoX3Zpc3VhbGl6YXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBWaXN1YWxpemF0aW9uQ29udGFpbmVyLmJva2VoX3Zpc3VhbGl6YXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJva2VoR3JhcGgoVmlzdWFsaXphdGlvbkNvbnRhaW5lci52aXN1YWxpemF0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RDNWaXN1YWxpemF0aW9uKCkge1xuICAgICAgICBpZihWaXN1YWxpemF0aW9uQ29udGFpbmVyLmQzX3Zpc3VhbGl6YXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBWaXN1YWxpemF0aW9uQ29udGFpbmVyLmQzX3Zpc3VhbGl6YXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEQzR3JhcGgoVmlzdWFsaXphdGlvbkNvbnRhaW5lci52aXN1YWxpemF0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBGSVRTUmVhZGVyV3JhcHBlciB9IGZyb20gJy4uL3dyYXBwZXJzL0ZJVFNSZWFkZXJXcmFwcGVyLmpzJ1xuaW1wb3J0IHsgQm9rZWhXcmFwcGVyIH0gZnJvbSAnLi4vd3JhcHBlcnMvQm9rZWhXcmFwcGVyLmpzJ1xuaW1wb3J0IHsgRDNXcmFwcGVyIH0gZnJvbSAnLi4vd3JhcHBlcnMvRDNXcmFwcGVyLmpzJ1xuXG5leHBvcnQgY2xhc3MgV3JhcHBlckNvbnRhaW5lciB7XG5cbiAgICBzdGF0aWMgZml0c19yZWFkZXJfd3JhcHBlciA9IG51bGw7XG4gICAgc3RhdGljIGJva2VoX3dyYXBwZXIgPSBudWxsO1xuICAgIHN0YXRpYyBkM193cmFwcGVyID0gbnVsbDtcblxuICAgIHN0YXRpYyB2aXN1YWxpemF0aW9uX2NvbnRhaW5lciA9ICd2aXN1YWxpemF0aW9uLWNvbnRhaW5lcidcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHNldEZJVFNSZWFkZXJXcmFwcGVyKGZpdHNfcmVhZGVyX3dyYXBwZXIpIHtcbiAgICAgICAgV3JhcHBlckNvbnRhaW5lci5maXRzX3JlYWRlcl93cmFwcGVyID0gZml0c19yZWFkZXJfd3JhcHBlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0Qm9rZWhXcmFwcGVyKGJva2VoX3dyYXBwZXIpIHtcbiAgICAgICAgV3JhcHBlckNvbnRhaW5lci5ib2tlaF93cmFwcGVyID0gYm9rZWhfd3JhcHBlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RDNXcmFwcGVyKGQzX3dyYXBwZXIpIHtcbiAgICAgICAgV3JhcHBlckNvbnRhaW5lci5kM193cmFwcGVyID0gZDNfd3JhcHBlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RklUU1JlYWRlcldyYXBwZXIoKSB7XG4gICAgICAgIGlmKFdyYXBwZXJDb250YWluZXIuZml0c19yZWFkZXJfd3JhcHBlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFdyYXBwZXJDb250YWluZXIuZml0c19yZWFkZXJfd3JhcHBlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRklUU1JlYWRlcldyYXBwZXIoJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEJva2VoV3JhcHBlcigpIHtcbiAgICAgICAgaWYoV3JhcHBlckNvbnRhaW5lci5ib2tlaF93cmFwcGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gV3JhcHBlckNvbnRhaW5lci5ib2tlaF93cmFwcGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb2tlaFdyYXBwZXIoV3JhcHBlckNvbnRhaW5lci52aXN1YWxpemF0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RDNXcmFwcGVyKCkge1xuICAgICAgICBpZihXcmFwcGVyQ29udGFpbmVyLmQzX3dyYXBwZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBXcmFwcGVyQ29udGFpbmVyLmQzX3dyYXBwZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEQzV3JhcHBlcihXcmFwcGVyQ29udGFpbmVyLnZpc3VhbGl6YXRpb25fY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7V3JhcHBlckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lclwiO1xuaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuaW1wb3J0IHtTcGVjdHJ1bVByb2Nlc3Nvcn0gZnJvbSBcIi4vU3BlY3RydW1Qcm9jZXNzb3JcIjtcbmltcG9ydCB7RGF0YVByb2Nlc3NvckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lclwiO1xuaW1wb3J0IHtFeHByZXNzaW9uUGFyc2VyfSBmcm9tIFwiLi4vdXRpbHMvRXhwcmVzc2lvblBhcnNlclwiO1xuaW1wb3J0IHtDb2x1bW5VdGlsc30gZnJvbSBcIi4uL3V0aWxzL0NvbHVtblV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhUHJlUHJvY2Vzc29yIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0UHJvY2Vzc2VkRGF0YXNldChkYXRhc2V0X3NldHRpbmdzX29iamVjdCkge1xuICAgICAgICBsZXQgZGF0YXNldCA9IHt9O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdEQVRBUFJFUFJPQ0VTU09SJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0KTtcblxuICAgICAgICBkYXRhc2V0X3NldHRpbmdzX29iamVjdC5heGlzLmZvckVhY2goKGF4aXMpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQVhJU1wiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGF4aXMuZmlsZV9pZCk7XG5cbiAgICAgICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgIGlmKGF4aXMuZmlsZV9pZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfb2JqZWN0ID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGF4aXMuZmlsZV9pZCk7XG5cbiAgICAgICAgICAgICAgICAvL2xldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUoZmlsZV9vYmplY3QuZmlsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5fZGF0YTtcblxuICAgICAgICAgICAgaWYoZGF0YXNldF9zZXR0aW5nc19vYmplY3QuZGF0YV90eXBlLnR5cGUgPT09ICdzcGVjdHJ1bScgJiZcbiAgICAgICAgICAgICAgICBTcGVjdHJ1bVByb2Nlc3Nvci5wcm9jZXNzZWRfY29sdW1uc19uYW1lLmluY2x1ZGVzKGF4aXMuY29sdW1uX25hbWUpKSB7XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IHRoaXMuZ2V0U3BlY3RydW1Qcm9jZXNzZWRDb2x1bW4oYXhpcy5oZHVfaW5kZXgsIGF4aXMuY29sdW1uX25hbWUsIGZydyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoYXhpcy5jb2x1bW5fdHlwZSA9PT0gJ3Byb2Nlc3NlZCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2FycmF5ID0gW107XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBfY29sdW1uX2RhdGEgPSBbXTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3VzdG9tIENvbHVtblwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhheGlzKTtcblxuICAgICAgICAgICAgICAgIGxldCBleHByZXNzaW9uX2FycmF5ID0gdGhpcy5wYXJzZUNvbHVtbnNFeHByZXNzaW9uKGF4aXMuY29sdW1uX2V4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgIGxldCBvcGVyYXRvcl9hcnJheSA9IHRoaXMucGFyc2VDb2x1bW5zT3BlcmF0b3JzKGF4aXMuY29sdW1uX2V4cHJlc3Npb24pO1xuXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbl9hcnJheS5mb3JFYWNoKChvcGVyYW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9hcnJheS5wdXNoKENvbHVtblV0aWxzLmdldENvbHVtblNldHRpbmdzKG9wZXJhbmQpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbHVtbl9hcnJheSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuXG4gICAgICAgICAgICAgICAgY29sdW1uX2FycmF5LmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb2x1bW4pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sX2RhdGEgPSB0aGlzLmdldFByb2Nlc3NlZENvbHVtbkRhdGEoY29sdW1uLmZpbGVfaWQsIGNvbHVtbi5oZHVfaW5kZXgsIGNvbHVtbi5jb2x1bW5fbmFtZSwgZnJ3KTtcblxuICAgICAgICAgICAgICAgICAgICB0ZW1wX2NvbHVtbl9kYXRhLnB1c2goY29sX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZW1wX2NvbHVtbl9kYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZF9kYXRhID0gdGhpcy5nZXRDdXN0b21Db2x1bW5Qcm9jZXNzZWREYXRhKHRlbXBfY29sdW1uX2RhdGEsIG9wZXJhdG9yX2FycmF5KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0Q3VzdG9tQ29sdW1uUHJvY2Vzc2VkRGF0YSh0ZW1wX2NvbHVtbl9kYXRhLCBvcGVyYXRvcl9hcnJheSkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2Nlc3NlZF9kYXRhKTtcblxuICAgICAgICAgICAgICAgIGNvbHVtbl9kYXRhID0gcHJvY2Vzc2VkX2RhdGE7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSBmcncuZ2V0Q29sdW1uRGF0YUZyb21IRFUoYXhpcy5oZHVfaW5kZXgsIGF4aXMuY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbHVtbl9kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coY29sdW1uX2RhdGEpO1xuXG4gICAgICAgICAgICBheGlzLmRhdGEgPSBjb2x1bW5fZGF0YTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYXhpcy5kYXRhKTtcbiAgICAgICAgfSlcblxuICAgICAgICBpZihkYXRhc2V0X3NldHRpbmdzX29iamVjdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JfYmFycycpKSB7XG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzX29iamVjdC5lcnJvcl9iYXJzLmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfb2JqZWN0ID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGVycm9yX2Jhci5maWxlX2lkKTtcblxuICAgICAgICAgICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUoZmlsZV9vYmplY3QuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2RhdGE7XG5cbiAgICAgICAgICAgICAgICBpZihkYXRhc2V0X3NldHRpbmdzX29iamVjdC5kYXRhX3R5cGUudHlwZSA9PT0gJ3NwZWN0cnVtJyAmJlxuICAgICAgICAgICAgICAgICAgICBTcGVjdHJ1bVByb2Nlc3Nvci5wcm9jZXNzZWRfY29sdW1uc19uYW1lLmluY2x1ZGVzKGVycm9yX2Jhci5jb2x1bW5fbmFtZSkpIHtcblxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IHRoaXMuZ2V0U3BlY3RydW1Qcm9jZXNzZWRDb2x1bW4oZXJyb3JfYmFyLmhkdV9pbmRleCwgZXJyb3JfYmFyLmNvbHVtbl9uYW1lLCBmcncpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3JfYmFyLmNvbHVtbl9uYW1lID09PSBTcGVjdHJ1bVByb2Nlc3Nvci5FX01JRF9MT0cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbl9kYXRhLmZvckVhY2goY29sX2RhdGEgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IGZydy5nZXRDb2x1bW5EYXRhRnJvbUhEVShlcnJvcl9iYXIuaGR1X2luZGV4LCBlcnJvcl9iYXIuY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVycm9yX2Jhci5kYXRhID0gY29sdW1uX2RhdGE7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZGF0YXNldF9zZXR0aW5nc19vYmplY3QpO1xuXG4gICAgICAgIGRhdGFzZXQgPSBkYXRhc2V0X3NldHRpbmdzX29iamVjdDtcblxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhc2V0KTtcblxuICAgICAgICByZXR1cm4gZGF0YXNldDtcbiAgICB9XG5cbiAgICBkYXRhc2V0VG9KU09ORGF0YShkYXRhc2V0X3NldHRpbmdzX29iamVjdCkge1xuICAgICAgICBsZXQgcm93cyA9IFtdO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTiBEQVRBXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhc2V0X3NldHRpbmdzX29iamVjdCk7XG5cbiAgICAgICAgZGF0YXNldF9zZXR0aW5nc19vYmplY3QuYXhpcy5mb3JFYWNoKChheGlzKSA9PiB7XG5cbiAgICAgICAgICAgIGF4aXMuZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJvd3NbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvd3NbaW5kZXhdW2F4aXMuY29sdW1uX25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIGlmKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0Lmhhc093blByb3BlcnR5KCdlcnJvcl9iYXJzJykpIHtcbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXIuZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3dzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tpbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dzW2luZGV4XVtlcnJvcl9iYXIuY29sdW1uX25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBwcm9jZXNzRXJyb3JCYXJEYXRhSlNPTihkYXRhc2V0LCBheGlzLCBlcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coZXJyb3JfYmFycyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFzZXQpO1xuXG4gICAgICAgIGxldCBlcnJvcl9iYXJfeF92YWx1ZXMgPSBbXTtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X3ZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGxldCBheGlzX3ggPSBheGlzLng7XG4gICAgICAgIGxldCBheGlzX3kgPSBheGlzLnk7XG5cbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X2NvbHVtbiA9IGVycm9yX2JhcnMueTtcblxuICAgICAgICBsZXQgZXJyb3JfYmFyc19vYmplY3QgPSB7fTtcblxuICAgICAgICBkYXRhc2V0LmZvckVhY2goZnVuY3Rpb24oZGF0YXBvaW50KXtcblxuICAgICAgICAgICAgaWYoZXJyb3JfYmFycy54KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlhcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YXBvaW50W2F4aXNfeF0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yX2Jhcl94X2NvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyX3ggPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSAtIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSArIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJfeF92YWx1ZXMucHVzaChlcnJvcl9iYXJfeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMueSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJZXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFwb2ludFtheGlzX3hdKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcl9iYXJfeV9jb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl95ID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgLSBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFyX3lfdmFsdWVzLnB1c2goZXJyb3JfYmFyX3kpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoZXJyb3JfYmFycy54KSBlcnJvcl9iYXJzX29iamVjdC54ID0gZXJyb3JfYmFyX3hfdmFsdWVzO1xuICAgICAgICBpZihlcnJvcl9iYXJzLnkpIGVycm9yX2JhcnNfb2JqZWN0LnkgPSBlcnJvcl9iYXJfeV92YWx1ZXM7XG5cbiAgICAgICAgcmV0dXJuIGVycm9yX2JhcnNfb2JqZWN0O1xuICAgIH1cblxuICAgIGdldFByb2Nlc3NlZENvbHVtbkRhdGEoZmlsZV9pZCwgaGR1X2luZGV4LCBjb2x1bW5fbmFtZSwgZml0c19yZWFkZXJfd3JhcHBlcikge1xuICAgICAgICBsZXQgZmlsZV9vYmplY3QgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZmlsZV9pZCk7XG4gICAgICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIuc2V0RmlsZShmaWxlX29iamVjdC5maWxlKTtcblxuICAgICAgICBsZXQgY29sX2RhdGEgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbkRhdGFGcm9tSERVKGhkdV9pbmRleCwgY29sdW1uX25hbWUpO1xuXG4gICAgICAgIHJldHVybiBjb2xfZGF0YTtcbiAgICB9XG5cbiAgICBnZXRDdXN0b21Db2x1bW5Qcm9jZXNzZWREYXRhKG9wZXJhbmRzLCBvcGVyYXRvcnMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcblxuICAgICAgICBjb25zb2xlLmxvZyhvcGVyYW5kcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG9wZXJhdG9ycyk7XG5cbiAgICAgICAgbGV0IGV4cHJlc3Npb25fc3RyaW5nO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb3BlcmFuZHNbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGV4cHJlc3Npb25fc3RyaW5nID0gJyc7XG5cbiAgICAgICAgICAgIGV4cHJlc3Npb25fc3RyaW5nICs9IG9wZXJhbmRzWzBdW2ldO1xuXG4gICAgICAgICAgICBvcGVyYXRvcnMuZm9yRWFjaCgob3BlcmF0b3IsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbl9zdHJpbmcgKz0gb3BlcmF0b3IgKyBvcGVyYW5kc1tpbmRleCArIDFdW2ldO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgZGF0YS5wdXNoKGV2YWwoZXhwcmVzc2lvbl9zdHJpbmcpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZXhwcmVzc2lvbl9zdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBnZXRTcGVjdHJ1bVByb2Nlc3NlZENvbHVtbihoZHVfaW5kZXgsIGNvbHVtbl9uYW1lLCBmaXRzX3JlYWRlcl93cmFwcGVyKSB7XG4gICAgICAgIGxldCBwcm9jZXNzZWRfY29sdW1uID0gW107XG5cbiAgICAgICAgbGV0IHNwID0gRGF0YVByb2Nlc3NvckNvbnRhaW5lci5nZXREYXRhUHJvY2Vzc29yQ29udGFpbmVyKCkuZ2V0U3BlY3RydW1Qcm9jZXNzb3IoKTtcblxuICAgICAgICBsZXQgZV9taW5fY29sID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRDb2x1bW5EYXRhRnJvbUhEVShoZHVfaW5kZXgsIFwiRV9NSU5cIik7XG4gICAgICAgIGxldCBlX21heF9jb2wgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbkRhdGFGcm9tSERVKGhkdV9pbmRleCwgXCJFX01BWFwiKTtcblxuICAgICAgICBlX21pbl9jb2wuZm9yRWFjaCgoZV9taW4sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBwcm9jZXNzZWRfY29sdW1uLnB1c2goU3BlY3RydW1Qcm9jZXNzb3Iuc3BlY3RydW1fY29sX2Z1bmN0aW9uc1tjb2x1bW5fbmFtZV0oZV9taW4sIGVfbWF4X2NvbFtpbmRleF0pKTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcHJvY2Vzc2VkX2NvbHVtbjtcbiAgICB9XG5cbiAgICBwYXJzZUNvbHVtbnNFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcbiAgICAgICAgbGV0IGV4cHJlc3Npb25fcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcblxuICAgICAgICBsZXQgY29sdW1uc19hcnJheSA9IGV4cHJlc3Npb25fcGFyc2VyLnBhcnNlU3RhbmRhcmRFeHByZXNzaW9uT3BlcmFuZChleHByZXNzaW9uKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cHJlc3Npb24gcGFyc2luZ1wiKVxuICAgICAgICBjb25zb2xlLmxvZyhjb2x1bW5zX2FycmF5KTtcblxuICAgICAgICByZXR1cm4gY29sdW1uc19hcnJheTtcbiAgICB9XG5cbiAgICBwYXJzZUNvbHVtbnNPcGVyYXRvcnMoZXhwcmVzc2lvbikge1xuICAgICAgICBsZXQgZXhwcmVzc2lvbl9wYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuXG4gICAgICAgIGxldCBvcGVyYXRvcnNfYXJyYXkgPSBleHByZXNzaW9uX3BhcnNlci5wYXJzZVN0YW5kYXJkRXhwcmVzc2lvbk9wZXJhdG9ycyhleHByZXNzaW9uKTtcblxuICAgICAgICByZXR1cm4gb3BlcmF0b3JzX2FycmF5O1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2UocmFuZ2VzLCBkYXRhLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZGF0YSA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycyA9IHt9O1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeSA9IFtdO1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBbXTtcblxuICAgICAgICBkYXRhLmZvckVhY2goKGRhdGFfcG9pbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YV9wb2ludCk7XG4gICAgICAgICAgICBsZXQgeF9jb2x1bW4gPSBrZXlzWzBdO1xuICAgICAgICAgICAgbGV0IHlfY29sdW1uID0ga2V5c1sxXTtcblxuICAgICAgICAgICAgaWYgKHJhbmdlcy54ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV94ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YV9wb2ludFt4X2NvbHVtbl0gPj0gcmFuZ2VzLngubG93ZXJfYm91bmQgJiYgZGF0YV9wb2ludFt4X2NvbHVtbl0gPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRhdGFfcG9pbnRbeV9jb2x1bW5dID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnRbeV9jb2x1bW5dIDw9IHJhbmdlcy55LnVwcGVyX2JvdW5kKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZGF0YS5wdXNoKGRhdGFfcG9pbnQpO1xuICAgICAgICAgICAgICAgIGlmKGVycm9yX2JhcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Vycm9yX2Jhcl94LnB1c2goZXJyb3JfYmFycy54W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9lcnJvcl9iYXJfeS5wdXNoKGVycm9yX2JhcnMueVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoZXJyb3JfYmFycyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzLnggPSB0ZW1wX2Vycm9yX2Jhcl94O1xuICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycy55ID0gdGVtcF9lcnJvcl9iYXJfeTtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMgPSB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZGF0YSA9IHRlbXBfcHJvY2Vzc2VkX2RhdGE7XG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2VCb2tlaChyYW5nZXMsIGRhdGEsIGhhc19lcnJvcl9iYXJzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NlZF9kYXRhID0ge307XG4gICAgICAgIHByb2Nlc3NlZF9kYXRhLnggPSBbXTtcbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEueSA9IFtdXG5cbiAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnhfbG93ID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55X2xvdyA9IFtdO1xuICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEueV91cCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRlbXBfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF95ID0gW107XG5cbiAgICAgICAgZGF0YS54LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy54Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF94LnB1c2godGVtcF9kYXRhX29iamVjdCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZGF0YS55LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLnkudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF95LnB1c2godGVtcF9kYXRhX29iamVjdClcbiAgICAgICAgfSlcblxuICAgICAgICB0ZW1wX3guZm9yRWFjaCgoZGF0YV9wb2ludF94LCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YV9wb2ludF95ID0gdGVtcF95W2ldO1xuXG4gICAgICAgICAgICBpZihkYXRhX3BvaW50X3gubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnRfeS5tYXRjaF9yYW5nZV95ID09IDIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54LnB1c2goZGF0YV9wb2ludF94LnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55LnB1c2goZGF0YV9wb2ludF95LnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmKGhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfbG93LnB1c2goZGF0YS55X2xvd1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfdXAucHVzaChkYXRhLnlfdXBbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X2xvdy5wdXNoKGRhdGEueF9sb3dbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwLnB1c2goZGF0YS54X3VwW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBMaWdodEN1cnZlUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBoZWFkZXJfY2FyZHMgPSBbXG4gICAgICAgICdUSU1FUkVGJyxcbiAgICAgICAgJ1RJTUVERUwnLFxuICAgICAgICAnTUpEUkVGJyxcbiAgICAgICAgJ1RTVEFSVCcsXG4gICAgICAgICdUU1RPUCcsXG4gICAgICAgICdURUxBUFNFJyxcbiAgICAgICAgJ0VfTUlOJyxcbiAgICAgICAgJ0VfTUFYJyxcbiAgICAgICAgJ0VfVU5JVCddXG5cbiAgICBzdGF0aWMgY29sdW1uc19uYW1lcyA9IHtcbiAgICAgICAgdGltZTogJ1RJTUUnLFxuICAgICAgICB0aW1lZGVsOiAnVElNRURFTCcsXG4gICAgICAgIHJhdGU6ICdSQVRFJyxcbiAgICAgICAgZXJyb3I6ICdFUlJPUicsXG4gICAgICAgIGZyYWNleHA6ICdGUkFDRVhQJ1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5uaW5nX3R5cGVzID0ge1xuICAgICAgICAnVElNRV9CQVNFRCc6ICd0aW1lX2Jhc2VkJyxcbiAgICAgICAgJ0VRVUFMX0NPVU5UJzogJ2VxdWFsX2NvdW50J1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5fdmFsdWVfbWV0aG9kcyA9IFtcbiAgICAgICAgJ21lYW4nLFxuICAgICAgICAnd2VpZ2h0ZWRtZWFuJyxcbiAgICAgICAgJ21lZGlhbicsXG4gICAgICAgICd3bWVkaWFuJyxcbiAgICAgICAgJ3N0ZGRldicsXG4gICAgICAgICdtZWRkZXYnLFxuICAgICAgICAna3VydG9zaXMnLFxuICAgICAgICAnc2tld25lc3MnLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21pbicsXG4gICAgICAgICdzdW0nXG4gICAgXVxuXG4gICAgc3RhdGljIG1pbl9jb2x1bW5zX251bWJlciA9IDI7XG4gICAgc3RhdGljIG1hbmRhdG9yeV9jb2x1bW5zID0gWydSQVRFJ107XG4gICAgc3RhdGljIHJlcGxhY2VtZW50X2NvbHVtbnMgPSBbJ1RJTUVERUwnXTtcblxuICAgIGhkdTtcbiAgICBoZHVfaW5kZXggPSBudWxsO1xuXG4gICAgYmlubmluZ190eXBlO1xuICAgIG1ldGhvZDtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgaGVhZGVyX3ZhbHVlcyA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZml0c19yZWFkZXJfd3JhcHBlciwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuZml0c19yZWFkZXJfd3JhcHBlciA9IGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgICAgIHRoaXMuaGR1X2luZGV4ID0gaGR1X2luZGV4O1xuXG4gICAgICAgIHRoaXMuX3NldEhEVSgpO1xuICAgIH1cblxuICAgIF9zZXRIRFUoKSB7XG4gICAgICAgIHRoaXMuaGR1ID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhEVSh0aGlzLmhkdV9pbmRleCk7XG4gICAgfVxuXG4gICAgc2V0SERVKGhkdSwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuaGR1ID0gaGR1O1xuICAgICAgICB0aGlzLmhkdV9pbmRleCA9IGhkdV9pbmRleDtcbiAgICB9XG5cbiAgICBwcm9jZXNzRGF0YVJhd0pTT04oYXhpcywgZXJyb3JfYmFycyA9IG51bGwpIHtcbiAgICAgICAgLy9sZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCByYXdfZml0c19kYXRhID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldERhdGFGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcblxuICAgICAgICBsZXQgeDtcbiAgICAgICAgbGV0IHk7XG5cbiAgICAgICAgbGV0IHhfY29sdW1uID0gYXhpcy54O1xuICAgICAgICBsZXQgeV9jb2x1bW4gPSBheGlzLnk7XG5cbiAgICAgICAgcmF3X2ZpdHNfZGF0YS5nZXRDb2x1bW4oeF9jb2x1bW4sIGZ1bmN0aW9uKGNvbCl7eCA9IGNvbH0pO1xuICAgICAgICByYXdfZml0c19kYXRhLmdldENvbHVtbih5X2NvbHVtbiwgZnVuY3Rpb24oY29sKXt5ID0gY29sfSk7XG5cbiAgICAgICAgZGF0YS54ID0geDtcbiAgICAgICAgZGF0YS55ID0geTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgICAgIGxldCBkeTtcblxuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgICAgIGxldCBlcnJvcl9iYXJfeV9jb2x1bW4gPSBlcnJvcl9iYXJzLnk7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl95X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZHkgPSBjb2x9KTtcblxuICAgICAgICAgICAgZGF0YS5keSA9IGR5O1xuICAgICAgICAgICAgLy9kYXRhLnRpbWVkZWwgPSB0aGlzLmdldFRpbWVkZWwoZXJyb3JfYmFyX3hfY29sdW1uKTtcbiAgICAgICAgICAgIC8vZGF0YS50aW1lZGVsID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckZyb21IRFUodGhpcy5oZHVfaW5kZXgpLmdldChcIlRJTUVERUxcIik7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZGF0YS50aW1lZGVsID0gY29sfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhSlNPTihheGlzLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCBsaWdodF9jdXJ2ZV9kYXRhID0ge307XG5cbiAgICAgICAgaWYoIXRoaXMuX2NoZWNrQ29sdW1ucygpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaWdodF9jdXJ2ZV9kYXRhLm1haW4gPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc0pTT05EYXRhRnJvbUhEVSh0aGlzLmhkdV9pbmRleCk7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgbGlnaHRfY3VydmVfZGF0YS5lcnJvcl9iYXJzID0gdGhpcy5fcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGxpZ2h0X2N1cnZlX2RhdGEubWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlnaHRfY3VydmVfZGF0YTtcbiAgICB9XG5cbiAgICBfcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGRhdGEpIHtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X3ZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfdmFsdWVzID0gW107XG5cbiAgICAgICAgbGV0IGF4aXNfeCA9IGF4aXMueDtcbiAgICAgICAgbGV0IGF4aXNfeSA9IGF4aXMueTtcblxuICAgICAgICBsZXQgZXJyb3JfYmFyX3hfY29sdW1uID0gZXJyb3JfYmFycy54O1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfY29sdW1uID0gZXJyb3JfYmFycy55O1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhcG9pbnQpe1xuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94ID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm91bmQ6IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pIC0gcGFyc2VGbG9hdChkYXRhcG9pbnRbZXJyb3JfYmFyX3lfY29sdW1uXSksXG4gICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeF06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBsZXQgZXJyb3JfYmFyX3kgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc194XSkgLSBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeF9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSArIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICBbYXhpc195XTogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIGVycm9yX2Jhcl94X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl94KTtcbiAgICAgICAgICAgIGVycm9yX2Jhcl95X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl95KTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4ge3g6IGVycm9yX2Jhcl94X3ZhbHVlcywgeTogZXJyb3JfYmFyX3lfdmFsdWVzfVxuICAgIH1cblxuICAgIF9jaGVja0NvbHVtbnMocmVxdWlyZWRfbmJfY29sdW1ucykge1xuICAgICAgICBsZXQgaXNfY2hlY2tlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IGNvbHVtbnNfbnVtYmVyID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldE51bWJlck9mQ29sdW1uRnJvbUhEVSh0aGlzLmhkdV9pbmRleClcbiAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRDb2x1bW5zTmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgpXG5cbiAgICAgICAgaWYoY29sdW1uc19udW1iZXIgPCByZXF1aXJlZF9uYl9jb2x1bW5zIHx8ICFjb2x1bW5zX25hbWUuaW5jbHVkZXMoTGlnaHRDdXJ2ZVByb2Nlc3Nvci5jb2x1bW5zX25hbWVzLnJhdGUpKSB7XG4gICAgICAgICAgICBpc19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfY2hlY2tlZDtcbiAgICB9XG5cbiAgICBnZXRUaW1lZGVsKGVycm9yX2Jhcl94ID0gbnVsbCkge1xuICAgICAgICBsZXQgdGltZWRlbDtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKHRoaXMuaGR1X2luZGV4KS5pbmNsdWRlcyhcIlRJTUVERUxcIikpIHtcbiAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94LCBmdW5jdGlvbiAoY29sKSB7dGltZWRlbCA9IGNvbH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgICAgIHRpbWVkZWwgPSBoZWFkZXIuZ2V0KFwiVElNRURFTFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lZGVsO1xuICAgIH1cblxuICAgIF9nZXRWYWx1ZUZyb21IRFVIZWFkZXIoKSB7XG4gICAgICAgIGxldCBjYXJkX3ZhbHVlO1xuICAgICAgICBMaWdodEN1cnZlUHJvY2Vzc29yLmhlYWRlcl9jYXJkcy5mb3JFYWNoKChjYXJkX25hbWUpID0+IHtcbiAgICAgICAgICAgIGNhcmRfdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBjYXJkX3ZhbHVlID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgsIGNhcmRfbmFtZSlcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyX3ZhbHVlc1tjYXJkX25hbWVdID0gY2FyZF92YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRCaW5uaW5nVHlwZShiaW5uaW5nX3R5cGUpIHtcbiAgICAgICAgdGhpcy5iaW5uaW5nX3R5cGUgPSBiaW5uaW5nX3R5cGVcbiAgICB9XG5cbiAgICBzZXRCaW5WYWx1ZU1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuXG4gICAgZ2V0Qmluc0Zvck1ldGhvZChyYXRlX2NvbHVtbiwgZnJhY2V4cF9jb2x1bW4sIGJpbnMsIG1ldGhvZCkge1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2JpbnMgPSBbXTtcblxuICAgICAgICBiaW5zLmZvckVhY2goKGJpbikgPT4ge1xuICAgICAgICAgICAgbGV0IHRpbWVzID0gW107XG4gICAgICAgICAgICBsZXQgcmF0ZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCBmcmFjZXhwcyA9IFtdO1xuXG4gICAgICAgICAgICBiaW4uZm9yRWFjaCgoeyB0aW1lLCByYXRlLCBmcmFjZXhwIH0pID0+IHtcbiAgICAgICAgICAgICAgICB0aW1lcy5wdXNoKHRpbWUpO1xuICAgICAgICAgICAgICAgIHJhdGVzLnB1c2gocmF0ZSk7XG4gICAgICAgICAgICAgICAgZnJhY2V4cHMucHVzaChmcmFjZXhwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfbWF4ID0gTWF0aC5tYXgoLi4ucmF0ZXMpO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX21pbiA9IE1hdGgubWluKC4uLnJhdGVzKTtcbiAgICAgICAgICAgIGxldCBiaW5fcmF0ZV9tZWFuID0gcmF0ZXMucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApIC8gcmF0ZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX3N1bSA9IHJhdGVzLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB0b3RhbCArIHZhbHVlLCAwKTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWRfYmlucztcbiAgICB9XG5cbiAgICBnZXRSYXRlRnJhY2V4cFdlaWdodGVkTWVhbkJpbm5lZERhdGEocmF0ZV9jb2x1bW4sIGZyYWNleHBfY29sdW1uLCBiaW5fc2l6ZSkge1xuICAgICAgICBsZXQgbnVtX2RhdGFfcG9pbnRzID0gcmF0ZV9jb2x1bW4ubGVuZ3RoO1xuICAgICAgICBsZXQgbnVtX2JpbnMgPSBNYXRoLmNlaWwobnVtX2RhdGFfcG9pbnRzIC8gYmluX3NpemUpO1xuXG4gICAgICAgIGxldCBiaW5uZWRfcmF0ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9iaW5zOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydF9wb3MgPSBpICogYmluX3NpemU7XG4gICAgICAgICAgICBsZXQgZW5kX3BvcyA9IE1hdGgubWluKHN0YXJ0X3BvcyArIGJpbl9zaXplLCByYXRlX2NvbHVtbi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgd2VpZ2h0ZWRfc3VtID0gMDtcbiAgICAgICAgICAgIGxldCBudW1fZGF0YV9wb2ludHNfYmluID0gMDtcblxuICAgICAgICAgICAgZm9yKGxldCBqID0gc3RhcnRfcG9zOyBqIDwgZW5kX3BvczsgaisrKSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRfc3VtICs9IHJhdGVfY29sdW1uW2pdICogZnJhY2V4cF9jb2x1bW5bal07XG4gICAgICAgICAgICAgICAgbnVtX2RhdGFfcG9pbnRzX2JpbisrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfdmFsdWUgPSB3ZWlnaHRlZF9zdW0gLyBudW1fZGF0YV9wb2ludHNfYmluO1xuICAgICAgICAgICAgYmlubmVkX3JhdGVzLnB1c2goYmluX3JhdGVfdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpbm5lZF9yYXRlcztcbiAgICB9XG5cbiAgICBnZXRNZWRpYW5EYXRlKGRhdGVzKSB7XG4gICAgICAgIGxldCBzb3J0ZWRfZGF0ZXMgPSBkYXRlcy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgICAgbGV0IG1lZGlhbl9pbmRleCA9IE1hdGguZmxvb3Ioc29ydGVkX2RhdGVzLmxlbmd0aCAvIDIpO1xuXG4gICAgICAgIGlmIChzb3J0ZWRfZGF0ZXMubGVuZ3RoICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvcnRlZF9kYXRlc1ttZWRpYW5faW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREdXJhdGlvbkluU2Vjb25kcyh0aW1lX2NvbHVtbikge1xuICAgICAgICBsZXQgbG93ZXN0X3RpbWUgPSBNYXRoLm1pbiguLi50aW1lX2NvbHVtbik7XG4gICAgICAgIGxldCBoaWdoZXN0X3RpbWUgPSBNYXRoLm1heCguLi50aW1lX2NvbHVtbik7XG5cbiAgICAgICAgbGV0IGR1cmF0aW9uX3NlY29uZHMgPSAoaGlnaGVzdF90aW1lIC0gbG93ZXN0X3RpbWUpICogODY0MDA7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX3NlY29uZHM7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFNwZWN0cnVtUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBwcm9jZXNzZWRfY29sdW1uc19uYW1lID0gWydFX0hBTEZfV0lEVEgnLCAnRV9NSUQnLCAnRV9NSURfTE9HJ107XG5cbiAgICBzdGF0aWMgRF9FID0gJ0VfSEFMRl9XSURUSCc7XG4gICAgc3RhdGljIEVfTUlEID0gJ0VfTUlEJztcbiAgICBzdGF0aWMgRV9NSURfTE9HID0gJ0VfTUlEX0xPRyc7XG5cbiAgICBzdGF0aWMgc3BlY3RydW1fY29sX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgRV9IQUxGX1dJRFRIOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lIYWxmV2lkdGgsXG4gICAgICAgIEVfTUlEOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludCxcbiAgICAgICAgRV9NSURfTE9HOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludExvZyxcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vRF9FXG4gICAgc3RhdGljIGdldEVuZXJneUhhbGZXaWR0aChlX21pbiwgZV9tYXgpIHtcbiAgICAgICAgcmV0dXJuICgoZV9tYXggLSBlX21pbikgLyAyKTtcbiAgICB9XG5cbiAgICAvL0VfTUlEXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50KGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gKChlX21heCArIGVfbWluKSAvIDIpO1xuICAgIH1cblxuICAgIC8vRV9NSURfTE9HXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50TG9nKGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGVfbWF4ICogZV9taW4pO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBc3ltZXRyaWNFbmVyeUVycm9yQmFyKGVfbWluLCBlX21heCwgZV9taWQpIHtcbiAgICAgICAgbGV0IGVfZXJyb3JfdXAgPSBlX21heCAtIGVfbWlkO1xuICAgICAgICBsZXQgZV9lcnJvcl9kb3duID0gZV9taWQgLSBlX21pbjtcblxuICAgICAgICByZXR1cm4geydlX2Vycm9yX3VwJzogZV9lcnJvcl91cCwgJ2VfZXJyb3JfZG93bic6IGVfZXJyb3JfZG93bn07XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEV2ZW50Tm90Rm91bmRJblJlZ2lzdHJ5RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJFdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yXCI7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBIRFVOb3RUYWJ1bGFyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJIRFVOb3RUYWJ1bGFyRXJyb3JcIjtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEludmFsaWRVUkxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkludmFsaWRVUkxFcnJvclwiO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgTm9FdmVudFN1YnNjcmliZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIk5vRXZlbnRTdWJzY3JpYmVyRXJyb3JcIjtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIE5vRXZlbnRUb0Rpc3BhdGNoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJOb0V2ZW50VG9EaXNwYXRjaFwiO1xuICAgIH1cbn0iLCJpbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcImFyaXRobWV0aWMtY29sdW1uLWNoYW5nZVwiO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfaWQgPSAnanN2aXMtbWFpbic7XG4gICAgc3RhdGljIG1haW5fcm9vdF9lbGVtZW50ID0gbnVsbDtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGRldGFpbCA9IHt9LCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLmRldGFpbCA9IHsgLi4uZGV0YWlsIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvVGFyZ2V0KHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvTWFpblJvb3QoKSB7XG4gICAgICAgIGlmKEFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudC5tYWluX3Jvb3RfZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50Lm1haW5fcm9vdF9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCkge1xuICAgICAgICBsZXQgZXNyID0gUmVnaXN0cnlDb250YWluZXIuZ2V0UmVnaXN0cnlDb250YWluZXIoKS5nZXRFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKTtcbiAgICAgICAgbGV0IHN1YnNjcmliZXJzX2lkID0gZXNyLmdldFN1YnNjcmliZXJzRm9yRXZlbnQoQXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50Lm5hbWUpO1xuXG4gICAgICAgIGxldCBzdWJzY3JpYmVyX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICBzdWJzY3JpYmVyc19pZC5mb3JFYWNoKChzdWJzY3JpYmVyX2lkKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdWJzY3JpYmVyX2lkKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXJfZWxlbWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImltcG9ydCB7UmVnaXN0cnlDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uRXZlbnQge1xuXG4gICAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjb21wb3NlZDogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcImNvbmZpZ3VyYXRpb25cIjtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb25fb2JqZWN0LCBkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCwgLi4ueydjb25maWd1cmF0aW9uX29iamVjdCc6IGNvbmZpZ3VyYXRpb25fb2JqZWN0fX07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uQ29uZmlndXJhdGlvbkV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChDb25maWd1cmF0aW9uRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvU3Vic2NyaWJlcnMoKSB7XG4gICAgICAgIGxldCBlc3IgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRSZWdpc3RyeUNvbnRhaW5lcigpLmdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpO1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnNfaWQgPSBlc3IuZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChDb25maWd1cmF0aW9uRXZlbnQubmFtZSlcblxuICAgICAgICBsZXQgc3Vic2NyaWJlcl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgc3Vic2NyaWJlcnNfaWQuZm9yRWFjaCgoc3Vic2NyaWJlcl9pZCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3Vic2NyaWJlcl9pZCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZUxvYWRlZEV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHN0YXRpYyBuYW1lID0gXCJmaWxlLWxvYWRlZFwiO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfaWQgPSAnanN2aXMtbWFpbic7XG4gICAgc3RhdGljIG1haW5fcm9vdF9lbGVtZW50ID0gbnVsbDtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGRldGFpbCA9IHt9LCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLmRldGFpbCA9IHsgLi4uZGV0YWlsIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRmlsZUxvYWRlZEV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChGaWxlTG9hZGVkRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvVGFyZ2V0KHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvTWFpblJvb3QoKSB7XG4gICAgICAgIGlmKEZpbGVMb2FkZWRFdmVudC5tYWluX3Jvb3RfZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgRmlsZUxvYWRlZEV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUxvYWRlZEV2ZW50Lm1haW5fcm9vdF9pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9TdWJzY3JpYmVycygpIHtcbiAgICAgICAgbGV0IGVzciA9IFJlZ2lzdHJ5Q29udGFpbmVyLmdldFJlZ2lzdHJ5Q29udGFpbmVyKCkuZ2V0RXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5KCk7XG4gICAgICAgIGxldCBzdWJzY3JpYmVyc19pZCA9IGVzci5nZXRTdWJzY3JpYmVyc0ZvckV2ZW50KEZpbGVMb2FkZWRFdmVudC5uYW1lKVxuXG4gICAgICAgIGxldCBzdWJzY3JpYmVyX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICBzdWJzY3JpYmVyc19pZC5mb3JFYWNoKChzdWJzY3JpYmVyX2lkKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdWJzY3JpYmVyX2lkKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXJfZWxlbWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImltcG9ydCB7UmVnaXN0cnlDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5pbXBvcnQge05vRXZlbnRTdWJzY3JpYmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvTm9FdmVudFN1YnNjcmliZXJFcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQge1xuXG4gICAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjb21wb3NlZDogdHJ1ZVxuICAgIH07XG5cbiAgICBzdGF0aWMgbmFtZSA9IFwiZmlsZS1yZWdpc3RyeS1jaGFuZ2VcIjtcbiAgICBzdGF0aWMgbWFpbl9yb290X2lkID0gJ2pzdmlzLW1haW4nO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfZWxlbWVudCA9IG51bGw7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5uYW1lLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHRoaXMuZGV0YWlsLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9UYXJnZXQodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9NYWluUm9vdCgpIHtcbiAgICAgICAgaWYoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubWFpbl9yb290X2VsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubWFpbl9yb290X2lkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvU3Vic2NyaWJlcnMoKSB7XG4gICAgICAgIGxldCBlc3IgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRSZWdpc3RyeUNvbnRhaW5lcigpLmdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpO1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnNfaWQgPSBlc3IuZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5uYW1lKTtcblxuICAgICAgICBsZXQgc3Vic2NyaWJlcl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXJzX2lkLmZvckVhY2goKHN1YnNjcmliZXJfaWQpID0+IHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdWJzY3JpYmVyX2lkKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYoc3Vic2NyaWJlcnNfaWQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm9FdmVudFN1YnNjcmliZXJFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtOb0V2ZW50VG9EaXNwYXRjaEVycm9yfSBmcm9tIFwiLi4vZXJyb3JzL05vRXZlbnRUb0Rpc3BhdGNoRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ2hhbmdlZEV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IGZhbHNlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfTtcblxuICAgIHN0YXRpYyBuYW1lID0gXCJzZXR0aW5ncy1jaGFuZ2VkXCI7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nc19vYmplY3QsIGRldGFpbCA9IHt9LCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLmRldGFpbCA9IHsgLi4uZGV0YWlsLCAuLi57J3NldHRpbmdzX29iamVjdCc6IHNldHRpbmdzX29iamVjdH19O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLlNldHRpbmdzQ2hhbmdlZEV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChTZXR0aW5nc0NoYW5nZWRFdmVudC5uYW1lLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHRoaXMuZGV0YWlsLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKCkge1xuICAgICAgICBpZih0aGlzLmV2ZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE5vRXZlbnRUb0Rpc3BhdGNoRXJyb3IoXCJObyBldmVudCB0byBkaXNwYXRjaFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IE5vRXZlbnRUb0Rpc3BhdGNoRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL05vRXZlbnRUb0Rpc3BhdGNoRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQge1xuXG4gICAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjb21wb3NlZDogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcInZpc3VhbGl6YXRpb24tZ2VuZXJhdGlvblwiO1xuXG4gICAgZXZlbnQgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3Nfb2JqZWN0LCBkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCwgLi4ueydzZXR0aW5nc19vYmplY3QnOiBzZXR0aW5nc19vYmplY3R9fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0geyAuLi5WaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50Lm5hbWUsIHtcbiAgICAgICAgICAgIGRldGFpbDogdGhpcy5kZXRhaWwsXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goKSB7XG4gICAgICAgIGlmKHRoaXMuZXZlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTm9FdmVudFRvRGlzcGF0Y2hFcnJvcihcIk5vIGV2ZW50IHRvIGRpc3BhdGNoXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSBcIi4uL3V0aWxzL1N0cmluZ1V0aWxzXCI7XG5pbXBvcnQge0NvbHVtYlV0aWxzfSBmcm9tIFwiLi4vdXRpbHMvQ29sdW1uVXRpbHNcIjtcbmltcG9ydCB7QXJpdGhtZXRpY0NvbHVtbkNoYW5nZUV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL0FyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tQ29sdW1uUmVnaXN0cnkge1xuXG4gICAgc3RhdGljIGNvbHVtbnMgPSBbXTtcbiAgICBzdGF0aWMgY29sdW1uX2NvdW50ZXIgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXZhaWxhYmxlQ29sdW1uc0xpc3QoKSB7XG4gICAgICAgIEN1c3RvbUNvbHVtblJlZ2lzdHJ5LmNvbHVtbnMgPSBDdXN0b21Db2x1bW5SZWdpc3RyeS5jb2x1bW5zLmZpbHRlcihvYmogPT4gb2JqICE9PSB1bmRlZmluZWQpO1xuICAgICAgICByZXR1cm4gQ3VzdG9tQ29sdW1uUmVnaXN0cnkuY29sdW1ucztcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkVG9BdmFpbGFibGVDb2x1bW5zKGNvbHVtbl90b19hZGQpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IHsgLi4uY29sdW1uX3RvX2FkZCxcbiAgICAgICAgICAgIGlkOiBDdXN0b21Db2x1bW5SZWdpc3RyeS5jb2x1bW5fY291bnRlcixcbiAgICAgICAgfTtcblxuICAgICAgICBDdXN0b21Db2x1bW5SZWdpc3RyeS5jb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICBDdXN0b21Db2x1bW5SZWdpc3RyeS5jb2x1bW5fY291bnRlcisrO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmVGcm9tQXZhaWxhYmxlQ29sdW1ucyhjb2x1bW5faWQpIHtcbiAgICAgICAgQ3VzdG9tQ29sdW1uUmVnaXN0cnkuY29sdW1ucyA9IEN1c3RvbUNvbHVtblJlZ2lzdHJ5LmNvbHVtbnMuZmlsdGVyKGNvbHVtbiA9PiBjb2x1bW4uaWQgIT09IHBhcnNlSW50KGNvbHVtbl9pZCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb2x1bW5CeUlkKGNvbHVtbl9pZCkge1xuICAgICAgICBsZXQgY29sdW1uID0gbnVsbDtcbiAgICAgICAgY29sdW1uID0gQ3VzdG9tQ29sdW1uUmVnaXN0cnkuY29sdW1ucy5maWx0ZXIoY29sdW1uID0+IGNvbHVtbi5pZCA9PT0gcGFyc2VJbnQoY29sdW1uX2lkKSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2VuZFJlZ2lzdHJ5Q2hhbmdlRXZlbnQoKSB7XG4gICAgICAgIGxldCBhY2NlID0gbmV3IEFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudCgpO1xuICAgICAgICBhY2NlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgIH1cblxufSIsImltcG9ydCB7RXZlbnROb3RGb3VuZEluUmVnaXN0cnlFcnJvcn0gZnJvbSBcIi4uL2Vycm9ycy9FdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkge1xuXG4gICAgc3RhdGljIGV2ZW50c19zdWJzY3JpYmVycyA9IHtcbiAgICAgICAgJ2ZpdHMtbG9hZGVkJzogWydzZXR0aW5ncy1jb21wb25lbnQnLCAnZmlsZS1jb21wb25lbnQnXSxcbiAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBbJ3NldHRpbmdzLWNvbXBvbmVudCddLFxuICAgICAgICAnZmlsZS1sb2FkZWQnOiBbJ2ZpbGUtY29tcG9uZW50J10sXG4gICAgICAgICdmaWxlLXNlbGVjdGVkJzogWydzZXR0aW5ncy1jb21wb25lbnQnLCAnYXJpdGhtZXRpYy1jb2x1bW4tY29tcG9uZW50J10sXG4gICAgICAgICdmaWxlLXJlZ2lzdHJ5LWNoYW5nZSc6IFsnc2V0dGluZ3MtY29tcG9uZW50JywgJ2ZpbGUtY29tcG9uZW50JywgJ2FyaXRobWV0aWMtY29sdW1uLWNvbXBvbmVudCddLFxuICAgICAgICAnYXJpdGhtZXRpYy1jb2x1bW4tY2hhbmdlJzogWydzZXR0aW5ncy1jb21wb25lbnQnXVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChldmVudF9uYW1lKSB7XG4gICAgICAgIGlmKEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeS5ldmVudHNfc3Vic2NyaWJlcnMuaGFzT3duUHJvcGVydHkoZXZlbnRfbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkuZXZlbnRzX3N1YnNjcmliZXJzW2V2ZW50X25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEV2ZW50Tm90Rm91bmRJblJlZ2lzdHJ5RXJyb3IoXCJFdmVudCBub3QgZm91bmQgOiBcIiArIGV2ZW50X25hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHtGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9GaWxlUmVnaXN0cnlDaGFuZ2VFdmVudFwiO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSBcIi4uL3V0aWxzL1N0cmluZ1V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlUmVnaXN0cnkge1xuXG4gICAgc3RhdGljIGF2YWlsYWJsZV9maWxlcyA9IFtdO1xuXG4gICAgc3RhdGljIGN1cnJlbnRfZmlsZXMgPSBbXTtcblxuICAgIHN0YXRpYyBmaWxlX2NvdW50ZXIgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXZhaWxhYmxlRmlsZXNMaXN0KCkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5maWx0ZXIob2JqID0+IG9iaiAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEN1cnJlbnRGaWxlc0xpc3QoKSB7XG4gICAgICAgIEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuZmlsdGVyKG9iaiA9PiBvYmogIT09IHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkVG9BdmFpbGFibGVGaWxlcyhmaWxlX3RvX2FkZCkge1xuICAgICAgICBsZXQgZmlsZSA9IHsgLi4uZmlsZV90b19hZGQsXG4gICAgICAgICAgICBpZDogRmlsZVJlZ2lzdHJ5LmZpbGVfY291bnRlcixcbiAgICAgICAgICAgIGZpbGVfbmFtZTogU3RyaW5nVXRpbHMuY2xlYW5GaWxlTmFtZShmaWxlX3RvX2FkZC5maWxlX25hbWUpXG4gICAgICAgIH07XG5cbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5wdXNoKGZpbGUpO1xuXG4gICAgICAgIEZpbGVSZWdpc3RyeS5maWxlX2NvdW50ZXIrKztcbiAgICB9XG5cbiAgICBzdGF0aWMgX2FkZFRvQXZhaWxhYmxlRmlsZXMoZmlsZSkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzLnB1c2goZmlsZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIG1vdmVUb0F2YWlsYWJsZUZpbGVzKGZpbGUpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5wdXNoKGZpbGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmVGcm9tQXZhaWxhYmxlRmlsZXMoZmlsZV9pZCkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmlkICE9PSBwYXJzZUludChmaWxlX2lkKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFRvQ3VycmVudEZpbGVzKGZpbGUpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21BdmFpbGFibGVGaWxlcyhmaWxlLmlkKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlRnJvbUN1cnJlbnRGaWxlcyhmaWxlX2lkKSB7XG4gICAgICAgIGxldCBmaWxlID0gRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKTtcblxuICAgICAgICBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcyA9IEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuaWQgIT09IHBhcnNlSW50KGZpbGVfaWQpKTtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5Lm1vdmVUb0F2YWlsYWJsZUZpbGVzKGZpbGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBbGxGaWxlcygpIHtcbiAgICAgICAgbGV0IGF2YWlsYWJsZV9maWxlcyA9IEZpbGVSZWdpc3RyeS5nZXRBdmFpbGFibGVGaWxlc0xpc3QoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRfZmlsZXMgPSBGaWxlUmVnaXN0cnkuZ2V0Q3VycmVudEZpbGVzTGlzdCgpO1xuXG4gICAgICAgIGxldCBmaWxlcyA9IGF2YWlsYWJsZV9maWxlcy5jb25jYXQoY3VycmVudF9maWxlcyk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRGaWxlQnlJZChmaWxlX2lkKSB7XG4gICAgICAgIGxldCBmaWxlX2FycmF5ID0gWy4uLkZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMsIC4uLkZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzXTtcblxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVfYXJyYXkuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKTtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZpbGVCeU5hbWUoZmlsZV9uYW1lKSB7XG4gICAgICAgIGxldCBmaWxlX2FycmF5ID0gWy4uLkZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMsIC4uLkZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzXTtcblxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVfYXJyYXkuZmluZChmaWxlID0+IGZpbGUuZmlsZV9uYW1lID09PSBmaWxlX25hbWUpO1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNGaWxlQ3VycmVudChmaWxlX2lkKSB7XG4gICAgICAgIGxldCBpc19jdXJyZW50ID0gZmFsc2U7XG5cbiAgICAgICAgaWYoRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuc29tZShmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKSkge1xuICAgICAgICAgICAgaXNfY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfY3VycmVudDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RmlsZU1ldGFkYXRhKGZpbGVfaWQsIG1ldGFkYXRhKSB7XG4gICAgICAgIGxldCBmaWxlcyA9IEZpbGVSZWdpc3RyeS5nZXRBbGxGaWxlcygpO1xuXG4gICAgICAgIGxldCBmaWxlID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5pZCAhPT0gcGFyc2VJbnQoZmlsZV9pZCkpO1xuXG4gICAgICAgIGZpbGUgPSB7IC4uLmZpbGUsIC4uLm1ldGFkYXRhIH07XG5cbiAgICAgICAgaWYoRmlsZVJlZ2lzdHJ5LmlzRmlsZUN1cnJlbnQoZmlsZV9pZCkpIHtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5yZW1vdmVGcm9tQ3VycmVudEZpbGVzKGZpbGVfaWQpO1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LmFkZFRvQ3VycmVudEZpbGVzKGZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21BdmFpbGFibGVGaWxlcyhmaWxlX2lkKTtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5fYWRkVG9BdmFpbGFibGVGaWxlcyhmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzZW5kUmVnaXN0cnlDaGFuZ2VFdmVudCgpIHtcbiAgICAgICAgbGV0IGZyY2UgPSBuZXcgRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQoKTtcbiAgICAgICAgZnJjZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge09iamVjdFV0aWxzfSBmcm9tIFwiLi4vdXRpbHMvT2JqZWN0VXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29uZmlndXJhdGlvbiB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdF9jb25maWd1cmF0aW9uID0ge1xuICAgICAgICAnbGlicmFyeS1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICBzZWxlY3RlZDogJ25vbmUnXG4gICAgICAgIH0sXG4gICAgICAgICdib2tlaC1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgJ2Jva2VoLW9wdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgdG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnZDMtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICdkMy1vcHRpb25zJzoge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdkYXRhLXR5cGUtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6ICdnZW5lcmljJ1xuICAgICAgICB9LFxuICAgICAgICAnbGlnaHQtY3VydmUtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICdsaWdodC1jdXJ2ZS1vcHRpb25zJzoge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdzcGVjdHJ1bS1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgJ3NwZWN0cnVtLW9wdGlvbnMnOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2hkdXMtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAnYXhpcy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2Vycm9yLWJhcnMtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdiaW5uaW5nLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnYWRkaXRpb25hbC1kYXRhc2V0LXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uZmlndXJhdGlvbiA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uX29iamVjdCA9IG51bGwpIHtcbiAgICAgICAgaWYoY29uZmlndXJhdGlvbl9vYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU2V0dGluZ3NDb25maWd1cmF0aW9uLmRlZmF1bHRfY29uZmlndXJhdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWd1cmF0aW9uX29iamVjdCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29uZmlndXJhdGlvbk9iamVjdCh3cmFwcGVyX2NvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgbGV0IGNvbmZpZ3VyYXRpb24gPSBudWxsO1xuXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gPSBPYmplY3RVdGlscy5kZWVwX21lcmdlKFNldHRpbmdzQ29uZmlndXJhdGlvbi5kZWZhdWx0X2NvbmZpZ3VyYXRpb24sIHdyYXBwZXJfY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgc3RhdGljIGdldENvbmZpZ3VyYXRpb25PYmplY3Qod3JhcHBlcl9jb25maWd1cmF0aW9uKSB7XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uID0gbnVsbDtcblxuICAgICAgICBjb25maWd1cmF0aW9uID0gT2JqZWN0VXRpbHMuZGVlcF9tZXJnZShTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZGVmYXVsdF9jb25maWd1cmF0aW9uLCB3cmFwcGVyX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBWaXN1YWxpemF0aW9uU2V0dGluZ3Mge1xuXG4gICAgc3RhdGljIGRlZmF1bHRfc2V0dGluZ3MgPSB7XG4gICAgICAgIGxpYnJhcnk6ICcnLFxuICAgICAgICBkYXRhX3R5cGU6ICcnLFxuICAgICAgICBheGlzOiB7fSxcbiAgICAgICAgc2NhbGVzOiB7fSxcbiAgICAgICAgZXJyb3JfYmFyczoge31cbiAgICB9XG5cbiAgICBzZXR0aW5ncyA9IHt9O1xuXG4gICAgc2V0dGluZ3NfbGlicmFyeSA9IG51bGw7XG4gICAgc2V0dGluZ3NfZGF0YV90eXBlID0gbnVsbDtcbiAgICBzZXR0aW5nc19oZHVzID0gbnVsbDtcbiAgICBzZXR0aW5nc19heGlzID0gbnVsbDtcbiAgICBzZXR0aW5nc19jb2x1bW5zID0gbnVsbDtcbiAgICBzZXR0aW5nc19zY2FsZXMgPSBudWxsO1xuICAgIHNldHRpbmdzX2Vycm9yX2JhcnMgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3Nfb2JqZWN0ID0gbnVsbCkge1xuICAgICAgICBpZihzZXR0aW5nc19vYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNldHRpbmdzX29iamVjdCkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShWaXN1YWxpemF0aW9uU2V0dGluZ3MuZGVmYXVsdF9zZXR0aW5ncykpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMaWJyYXJ5U2V0dGluZ3MobGlicmFyeSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2xpYnJhcnkgPSBsaWJyYXJ5O1xuICAgIH1cblxuICAgIGdldExpYnJhcnlTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19saWJyYXJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19saWJyYXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXREYXRhVHlwZVNldHRpbmdzKGRhdGFfdHlwZSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2RhdGFfdHlwZSA9IGRhdGFfdHlwZTtcbiAgICB9XG5cbiAgICBnZXREYXRhVHlwZVNldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX2RhdGFfdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfZGF0YV90eXBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMaWdodEN1cnZlU2V0dGluZ3MoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRTcGVjdHJ1bVNldHRpbmdzKCkge1xuXG4gICAgfVxuXG4gICAgc2V0SERVc1NldHRpbmdzKGhkdXMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19oZHVzID0gaGR1cztcbiAgICB9XG5cbiAgICBnZXRIRFVzU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfaGR1cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfaGR1cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QXhpc1NldHRpbmdzKGF4aXMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19heGlzID0gYXhpcztcbiAgICB9XG5cbiAgICBnZXRBeGlzU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfYXhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfYXhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q29sdW1uc1NldHRpbmdzKGNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19jb2x1bW5zID0gY29sdW1ucztcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5zU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfY29sdW1ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfY29sdW1ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U2NhbGVzU2V0dGluZ3Moc2NhbGVzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfc2NhbGVzID0gc2NhbGVzO1xuICAgIH1cblxuICAgIGdldFNjYWxlc1NldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX3NjYWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3Nfc2NhbGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRFcnJvckJhcnNTZXR0aW5ncyhlcnJvcl9iYXJzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfZXJyb3JfYmFycyA9IGVycm9yX2JhcnM7XG4gICAgfVxuXG4gICAgZ2V0RXJyb3JCYXJzU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfZXJyb3JfYmFycykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfZXJyb3JfYmFycztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UmFuZ2VzU2V0dGluZ3MocmFuZ2VzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfcmFuZ2VzID0gcmFuZ2VzO1xuICAgIH1cblxuICAgIGdldFJhbmdlc1NldHRpbmdzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19yYW5nZXM7XG4gICAgfVxuXG4gICAgZ2V0QWRkaXRpb25hbERhdGFzZXRzU2V0dGluZ3MoKSB7XG5cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19saWJyYXJ5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19kYXRhX3R5cGUgPSBudWxsO1xuICAgICAgICB0aGlzLnNldHRpbmdzX2hkdXMgPSBudWxsO1xuICAgICAgICB0aGlzLnNldHRpbmdzX2F4aXMgPSBudWxsO1xuICAgICAgICB0aGlzLnNldHRpbmdzX3NjYWxlcyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfZXJyb3JfYmFycyA9IG51bGw7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBDb2x1bW5VdGlscyB7XG5cbiAgICBzdGF0aWMgZ2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uX3NldHRpbmdzKSB7XG4gICAgICAgIGxldCBzZXR0aW5ncyA9IGNvbHVtbl9zZXR0aW5ncy5zcGxpdCgnJCcpO1xuXG4gICAgICAgIGxldCBjb2x1bW5fbG9jYXRpb24gPSBzZXR0aW5nc1swXS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY29sdW1uX25hbWUgPSBzZXR0aW5nc1sxXSB8fCAnJztcblxuICAgICAgICBsZXQgZmlsZV9pZCA9IGNvbHVtbl9sb2NhdGlvblswXTtcbiAgICAgICAgbGV0IGhkdV9pbmRleCA9IGNvbHVtbl9sb2NhdGlvbi5sZW5ndGggPiAxID8gY29sdW1uX2xvY2F0aW9uWzFdIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVfaWQ6IGZpbGVfaWQsXG4gICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOiBjb2x1bW5fbmFtZVxuICAgICAgICB9O1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcblxuICAgIHN0YXRpYyBzdGFuZGFyZF9mdW5jdGlvbnMgPSBbJ01hdGguc3FydCcsXG4gICAgICAgICdNYXRoLmFicycsXG4gICAgICAgICdNYXRoLmNvcycsXG4gICAgICAgICdNYXRoLnNpbicsXG4gICAgICAgICdNYXRoLm1heCcsXG4gICAgICAgICdNYXRoLm1pbicsXG4gICAgICAgICdNYXRoLnBvdycsXG4gICAgICAgICdNYXRoLmxvZycsXG4gICAgICAgICdNYXRoLnJvdW5kJ1xuICAgIF07XG5cbiAgICBzdGF0aWMgY3VzdG9tX2Z1bmN0aW9ucyA9IFtdO1xuXG4gICAgZXhwcmVzc2lvbiA9IG51bGw7XG4gICAgYmxvY2tzID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uID0gbnVsbCkge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cblxuICAgIHNldEV4cHJlc3Npb24oZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cblxuICAgIHBhcnNlU3RhbmRhcmRFeHByZXNzaW9uT3BlcmFuZChleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yX3JlZ2V4ID0gL1tcXCtcXC1cXCpcXC9dL2c7XG5cbiAgICAgICAgbGV0IHBhcnRzID0gZXhwcmVzc2lvbi5zcGxpdChvcGVyYXRvcl9yZWdleCk7XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkX3BhcnRzID0gcGFydHMuZmlsdGVyKHBhcnQgPT4gcGFydC50cmltKCkgIT09ICcnKTtcblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRfcGFydHM7XG4gICAgfVxuXG4gICAgcGFyc2VTdGFuZGFyZEV4cHJlc3Npb25PcGVyYXRvcnMoZXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBvcGVyYXRvcl9yZWdleCA9IC9bXFwrXFwtXFwqXFwvXS9nO1xuXG4gICAgICAgIGNvbnN0IG9wZXJhdG9ycyA9IGV4cHJlc3Npb24ubWF0Y2gob3BlcmF0b3JfcmVnZXgpO1xuXG4gICAgICAgIHJldHVybiBvcGVyYXRvcnM7XG4gICAgfVxuXG4gICAgcGFyc2VFeHByZXNzaW9uKCkge1xuICAgICAgICBpZih0aGlzLmV4cHJlc3Npb24pIHtcblxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgdGhpcy5leHByZXNzaW9uLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgY3Vycl9jaGFyID0gdGhpcy5leHByZXNzaW9uW2ldO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJhc2ljRXhwcmVzc2lvbkV2YWx1YXRpb24oKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uX3Jlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGV4cHJlc3Npb25fcmVzdWx0ID0gZXZhbCh0aGlzLmV4cHJlc3Npb24pO1xuICAgICAgICB9IGNhdGNoKGUpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25fcmVzdWx0O1xuICAgIH1cblxuICAgIGN1c3RvbUV4cHJlc3Npb25FdmFsdWF0aW9uKCkge1xuXG4gICAgfVxuXG4gICAgY2hlY2tFeHByZXNzaW9uKCkge1xuXG4gICAgICAgIGxldCBleHByZXNzaW9uX3R5cGUgPSAnc3RhbmRhcmQnO1xuXG4gICAgICAgIGNvbnN0IHJlZ2V4X2lzX29wZXJhdG9yX251bWJlciA9IC9bK1xcLSovMC05Ll0rLztcblxuICAgICAgICBsZXQgZXhwcmVzc2lvbl9wYXJ0cyA9IHRoaXMuZXhwcmVzc2lvbi5zcGxpdCgvXFxzKy8pO1xuXG4gICAgICAgIGV4cHJlc3Npb25fcGFydHMuZm9yRWFjaChwYXJ0ID0+IHtcbiAgICAgICAgICAgIGlmICghcmVnZXhfaXNfb3BlcmF0b3JfbnVtYmVyLnRlc3QocGFydCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoRXhwcmVzc2lvblBhcnNlci5zdGFuZGFyZF9mdW5jdGlvbnMuaW5jbHVkZXMocGFydCkpIHtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoRXhwcmVzc2lvblBhcnNlci5jdXN0b21fZnVuY3Rpb25zLmluY2x1ZGVzKHBhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25fdHlwZSA9ICdjdXN0b20nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25fdHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uX3R5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbl90eXBlO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBPYmplY3RVdGlscyB7XG5cbiAgICBzdGF0aWMgZGVlcF9tZXJnZShiYXNlX29iamVjdCwgbWVyZ2luZ19vYmplY3QpIHtcbiAgICAgICAgbGV0IG1lcmdlZF9vYmplY3QgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmFzZV9vYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChiYXNlX29iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkX29iamVjdFtrZXldID0gYmFzZV9vYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBtZXJnaW5nX29iamVjdCkge1xuICAgICAgICAgICAgaWYgKG1lcmdpbmdfb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KG1lcmdpbmdfb2JqZWN0W2tleV0pKSB7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1lcmdlZF9vYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgbWVyZ2luZ19vYmplY3Rba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkX29iamVjdFtrZXldID0gT2JqZWN0VXRpbHMuZGVlcF9tZXJnZShtZXJnZWRfb2JqZWN0W2tleV0sIG1lcmdpbmdfb2JqZWN0W2tleV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZF9vYmplY3Rba2V5XSA9IG1lcmdpbmdfb2JqZWN0W2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlZF9vYmplY3Q7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFN0cmluZ1V0aWxzIHtcblxuICAgIHN0YXRpYyBjbGVhbkZpbGVOYW1lKHN0cikge1xuICAgICAgICBpZiAoc3RyLnN0YXJ0c1dpdGgoJy4nKSB8fCBzdHIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nVXRpbHMuY2xlYW5GaWxlTmFtZShzdHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBCb2tlaEdyYXBoIHtcblxuICAgIGNvbnRhaW5lcl9pZCA9IG51bGw7XG4gICAgY29udGFpbmVyID0gbnVsbDtcblxuICAgIHN0YXRpYyBwbHQgPSBCb2tlaC5QbG90dGluZztcblxuICAgIHN0YXRpYyBzY2FsZV9mdW5jdGlvbnMgPSB7XG4gICAgICAgIFwibGluZWFyXCI6IEJva2VoLkxpbmVhclNjYWxlLFxuICAgICAgICBcImxvZ1wiOiBCb2tlaC5Mb2dTY2FsZVxuICAgIH1cblxuICAgIHNvdXJjZSA9IG51bGw7XG5cbiAgICB5X2Vycm9yX2JhcjtcbiAgICB4X2Vycm9yX2JhcjtcblxuICAgIGNvbHVtbnM7XG4gICAgZGF0YV90YWJsZTtcblxuICAgIHN0YXRpYyBzdXBwb3J0ZWRfdG9vbF9hcnJheSA9IFtcbiAgICAgICAgXCJwYW5cIixcbiAgICAgICAgXCJib3hfem9vbVwiLFxuICAgICAgICBcIndoZWVsX3pvb21cIixcbiAgICAgICAgXCJob3ZlclwiLFxuICAgICAgICBcImNyb3NzaGFpclwiLFxuICAgICAgICBcInJlc2V0XCIsXG4gICAgICAgIFwic2F2ZVwiLFxuICAgICAgICBcImxhc3NvX3NlbGVjdFwiLFxuICAgICAgICBcInBvbHlfc2VsZWN0XCIsXG4gICAgICAgIFwidGFwXCIsXG4gICAgICAgIFwiZXhhbWluZSxcIixcbiAgICAgICAgXCJ1bmRvXCIsXG4gICAgICAgIFwicmVkb1wiXTtcblxuICAgIHN0YXRpYyBkZWZhdWx0X3Rvb2xfYXJyYXkgPSBbXG4gICAgICAgIFwicGFuXCIsXG4gICAgICAgIFwiYm94X3pvb21cIixcbiAgICAgICAgXCJ3aGVlbF96b29tXCIsXG4gICAgICAgIFwiaG92ZXJcIixcbiAgICAgICAgXCJjcm9zc2hhaXJcIixcbiAgICAgICAgXCJyZXNldFwiLFxuICAgICAgICBcInNhdmVcIl07XG5cbiAgICBzdGF0aWMgZGVmYXVsdF90b29sX3N0cmluZyA9IFwicGFuLGJveF96b29tLHdoZWVsX3pvb20saG92ZXIsY3Jvc3NoYWlyLHJlc2V0LHNhdmVcIjtcblxuICAgIHRvb2xfYXJyYXkgPSBbXTtcbiAgICB0b29sX3N0cmluZyA9IFwiXCI7XG5cbiAgICBoYXNfZGF0YV90YWJsZSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyX2lkID0gJyN2aXN1YWxpemF0aW9uLWNvbnRhaW5lcicpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJfaWQgPSBjb250YWluZXJfaWQ7XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJfaWQpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVTZXR0aW5ncyhkYXRhLCBsYWJlbHMsIHNjYWxlcywgdGl0bGUsIGVycm9yX2JhcnMgPSBudWxsLCBjdXN0b21fcmFuZ2UgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2V0dXBTb3VyY2UoZGF0YSk7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFBsb3QodGl0bGUsIGRhdGFbJ3lfbG93J10sIGRhdGFbJ3lfdXAnXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihjdXN0b21fcmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgeF9sb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgeF91cCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgbGV0IHlfbG93ID0gW107XG4gICAgICAgICAgICAgICAgbGV0IHlfdXAgPSBbXTtcblxuICAgICAgICAgICAgICAgIGlmKGN1c3RvbV9yYW5nZS54ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZS54Lmxvd2VyX2JvdW5kICE9PSBudWxsID8geF9sb3cucHVzaChjdXN0b21fcmFuZ2UueC5sb3dlcl9ib3VuZCkgOiB4X2xvdyA9IGRhdGFbJ3gnXTtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlLngudXBwZXJfYm91bmQgIT09IG51bGwgPyB4X3VwLnB1c2goY3VzdG9tX3JhbmdlLngudXBwZXJfYm91bmQpIDogeF91cCA9IGRhdGFbJ3gnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4X2xvdyA9IGRhdGFbJ3gnXTtcbiAgICAgICAgICAgICAgICAgICAgeF91cCA9IGRhdGFbJ3gnXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihjdXN0b21fcmFuZ2UueSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2UueS5sb3dlcl9ib3VuZCAhPT0gbnVsbCA/IHlfbG93LnB1c2goY3VzdG9tX3JhbmdlLnkubG93ZXJfYm91bmQpIDogeV9sb3cgPSBkYXRhWyd5J107XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZS55LnVwcGVyX2JvdW5kICE9PSBudWxsID8geV91cC5wdXNoKGN1c3RvbV9yYW5nZS55LnVwcGVyX2JvdW5kKSA6IHlfdXAgPSBkYXRhWyd5J107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeV9sb3cgPSBkYXRhWyd5J107XG4gICAgICAgICAgICAgICAgICAgIHlfdXAgPSBkYXRhWyd5J107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cFBsb3QodGl0bGUsIHlfbG93LCB5X3VwLCB4X2xvdywgeF91cClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cFBsb3QodGl0bGUsIGRhdGFbJ3knXSwgZGF0YVsneSddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXR1cERhdGEoKTtcbiAgICAgICAgdGhpcy5zZXR1cFNjYWxlcyhzY2FsZXMpO1xuICAgICAgICB0aGlzLnNldHVwTGFiZWxzKGxhYmVscyk7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgdGhpcy5zZXR1cEVycm9yQmFycygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUdyYXBoKCkge1xuXG4gICAgICAgIGlmKHRoaXMuaGFzX2RhdGFfdGFibGUpIHtcbiAgICAgICAgICAgIEJva2VoR3JhcGgucGx0LnNob3cobmV3IEJva2VoLkNvbHVtbih7Y2hpbGRyZW46IFtwLCBkYXRhX3RhYmxlXX0pLCBcIiNncmFwaC1jb250YWluZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBCb2tlaEdyYXBoLnBsdC5zaG93KHRoaXMucGxvdCwgdGhpcy5jb250YWluZXJfaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBQbG90KHRpdGxlLCB5X3JhbmdlX2xvdywgeV9yYW5nZV91cCwgeF9yYW5nZV9sb3cgPSBudWxsLCB4X3JhbmdlX3VwPSBudWxsKSB7XG5cbiAgICAgICAgaWYoeF9yYW5nZV9sb3cpIHtcbiAgICAgICAgICAgIHRoaXMucGxvdCA9IEJva2VoR3JhcGgucGx0LmZpZ3VyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgICAgIHRvb2xzOiBCb2tlaEdyYXBoLmRlZmF1bHRfdG9vbF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbG90ID0gQm9rZWhHcmFwaC5wbHQuZmlndXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgdG9vbHM6IEJva2VoR3JhcGguZGVmYXVsdF90b29sX3N0cmluZyxcbiAgICAgICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFNvdXJjZShkYXRhX3NvdXJjZXMpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgQm9rZWguQ29sdW1uRGF0YVNvdXJjZSh7XG4gICAgICAgICAgICBkYXRhOiBkYXRhX3NvdXJjZXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0dXBEYXRhKCkge1xuICAgICAgICBjb25zdCBjaXJjbGVzID0gdGhpcy5wbG90LmNpcmNsZSh7IGZpZWxkOiBcInhcIiB9LCB7IGZpZWxkOiBcInlcIiB9LCB7XG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgICAgIGZpbGxfY29sb3I6IFwibmF2eVwiLFxuICAgICAgICAgICAgbGluZV9jb2xvcjogbnVsbCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0dXBFcnJvckJhcnMoKSB7XG4gICAgICAgIHRoaXMueV9lcnJvcl9iYXIgPSBuZXcgQm9rZWguV2hpc2tlcih7XG4gICAgICAgICAgICBkaW1lbnNpb246IFwiaGVpZ2h0XCIsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgYmFzZToge2ZpZWxkOiBcInhcIn0sXG4gICAgICAgICAgICBsb3dlcjoge2ZpZWxkOiBcInlfbG93XCJ9LFxuICAgICAgICAgICAgdXBwZXI6IHtmaWVsZDogXCJ5X3VwXCJ9LFxuICAgICAgICAgICAgbGluZV9jb2xvcjogXCJuYXZ5XCIsXG4gICAgICAgICAgICBsb3dlcl9oZWFkOiBudWxsLFxuICAgICAgICAgICAgdXBwZXJfaGVhZDogbnVsbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy54X2Vycm9yX2JhciA9IG5ldyBCb2tlaC5XaGlza2VyKHtcbiAgICAgICAgICAgIGRpbWVuc2lvbjogXCJ3aWR0aFwiLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIGJhc2U6IHtmaWVsZDogXCJ5XCJ9LFxuICAgICAgICAgICAgbG93ZXI6IHtmaWVsZDogXCJ4X2xvd1wifSxcbiAgICAgICAgICAgIHVwcGVyOiB7ZmllbGQ6IFwieF91cFwifSxcbiAgICAgICAgICAgIGxpbmVfY29sb3I6IFwibmF2eVwiLFxuICAgICAgICAgICAgbG93ZXJfaGVhZDogbnVsbCxcbiAgICAgICAgICAgIHVwcGVyX2hlYWQ6IG51bGwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGxvdC5hZGRfbGF5b3V0KHRoaXMueV9lcnJvcl9iYXIpO1xuICAgICAgICB0aGlzLnBsb3QuYWRkX2xheW91dCh0aGlzLnhfZXJyb3JfYmFyKTtcbiAgICB9XG5cbiAgICBzZXR1cFNjYWxlcyAoc2NhbGVzKSB7XG4gICAgICAgIGlmKHNjYWxlcykge1xuICAgICAgICAgICAgdGhpcy5wbG90Lnhfc2NhbGUgPSBuZXcgQm9rZWhHcmFwaC5zY2FsZV9mdW5jdGlvbnNbc2NhbGVzLnhdKCk7XG4gICAgICAgICAgICB0aGlzLnBsb3QueV9zY2FsZSA9IG5ldyBCb2tlaEdyYXBoLnNjYWxlX2Z1bmN0aW9uc1tzY2FsZXMueV0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwTGFiZWxzKGxhYmVscykge1xuICAgICAgICB0aGlzLnBsb3QueGF4aXMuYXhpc19sYWJlbCA9IGxhYmVscy54O1xuICAgICAgICB0aGlzLnBsb3QueWF4aXMuYXhpc19sYWJlbCA9IGxhYmVscy55O1xuICAgIH1cblxuICAgIHNldHVwQ29sdW1ucyhsYWJlbHMsIGNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gW1xuICAgICAgICAgICAgbmV3IEJva2VoLlRhYmxlcy5UYWJsZUNvbHVtbih7ZmllbGQ6ICd4JywgdGl0bGU6IGxhYmVscy54fSksXG4gICAgICAgICAgICBuZXcgQm9rZWguVGFibGVzLlRhYmxlQ29sdW1uKHtmaWVsZDogJ3knLCB0aXRsZTogbGFiZWxzLnl9KVxuICAgICAgICBdXG4gICAgfVxuXG4gICAgc2V0dXBEYXRhVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZGF0YV90YWJsZSA9IG5ldyBCb2tlaC5UYWJsZXMuRGF0YVRhYmxlKHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVUb29sQXJyYXkodG9vbF9hcnJheSkge1xuICAgICAgICB0aGlzLnRvb2xfYXJyYXkgPSB0b29sX2FycmF5O1xuICAgIH1cblxuICAgIGFkZFRvb2xUb1Rvb2xBcnJheSh0b29sX25hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRvb2xfYXJyYXkuaW5jbHVkZXModG9vbF9uYW1lKSAmJiBCb2tlaEdyYXBoLnN1cHBvcnRlZF90b29sX2FycmF5LmluY2x1ZGVzKHRvb2xfbmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMudG9vbF9hcnJheS5wdXNoKHRvb2xfbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVUb29sRnJvbVRvb2xBcnJheSh0b29sX25hbWUpIHtcbiAgICAgICAgdGhpcy50b29sX2FycmF5ID0gdGhpcy50b29sX2FycmF5LmZpbHRlcihzdHIgPT4gc3RyICE9PSB0b29sX25hbWUpO1xuICAgIH1cblxuICAgIHNldFRvb2xTdHJpbmdGcm9tVG9vbEFycmF5KCkge1xuICAgICAgICB0aGlzLnRvb2xfc3RyaW5nID0gdGhpcy50b29sX2FycmF5LmpvaW4oJywnKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgRDNHcmFwaCB7XG5cbiAgICB4X3NjYWxlO1xuICAgIHhfc2NhbGVfdHlwZTtcblxuICAgIHlfc2NhbGU7XG4gICAgeV9zY2FsZV90eXBlO1xuXG4gICAgeF9heGlzO1xuICAgIHhfYXhpc19kYXRhX2NvbDtcblxuICAgIHlfYXhpcztcbiAgICB5X2F4aXNfZGF0YV9jb2w7XG5cbiAgICBkYXRhc2V0O1xuICAgIHN2ZzsgcGxvdDsgY2xpcDsgem9vbV9yZWN0O1xuXG4gICAgem9vbTtcblxuICAgIGxpbmVfY29udGFpbmVyOyBwYXRoO1xuXG4gICAgY29udGFpbmVyO1xuICAgIGNvbnRhaW5lcl9pZDtcblxuICAgIG1hcmdpbiA9IHt0b3A6IDEwLCByaWdodDogMzAsIGJvdHRvbTogMzAsIGxlZnQ6IDYwfTtcbiAgICB3aWR0aCA9IDgwMCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICBoZWlnaHQgPSA0MDAgLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XG5cbiAgICBoYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuICAgIHhfYXhpc19kYXRhX2NvbF9lcnJvcl9iYXI7XG4gICAgeV9heGlzX2RhdGFfY29sX2Vycm9yX2JhcjtcblxuICAgIGhhc19saW5lID0gZmFsc2U7XG5cbiAgICBoYXNfbXVsdGlwbGVfcGxvdHMgPSBmYWxzZTtcbiAgICBhZGRpdGlvbmFsX3Bsb3RzID0gW107XG5cbiAgICBpbml0aWFsaXplZDtcblxuICAgIHN0YXRpYyBzY2FsZV9mdW5jdGlvbnMgPSB7XG4gICAgICAgIFwibGluZWFyXCI6IGQzLnNjYWxlTGluZWFyLFxuICAgICAgICBcImxvZ1wiOiBkMy5zY2FsZUxvZ1xuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdF9zY2FsZXMgPSB7XG4gICAgICAgIFwieFwiOiAnbGluZWFyJyxcbiAgICAgICAgXCJ5XCI6ICdsaW5lYXInXG4gICAgfVxuXG4gICAgc3RhdGljIGRlZmF1bHRfYXhpc190aWNrX2Zvcm1hdCA9IFwiLjJmXCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQgPSAndmlzdWFsaXphdGlvbi1jb250YWluZXInLCBkYXRhc2V0ID0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IGNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcblxuICAgICAgICB0aGlzLl91cGRhdGVDaGFydCA9IHRoaXMuX3VwZGF0ZUNoYXJ0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJfaWQpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVTZXR0aW5ncyhkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICBheGlzLFxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZXMgPSBEM0dyYXBoLmRlZmF1bHRfc2NhbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgaGFzX2xpbmUgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbF9wbG90cyA9IG51bGwpIHtcblxuICAgICAgICBsZXQgaXNfc2V0ID0gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5kYXRhc2V0ID0gZGF0YTtcblxuICAgICAgICAgICAgdGhpcy54X2F4aXNfZGF0YV9jb2wgPSBheGlzWyd4J107XG4gICAgICAgICAgICB0aGlzLnlfYXhpc19kYXRhX2NvbCA9IGF4aXNbJ3knXTtcblxuICAgICAgICAgICAgdGhpcy54X3NjYWxlX3R5cGUgPSBzY2FsZXNbJ3gnXTtcbiAgICAgICAgICAgIHRoaXMueV9zY2FsZV90eXBlID0gc2NhbGVzWyd5J107XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc19lcnJvcl9iYXJzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3JfYmFycyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnhfYXhpc19kYXRhX2NvbF9lcnJvcl9iYXIgPSBheGlzWyd4J10udmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy55X2F4aXNfZGF0YV9jb2xfZXJyb3JfYmFyID0gYXhpc1sneSddLnZhbHVlO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzX2Vycm9yX2JhcnMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxfcGxvdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc19tdWx0aXBsZV9wbG90cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRpdGlvbmFsX3Bsb3RzID0gW107XG5cbiAgICAgICAgICAgICAgICBsZXQgYWRkaXRpb25hbF9wbG90c190ZW1wID0gW107XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbF9wbG90cy5mb3JFYWNoKGZ1bmN0aW9uIChwbG90KSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxfcGxvdHNfdGVtcC5wdXNoKHBsb3QpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRpdGlvbmFsX3Bsb3RzID0gYWRkaXRpb25hbF9wbG90c190ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmhhc19saW5lID0gaGFzX2xpbmU7XG5cbiAgICAgICAgICAgIGlzX3NldCA9IHRydWU7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBncmFwaCBzZXR0aW5ncyBwcm9jZXNzXCIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfc2V0O1xuICAgIH1cblxuICAgIGluaXRpYWxpemVHcmFwaCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNWR0NvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRYU2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRYQXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fc2V0WEF4aXNMYWJlbCgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRZQXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fc2V0WUF4aXNMYWJlbCgpXG5cbiAgICAgICAgICAgIHRoaXMuX3NldERhdGFQbG90KCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFpvb21CZWhhdmlvcigpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RXJyb3JCYXJzKHRoaXMuZXJyb3JfYmFycyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaGFzX2xpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRBeGlzTGluZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmhhc19tdWx0aXBsZV9wbG90cykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEFkZGl0aW9uYWxQbG90cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBncmFwaCBpbml0aWFsaXphdGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICAgIH1cblxuICAgIF9zZXRTVkdDb250YWluZXIoKSB7XG5cbiAgICAgICAgbGV0IGZ1bGxfd2lkdGggPSB0aGlzLl9nZXRGdWxsV2lkdGgoKTtcbiAgICAgICAgbGV0IGZ1bGxfaGVpZ2h0ID0gdGhpcy5fZ2V0RnVsbEhlaWdodCgpO1xuXG4gICAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuY29udGFpbmVyKVxuICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdWxsX3dpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVsbF9oZWlnaHQpXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIixcbiAgICAgICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHRoaXMubWFyZ2luLmxlZnQgKyBcIixcIiArIHRoaXMubWFyZ2luLnRvcCArIFwiKVwiKTtcbiAgICB9XG5cbiAgICBfc2V0WFNjYWxlKCkge1xuICAgICAgICB0aGlzLnhfc2NhbGUgPSBEM0dyYXBoLnNjYWxlX2Z1bmN0aW9uc1t0aGlzLnhfc2NhbGVfdHlwZV0oKVxuICAgICAgICAgICAgLmRvbWFpbihkMy5leHRlbnQodGhpcy5kYXRhc2V0LCBkID0+IGRbdGhpcy54X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgIC5yYW5nZShbIDAsIHRoaXMud2lkdGggXSk7XG4gICAgfVxuXG4gICAgX3NldFlTY2FsZSgpIHtcbiAgICAgICAgdGhpcy55X3NjYWxlID0gRDNHcmFwaC5zY2FsZV9mdW5jdGlvbnNbdGhpcy55X3NjYWxlX3R5cGVdKClcbiAgICAgICAgICAgIC5kb21haW4oZDMuZXh0ZW50KHRoaXMuZGF0YXNldCwgZCA9PiBkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAucmFuZ2UoWyB0aGlzLmhlaWdodCwgMF0pO1xuICAgIH1cblxuICAgIF9zZXRYQXhpcyh0aWNrX2Zvcm1hdCA9IEQzR3JhcGguZGVmYXVsdF9heGlzX3RpY2tfZm9ybWF0KSB7XG4gICAgICAgICB0aGlzLnhfYXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ4XCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgdGhpcy5oZWlnaHQgKyBcIilcIilcbiAgICAgICAgICAgIC5jYWxsKGQzLmF4aXNCb3R0b20odGhpcy54X3NjYWxlKVxuICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KGQzLmZvcm1hdCh0aWNrX2Zvcm1hdCkpKVxuICAgICAgICAgICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0aWNrLWxpbmVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInkyXCIsIC10aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMikpXG4gICAgfVxuXG4gICAgX3NldFlBeGlzKHRpY2tfZm9ybWF0ID0gRDNHcmFwaC5kZWZhdWx0X2F4aXNfdGlja19mb3JtYXQpIHtcbiAgICAgICAgdGhpcy55X2F4aXMgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieVwiKVxuICAgICAgICAgICAgLmNhbGwoZDMuYXhpc0xlZnQodGhpcy55X3NjYWxlKVxuICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KGQzLmZvcm1hdCh0aWNrX2Zvcm1hdCkpKVxuICAgICAgICAgICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMikpO1xuICAgIH1cblxuICAgIF9zZXRYQXhpc0xhYmVsKCkge1xuICAgICAgICB0aGlzLnhfYXhpcy5zZWxlY3QoXCIudGljazpsYXN0LW9mLXR5cGUgdGV4dFwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieC1sYWJlbFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC0xMSlcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAyKVxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgICAgICAgICAuYXR0cihcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnRleHQodGhpcy54X2F4aXNfZGF0YV9jb2wpO1xuICAgIH1cblxuICAgIF9zZXRZQXhpc0xhYmVsKCkge1xuICAgICAgICB0aGlzLnlfYXhpcy5zZWxlY3QoXCIudGljazpsYXN0LW9mLXR5cGUgdGV4dFwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieS1sYWJlbFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDMpXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgLTUpXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAudGV4dCh0aGlzLnlfYXhpc19kYXRhX2NvbCk7XG4gICAgfVxuXG4gICAgX3NldERhdGFQbG90KCkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy54X3NjYWxlO1xuICAgICAgICBsZXQgeSA9IHRoaXMueV9zY2FsZTtcblxuICAgICAgICBsZXQgeF9jb2xfZGF0YSA9IHRoaXMueF9heGlzX2RhdGFfY29sO1xuICAgICAgICBsZXQgeV9jb2xfZGF0YSA9IHRoaXMueV9heGlzX2RhdGFfY29sO1xuXG4gICAgICAgIHRoaXMuY2xpcCA9IHRoaXMuc3ZnLmFwcGVuZChcImRlZnNcIikuYXBwZW5kKFwiU1ZHOmNsaXBQYXRoXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiY2xpcFwiKVxuICAgICAgICAgICAgLmFwcGVuZChcIlNWRzpyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5oZWlnaHQgKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMCk7XG5cbiAgICAgICAgdGhpcy5wbG90ID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKFwiY2xpcC1wYXRoXCIsIFwidXJsKCNjbGlwKVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRhdGEtcGxvdFwiKVxuXG4gICAgICAgIHRoaXMucGxvdFxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEodGhpcy5kYXRhc2V0KVxuICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHgoZFt4X2NvbF9kYXRhXSk7IH0gKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4geShkW3lfY29sX2RhdGFdKTsgfSApXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgNClcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSlcbiAgICB9XG5cbiAgICBfc2V0QWRkaXRpb25hbFBsb3RzKCkge1xuICAgICAgICBsZXQgcGxvdDtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYWRkaXRpb25hbF9wbG90cy5sZW5ndGgsIGkrKzspIHtcbiAgICAgICAgICAgIHBsb3QgPSB0aGlzLmFkZGl0aW9uYWxfcGxvdHNbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXJyb3JCYXJzKGVycm9yX2JhcnMpIHtcblxuICAgICAgICB0aGlzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzO1xuXG4gICAgICAgIGlmKGVycm9yX2JhcnMueSkge1xuICAgICAgICAgICAgbGV0IGxpbmVfZXJyb3JfYmFyX3ggPSBkMy5saW5lKClcbiAgICAgICAgICAgICAgICAueChkID0+IHRoaXMueF9zY2FsZShkW3RoaXMueF9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAgICAgLnkoZCA9PiB0aGlzLnlfc2NhbGUoZC5ib3VuZCkpO1xuXG4gICAgICAgICAgICBlcnJvcl9iYXJzLnkuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjZGF0YS1wbG90JykuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZXJyb3ItYmFyLXhcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAxLjUpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lX2Vycm9yX2Jhcl94KGVycm9yX2JhcikpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGVycm9yX2JhcnMueCkge1xuICAgICAgICAgICAgbGV0IGxpbmVfZXJyb3JfYmFyX3kgPSBkMy5saW5lKClcbiAgICAgICAgICAgICAgICAueChkID0+IHRoaXMueF9zY2FsZShkLmJvdW5kKSlcbiAgICAgICAgICAgICAgICAueShkID0+IHRoaXMueV9zY2FsZShkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpO1xuXG4gICAgICAgICAgICBlcnJvcl9iYXJzLnguZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjZGF0YS1wbG90JykuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZXJyb3ItYmFyLXhcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAxLjUpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lX2Vycm9yX2Jhcl95KGVycm9yX2JhcikpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRBeGlzTGluZSgpIHtcbiAgICAgICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgICAgIC5jdXJ2ZShkMy5jdXJ2ZUNhdG11bGxSb20pXG4gICAgICAgICAgICAueChkID0+IHRoaXMueF9heGlzKGRbdGhpcy54X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgIC55KGQgPT4gdGhpcy55X2F4aXMoZFt0aGlzLnlfYXhpc19kYXRhX2NvbF0pKTtcblxuICAgICAgICB0aGlzLmxpbmVfY29udGFpbmVyID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInBhdGgtY29udGFpbmVyXCIpXG4gICAgICAgICAgICAuYXR0cihcImNsaXAtcGF0aFwiLCBcInVybCgjY2xpcClcIik7XG5cbiAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5saW5lX2NvbnRhaW5lci5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwicGF0aFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKS5hdHRyKFwic3Ryb2tlXCIsIFwic3RlZWxibHVlXCIpXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XG4gICAgfVxuXG4gICAgX3NldFpvb21CZWhhdmlvcigpIHtcblxuICAgICAgICB0aGlzLnpvb20gPSBkMy56b29tKClcbiAgICAgICAgICAgIC5zY2FsZUV4dGVudChbLjUsIDIwXSlcbiAgICAgICAgICAgIC5leHRlbnQoW1swLCAwXSwgW3RoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XV0pXG4gICAgICAgICAgICAub24oXCJ6b29tXCIsIHRoaXMuX3VwZGF0ZUNoYXJ0KTtcblxuICAgICAgICB0aGlzLnpvb21fcmVjdCA9IHRoaXMuc3ZnLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgdGhpcy5tYXJnaW4ubGVmdCArICcsJyArIHRoaXMubWFyZ2luLnRvcCArICcpJylcbiAgICAgICAgICAgIC5jYWxsKHRoaXMuem9vbSk7XG5cbiAgICB9XG5cbiAgICBfdXBkYXRlQ2hhcnQoZSkge1xuXG4gICAgICAgIGxldCByZXNjYWxlZF94ID0gZS50cmFuc2Zvcm0ucmVzY2FsZVgodGhpcy54X3NjYWxlKTtcbiAgICAgICAgbGV0IHJlc2NhbGVkX3kgPSBlLnRyYW5zZm9ybS5yZXNjYWxlWSh0aGlzLnlfc2NhbGUpO1xuXG4gICAgICAgIHRoaXMueF9heGlzLmNhbGwoZDMuYXhpc0JvdHRvbShyZXNjYWxlZF94KS50aWNrRm9ybWF0KGQzLmZvcm1hdChEM0dyYXBoLmRlZmF1bHRfYXhpc190aWNrX2Zvcm1hdCkpKVxuICAgICAgICB0aGlzLnlfYXhpcy5jYWxsKGQzLmF4aXNMZWZ0KHJlc2NhbGVkX3kpLnRpY2tGb3JtYXQoZDMuZm9ybWF0KEQzR3JhcGguZGVmYXVsdF9heGlzX3RpY2tfZm9ybWF0KSkpXG5cbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiLnRpY2stbGluZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiI3ktbGFiZWxcIikucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcIiN4LWxhYmVsXCIpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCIuZXJyb3ItYmFyLXhcIikucmVtb3ZlKCk7XG5cbiAgICAgICAgdGhpcy54X2F4aXMuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidGljay1saW5lXCIpXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIC10aGlzLmhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLW9wYWNpdHlcIiwgMC4yKVxuXG4gICAgICAgIHRoaXMueV9heGlzLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRpY2stbGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB0aGlzLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAwLjIpXG5cbiAgICAgICAgdGhpcy5fc2V0WEF4aXNMYWJlbCgpO1xuICAgICAgICB0aGlzLl9zZXRZQXhpc0xhYmVsKCk7XG5cbiAgICAgICAgbGV0IHhfZGF0YV9jb2wgPSB0aGlzLnhfYXhpc19kYXRhX2NvbDtcbiAgICAgICAgbGV0IHlfZGF0YV9jb2wgPSB0aGlzLnlfYXhpc19kYXRhX2NvbDtcblxuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5kYXRhKHRoaXMuZGF0YXNldClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxNTApXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiByZXNjYWxlZF94KGRbeF9kYXRhX2NvbF0pOyB9IClcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHJlc2NhbGVkX3koZFt5X2RhdGFfY29sXSk7IH0gKVxuXG4gICAgICAgIGlmKHRoaXMuaGFzX2xpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcInBhdGhcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRBeGlzTGluZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5oYXNfZXJyb3JfYmFycykge1xuXG4gICAgICAgICAgICBpZih0aGlzLmVycm9yX2JhcnMueSkge1xuICAgICAgICAgICAgICAgIGxldCBsaW5lX2Vycm9yX2Jhcl94ID0gZDMubGluZSgpXG4gICAgICAgICAgICAgICAgICAgIC54KGQgPT4gcmVzY2FsZWRfeChkW3RoaXMueF9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAgICAgICAgIC55KGQgPT4gcmVzY2FsZWRfeShkLmJvdW5kKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yX2JhcnMueS5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjZGF0YS1wbG90JykuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImVycm9yLWJhci14XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMS41KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3goZXJyb3JfYmFyKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5lcnJvcl9iYXJzLngpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGluZV9lcnJvcl9iYXJfeSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgICAgICAgICAueChkID0+IHJlc2NhbGVkX3goZC5ib3VuZCkpXG4gICAgICAgICAgICAgICAgICAgIC55KGQgPT4gcmVzY2FsZWRfeShkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcl9iYXJzLnguZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCgnI2RhdGEtcGxvdCcpLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJlcnJvci1iYXIteFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJzdGVlbGJsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lX2Vycm9yX2Jhcl95KGVycm9yX2JhcikpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9nZXRGdWxsV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0XG4gICAgfVxuXG4gICAgX2dldEZ1bGxIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbVxuICAgIH1cbn0iLCJpbXBvcnQge0NvbmZpZ3VyYXRpb25FdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnRcIjtcbmltcG9ydCB7RGF0YVByb2Nlc3NvckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lclwiO1xuaW1wb3J0IHtWaXN1YWxpemF0aW9uQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyXCI7XG5pbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7U2V0dGluZ3NDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vc2V0dGluZ3MvU2V0dGluZ3NDb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBCb2tlaFdyYXBwZXIge1xuXG4gICAgc3RhdGljIGNvbnRhaW5lcl9pZCA9ICd2aXN1YWxpemF0aW9uLWNvbnRhaW5lcic7XG5cbiAgICBzdGF0aWMgbGlicmFyeSA9ICdib2tlaCc7XG5cbiAgICBzdGF0aWMgdGl0bGUgPSB7XG4gICAgICAgICdsaWdodC1jdXJ2ZSc6ICdMaWdodCBjdXJ2ZScsXG4gICAgICAgICdzcGVjdHJ1bSc6ICdzcGVjdHJ1bSdcbiAgICB9XG5cbiAgICBzdGF0aWMgc3BlY2lmaWNfc2V0dGluZ3MgPSB7XG4gICAgICAgICdib2tlaC1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAnYm9rZWgtb3B0aW9ucyc6IHtcbiAgICAgICAgICAgICAgICB0b29sczoge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBudWxsO1xuXG4gICAgY29uZmlndXJhdGlvbl9vYmplY3QgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLl9zZXR1cExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQm9rZWhXcmFwcGVyLmNvbnRhaW5lcl9pZCk7XG4gICAgfVxuXG4gICAgX3Jlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxuICAgIF9zZXR1cExpc3RlbmVycygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2V0dGluZ3MtY2hhbmdlZCcsIHRoaXMuaGFuZGxlU2V0dGluZ3NDaGFuZ2VkRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc3VhbGl6YXRpb24tZ2VuZXJhdGlvbicsIHRoaXMuaGFuZGxlVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTZXR0aW5nc0NoYW5nZWRFdmVudChldmVudCkge1xuICAgICAgICBsZXQgc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHNldHRpbmdzX29iamVjdC5nZXRMaWJyYXJ5U2V0dGluZ3MoKTtcblxuICAgICAgICBpZihsaWJyYXJ5X3NldHRpbmdzLmxpYnJhcnkgPT09IEJva2VoV3JhcHBlci5saWJyYXJ5KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5jb25maWd1cmF0aW9uX29iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjb25maWd1cmF0aW9uX2V2ZW50ID0gbmV3IENvbmZpZ3VyYXRpb25FdmVudCh0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcblxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25fZXZlbnQuZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldExpYnJhcnlTZXR0aW5ncygpO1xuXG4gICAgICAgIGlmKGxpYnJhcnlfc2V0dGluZ3MubGlicmFyeSA9PT0gQm9rZWhXcmFwcGVyLmxpYnJhcnkpIHtcblxuICAgICAgICAgICAgdGhpcy5fcmVzZXRDb250YWluZXIoKTtcblxuICAgICAgICAgICAgbGV0IGRhdGFzZXRfc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICAgICAgbGV0IGF4aXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRBeGlzU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBheGlzX3NldHRpbmdzID0gW107XG5cbiAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gYXhpcykge1xuICAgICAgICAgICAgICAgIGxldCBheGlzX2NvbHVtbl9vYmplY3QgPSB0aGlzLl9nZXRDb2x1bW5TZXR0aW5ncyhheGlzW2F4aXNfY29sdW1uXSk7XG4gICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgIGF4aXNfc2V0dGluZ3MucHVzaChheGlzX2NvbHVtbl9vYmplY3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmF4aXMgPSBheGlzX3NldHRpbmdzO1xuICAgICAgICAgICAgZGF0YXNldF9zZXR0aW5ncy5kYXRhX3R5cGUgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXREYXRhVHlwZVNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGxldCBlcnJvcl9iYXJzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RXJyb3JCYXJzU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBoYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZihlcnJvcl9iYXJzICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyc19zZXR0aW5ncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gZXJyb3JfYmFycykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc19jb2x1bW5fb2JqZWN0ID0gdGhpcy5fZ2V0Q29sdW1uU2V0dGluZ3MoZXJyb3JfYmFyc1theGlzX2NvbHVtbl0pO1xuICAgICAgICAgICAgICAgICAgICBheGlzX2NvbHVtbl9vYmplY3QgPSB7Li4uYXhpc19jb2x1bW5fb2JqZWN0LCAuLi57YXhpczogYXhpc19jb2x1bW59fVxuXG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnNfc2V0dGluZ3MucHVzaChheGlzX2NvbHVtbl9vYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3MuZXJyb3JfYmFycyA9IGVycm9yX2JhcnNfc2V0dGluZ3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBkcHAgPSBEYXRhUHJvY2Vzc29yQ29udGFpbmVyLmdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKS5nZXREYXRhUHJlUHJvY2Vzc29yKCk7XG5cbiAgICAgICAgICAgIGxldCBwcm9jZXNzZWRfZGF0YSA9IGRwcC5nZXRQcm9jZXNzZWREYXRhc2V0KGRhdGFzZXRfc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YV90eXBlID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RGF0YVR5cGVTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICBsZXQgc2NhbGVzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0U2NhbGVzU2V0dGluZ3MoKTtcblxuXG4gICAgICAgICAgICBheGlzID0ge3g6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uY29sdW1uX25hbWUsIHk6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uY29sdW1uX25hbWV9O1xuICAgICAgICAgICAgbGV0IGxhYmVscyA9IGF4aXM7XG5cbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uZGF0YSA9IHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YSA9IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcblxuXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt4OiBwcm9jZXNzZWRfZGF0YS5heGlzWzBdLmRhdGEsIHk6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YX07XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2JhcnNfb2JqZWN0ID0ge307XG5cbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzLmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXIuZGF0YSA9IGVycm9yX2Jhci5kYXRhLm1hcCh2YWx1ZSA9PiAhaXNGaW5pdGUodmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFyLmRhdGEgPSBlcnJvcl9iYXIuZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzX29iamVjdFtlcnJvcl9iYXIuYXhpc10gPSBlcnJvcl9iYXIuY29sdW1uX25hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3JfYmFyLmF4aXMgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5keCA9IGVycm9yX2Jhci5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZXJyb3JfYmFyLmF4aXMgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5keSA9IGVycm9yX2Jhci5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IHt4OiBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzBdLmNvbHVtbl9uYW1lLCB5OiBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzFdLmNvbHVtbl9uYW1lfTtcblxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uZGF0YSA9IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uZGF0YS5tYXAodmFsdWUgPT4gIWlzRmluaXRlKHZhbHVlKSA/IDAgOiB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1sxXS5kYXRhID0gcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1sxXS5kYXRhLm1hcCh2YWx1ZSA9PiAhaXNGaW5pdGUodmFsdWUpID8gMCA6IHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuZHggPSBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzBdLmRhdGEubWFwKHZhbHVlID0+IGlzTmFOKHZhbHVlKSA/IDAgOiB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZGF0YS5keSA9IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMV0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgbGV0IGFzeW1tZXRyaWNfdW5jZXJ0YWludGllcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZGF0YV90eXBlID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW1tZXRyaWNfdW5jZXJ0YWludGllcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3Byb2Nlc3NFcnJvckJhckRhdGEoZGF0YSwgYXN5bW1ldHJpY191bmNlcnRhaW50aWVzKTtcblxuICAgICAgICAgICAgICAgIGhhc19lcnJvcl9iYXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldFJhbmdlc1NldHRpbmdzKCk7XG4gICAgICAgICAgICBsZXQgY3VzdG9tX3JhbmdlX2RhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICBpZihyYW5nZXMgIT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZUJva2VoKHJhbmdlcywgZGF0YSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZUJva2VoKHJhbmdlcywgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YSA9IGN1c3RvbV9yYW5nZV9kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmlzdWFsaXphdGlvbiA9IFZpc3VhbGl6YXRpb25Db250YWluZXIuZ2V0Qm9rZWhWaXN1YWxpemF0aW9uKCk7XG5cbiAgICAgICAgICAgIHZpc3VhbGl6YXRpb24uaW5pdGlhbGl6ZVNldHRpbmdzKGRhdGEsIGxhYmVscywgc2NhbGVzLCBCb2tlaFdyYXBwZXIudGl0bGVbJ2RhdGFfdHlwZSddLCBlcnJvcl9iYXJzLCByYW5nZXMpO1xuXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dldENvbHVtblNldHRpbmdzKGNvbHVtbl9zZXR0aW5ncykge1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSBjb2x1bW5fc2V0dGluZ3Muc3BsaXQoJyQnKTtcblxuICAgICAgICBsZXQgY29sdW1uX2xvY2F0aW9uID0gc2V0dGluZ3NbMF0uc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IGNvbHVtbl9uYW1lID0gc2V0dGluZ3NbMV0gfHwgJyc7XG5cbiAgICAgICAgbGV0IGZpbGVfaWQgPSBjb2x1bW5fbG9jYXRpb25bMF07XG4gICAgICAgIGxldCBoZHVfaW5kZXggPSBjb2x1bW5fbG9jYXRpb24ubGVuZ3RoID4gMSA/IGNvbHVtbl9sb2NhdGlvblsxXSA6ICcnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWxlX2lkOiBmaWxlX2lkLFxuICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICBjb2x1bW5fbmFtZTogY29sdW1uX25hbWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfcHJvY2Vzc0Vycm9yQmFyRGF0YShkYXRhLCBhc3ltZXRyaWNfdW5jZXJ0YWludGllcyA9IGZhbHNlKSB7XG5cbiAgICAgICAgbGV0IGRpdl9mYWN0b3I9IDI7XG5cbiAgICAgICAgaWYoYXN5bWV0cmljX3VuY2VydGFpbnRpZXMpIHtcbiAgICAgICAgICAgIGRpdl9mYWN0b3IgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoZGF0YS5keCkge1xuICAgICAgICAgICAgbGV0IHhfbG93ID0gW107XG4gICAgICAgICAgICBsZXQgeF91cCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gZGF0YS5keCkge1xuICAgICAgICAgICAgICAgIHhfbG93W2ldID0gZGF0YS54W2ldIC0gZGF0YS5keFtpXSAvIGRpdl9mYWN0b3I7XG4gICAgICAgICAgICAgICAgeF91cFtpXSA9IGRhdGEueFtpXSArIGRhdGEuZHhbaV0gLyBkaXZfZmFjdG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhLnhfbG93ID0geF9sb3c7XG4gICAgICAgICAgICBkYXRhLnhfdXAgPSB4X3VwO1xuXG4gICAgICAgICAgICBkZWxldGUgZGF0YS5keDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGRhdGEuZHkpIHtcbiAgICAgICAgICAgIGxldCB5X2xvdyA9IFtdO1xuICAgICAgICAgICAgbGV0IHlfdXAgPSBbXTtcblxuICAgICAgICAgICAgZm9yKGxldCBpIGluIGRhdGEuZHkpIHtcbiAgICAgICAgICAgICAgICB5X2xvd1tpXSA9IGRhdGEueVtpXSAtIGRhdGEuZHlbaV07XG4gICAgICAgICAgICAgICAgeV91cFtpXSA9IGRhdGEueVtpXSArIGRhdGEuZHlbaV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEueV9sb3cgPSB5X2xvdztcbiAgICAgICAgICAgIGRhdGEueV91cCA9IHlfdXA7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmR5O1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICBsZXQgeV9sb3cgPSBbXSwgeV91cCA9IFtdLCB4X2xvdyA9IFtdLCB4X3VwID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhLmR5KSB7XG4gICAgICAgICAgICB5X2xvd1tpXSA9IGRhdGEueVtpXSAtIGRhdGEuZHlbaV07XG4gICAgICAgICAgICB5X3VwW2ldID0gZGF0YS55W2ldICsgZGF0YS5keVtpXTtcbiAgICAgICAgICAgIHhfbG93W2ldID0gZGF0YS54W2ldIC0gZGF0YS5keFtpXSAvIGRpdl9mYWN0b3I7XG4gICAgICAgICAgICB4X3VwW2ldID0gZGF0YS54W2ldICsgZGF0YS5keFtpXSAvIGRpdl9mYWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnlfbG93ID0geV9sb3c7XG4gICAgICAgIGRhdGEueV91cCA9IHlfdXA7XG4gICAgICAgIGRhdGEueF9sb3cgPSB4X2xvdztcbiAgICAgICAgZGF0YS54X3VwID0geF91cDtcblxuICAgICAgICBkZWxldGUgZGF0YS5keTtcbiAgICAgICAgZGVsZXRlIGRhdGEuZHg7XG4gICAgICAgICovXG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29uZmlndXJhdGlvbk9iamVjdCgpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uX29iamVjdCA9IFNldHRpbmdzQ29uZmlndXJhdGlvbi5nZXRDb25maWd1cmF0aW9uT2JqZWN0KEJva2VoV3JhcHBlci5zcGVjaWZpY19zZXR0aW5ncyk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtDb25maWd1cmF0aW9uRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvQ29uZmlndXJhdGlvbkV2ZW50XCI7XG5pbXBvcnQge0RhdGFQcm9jZXNzb3JDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL0RhdGFQcm9jZXNzb3JDb250YWluZXJcIjtcbmltcG9ydCB7VmlzdWFsaXphdGlvbkNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvVmlzdWFsaXphdGlvbkNvbnRhaW5lclwiO1xuaW1wb3J0IHtTZXR0aW5nc0NvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9zZXR0aW5ncy9TZXR0aW5nc0NvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIEQzV3JhcHBlciB7XG5cbiAgICBzdGF0aWMgbGlicmFyeSA9IFwiZDNcIjtcbiAgICBzdGF0aWMgY29udGFpbmVyX2lkID0gXCJ2aXN1YWxpemF0aW9uLWNvbnRhaW5lclwiO1xuXG4gICAgc3RhdGljIHNwZWNpZmljX3NldHRpbmdzID0ge1xuICAgICAgICAnZDMtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgJ2QzLW9wdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgJ2hhc19saW5lJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lcjtcbiAgICBjb250YWluZXJfaWQ7XG5cbiAgICBzZXR0aW5nc19vYmplY3Q7XG4gICAgY29uZmlndXJhdGlvbl9vYmplY3QgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyX2lkID0gRDNXcmFwcGVyLmNvbnRhaW5lcl9pZCkge1xuICAgICAgICB0aGlzLl9zZXR1cExpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICB9XG5cbiAgICBfc2V0dXBMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NldHRpbmdzLWNoYW5nZWQnLCB0aGlzLmhhbmRsZVNldHRpbmdzQ2hhbmdlZEV2ZW50LmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXN1YWxpemF0aW9uLWdlbmVyYXRpb24nLCB0aGlzLmhhbmRsZVZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgaGFuZGxlU2V0dGluZ3NDaGFuZ2VkRXZlbnQoZXZlbnQpIHtcblxuICAgICAgICBsZXQgc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHNldHRpbmdzX29iamVjdC5nZXRMaWJyYXJ5U2V0dGluZ3MoKTtcblxuICAgICAgICBpZihsaWJyYXJ5X3NldHRpbmdzLmxpYnJhcnkgPT09IEQzV3JhcHBlci5saWJyYXJ5KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5jb25maWd1cmF0aW9uX29iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjb25maWd1cmF0aW9uX2V2ZW50ID0gbmV3IENvbmZpZ3VyYXRpb25FdmVudCh0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uX2V2ZW50LmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KGV2ZW50KSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJHcmFwaCBnZW5lcmF0aW9uXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QgPSBldmVudC5kZXRhaWwuc2V0dGluZ3Nfb2JqZWN0O1xuXG4gICAgICAgIGxldCBsaWJyYXJ5X3NldHRpbmdzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0TGlicmFyeVNldHRpbmdzKCk7XG5cbiAgICAgICAgaWYobGlicmFyeV9zZXR0aW5ncy5saWJyYXJ5ID09PSBEM1dyYXBwZXIubGlicmFyeSkge1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgICAgIGxldCBkYXRhc2V0X3NldHRpbmdzID0ge307XG5cbiAgICAgICAgICAgIGxldCBkYXRhX3R5cGUgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXREYXRhVHlwZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBsZXQgYXhpcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldEF4aXNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRDb2x1bW5zU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBzY2FsZXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRTY2FsZXNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGVycm9yX2JhcnMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRFcnJvckJhcnNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldFJhbmdlc1NldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGxldCBoYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmRhdGFfdHlwZSA9IGRhdGFfdHlwZTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDT0xVTU5TXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29sdW1ucyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhheGlzKTtcblxuICAgICAgICAgICAgbGV0IGF4aXNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gYXhpcykge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29sdW1uc1theGlzX2NvbHVtbl0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGF4aXNfY29sdW1uX29iamVjdDtcblxuICAgICAgICAgICAgICAgIGlmKGNvbHVtbnNbYXhpc19jb2x1bW5dLmNvbHVtbl90eXBlID09PSAnc3RhbmRhcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RhbmRhcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNfY29sdW1uX29iamVjdCA9IHRoaXMuX2dldENvbHVtblNldHRpbmdzKGF4aXNbYXhpc19jb2x1bW5dKTtcbiAgICAgICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4uY29sdW1uc1theGlzX2NvbHVtbl0sIC4uLntheGlzOiBheGlzX2NvbHVtbn19XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNvbHVtbnNbYXhpc19jb2x1bW5dLmNvbHVtbl90eXBlID09PSAncHJvY2Vzc2VkJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkN1c3RvbSBjb2x1bW4gc2V0dGluZ3Mgb2JqZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBheGlzX2NvbHVtbl9vYmplY3QgPSB0aGlzLl9nZXRDdXN0b21Db2x1bW5TZXR0aW5ncyhheGlzW2F4aXNfY29sdW1uXSk7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNfY29sdW1uX29iamVjdCA9IHsuLi5heGlzX2NvbHVtbl9vYmplY3QsIC4uLmNvbHVtbnNbYXhpc19jb2x1bW5dLCAuLi57YXhpczogYXhpc19jb2x1bW59fVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVmYXVsdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gdGhpcy5fZ2V0Q29sdW1uU2V0dGluZ3MoYXhpc1theGlzX2NvbHVtbl0pO1xuICAgICAgICAgICAgICAgICAgICBheGlzX2NvbHVtbl9vYmplY3QgPSB7Li4uYXhpc19jb2x1bW5fb2JqZWN0LCAuLi5jb2x1bW5zW2F4aXNfY29sdW1uXSwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBheGlzX3NldHRpbmdzLnB1c2goYXhpc19jb2x1bW5fb2JqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBWElTIFNFVFRJTkdTXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYXhpc19zZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3MuYXhpcyA9IGF4aXNfc2V0dGluZ3M7XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoYXNfZXJyb3JfYmFycyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyc19zZXR0aW5ncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gZXJyb3JfYmFycykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc19jb2x1bW5fb2JqZWN0ID0gdGhpcy5fZ2V0Q29sdW1uU2V0dGluZ3MoZXJyb3JfYmFyc1theGlzX2NvbHVtbl0pO1xuICAgICAgICAgICAgICAgICAgICBheGlzX2NvbHVtbl9vYmplY3QgPSB7Li4uYXhpc19jb2x1bW5fb2JqZWN0LCAuLi57YXhpczogYXhpc19jb2x1bW59fVxuXG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnNfc2V0dGluZ3MucHVzaChheGlzX2NvbHVtbl9vYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3MuZXJyb3JfYmFycyA9IGVycm9yX2JhcnNfc2V0dGluZ3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBkcHAgPSBEYXRhUHJvY2Vzc29yQ29udGFpbmVyLmdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKS5nZXREYXRhUHJlUHJvY2Vzc29yKCk7XG5cbiAgICAgICAgICAgIGxldCBwcm9jZXNzZWRfZGF0YSA9IGRwcC5nZXRQcm9jZXNzZWREYXRhc2V0KGRhdGFzZXRfc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9jZXNzZWRfZGF0YSk7XG5cbiAgICAgICAgICAgIGxldCBwcm9jZXNzZWRfanNvbl9kYXRhID0gZHBwLmRhdGFzZXRUb0pTT05EYXRhKHByb2Nlc3NlZF9kYXRhKTtcblxuICAgICAgICAgICAgYXhpcyA9IHt4OiBwcm9jZXNzZWRfZGF0YS5heGlzWzBdLmNvbHVtbl9uYW1lLCB5OiBwcm9jZXNzZWRfZGF0YS5heGlzWzFdLmNvbHVtbl9uYW1lfTtcblxuICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyc19vYmplY3QgPSB7fTtcblxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnNfb2JqZWN0W2Vycm9yX2Jhci5heGlzXSA9IGVycm9yX2Jhci5jb2x1bW5fbmFtZTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IGRwcC5wcm9jZXNzRXJyb3JCYXJEYXRhSlNPTihwcm9jZXNzZWRfanNvbl9kYXRhLCBheGlzLCBlcnJvcl9iYXJzX29iamVjdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VzdG9tX3JhbmdlX2RhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEsIGVycm9yX2JhcnMpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IGN1c3RvbV9yYW5nZV9kYXRhLmVycm9yX2JhcnM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2aXN1YWxpemF0aW9uID0gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5nZXREM1Zpc3VhbGl6YXRpb24oKTtcblxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbi5pbml0aWFsaXplU2V0dGluZ3MocHJvY2Vzc2VkX2pzb25fZGF0YSwgYXhpcywgc2NhbGVzLCBlcnJvcl9iYXJzLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIHJlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbl9vYmplY3QgPSBTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZ2V0Q29uZmlndXJhdGlvbk9iamVjdChEM1dyYXBwZXIuc3BlY2lmaWNfc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9nZXRDdXN0b21Db2x1bW5TZXR0aW5ncyhjb2x1bW5fc2V0dGluZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJfZ2V0Q3VzdG9tQ29sdW1uU2V0dGluZ3NcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGNvbHVtbl9zZXR0aW5ncyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbHVtbl9leHByZXNzaW9uOiBjb2x1bW5fc2V0dGluZ3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfZ2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uX3NldHRpbmdzKSB7XG4gICAgICAgIGxldCBzZXR0aW5ncyA9IGNvbHVtbl9zZXR0aW5ncy5zcGxpdCgnJCcpO1xuXG4gICAgICAgIGxldCBjb2x1bW5fbG9jYXRpb24gPSBzZXR0aW5nc1swXS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY29sdW1uX25hbWUgPSBzZXR0aW5nc1sxXSB8fCAnJztcblxuICAgICAgICBsZXQgZmlsZV9pZCA9IGNvbHVtbl9sb2NhdGlvblswXTtcbiAgICAgICAgbGV0IGhkdV9pbmRleCA9IGNvbHVtbl9sb2NhdGlvbi5sZW5ndGggPiAxID8gY29sdW1uX2xvY2F0aW9uWzFdIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVfaWQ6IGZpbGVfaWQsXG4gICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOiBjb2x1bW5fbmFtZVxuICAgICAgICB9O1xuICAgIH1cblxufSIsImltcG9ydCB7SW52YWxpZFVSTEVycm9yfSBmcm9tIFwiLi4vZXJyb3JzL0ludmFsaWRVUkxFcnJvclwiO1xuaW1wb3J0IHtIRFVOb3RUYWJ1bGFyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvSERVTm90VGFidWxhckVycm9yXCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tIFwiLi4vdXRpbHMvU3RyaW5nVXRpbHNcIjtcbmltcG9ydCB7RmlsZUxvYWRlZEV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL0ZpbGVMb2FkZWRFdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgRklUU1JlYWRlcldyYXBwZXIge1xuXG4gICAgZmlsZV9wYXRoID0gbnVsbDtcbiAgICBmaWxlID0gbnVsbDtcblxuICAgIHN0YXRpYyBCSU5UQUJMRSA9ICdCSU5UQUJMRSc7XG4gICAgc3RhdGljIFRBQkxFID0gJ1RBQkxFJztcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVfcGF0aCA9IG51bGwpIHtcbiAgICAgICAgaWYoZmlsZV9wYXRoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICAgICAgICAgICAgaWYgKEZJVFNSZWFkZXJXcmFwcGVyLmlzX3BhdGhfdmFsaWQoZmlsZV9wYXRoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZV9wYXRoID0gZmlsZV9wYXRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dldEZpbGUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFVSTEVycm9yKFwiSW52YWxpZCBmaWxlIHBhdGggOiBcIiArIGZpbGVfcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0aWFsaXplRnJvbVBhdGgoZmlsZV9wYXRoKSB7XG4gICAgICAgIGlmKEZJVFNSZWFkZXJXcmFwcGVyLmlzX3BhdGhfdmFsaWQoZmlsZV9wYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5maWxlX3BhdGggPSBmaWxlX3BhdGg7XG4gICAgICAgICAgICB0aGlzLl9nZXRGaWxlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkVVJMRXJyb3IoXCJJbnZhbGlkIGZpbGUgcGF0aCA6IFwiICsgZmlsZV9wYXRoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUZyb21CdWZmZXIoYXJyYXlfYnVmZmVyLCBmaWxlX25hbWUpIHtcbiAgICAgICAgdGhpcy5maWxlX3BhdGggPSBmaWxlX25hbWU7XG4gICAgICAgIHRoaXMuX3JlYWRGaWxlKGFycmF5X2J1ZmZlcik7XG4gICAgfVxuXG4gICAgX2dldEZpbGUoKSB7XG5cbiAgICAgICAgcmV0dXJuIGZldGNoKHRoaXMuZmlsZV9wYXRoKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IsIHN0YXR1cyA9ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoYnVmZmVyKSA9PiB0aGlzLl9yZWFkRmlsZShidWZmZXIpKTtcbiAgICB9XG5cbiAgICBfcmVhZEZpbGUoYXJyYXlCdWZmZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZmlsZSA9IHdpbmRvdy5GSVRTUmVhZGVyLnBhcnNlRklUUyhhcnJheUJ1ZmZlcik7XG5cbiAgICAgICAgICAgIHRoaXMuc2VuZEZJVFNMb2FkZWRFdmVudHMoKTtcblxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW5pdGlhbGl6aW5nIGludGVyZmFjZVwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVfcGF0aDtcbiAgICB9XG5cbiAgICBzZXRGaWxlKGZpbGUpIHtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICB9XG5cbiAgICBzZXRGaWxlRnJvbUZpbGVPYmplY3QoZmlsZV9vYmplY3QpIHtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZV9vYmplY3QuZmlsZTtcbiAgICAgICAgdGhpcy5hcmZfZmlsZSA9IGZpbGVfb2JqZWN0LmFyZl9maWxlX2lkO1xuICAgICAgICB0aGlzLnJtZl9maWxlID0gZmlsZV9vYmplY3Qucm1mX2ZpbGVfaWQ7XG4gICAgfVxuXG4gICAgZ2V0SERVKGhkdV9pbmRleCkge1xuICAgICAgICBpZihoZHVfaW5kZXggPj0gMCAmJiBoZHVfaW5kZXggPCB0aGlzLmZpbGUuaGR1cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGUuaGR1c1toZHVfaW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIRFVzKCkge1xuXG4gICAgICAgIGxldCBIRFVzID0gW107XG4gICAgICAgIGxldCBoZHVfb2JqZWN0O1xuICAgICAgICBsZXQgdHlwZTtcbiAgICAgICAgbGV0IGV4dG5hbWUgPSAnJztcblxuICAgICAgICB0aGlzLmZpbGUuaGR1cy5mb3JFYWNoKGZ1bmN0aW9uKGhkdSwgaW5kZXgpIHtcblxuICAgICAgICAgICAgaWYgKGhkdS5oZWFkZXIucHJpbWFyeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlBSSU1BUllcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuICAgICAgICAgICAgICAgIGV4dG5hbWUgPSBoZHUuaGVhZGVyLmdldCgnRVhUTkFNRScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoZHVfb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiB0eXBlLFxuICAgICAgICAgICAgICAgIFwiaW5kZXhcIjogaW5kZXgsXG4gICAgICAgICAgICAgICAgXCJleHRuYW1lXCI6IGV4dG5hbWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEhEVXMucHVzaChoZHVfb2JqZWN0KTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gSERVcztcbiAgICB9XG5cbiAgICBnZXRUYWJ1bGFySERVcygpIHtcbiAgICAgICAgbGV0IHRhYnVsYXJfaGR1c19pbmRleCA9IFtdO1xuXG4gICAgICAgIHRoaXMuZmlsZS5oZHVzLmZvckVhY2goZnVuY3Rpb24oaGR1LCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGhkdS5oZWFkZXIucHJpbWFyeSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmKGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpID09PSBcIlRBQkxFXCIgfHwgaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJykgPT09IFwiQklOVEFCTEVcIikge1xuICAgICAgICAgICAgICAgICAgICB0YWJ1bGFyX2hkdXNfaW5kZXgucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB0YWJ1bGFyX2hkdXNfaW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDb2x1bW5Gcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sdW1uX251bWJlciA9IG51bGw7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGNvbHVtbl9udW1iZXIgPSBkYXRhLmNvbHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSERVTm90VGFidWxhckVycm9yKFwiU2VsZWN0ZWQgSERVIGlzIG5vdCB0YWJ1bGFyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW1iZXI7XG4gICAgfVxuXG4gICAgZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcbiAgICAgICAgbGV0IGNvbHVtbl9uYW1lO1xuXG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG4gICAgICAgICAgICBkYXRhLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uX25hbWUgPSBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sdW1ucztcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5zSlNPTkRhdGFGcm9tSERVKGhkdV9pbmRleCkge1xuXG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG4gICAgICAgIGxldCBkYXRhID0gaGR1LmRhdGE7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZHUuaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sdW1uc19kYXRhX2pzb24gPSBbXTtcbiAgICAgICAgbGV0IHJhd19jb2x1bW5zX2RhdGFfYXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IGNvbHVtbl9kYXRhO1xuXG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG4gICAgICAgICAgICBkYXRhLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4pIHtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGNvbHVtbiwgZnVuY3Rpb24gKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSBjb2w7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByYXdfY29sdW1uc19kYXRhX2FycmF5W2NvbHVtbl0gPSBjb2x1bW5fZGF0YTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5fbmFtZXMgPSBPYmplY3Qua2V5cyhyYXdfY29sdW1uc19kYXRhX2FycmF5KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdfY29sdW1uc19kYXRhX2FycmF5W2NvbHVtbl9uYW1lc1swXV0ubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fanNvbl9kYXRhX29iamVjdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29sdW1uX25hbWVzLmZvckVhY2goKGNvbHVtbl9uYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9qc29uX2RhdGFfb2JqZWN0W2NvbHVtbl9uYW1lXSA9IHJhd19jb2x1bW5zX2RhdGFfYXJyYXlbY29sdW1uX25hbWVdW2ldO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29sdW1uc19kYXRhX2pzb24ucHVzaChjb2x1bW5fanNvbl9kYXRhX29iamVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sdW1uc19kYXRhX2pzb247XG4gICAgfVxuXG4gICAgZ2V0Q29sdW1uRGF0YUZyb21IRFUoaGR1X2luZGV4LCBjb2x1bW5fbmFtZSkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG5cbiAgICAgICAgbGV0IGNvbF9kYXRhID0gW107XG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG5cbiAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGNvbHVtbl9uYW1lLCBmdW5jdGlvbihjb2wpe1xuICAgICAgICAgICAgICAgIGlmKGNvbFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoZWFkZXJfY29sX2RhdGEgPSBoZHUuaGVhZGVyLmdldChjb2x1bW5fbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IGNvbC5tYXAoKCkgPT4gaGVhZGVyX2NvbF9kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb2xfZGF0YSA9IGNvbDtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sX2RhdGE7XG4gICAgfVxuXG4gICAgZ2V0SGVhZGVyRnJvbUhEVShoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcjtcbiAgICB9XG5cbiAgICBnZXREYXRhRnJvbUhEVShoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGRhdGEgPSBoZHUuZGF0YTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBnZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGhkdV9pbmRleCwgY2FyZF9uYW1lKSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGhlYWRlci5nZXQoY2FyZF9uYW1lKTtcblxuICAgICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldEhlYWRlckNhcmRzVmFsdWVGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGNvbnN0IGNhcmRzX2FycmF5ID0gW107XG5cbiAgICAgICAgT2JqZWN0LmVudHJpZXMoaGR1LmhlYWRlci5jYXJkcykuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBsZXQgaXRlbV92YWx1ZV9hcnJheSA9IGl0ZW1bMV07XG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiBpdGVtX3ZhbHVlX2FycmF5ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtX3ZhbHVlX2FycmF5KSkge1xuICAgICAgICAgICAgICAgIGl0ZW1fdmFsdWVfYXJyYXlbJ2NhcmRfbmFtZSddID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjYXJkc19hcnJheS5wdXNoKGl0ZW1fdmFsdWVfYXJyYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBzb3J0ZWRfaGR1X2NhcmRzID0gY2FyZHNfYXJyYXkuc29ydCgoYSwgYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gICAgICAgIHJldHVybiBzb3J0ZWRfaGR1X2NhcmRzO1xuICAgIH1cblxuICAgIGlzSERVVGFidWxhcihoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuXG4gICAgICAgIGxldCBpc190YWJ1bGFyID0gZmFsc2U7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGlzX3RhYnVsYXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzX3RhYnVsYXI7XG4gICAgfVxuXG4gICAgX2lzSERVVGFidWxhcihoZHUpIHtcbiAgICAgICAgbGV0IGV4dGVuc2lvbiA9IGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuICAgICAgICByZXR1cm4gZXh0ZW5zaW9uID09PSBGSVRTUmVhZGVyV3JhcHBlci5CSU5UQUJMRSB8fCBleHRlbnNpb24gPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFO1xuICAgIH1cblxuICAgIGdldEFsbENvbHVtbnMoKSB7XG4gICAgICAgIGxldCBjb2x1bW5zID0gW107XG5cbiAgICAgICAgdGhpcy5maWxlLmhkdXMuZm9yRWFjaCgoaGR1LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICBpZih0aGlzLl9pc0hEVVRhYnVsYXIoaGR1KSkge1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWUgPSB0aGlzLmdldENvbHVtbnNOYW1lRnJvbUhEVShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5zX25hbWUuZm9yRWFjaCgoY29sdW1uX25hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbHVtbl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGlmKGhkdS5oZWFkZXIuZ2V0KCdUSU1FREVMJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdUSU1FREVMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoaGR1LmhlYWRlci5nZXQoJ0FOQ1JGSUxFJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY3JmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeU5hbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmdVdGlscy5jbGVhbkZpbGVOYW1lKGhkdS5oZWFkZXIuZ2V0KCdBTkNSRklMRScpKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGFuY3JmaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcncgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGFuY3JmaWxlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYodGhpcy5hcmZfZmlsZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmNyZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZCh0aGlzLmFyZl9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihhbmNyZmlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gbmV3IEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShhbmNyZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoaGR1LmhlYWRlci5nZXQoJ1JFU1BGSUxFJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeU5hbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmdVdGlscy5jbGVhbkZpbGVOYW1lKGhkdS5oZWFkZXIuZ2V0KCdSRVNQRklMRScpKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BmaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcncgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUocmVzcGZpbGUuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoZHVzX2luZGV4ID0gZnJ3LmdldFRhYnVsYXJIRFVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNfZV9taW5fbWF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZHVzX2luZGV4LmZvckVhY2goKGhkdV9pbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWUgPSBmcncuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbnNfbmFtZS5pbmNsdWRlcyhcIkVfTUlOXCIpICYmIGNvbHVtbnNfbmFtZS5pbmNsdWRlcyhcIkVfTUFYXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc19lX21pbl9tYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZV9taW5fbWF4X2hkdXNfaW5kZXggPSBoZHVfaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX0hBTEZfV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRV9NSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRV9NSURfTE9HJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZnJvbV9oZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9maWxlOiByZXNwZmlsZS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0aGlzLnJtZl9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZCh0aGlzLnJtZl9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwZmlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gbmV3IEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKHJlc3BmaWxlLmZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGR1c19pbmRleCA9IGZydy5nZXRUYWJ1bGFySERVcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGFzX2VfbWluX21heCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGR1c19pbmRleC5mb3JFYWNoKChoZHVfaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uc19uYW1lID0gZnJ3LmdldENvbHVtbnNOYW1lRnJvbUhEVShoZHVfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5zX25hbWUuaW5jbHVkZXMoXCJFX01JTlwiKSAmJiBjb2x1bW5zX25hbWUuaW5jbHVkZXMoXCJFX01BWFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNfZV9taW5fbWF4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVfbWluX21heF9oZHVzX2luZGV4ID0gaGR1X2luZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2x1bW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRV9IQUxGX1dJRFRIJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZnJvbV9oZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9maWxlOiByZXNwZmlsZS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0VfTUlEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZnJvbV9oZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9maWxlOiByZXNwZmlsZS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0VfTUlEX0xPRycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Byb2Nlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZmlsZTogcmVzcGZpbGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgIH1cblxuICAgIHNlbmRGSVRTTG9hZGVkRXZlbnRzKCkge1xuICAgICAgICBsZXQgZmlsZWxlID0gbmV3IEZpbGVMb2FkZWRFdmVudCh7XG4gICAgICAgICAgICBmaWxlX25hbWU6IHRoaXMuZmlsZV9wYXRoLFxuICAgICAgICAgICAgdHlwZTogJ2ZpdHMnLFxuICAgICAgICAgICAgZmlsZTogdGhpcy5maWxlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGVsZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNfcGF0aF92YWxpZChwYXRoKSB7XG4gICAgICAgIGxldCBpc192YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmKEZJVFNSZWFkZXJXcmFwcGVyLl9pc1BhdGhWYWxpZChwYXRoKSB8fCBGSVRTUmVhZGVyV3JhcHBlci5faXNVUkxWYWxpZChwYXRoKSkge1xuICAgICAgICAgICAgaXNfdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzX3ZhbGlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNVUkxWYWxpZCh1cmwpIHtcbiAgICAgICAgY29uc3QgdXJsUmVnZXggPSAvXihmdHB8aHR0cHxodHRwcyk6XFwvXFwvW14gXCJdKyQvO1xuICAgICAgICByZXR1cm4gdXJsUmVnZXgudGVzdCh1cmwpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNQYXRoVmFsaWQocGF0aCkge1xuICAgICAgICBjb25zdCBwYXRoUmVnZXggPSAvXihcXC9bYS16QS1aMC05Ll8tXSspK1xcLz8kLztcbiAgICAgICAgcmV0dXJuIHBhdGhSZWdleC50ZXN0KHBhdGgpO1xuICAgIH1cblxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRklUU1JlYWRlcldyYXBwZXIgfSBmcm9tICcuL3dyYXBwZXJzL0ZJVFNSZWFkZXJXcmFwcGVyLmpzJ1xuaW1wb3J0IHsgQm9rZWhXcmFwcGVyIH0gZnJvbSAnLi93cmFwcGVycy9Cb2tlaFdyYXBwZXIuanMnXG5pbXBvcnQgeyBEM1dyYXBwZXIgfSBmcm9tICcuL3dyYXBwZXJzL0QzV3JhcHBlci5qcydcbmltcG9ydCB7IFdyYXBwZXJDb250YWluZXIgfSBmcm9tICcuL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lci5qcydcbmltcG9ydCB7IFZpc3VhbGl6YXRpb25Db250YWluZXIgfSBmcm9tICcuL2NvbnRhaW5lcnMvVmlzdWFsaXphdGlvbkNvbnRhaW5lci5qcydcbmltcG9ydCB7IEZpbGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvRmlsZUNvbXBvbmVudC5qcydcbmltcG9ydCB7IFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL1NldHRpbmdzQ29tcG9uZW50LmpzJ1xuaW1wb3J0IHsgVmlzdWFsaXphdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9WaXN1YWxpemF0aW9uQ29tcG9uZW50LmpzJ1xuaW1wb3J0IHsgRklUU1NldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9GSVRTU2V0dGluZ3NDb21wb25lbnQuanMnXG5pbXBvcnQgeyBDU1ZTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9maWxlX3R5cGUvQ1NWU2V0dGluZ3NDb21wb25lbnQuanMnXG5pbXBvcnQgeyBEM0dyYXBoIH0gZnJvbSBcIi4vdmlzdWFsaXphdGlvbnMvRDNHcmFwaFwiO1xuaW1wb3J0IHsgQm9rZWhHcmFwaCB9IGZyb20gXCIuL3Zpc3VhbGl6YXRpb25zL0Jva2VoR3JhcGhcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuaW1wb3J0IHtSZWdpc3RyeUNvbnRhaW5lcn0gZnJvbSBcIi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuaW1wb3J0IHtBcml0aG1ldGljQ29sdW1uSW5wdXR9IGZyb20gXCIuL2NvbXBvbmVudHMvaW5wdXRzL0FyaXRobWV0aWNDb2x1bW5JbnB1dFwiO1xuaW1wb3J0IHtDdXN0b21Db2x1bW5SZWdpc3RyeX0gZnJvbSBcIi4vcmVnaXN0cmllcy9DdXN0b21Db2x1bW5SZWdpc3RyeVwiO1xuXG5sZXQgZmlsZV9wYXRoID0gd2luZG93LmxvY2F0aW9uLmhyZWYgKyBcIl90ZXN0X2ZpbGVzL3NwaWFjc19sY19xdWVyeS5maXRzXCI7XG5cbmxldCBmaXRzX3JlYWRlcl93cmFwcGVyID0gbmV3IEZJVFNSZWFkZXJXcmFwcGVyKGZpbGVfcGF0aCk7XG5cbmxldCBib2tlaF93cmFwcGVyID0gbmV3IEJva2VoV3JhcHBlcigpO1xuXG5sZXQgZDNfd3JhcHBlciA9IG5ldyBEM1dyYXBwZXIoKTtcblxuV3JhcHBlckNvbnRhaW5lci5zZXRGSVRTUmVhZGVyV3JhcHBlcihmaXRzX3JlYWRlcl93cmFwcGVyKTtcbldyYXBwZXJDb250YWluZXIuc2V0Qm9rZWhXcmFwcGVyKGJva2VoX3dyYXBwZXIpO1xuV3JhcHBlckNvbnRhaW5lci5zZXREM1dyYXBwZXIoZDNfd3JhcHBlcik7XG5cblZpc3VhbGl6YXRpb25Db250YWluZXIuc2V0Qm9rZWhWaXN1YWxpemF0aW9uKG5ldyBCb2tlaEdyYXBoKCkpO1xuVmlzdWFsaXphdGlvbkNvbnRhaW5lci5zZXREM1Zpc3VhbGl6YXRpb24obmV3IEQzR3JhcGgoKSk7XG5cblJlZ2lzdHJ5Q29udGFpbmVyLnNldEZpbGVSZWdpc3RyeShuZXcgRmlsZVJlZ2lzdHJ5KCkpO1xuUmVnaXN0cnlDb250YWluZXIuc2V0Q3VzdG9tQ29sdW1uUmVnaXN0cnkobmV3IEN1c3RvbUNvbHVtblJlZ2lzdHJ5KCkpO1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2ZpbGUtY29tcG9uZW50JywgRmlsZUNvbXBvbmVudCk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3NldHRpbmdzLWNvbXBvbmVudCcsIFNldHRpbmdzQ29tcG9uZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndmlzdWFsaXphdGlvbi1jb21wb25lbnQnLCBWaXN1YWxpemF0aW9uQ29tcG9uZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZml0cy1jb21wb25lbnQnLCBGSVRTU2V0dGluZ3NDb21wb25lbnQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjc3YtY29tcG9uZW50JywgQ1NWU2V0dGluZ3NDb21wb25lbnQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdhcml0aG1ldGljLWNvbHVtbi1jb21wb25lbnQnLCBBcml0aG1ldGljQ29sdW1uSW5wdXQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9