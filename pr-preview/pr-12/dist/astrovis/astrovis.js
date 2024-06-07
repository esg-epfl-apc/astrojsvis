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
    }

    _setupInnerElementsListeners() {
        this._setSelectLibraryListener();
        this._setSelectDataTypeListener()
        this._setSelectHDUsListener();
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

                fits_reader_wrapper.setFile(file.file);
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
        this._setSelectGroupErrorBars(select_options);
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
            let scales = {};

            axis.x = values['select-axis-x'].value;
            axis.y = values['select-axis-y'].value;

            scales.x = values['select-axis-x-scale'].value;
            scales.y = values['select-axis-y-scale'].value;

            this.settings_object.setAxisSettings(axis);
            this.settings_object.setScalesSettings(scales);
        }

        if(values['has-error-bars-checkbox']) {
            if(values['has-error-bars-checkbox'].checked === true) {
                let error_bars = {};

                error_bars.x = values['select-axis-x-error-bar'].value;
                error_bars.y = values['select-axis-y-error-bar'].value;

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

            if(window.getComputedStyle(select, null).getPropertyValue("display") !== 'none' && value !== 'none') {
                form_values[id] = {classes, value};
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




class FITSSettingsComponent extends HTMLElement {

    container_id = "fits-settings-container";
    select_hdu_id = "select-hdu-file";
    table_header_id = "table-header-data";
    table_data_id = "table-data";

    file = null;
    is_current = false;

    add_to_plot_btn_id = "add-to-plot";
    remove_from_plot_btn_id = "remove-from-plot";

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
            '                                    <!-- button class="btn btn-success" id="save-file-settings">Save changes</button -->\n' +
            '                                    <button class="btn btn-primary" id="add-to-plot">Add to plot</button>\n' +
            '                                    <button class="btn btn-danger" id="remove-from-plot">Remove from plot</button>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>'

    }

    setupComponent() {
        this.setHDUSelect();
        this.setupActionButtons();

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
            frce.dispatchToSubscribers();

            this.resetContainerForCurrentFile();

        });

        remove_from_plot_btn.addEventListener('click', (event) => {
            _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.removeFromCurrentFiles(this.file.id);

            this.is_current = false;

            let frce = new _events_FileRegistryChangeEvent__WEBPACK_IMPORTED_MODULE_2__.FileRegistryChangeEvent();
            frce.dispatchToSubscribers();

            this.resetContainerForCurrentFile();
        });
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

    resetContainerForCurrentFile() {
        this.setupComponent();
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


class RegistryContainer {

    constructor() {

    }

    getEventSubscribersRegistry() {
        return new _registries_EventSubscribersRegistry_js__WEBPACK_IMPORTED_MODULE_0__.EventSubscribersRegistry();
    }

    static getRegistryContainer() {
        return new RegistryContainer();
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





class DataPreProcessor {

    constructor() {

    }

    getProcessedDataset(dataset_settings_object) {
        let dataset = {};

        dataset_settings_object.axis.forEach((axis) => {

            let file_object = _registries_FileRegistry__WEBPACK_IMPORTED_MODULE_1__.FileRegistry.getFileById(axis.file_id);

            let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_0__.WrapperContainer.getFITSReaderWrapper();
            frw.setFile(file_object.file);

            let column_data;

            if(dataset_settings_object.data_type.type === 'spectrum' &&
                _SpectrumProcessor__WEBPACK_IMPORTED_MODULE_2__.SpectrumProcessor.processed_columns_name.includes(axis.column_name)) {

                column_data = this.getSpectrumProcessedColumn(axis.hdu_index, axis.column_name, frw)
            } else {
                column_data = frw.getColumnDataFromHDU(axis.hdu_index, axis.column_name);
            }

            axis.data = column_data;

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
                            console.log(col_data);
                        })
                    }

                } else {
                    column_data = frw.getColumnDataFromHDU(error_bar.hdu_index, error_bar.column_name);
                }

                error_bar.data = column_data;
            })
        }

        dataset = dataset_settings_object;

        return dataset;
    }

    datasetToJSONData(dataset_settings_object) {
        let rows = [];

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

        let error_bar_x_values = [];
        let error_bar_y_values = [];

        let axis_x = axis.x;
        let axis_y = axis.y;

        let error_bar_x_column = error_bars.x;
        let error_bar_y_column = error_bars.y;

        dataset.forEach(function(datapoint){
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

        return { x: error_bar_x_values, y: error_bar_y_values }
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


class FileRegistryChangeEvent {

    static defaultOptions = {
        bubbles: true,
        composed: false
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
        subscribers_id.forEach((subscriber_id) => {
            subscriber_element = document.getElementById(subscriber_id);
            subscriber_element.dispatchEvent(this.event);
        })
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
        'file-selected': ['settings-component'],
        'file-registry-change': ['settings-component', 'file-component']
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

            if (error_bars) {
                this.has_error_bars = true;
                this.error_bars = error_bars;

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

        let error_bar_x = {x: error_bars.x};

        let line_error_bar_x = d3.line()
            .x(d => this.x_scale(d[this.x_axis_data_col]))
            .y(d => this.y_scale(d.bound));

        error_bars.x.forEach((error_bar) => {
            d3.select('#data-plot').append("path")
                .attr("class", "error-bar-x")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line_error_bar_x(error_bar));
        })

        let line_error_bar_y = d3.line()
            .x(d => this.x_scale(d.bound))
            .y(d => this.y_scale(d[this.y_axis_data_col]));

        error_bars.y.forEach((error_bar) => {
            d3.select('#data-plot').append("path")
                .attr("class", "error-bar-x")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line_error_bar_y(error_bar));
        })

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

            let line_error_bar_x = d3.line()
                .x(d => rescaled_x(d[this.x_axis_data_col]))
                .y(d => rescaled_y(d.bound));

            this.error_bars.x.forEach((error_bar) => {
                d3.select('#data-plot').append("path")
                    .attr("class", "error-bar-x")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_x(error_bar));
            })

            let line_error_bar_y = d3.line()
                .x(d => rescaled_x(d.bound))
                .y(d => rescaled_y(d[this.y_axis_data_col]));

            this.error_bars.y.forEach((error_bar) => {
                d3.select('#data-plot').append("path")
                    .attr("class", "error-bar-x")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_y(error_bar));
            })
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

            let processed_json_data = dpp.datasetToJSONData(processed_data);

            let data_type = this.settings_object.getDataTypeSettings();
            let hdu = this.settings_object.getHDUsSettings();

            let scales = this.settings_object.getScalesSettings();


            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};
            let labels = axis;

            processed_data.axis[0].data = processed_data.axis[0].data.map(value => isNaN(value) ? 0 : value);
            processed_data.axis[1].data = processed_data.axis[1].data.map(value => isNaN(value) ? 0 : value);


            let data = {x: processed_data.axis[0].data, y: processed_data.axis[1].data};

            if(error_bars) {
                error_bars = {x: processed_data.error_bars[0].column_name, y: processed_data.error_bars[1].column_name};

                processed_data.error_bars[0].data = processed_data.error_bars[0].data.map(value => !isFinite(value) ? 0 : value);
                processed_data.error_bars[1].data = processed_data.error_bars[1].data.map(value => !isFinite(value) ? 0 : value);

                data.dx = processed_data.error_bars[0].data.map(value => isNaN(value) ? 0 : value);
                data.dy = processed_data.error_bars[1].data.map(value => isNaN(value) ? 0 : value);

                let asymmetric_uncertainties = false;

                if(data_type === 'spectrum') {
                    asymmetric_uncertainties = true;
                }

                data = this._processErrorBarData(data, asymmetric_uncertainties);

                has_error_bars = true;
            }

            let ranges = this.settings_object.getRangesSettings();
            let has_custom_range = false;
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

    getProcessedData(data_type, hdu_index, axis, error_bars) {
        let data = null;

        let dpc = _containers_DataProcessorContainer__WEBPACK_IMPORTED_MODULE_1__.DataProcessorContainer.getDataProcessorContainer();
        let data_processor;

        let frw = _containers_WrapperContainer__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.getFITSReaderWrapper();

        if(data_type === 'light-curve') {
            data_processor = dpc.getLightCurveProcessor(frw, hdu_index);
        } else if(data_type === 'spectrum') {
            data_processor = dpc.getSpectrumProcessor(frw, hdu_index);
        }

        data = data_processor.processDataRawJSON(axis, error_bars);

        if(error_bars) {
            data = this._processErrorBarData(data);
        }

        return data;
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
        this.settings_object = event.detail.settings_object;

        let library_settings = this.settings_object.getLibrarySettings();

        if(library_settings.library === D3Wrapper.library) {

            this.resetContainer();

            let dataset_settings = {};

            let data_type = this.settings_object.getDataTypeSettings();
            let axis = this.settings_object.getAxisSettings();
            let scales = this.settings_object.getScalesSettings();
            let error_bars = this.settings_object.getErrorBarsSettings();
            let ranges = this.settings_object.getRangesSettings();

            let has_error_bars = false;

            dataset_settings.data_type = data_type;

            let axis_settings = [];
            for(let axis_column in axis) {
                let axis_column_object = this._getColumnSettings(axis[axis_column]);
                axis_column_object = {...axis_column_object, ...{axis: axis_column}}

                axis_settings.push(axis_column_object);
            }

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
            let processed_json_data = dpp.datasetToJSONData(processed_data);

            axis = {x: processed_data.axis[0].column_name, y: processed_data.axis[1].column_name};

            if(has_error_bars) {
                error_bars = {x: processed_data.error_bars[0].column_name, y: processed_data.error_bars[1].column_name};
                error_bars = dpp.processErrorBarDataJSON(processed_json_data, axis, error_bars)
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













let file_path = window.location.href + "_test_files/spiacs_lc_query.fits";

let fits_reader_wrapper = new _wrappers_FITSReaderWrapper_js__WEBPACK_IMPORTED_MODULE_0__.FITSReaderWrapper(file_path);

let bokeh_wrapper = new _wrappers_BokehWrapper_js__WEBPACK_IMPORTED_MODULE_1__.BokehWrapper();

let d3_wrapper = new _wrappers_D3Wrapper_js__WEBPACK_IMPORTED_MODULE_2__.D3Wrapper();

_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setBokehWrapper(bokeh_wrapper);
_containers_WrapperContainer_js__WEBPACK_IMPORTED_MODULE_3__.WrapperContainer.setD3Wrapper(d3_wrapper);

_containers_VisualizationContainer_js__WEBPACK_IMPORTED_MODULE_4__.VisualizationContainer.setBokehVisualization(new _visualizations_BokehGraph__WEBPACK_IMPORTED_MODULE_11__.BokehGraph());
_containers_VisualizationContainer_js__WEBPACK_IMPORTED_MODULE_4__.VisualizationContainer.setD3Visualization(new _visualizations_D3Graph__WEBPACK_IMPORTED_MODULE_10__.D3Graph());

customElements.define('file-component', _components_FileComponent_js__WEBPACK_IMPORTED_MODULE_5__.FileComponent);
customElements.define('settings-component', _components_SettingsComponent_js__WEBPACK_IMPORTED_MODULE_6__.SettingsComponent);
customElements.define('visualization-component', _components_VisualizationComponent_js__WEBPACK_IMPORTED_MODULE_7__.VisualizationComponent);
customElements.define('fits-component', _components_file_type_FITSSettingsComponent_js__WEBPACK_IMPORTED_MODULE_8__.FITSSettingsComponent);
customElements.define('csv-component', _components_file_type_CSVSettingsComponent_js__WEBPACK_IMPORTED_MODULE_9__.CSVSettingsComponent);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVULGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixzRkFBc0I7O0FBRXZDO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsaUVBQWlCO0FBQ25ELFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQzlRTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3REFBd0QsUUFBUTtBQUNoRSx3REFBd0QsUUFBUTs7QUFFaEU7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHVFQUF1RSxTQUFTOztBQUVoRjtBQUNBO0FBQ0E7O0FBRUEsdUVBQXVFLG1CQUFtQjs7QUFFMUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0RBQXdELGNBQWM7QUFDdEUsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNB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QUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QywyQkFBMkI7QUFDbEUsdUNBQXVDLDJCQUEyQjtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsc0NBQXNDO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsb0NBQW9DO0FBQzNFLHVDQUF1QyxvQ0FBb0M7O0FBRTNFO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNaZ0U7QUFDWTtBQUNBO0FBQ1o7QUFDUTs7QUFFakU7O0FBRVA7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsMEVBQWtCOztBQUVoRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQywyQkFBMkI7O0FBRWpFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQywyQkFBMkI7O0FBRXJFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0Isc0ZBQXNCOztBQUU1Qzs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTs7O0FBR0Esd0JBQXdCOztBQUV4QjtBQUNBLDhCQUE4Qjs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxnQ0FBZ0Msc0ZBQXNCOztBQUV0RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0Isc0ZBQXNCO0FBQ3hDOztBQUVBLGtCQUFrQiwwRUFBZ0I7O0FBRWxDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0Msa0ZBQXFCO0FBQ3pEOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqUGdFO0FBQ1k7QUFDQTtBQUNKOztBQUVqRTs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLDBFQUFrQjtBQUNoRTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQywyQkFBMkI7O0FBRWpFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsMkJBQTJCOztBQUVyRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLHNGQUFzQjs7QUFFNUM7QUFDQTs7QUFFQSxvQkFBb0I7O0FBRXBCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0Msc0ZBQXNCOztBQUV0RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxrRkFBcUI7QUFDekQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEswRDtBQUNNO0FBQ1I7QUFDUDtBQUNTOztBQUVuRDs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCwwQkFBMEIsb0VBQWU7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNCQUFzQixvRUFBZTtBQUNyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsZ0JBQWdCO0FBQzVFO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVixzQkFBc0IsMEVBQWtCO0FBQ3hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVixzQkFBc0IsMEVBQWtCO0FBQ3hDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsa0JBQWtCOztBQUVsQjs7QUFFQTtBQUNBLGFBQWE7O0FBRWI7O0FBRUEsNEJBQTRCLG9EQUFvRDs7QUFFaEY7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQSxVQUFVO0FBQ1Ysc0JBQXNCLDBFQUFrQjtBQUN4Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhOztBQUViLFVBQVU7QUFDVixzQkFBc0IsMEVBQWtCO0FBQ3hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsa0VBQVk7QUFDL0Msd0JBQXdCLDJEQUFXO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsbUNBQW1DLGtFQUFZO0FBQy9DLHdCQUF3QiwyREFBVztBQUNuQzs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5Qjs7QUFFekI7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixvRUFBZTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O1VDbmJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05tRTtBQUNWO0FBQ047QUFDZ0I7QUFDWTtBQUNsQjtBQUNRO0FBQ1U7QUFDUTtBQUNGO0FBQ2xDO0FBQ007O0FBRXpEOztBQUVBLDhCQUE4Qiw2RUFBaUI7O0FBRS9DLHdCQUF3QixtRUFBWTs7QUFFcEMscUJBQXFCLDZEQUFTOztBQUU5Qiw2RUFBZ0I7QUFDaEIsNkVBQWdCO0FBQ2hCLDZFQUFnQjs7QUFFaEIseUZBQXNCLDJCQUEyQixtRUFBVTtBQUMzRCx5RkFBc0Isd0JBQXdCLDZEQUFPOztBQUVyRCx3Q0FBd0MsdUVBQWE7QUFDckQsNENBQTRDLCtFQUFpQjtBQUM3RCxpREFBaUQseUZBQXNCO0FBQ3ZFLHdDQUF3QyxpR0FBcUI7QUFDN0QsdUNBQXVDLCtGQUFvQiIsInNvdXJjZXMiOlsid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvRmlsZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvU2V0dGluZ3NDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL1Zpc3VhbGl6YXRpb25Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9DU1ZTZXR0aW5nc0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbXBvbmVudHMvZmlsZV90eXBlL0ZJVFNTZXR0aW5nc0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvUmVnaXN0cnlDb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb250YWluZXJzL1NldHRpbmdzQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZGF0YV9wcm9jZXNzb3JzL0RhdGFQcmVQcm9jZXNzb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9kYXRhX3Byb2Nlc3NvcnMvTGlnaHRDdXJ2ZVByb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2RhdGFfcHJvY2Vzc29ycy9TcGVjdHJ1bVByb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9FdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXJyb3JzL0hEVU5vdFRhYnVsYXJFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9JbnZhbGlkVVJMRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9lcnJvcnMvTm9FdmVudFRvRGlzcGF0Y2hFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9ldmVudHMvRmlsZUxvYWRlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1NldHRpbmdzQ2hhbmdlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1Zpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9yZWdpc3RyaWVzL0V2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vc2V0dGluZ3MvU2V0dGluZ3NDb25maWd1cmF0aW9uLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vc2V0dGluZ3MvVmlzdWFsaXphdGlvblNldHRpbmdzLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdXRpbHMvT2JqZWN0VXRpbHMuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi91dGlscy9TdHJpbmdVdGlscy5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3Zpc3VhbGl6YXRpb25zL0Jva2VoR3JhcGguanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi92aXN1YWxpemF0aW9ucy9EM0dyYXBoLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vd3JhcHBlcnMvQm9rZWhXcmFwcGVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vd3JhcHBlcnMvRDNXcmFwcGVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vd3JhcHBlcnMvRklUU1JlYWRlcldyYXBwZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FzdHJvdmlzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQXN0cm92aXNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiQXN0cm92aXNcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IHtXcmFwcGVyQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyXCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50XCI7XG5pbXBvcnQge0ZJVFNTZXR0aW5nc0NvbXBvbmVudH0gZnJvbSBcIi4vZmlsZV90eXBlL0ZJVFNTZXR0aW5nc0NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIHN0YXRpYyBjb21wb25lbnRfaWQgPSBcImZpbGVfY29tcG9uZW50XCI7XG4gICAgc3RhdGljIHNlbGVjdF9maWxlID0gXCJzZWxlY3QtZmlsZVwiO1xuICAgIHN0YXRpYyBpbnB1dF9maWxlX3VybCA9IFwiZmlsZS1pbnB1dC11cmxcIjtcbiAgICBzdGF0aWMgaW5wdXRfZmlsZV9sb2NhbCA9IFwiZmlsZS1pbnB1dC1sb2NhbFwiO1xuICAgIHN0YXRpYyBpbnB1dF9maWxlX3R5cGUgPSBcInNlbGVjdC1maWxlLXR5cGVcIjtcbiAgICBzdGF0aWMgbG9hZF9idXR0b24gPSBcImxvYWQtZmlsZVwiO1xuXG4gICAgc3RhdGljIGF2YWlsYWJsZV9maWxlc19saXN0X2lkID0gJ2F2YWlsYWJsZS1maWxlcy1saXN0JztcbiAgICBzdGF0aWMgY3VycmVudF9maWxlc19saXN0X2lkID0gJ2N1cnJlbnQtZmlsZXMtbGlzdCc7XG5cbiAgICBzdGF0aWMgZmlsZV9zZXR0aW5nc19jb250YWluZXJfaWQgPSAnZmlsZS1zZXR0aW5ncy1jb250YWluZXInO1xuXG4gICAgc3RhdGljIHNhdmVfYnV0dG9uX2lkID0gJ3NhdmUtZmlsZS1zZXR0aW5ncyc7XG4gICAgc3RhdGljIGFkZF9idXR0b25faWQgPSAnYWRkLXRvLXBsb3QnXG4gICAgc3RhdGljIHJlbW92ZV9idXR0b25faWQgPSAncmVtb3ZlLWZyb20tcGxvdCdcblxuICAgIGNvbnRhaW5lcl9pZDtcbiAgICBjb250YWluZXI7XG5cbiAgICBmaXRzX3JlYWRlcl93cmFwcGVyID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcl9pZCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IGNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQgPSB0aGlzLmhhbmRsZUZJVFNMb2FkZWRFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdENoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVTZWxlY3RDaGFuZ2VFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZUxvYWRGaWxlRXZlbnQgPSB0aGlzLmhhbmRsZUxvYWRGaWxlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlTG9hZGVkRXZlbnQgPSB0aGlzLmhhbmRsZUZpbGVMb2FkZWRFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZUZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBJbm5lckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIF9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpdHMtbG9hZGVkJywgdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbGUtbG9hZGVkJywgdGhpcy5oYW5kbGVGaWxlTG9hZGVkRXZlbnQpXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1yZWdpc3RyeS1jaGFuZ2UnLCB0aGlzLmhhbmRsZUZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KVxuICAgIH1cblxuICAgIF9zZXR1cElubmVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdC1jaGFuZ2UnLCB0aGlzLmhhbmRsZVNlbGVjdENoYW5nZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdsb2FkLWZpbGUnLCB0aGlzLmhhbmRsZUxvYWRGaWxlRXZlbnQpO1xuICAgIH1cblxuICAgIF9zZXR1cElubmVyRWxlbWVudHNMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuX3NldExvYWRMb2NhbEZpbGVCdXR0b25MaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9zZXRGaWxlc0xpc3RzTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgX3NldExvYWRMb2NhbEZpbGVCdXR0b25MaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IGZpbGVfaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmlucHV0X2ZpbGVfbG9jYWwpO1xuICAgICAgICBsZXQgdHlwZV9pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuaW5wdXRfZmlsZV90eXBlKTtcblxuICAgICAgICBsZXQgZmlsZV90eXBlID0gdHlwZV9pbnB1dC52YWx1ZTtcblxuICAgICAgICBmaWxlX2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBsZXQgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZV90eXBlID09PSAnZml0cycpIHtcbiAgICAgICAgICAgICAgICBmaWxlLmFycmF5QnVmZmVyKCkudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXRzX3JlYWRlcl93cmFwcGVyID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIuaW5pdGlhbGl6ZUZyb21CdWZmZXIoYXJyYXlCdWZmZXIsIGZpbGUubmFtZSk7XG5cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgZmlsZSBhcyBBcnJheUJ1ZmZlcjonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZmlsZV90eXBlID09PSAnY3N2Jykge1xuICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3N2X2ZpbGUgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBfc2V0RmlsZXNMaXN0c0xpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IGxpc3RfYXZhaWxhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5hdmFpbGFibGVfZmlsZXNfbGlzdF9pZCk7XG4gICAgICAgIGxldCBsaXN0X2N1cnJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmN1cnJlbnRfZmlsZXNfbGlzdF9pZCk7XG5cbiAgICAgICAgbGV0IGJ1dHRvbnNfYXZhaWxhYmxlID0gbGlzdF9hdmFpbGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICAgICAgbGV0IGJ1dHRvbnNfY3VycmVudCA9IGxpc3RfY3VycmVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuXG4gICAgICAgIGxldCBidXR0b25zID0gQXJyYXkuZnJvbShidXR0b25zX2F2YWlsYWJsZSkuY29uY2F0KEFycmF5LmZyb20oYnV0dG9uc19jdXJyZW50KSk7XG5cbiAgICAgICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGFyaWFfY3VycmVudCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIik7XG4gICAgICAgICAgICAgICAgaWYgKGFyaWFfY3VycmVudCAmJiBhcmlhX2N1cnJlbnQgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJGaWxlU2V0dGluZ3NQYW5lbCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIiwgXCJ0cnVlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRGaWxlU2V0dGluZ3NQYW5lbChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uc190b19maWx0ZXIgPSBBcnJheS5mcm9tKGJ1dHRvbnMpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlcmVkX2J1dHRvbnMgPSBidXR0b25zX3RvX2ZpbHRlci5maWx0ZXIobGlzdF9idXR0b24gPT4gbGlzdF9idXR0b24gIT09IGJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICBmaWx0ZXJlZF9idXR0b25zLmZvckVhY2goZmlsdGVyZWRfYnV0dG9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRfYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZF9idXR0b24ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldEZpbGVTZXR0aW5nc0J1dHRvbnNMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBzYXZlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuc2F2ZV9idXR0b25faWQpO1xuICAgICAgICBsZXQgYWRkX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuYWRkX2J1dHRvbl9pZCk7XG5cbiAgICAgICAgc2F2ZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcblxuICAgICAgICB9KTtcblxuICAgICAgICBhZGRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgYnRuID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgbGV0IGZpbGVfaWQgPSBidG4uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG5cbiAgICAgICAgICAgIGxldCBmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGZpbGVfaWQpO1xuXG4gICAgICAgICAgICBGaWxlUmVnaXN0cnkuYWRkVG9DdXJyZW50RmlsZXMoZmlsZSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudEZpbGVzTGlzdCgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBdmFpbGFibGVGaWxlc0xpc3QoKTtcblxuICAgICAgICAgICAgbGV0IGZyY2UgPSBuZXcgRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQoKTtcbiAgICAgICAgICAgIGZyY2UuZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUZJVFNMb2FkZWRFdmVudChldmVudCkge1xuICAgICAgICB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIgPSBldmVudC5kZXRhaWxbJ2ZpdHNfcmVhZGVyX3dyYXBwZXInXTtcbiAgICAgICAgbGV0IGZpbGVfcGF0aCA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRGaWxlUGF0aCgpO1xuXG4gICAgICAgIHRoaXMuX2FkZEZpbGVUb1NlbGVjdChmaWxlX3BhdGgpO1xuICAgIH1cblxuICAgIGhhbmRsZUZpbGVMb2FkZWRFdmVudChldmVudCkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYWRkVG9BdmFpbGFibGVGaWxlcyhldmVudC5kZXRhaWwpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmxlRmlsZXNMaXN0KCk7XG4gICAgICAgIHRoaXMuX3NldEZpbGVzTGlzdHNMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRGaWxlc0xpc3QoKTtcblxuICAgICAgICB0aGlzLl9zZXRGaWxlc0xpc3RzTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9hZEZpbGVFdmVudChldmVudCkge1xuXG4gICAgfVxuXG4gICAgdXBkYXRlRmlsZXNMaXN0cygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVBdmFpbGFibGVGaWxlc0xpc3QoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50RmlsZXNMaXN0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQXZhaWxhYmxlRmlsZXNMaXN0KCkge1xuICAgICAgICBsZXQgYXZhaWxhYmxlX2ZpbGVzX2xpc3RfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuYXZhaWxhYmxlX2ZpbGVzX2xpc3RfaWQpO1xuXG4gICAgICAgIGF2YWlsYWJsZV9maWxlc19saXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGZpbGVfZWxlbWVudHMgPSB0aGlzLl9jcmVhdGVGaWxlU2VsZWN0aW9uKCdhdmFpbGFibGUnKTtcblxuICAgICAgICBmaWxlX2VsZW1lbnRzLmZvckVhY2goKGZpbGVfZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgYXZhaWxhYmxlX2ZpbGVzX2xpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChmaWxlX2VsZW1lbnQpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZUN1cnJlbnRGaWxlc0xpc3QoKSB7XG4gICAgICAgIGxldCBjdXJyZW50X2ZpbGVzX2xpc3RfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuY3VycmVudF9maWxlc19saXN0X2lkKTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVzX2xpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgZmlsZV9lbGVtZW50cyA9IHRoaXMuX2NyZWF0ZUZpbGVTZWxlY3Rpb24oJ2N1cnJlbnQnKTtcblxuICAgICAgICBmaWxlX2VsZW1lbnRzLmZvckVhY2goKGZpbGVfZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY3VycmVudF9maWxlc19saXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZV9lbGVtZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjbGVhckZpbGVTZXR0aW5nc1BhbmVsKCkge1xuICAgICAgICBsZXQgZmlsZV9zZXR0aW5nc19jb21wb25lbnRfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5maWxlX3NldHRpbmdzX2NvbnRhaW5lcl9pZCk7XG4gICAgICAgIGZpbGVfc2V0dGluZ3NfY29tcG9uZW50X2NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBzZXRGaWxlU2V0dGluZ3NQYW5lbChmaWxlKSB7XG4gICAgICAgIHRoaXMuY2xlYXJGaWxlU2V0dGluZ3NQYW5lbCgpO1xuXG4gICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG5cbiAgICAgICAgICAgIGxldCBpc19jdXJyZW50ID0gRmlsZVJlZ2lzdHJ5LmlzRmlsZUN1cnJlbnQoZmlsZS5pZCk7XG5cbiAgICAgICAgICAgIGxldCBmaWxlX3NldHRpbmdzX2NvbXBvbmVudCA9IG5ldyBGSVRTU2V0dGluZ3NDb21wb25lbnQoZmlsZSwgaXNfY3VycmVudCk7XG5cbiAgICAgICAgICAgIGxldCBmaWxlX3NldHRpbmdzX2NvbXBvbmVudF9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmZpbGVfc2V0dGluZ3NfY29udGFpbmVyX2lkKTtcbiAgICAgICAgICAgIGZpbGVfc2V0dGluZ3NfY29tcG9uZW50X2NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWxlX3NldHRpbmdzX2NvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIGZpbGVfc2V0dGluZ3NfY29tcG9uZW50LnNldHVwQ29tcG9uZW50KCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9hZGRGaWxlVG9TZWxlY3QoZmlsZSkge1xuICAgICAgICBsZXQgZmlsZV9vcHRpb24gPSB0aGlzLl9jcmVhdGVTZWxlY3RPcHRpb24oZmlsZSk7XG4gICAgICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LnNlbGVjdF9maWxlKTtcblxuICAgICAgICBzZWxlY3QuYWRkKGZpbGVfb3B0aW9uKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlRmlsZVNlbGVjdGlvbihsaXN0ID0gJ2F2YWlsYWJsZScpIHtcbiAgICAgICAgbGV0IGZpbGVzO1xuXG4gICAgICAgIGlmKGxpc3QgPT09ICdhdmFpbGFibGUnKSB7XG4gICAgICAgICAgICBmaWxlcyA9IEZpbGVSZWdpc3RyeS5nZXRBdmFpbGFibGVGaWxlc0xpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbGVzID0gRmlsZVJlZ2lzdHJ5LmdldEN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWxlY3Rpb25fZWxlbWVudHMgPSBbXTtcblxuICAgICAgICBsZXQgZmlsZV9zZWxlY3Rpb247XG4gICAgICAgIGZpbGVzLmZvckVhY2goKGF2YWlsYWJsZV9maWxlKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmlsZV91aWQgPSBhdmFpbGFibGVfZmlsZS5pZCsnLicrYXZhaWxhYmxlX2ZpbGUuZmlsZV9uYW1lO1xuXG4gICAgICAgICAgICBmaWxlX3NlbGVjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICBmaWxlX3NlbGVjdGlvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgZmlsZV9zZWxlY3Rpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhdmFpbGFibGUtZmlsZS1zZWxlY3Rpb24gbGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1hY3Rpb25cIik7XG4gICAgICAgICAgICBmaWxlX3NlbGVjdGlvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGF2YWlsYWJsZV9maWxlLmlkKTtcbiAgICAgICAgICAgIGZpbGVfc2VsZWN0aW9uLnRleHRDb250ZW50ID0gZmlsZV91aWQ7XG5cbiAgICAgICAgICAgIHNlbGVjdGlvbl9lbGVtZW50cy5wdXNoKGZpbGVfc2VsZWN0aW9uKTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uX2VsZW1lbnRzO1xuICAgIH1cblxuICAgIF9jcmVhdGVTZWxlY3RPcHRpb24oZmlsZV9wYXRoKSB7XG4gICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGZpbGVfcGF0aDtcbiAgICAgICAgb3B0aW9uLnRleHQgPSBmaWxlX3BhdGg7XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9XG5cbiAgICBoYW5kbGVTZWxlY3RDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJfaWQpXG4gICAgfVxuXG4gICAgcmVzZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtTZXR0aW5nc0NvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvU2V0dGluZ3NDb250YWluZXJcIjtcbmltcG9ydCB7U2V0dGluZ3NDaGFuZ2VkRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvU2V0dGluZ3NDaGFuZ2VkRXZlbnRcIjtcbmltcG9ydCB7VmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9WaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50XCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgY29udGFpbmVyX2lkO1xuICAgIGNvbnRhaW5lclxuXG4gICAgc3RhdGljIGNvbXBvbmVudF9pZCA9IFwic2V0dGluZ3NfY29tcG9uZW50XCI7XG4gICAgc3RhdGljIGNvbnRhaW5lcl9pZCA9IFwic2V0dGluZ3MtY29tcG9uZW50XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2xpYnJhcnlfaWQgPSBcInNlbGVjdC1saWJyYXJ5XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2RhdGFfdHlwZV9pZCA9IFwic2VsZWN0LWRhdGEtdHlwZVwiO1xuXG4gICAgc3RhdGljIGxpZ2h0X2N1cnZlX3NldHRpbmdzX2lkID0gXCJsaWdodC1jdXJ2ZS1zZXR0aW5nc1wiXG4gICAgc3RhdGljIHNwZWN0cnVtX3NldHRpbmdzX2lkID0gXCJzcGVjdHJ1bS1zZXR0aW5nc1wiXG5cbiAgICBzdGF0aWMgc2VsZWN0X2hkdXNfaWQgPSBcInNlbGVjdC1oZHVzXCI7XG5cbiAgICBzdGF0aWMgY2FsY3VsYXRpb25fcmFkaW9fY2xhc3MgPSBcImNhbGN1bGF0aW9uLXJhZGlvXCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2F4aXNfeF9pZCA9IFwic2VsZWN0LWF4aXMteFwiO1xuICAgIHN0YXRpYyBzZWxlY3RfYXhpc195X2lkID0gXCJzZWxlY3QtYXhpcy15XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2Vycm9yX2Jhcl94X2lkID0gXCJzZWxlY3QtYXhpcy14LWVycm9yLWJhclwiO1xuICAgIHN0YXRpYyBzZWxlY3RfZXJyb3JfYmFyX3lfaWQgPSBcInNlbGVjdC1heGlzLXktZXJyb3ItYmFyXCI7XG5cbiAgICBzdGF0aWMgc3VwcG9ydGVkX2RhdGFfdHlwZXMgPSBbJ2dlbmVyaWMnLCAnbGlnaHQtY3VydmUnLCAnc3BlY3RydW0nXTtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBudWxsO1xuICAgIHNldHRpbmdzX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IFNldHRpbmdzQ29tcG9uZW50LmNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QgPSBTZXR0aW5nc0NvbnRhaW5lci5nZXRTZXR0aW5nc0NvbnRhaW5lcigpLmdldFZpc3VhbGl6YXRpb25TZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50ID0gdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDb25maWd1cmF0aW9uRXZlbnQgPSB0aGlzLmhhbmRsZUNvbmZpZ3VyYXRpb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlTGlicmFyeUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlSERVc0NoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVIRFVzQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50ID0gdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLl9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLl9zZXR1cElubmVyRWxlbWVudHNMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBfc2V0dXBFeHRlcm5hbExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmaXRzLWxvYWRlZCcsIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjb25maWd1cmF0aW9uJywgdGhpcy5oYW5kbGVDb25maWd1cmF0aW9uRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbGUtcmVnaXN0cnktY2hhbmdlJywgdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQpO1xuICAgIH1cblxuICAgIF9zZXR1cElubmVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdC1saWJyYXJ5LWNoYW5nZScsIHRoaXMuaGFuZGxlTGlicmFyeUNoYW5nZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3QtZGF0YS10eXBlLWNoYW5nZScsIHRoaXMuaGFuZGxlRGF0YVR5cGVDaGFuZ2VFdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0LWhkdXMtY2hhbmdlJywgdGhpcy5oYW5kbGVIRFVzQ2hhbmdlRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbi1nZW5lcmF0ZS1jbGljaycsIHRoaXMuaGFuZGxlR2VuZXJhdGVFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0TGlicmFyeUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdERhdGFUeXBlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLl9zZXRTZWxlY3RIRFVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0R2VuZXJhdGVCdXR0b25MaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9zZXRDYWxjdWxhdGlvblJhZGlvTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRklUU0xvYWRlZEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZml0c19yZWFkZXJfd3JhcHBlciA9IGV2ZW50LmRldGFpbFsnZml0c19yZWFkZXJfd3JhcHBlciddO1xuXG4gICAgICAgIGxldCBoZHVzID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhEVXMoKTtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0SERVcyhoZHVzKTtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuaXNIRFVUYWJ1bGFyKGhkdXNbMF0uaW5kZXgpKSB7XG4gICAgICAgICAgICBsZXQgaGR1X2NvbHVtbnNfbmFtZSA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRDb2x1bW5zTmFtZUZyb21IRFUoaGR1c1swXS5pbmRleCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNlbGVjdEF4aXMoaGR1X2NvbHVtbnNfbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RFcnJvckJhcnMoaGR1X2NvbHVtbnNfbmFtZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0QXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RFcnJvckJhcnMoKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVDb25maWd1cmF0aW9uRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGNvbmZpZ3VyYXRpb25fb2JqZWN0ID0gZXZlbnQuZGV0YWlsLmNvbmZpZ3VyYXRpb25fb2JqZWN0O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3MoY29uZmlndXJhdGlvbl9vYmplY3QpO1xuICAgIH1cblxuICAgIGhhbmRsZUxpYnJhcnlDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzT2JqZWN0KCk7XG5cbiAgICAgICAgbGV0IHNldHRpbmdzX2NoYW5nZWRfZXZlbnQgPSBuZXcgU2V0dGluZ3NDaGFuZ2VkRXZlbnQodGhpcy5zZXR0aW5nc19vYmplY3QpO1xuICAgICAgICBzZXR0aW5nc19jaGFuZ2VkX2V2ZW50LmRpc3BhdGNoKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGF0YVR5cGVDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgbGV0IGRhdGFfdHlwZSA9IGV2ZW50LmRldGFpbC5kYXRhX3R5cGU7XG5cbiAgICAgICAgaWYoU2V0dGluZ3NDb21wb25lbnQuc3VwcG9ydGVkX2RhdGFfdHlwZXMuaW5jbHVkZXMoZGF0YV90eXBlKSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgICAgICBzd2l0Y2goZGF0YV90eXBlKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsaWdodC1jdXJ2ZSc6XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LmxpZ2h0X2N1cnZlX3NldHRpbmdzX2lkKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc3BlY3RydW1fc2V0dGluZ3NfaWQpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc3BlY3RydW0nOlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zcGVjdHJ1bV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LmxpZ2h0X2N1cnZlX3NldHRpbmdzX2lkKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNwZWN0cnVtX3NldHRpbmdzX2lkKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5saWdodF9jdXJ2ZV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVIRFVzQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxldCBoZHVfaW5kZXggPSBldmVudC5kZXRhaWwuaGR1X2luZGV4O1xuXG4gICAgICAgIGlmKHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5pc0hEVVRhYnVsYXIoaGR1X2luZGV4KSkge1xuICAgICAgICAgICAgbGV0IGhkdV9jb2x1bW5zX25hbWUgPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFNlbGVjdEF4aXMoaGR1X2NvbHVtbnNfbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RFcnJvckJhcnMoaGR1X2NvbHVtbnNfbmFtZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0QXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RFcnJvckJhcnMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlR2VuZXJhdGVFdmVudChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5yZXNldCgpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3NPYmplY3QoKTtcblxuICAgICAgICBsZXQgdmlzdWFsaXphdGlvbl9nZW5lcmF0aW9uX2V2ZW50ID0gbmV3IFZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQodGhpcy5zZXR0aW5nc19vYmplY3QpO1xuICAgICAgICB2aXN1YWxpemF0aW9uX2dlbmVyYXRpb25fZXZlbnQuZGlzcGF0Y2goKTtcblxuICAgIH1cblxuICAgIGhhbmRsZUZpbGVDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBsZXQgY3VycmVudF9maWxlX2xpc3QgPSBGaWxlUmVnaXN0cnkuZ2V0Q3VycmVudEZpbGVzTGlzdCgpO1xuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuXG4gICAgICAgIGN1cnJlbnRfZmlsZV9saXN0LmZvckVhY2goKGZpbGUpID0+IHtcblxuICAgICAgICAgICAgaWYoZmlsZS50eXBlID09PSAnZml0cycpIHtcbiAgICAgICAgICAgICAgICBsZXQgZml0c19yZWFkZXJfd3JhcHBlciA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcblxuICAgICAgICAgICAgICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIuc2V0RmlsZShmaWxlLmZpbGUpO1xuICAgICAgICAgICAgICAgIGxldCBmaXRzX2NvbHVtbnMgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldEFsbENvbHVtbnMoKTtcblxuICAgICAgICAgICAgICAgIGZpdHNfY29sdW1ucy5mb3JFYWNoKChmaXRzX2NvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0gey4uLmZpdHNfY29sdW1uLCBmaWxlX2lkOiBmaWxlLmlkfTtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSBlbHNlIGlmKGZpbGUudHlwZSA9PT0gJ2NzdicpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBjb2x1bW5zX2J5X2ZpbGUgPSBjb2x1bW5zLnJlZHVjZSgoYWNjLCBjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIGlmICghYWNjW2NvbHVtbi5maWxlX2lkXSkge1xuICAgICAgICAgICAgICAgIGFjY1tjb2x1bW4uZmlsZV9pZF0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjY1tjb2x1bW4uZmlsZV9pZF0ucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIGxldCBzZWxlY3Rfb3B0aW9ucyA9IFtdO1xuXG4gICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgZm9yIChsZXQgZmlsZV9pZCBpbiBjb2x1bW5zX2J5X2ZpbGUpIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5zX2J5X2ZpbGUuaGFzT3duUHJvcGVydHkoZmlsZV9pZCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChmaWxlX2lkKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZV9uYW1lID0gZmlsZS5maWxlX25hbWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGZpbGUuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3Rfb3B0aW9ucy5wdXNoKHRoaXMuX2NyZWF0ZUZpbGVDb2x1bW5zT3B0aW9uc0dyb3VwKGNvbHVtbnNfYnlfZmlsZVtmaWxlX2lkXSwgZmlsZV9uYW1lLCAnb3B0LWdyb3VwJywgZnJ3KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZXRTZWxlY3RHcm91cEF4aXMoc2VsZWN0X29wdGlvbnMpO1xuICAgICAgICB0aGlzLl9zZXRTZWxlY3RHcm91cEVycm9yQmFycyhzZWxlY3Rfb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcl9pZClcbiAgICB9XG5cbiAgICBfcmVzZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEhEVXMoaGR1cykge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEhEVXMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2hkdXNfaWQpO1xuXG4gICAgICAgIGxldCBvcHRpb25zID0gdGhpcy5fY3JlYXRlSERVc09wdGlvbnMoaGR1cyk7XG5cbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgc2VsZWN0LmFkZChvcHRpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVzZXRTZWxlY3RIRFVzKCkge1xuICAgICAgICBsZXQgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2hkdXNfaWQpO1xuICAgICAgICBzZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUhEVXNPcHRpb25zKEhEVXMpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSBbXTtcbiAgICAgICAgbGV0IG9wdGlvbjtcblxuICAgICAgICBIRFVzLmZvckVhY2goZnVuY3Rpb24oaGR1LCBpbmRleCkge1xuICAgICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgaWYoaW5kZXggPT09IDApIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaGR1LmluZGV4O1xuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBoZHUubmFtZTtcblxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUZpbGVDb2x1bW5zT3B0aW9uc0dyb3VwKGZpbGVfY29sdW1ucywgZ3JvdXBfbmFtZSwgZ3JvdXBfY2xhc3MsIGZpdHNfcmVhZGVyX3dyYXBwZXIpIHtcblxuICAgICAgICBsZXQgb3B0X2dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGdyb3VwXCIpO1xuICAgICAgICBvcHRfZ3JvdXAubGFiZWwgPSBncm91cF9uYW1lO1xuICAgICAgICBvcHRfZ3JvdXAuY2xhc3NOYW1lICs9IGdyb3VwX2NsYXNzO1xuXG4gICAgICAgIGZpbGVfY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgbGV0IGhkdV90eXBlID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGNvbHVtbi5oZHVfaW5kZXgsICdYVEVOU0lPTicpO1xuICAgICAgICAgICAgbGV0IGhkdV9leHRuYW1lID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGNvbHVtbi5oZHVfaW5kZXgsICdFWFROQU1FJyk7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGhkdV90eXBlKyctJytoZHVfZXh0bmFtZSsnICcrY29sdW1uLm5hbWU7XG5cbiAgICAgICAgICAgIGlmKGNvbHVtbi5pc19mcm9tX2hlYWRlcikge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJyhIRUFERVIpJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY29sdW1uLmlzX3Byb2Nlc3NlZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbi50ZXh0ID0gbmFtZTtcbiAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUgPSBgJHtjb2x1bW4uZnJvbV9maWxlfS4ke2NvbHVtbi5oZHVfaW5kZXh9JCR7Y29sdW1uLm5hbWV9YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBuYW1lO1xuICAgICAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGAke2NvbHVtbi5maWxlX2lkfS4ke2NvbHVtbi5oZHVfaW5kZXh9JCR7Y29sdW1uLm5hbWV9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb3B0X2dyb3VwLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvcHRfZ3JvdXBcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0QXhpcyhjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0QXhpcygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfYXhpc194ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc195ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9heGlzID0gW3NlbGVjdF9heGlzX3gsIHNlbGVjdF9heGlzX3ldO1xuXG4gICAgICAgIGxldCBvcHRpb25zID0gdGhpcy5fY3JlYXRlQ29sdW1uc09wdGlvbnMoY29sdW1ucyk7XG5cbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgc2VsZWN0X2F4aXMuZm9yRWFjaChmdW5jdGlvbihzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xvbmVkX29wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmFkZChjbG9uZWRfb3B0aW9uKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RHcm91cEF4aXMoY29sdW1uc19vcHRncm91cCkge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3lfaWQpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfYXhpcyA9IFtzZWxlY3RfYXhpc194LCBzZWxlY3RfYXhpc195XTtcblxuICAgICAgICBjb2x1bW5zX29wdGdyb3VwLmZvckVhY2goKGNvbHVtbl9vcHRncm91cCkgPT4ge1xuICAgICAgICAgICAgc2VsZWN0X2F4aXMuZm9yRWFjaCgoc2VsZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRncm91cCA9IGNvbHVtbl9vcHRncm91cC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmFkZChjbG9uZWRfb3B0Z3JvdXApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIF9yZXNldFNlbGVjdEF4aXMoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc194ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc195ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2F4aXNfeC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2VsZWN0X2F4aXNfeS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0RXJyb3JCYXJzKGNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RFcnJvckJhcnMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl94X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJzID0gW3NlbGVjdF9lcnJvcl9iYXJfeCwgc2VsZWN0X2Vycm9yX2Jhcl95XTtcblxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuX2NyZWF0ZUNvbHVtbnNPcHRpb25zKGNvbHVtbnMpO1xuXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHNlbGVjdF9lcnJvcl9iYXJzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5hZGQoY2xvbmVkX29wdGlvbik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0R3JvdXBFcnJvckJhcnMoY29sdW1uc19vcHRncm91cCkge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEVycm9yQmFycygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl95ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl95X2lkKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2JhcnMgPSBbc2VsZWN0X2Vycm9yX2Jhcl94LCBzZWxlY3RfZXJyb3JfYmFyX3ldO1xuXG4gICAgICAgIGNvbHVtbnNfb3B0Z3JvdXAuZm9yRWFjaCgoY29sdW1uX29wdGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBzZWxlY3RfZXJyb3JfYmFycy5mb3JFYWNoKChzZWxlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xvbmVkX29wdGdyb3VwID0gY29sdW1uX29wdGdyb3VwLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZWxlY3QuYWRkKGNsb25lZF9vcHRncm91cCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIF9yZXNldFNlbGVjdEVycm9yQmFycygpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3lfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2VsZWN0X2Vycm9yX2Jhcl95LmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIF9jcmVhdGVDb2x1bW5zT3B0aW9ucyhjb2x1bW5zKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0gW107XG4gICAgICAgIGxldCBvcHRpb247XG5cbiAgICAgICAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbikge1xuXG4gICAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBjb2x1bW47XG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGNvbHVtbjtcblxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdExpYnJhcnlMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9saWJyYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2xpYnJhcnlfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9saWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC1saWJyYXJ5LWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBsaWJyYXJ5OiBzZWxlY3RfbGlicmFyeS52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2NoYW5nZV9ldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3REYXRhVHlwZUxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgc2VsZWN0X2RhdGFfdHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9kYXRhX3R5cGVfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9kYXRhX3R5cGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgY3VzdG9tX2NoYW5nZV9ldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0LWRhdGEtdHlwZS1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29tcG9zZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YV90eXBlOiBzZWxlY3RfZGF0YV90eXBlLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEhEVXNMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9oZHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2hkdXNfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9oZHVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC1oZHVzLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IHNlbGVjdF9oZHVzLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldENhbGN1bGF0aW9uUmFkaW9MaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCByYWRpb19idXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBTZXR0aW5nc0NvbXBvbmVudC5jYWxjdWxhdGlvbl9yYWRpb19jbGFzcyk7XG4gICAgICAgIHJhZGlvX2J1dHRvbnMuZm9yRWFjaChyYWRpb19idXR0b24gPT4ge1xuICAgICAgICAgICAgcmFkaW9fYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRHZW5lcmF0ZUJ1dHRvbkxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgYnV0dG9uX2dlbmVyYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1nZW5lcmF0ZScpO1xuXG4gICAgICAgIGJ1dHRvbl9nZW5lcmF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2J1dHRvbi1nZW5lcmF0ZS1jbGljaycsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2V0dGluZ3MoY29uZmlndXJhdGlvbikge1xuICAgICAgICBmb3IgKGxldCBbc2V0dGluZywgdmFsdWVzXSBvZiBPYmplY3QuZW50cmllcyhjb25maWd1cmF0aW9uKSkge1xuXG4gICAgICAgICAgICBsZXQgc2V0dGluZ19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZyk7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ19lbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmRpc3BsYXkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ19lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNldHRpbmdzT2JqZWN0KCkge1xuICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy5fZXh0cmFjdEZvcm1WYWx1ZXMoKTtcblxuICAgICAgICBsZXQgbGlicmFyeSA9IHt9O1xuICAgICAgICBsaWJyYXJ5LmxpYnJhcnkgPSB2YWx1ZXNbJ3NlbGVjdC1saWJyYXJ5J10udmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldExpYnJhcnlTZXR0aW5ncyhsaWJyYXJ5KTtcblxuICAgICAgICBsZXQgaGR1ID0ge307XG4gICAgICAgIGhkdVsnaGR1X2luZGV4J10gPSB2YWx1ZXNbJ3NlbGVjdC1oZHVzJ10udmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldEhEVXNTZXR0aW5ncyhoZHUpO1xuXG4gICAgICAgIGxldCBkYXRhX3R5cGUgPSB7fTtcblxuICAgICAgICBkYXRhX3R5cGUudHlwZSA9IHZhbHVlc1snc2VsZWN0LWRhdGEtdHlwZSddLnZhbHVlO1xuICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXREYXRhVHlwZVNldHRpbmdzKGRhdGFfdHlwZSk7XG5cbiAgICAgICAgaWYodmFsdWVzWydzZWxlY3QtYXhpcy14J10gJiYgdmFsdWVzWydzZWxlY3QtYXhpcy15J10pIHtcbiAgICAgICAgICAgIGxldCBheGlzID0ge307XG4gICAgICAgICAgICBsZXQgc2NhbGVzID0ge307XG5cbiAgICAgICAgICAgIGF4aXMueCA9IHZhbHVlc1snc2VsZWN0LWF4aXMteCddLnZhbHVlO1xuICAgICAgICAgICAgYXhpcy55ID0gdmFsdWVzWydzZWxlY3QtYXhpcy15J10udmFsdWU7XG5cbiAgICAgICAgICAgIHNjYWxlcy54ID0gdmFsdWVzWydzZWxlY3QtYXhpcy14LXNjYWxlJ10udmFsdWU7XG4gICAgICAgICAgICBzY2FsZXMueSA9IHZhbHVlc1snc2VsZWN0LWF4aXMteS1zY2FsZSddLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRBeGlzU2V0dGluZ3MoYXhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRTY2FsZXNTZXR0aW5ncyhzY2FsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodmFsdWVzWydoYXMtZXJyb3ItYmFycy1jaGVja2JveCddKSB7XG4gICAgICAgICAgICBpZih2YWx1ZXNbJ2hhcy1lcnJvci1iYXJzLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvcl9iYXJzID0ge307XG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJzLnggPSB2YWx1ZXNbJ3NlbGVjdC1heGlzLXgtZXJyb3ItYmFyJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgZXJyb3JfYmFycy55ID0gdmFsdWVzWydzZWxlY3QtYXhpcy15LWVycm9yLWJhciddLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0RXJyb3JCYXJzU2V0dGluZ3MoZXJyb3JfYmFycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih2YWx1ZXNbJ2hhcy14LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSB8fCB2YWx1ZXNbJ2hhcy15LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBsZXQgcmFuZ2VzID0ge1xuICAgICAgICAgICAgICAgIHg6IHt9LFxuICAgICAgICAgICAgICAgIHk6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZih2YWx1ZXNbJ2hhcy14LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneCddLmxvd2VyX2JvdW5kID0gdmFsdWVzWyd4LWxvd2VyLWJvdW5kJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWyd4J10udXBwZXJfYm91bmQgPSB2YWx1ZXNbJ3gtaGlnaGVyLWJvdW5kJ10udmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneCddID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVzWydoYXMteS1yYW5nZS1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3knXS5sb3dlcl9ib3VuZCA9IHZhbHVlc1sneS1sb3dlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneSddLnVwcGVyX2JvdW5kID0gdmFsdWVzWyd5LWhpZ2hlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3knXSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldFJhbmdlc1NldHRpbmdzKHJhbmdlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRSYW5nZXNTZXR0aW5ncyhudWxsKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2V4dHJhY3RGb3JtVmFsdWVzKCkge1xuXG4gICAgICAgIGxldCBmb3JtX3ZhbHVlcyA9IHt9O1xuXG4gICAgICAgIGxldCBzZWxlY3RzID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0tc2VsZWN0Jyk7XG5cbiAgICAgICAgc2VsZWN0cy5mb3JFYWNoKHNlbGVjdCA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSBzZWxlY3QuaWQ7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9IHNlbGVjdC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlbGVjdC52YWx1ZTtcblxuICAgICAgICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUoc2VsZWN0LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKSAhPT0gJ25vbmUnICYmIHZhbHVlICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgdmFsdWV9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgY2hlY2tib3hlcyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLWNoZWNrYm94Jyk7XG5cbiAgICAgICAgY2hlY2tib3hlcy5mb3JFYWNoKGNoZWNrYm94ID0+IHtcblxuICAgICAgICAgICAgbGV0IGlkID0gY2hlY2tib3guaWQ7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9IGNoZWNrYm94LmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSBjaGVja2JveC5jaGVja2VkO1xuXG4gICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgY2hlY2tlZH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dHMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybS1pbnB1dCcpO1xuXG4gICAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9IGlucHV0LmlkO1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBpbnB1dC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgdmFsdWV9O1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBmb3JtX3ZhbHVlcztcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgVmlzdWFsaXphdGlvbkNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIGNvbnRhaW5lcl9pZDtcbiAgICBjb250YWluZXJcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcl9pZCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIHJlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBDU1ZTZXR0aW5nc0NvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVfaWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi8uLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnR9IGZyb20gXCIuLi8uLi9ldmVudHMvRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIEZJVFNTZXR0aW5nc0NvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIGNvbnRhaW5lcl9pZCA9IFwiZml0cy1zZXR0aW5ncy1jb250YWluZXJcIjtcbiAgICBzZWxlY3RfaGR1X2lkID0gXCJzZWxlY3QtaGR1LWZpbGVcIjtcbiAgICB0YWJsZV9oZWFkZXJfaWQgPSBcInRhYmxlLWhlYWRlci1kYXRhXCI7XG4gICAgdGFibGVfZGF0YV9pZCA9IFwidGFibGUtZGF0YVwiO1xuXG4gICAgZmlsZSA9IG51bGw7XG4gICAgaXNfY3VycmVudCA9IGZhbHNlO1xuXG4gICAgYWRkX3RvX3Bsb3RfYnRuX2lkID0gXCJhZGQtdG8tcGxvdFwiO1xuICAgIHJlbW92ZV9mcm9tX3Bsb3RfYnRuX2lkID0gXCJyZW1vdmUtZnJvbS1wbG90XCI7XG5cbiAgICBjb250YWluZXIgPSAnPGRpdiBpZD1cImZpdHMtc2V0dGluZ3MtY29udGFpbmVyXCIgY2xhc3M9XCJmdWxsLXdpZHRoLWNvbHVtblwiIHN0eWxlPVwiZ3JpZC1jb2x1bW46IDEgLyBzcGFuIDI7XCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZFwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG5cbiAgICBzZWxlY3RfaGR1X2ZpbGUgPSAnPHNlbGVjdCBpZD1cInNlbGVjdC1oZHUtZmlsZVwiIGNsYXNzPVwiZm9ybS1zZWxlY3RcIj48L3NlbGVjdD4nO1xuXG4gICAgaW5uZXJfY29udGFpbmVyID0gJzxkaXYgY2xhc3M9XCJpbm5lci1yb3dcIj48L2Rpdj4nO1xuXG4gICAgaGVhZGVyX2NvbHVtbiA9ICc8ZGl2IGNsYXNzPVwibGVmdC1jb2x1bW5cIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPkhlYWRlcjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPicgK1xuICAgICAgICAnPGRpdiBpZD1cImhlYWRlci1oZHUtZmlsZVwiPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuXG4gICAgdGFibGVfaGVhZGVyID0gJzx0YWJsZSBpZD1cInRhYmxlLWhlYWRlci1kYXRhXCIgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+JyArXG4gICAgICAgICcgICAgPHRoZWFkPicgK1xuICAgICAgICAnICAgIDx0cj4nICtcbiAgICAgICAgJyAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+JyArXG4gICAgICAgICcgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk5hbWU8L3RoPicgK1xuICAgICAgICAnICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5WYWx1ZTwvdGg+JyArXG4gICAgICAgICcgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPkNvbW1lbnQ8L3RoPicgK1xuICAgICAgICAnICAgIDwvdHI+JyArXG4gICAgICAgICcgICAgPC90aGVhZD4nICtcbiAgICAgICAgJyAgICA8dGJvZHkgY2xhc3M9XCJ0YWJsZS1ncm91cC1kaXZpZGVyXCI+JyArXG4gICAgICAgICcgICAgPC90Ym9keT4nICtcbiAgICAgICAgJzwvdGFibGU+J1xuXG4gICAgZGF0YV9jb2x1bW4gPSAnPGRpdiBjbGFzcz1cInJpZ2h0LWNvbHVtblwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+RGF0YTwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPicgK1xuICAgICAgICAnICAgPGRpdiBpZD1cImRhdGEtaGR1LWZpbGVcIj4nICtcbiAgICAgICAgJyAgIDwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JztcblxuICAgIHRhYmxlX2RhdGEgPSAnPHRhYmxlIGlkPVwidGFibGUtZGF0YVwiIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPicgK1xuICAgICAgICAnICAgIDx0aGVhZD4nICtcbiAgICAgICAgJyAgICAgICA8dHI+JyArXG4gICAgICAgICcgICAgICAgPC90cj4nICtcbiAgICAgICAgJyAgICA8L3RoZWFkPicgK1xuICAgICAgICAnICAgIDx0Ym9keSBjbGFzcz1cInRhYmxlLWdyb3VwLWRpdmlkZXJcIj4nICtcbiAgICAgICAgJyAgICA8L3Rib2R5PicgK1xuICAgICAgICAnPC90YWJsZT4nXG5cbiAgICBidG5fc2F2ZV9zZXR0aW5ncyA9ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgaWQ9XCJzYXZlLWZpbGUtc2V0dGluZ3NcIj5TYXZlIGNoYW5nZXM8L2J1dHRvbj4nO1xuICAgIGJ0bl9hZGRfdG9fcGxvdCA9ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgaWQ9XCJhZGQtdG8tcGxvdFwiPkFkZCB0byBwbG90PC9idXR0b24+OydcbiAgICBidG5fcmVtb3ZlX2Zyb21fcGxvdCA9ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiBpZD1cInJlbW92ZS1mcm9tLXBsb3RcIj5SZW1vdmUgZnJvbSBwbG90PC9idXR0b24+JztcblxuICAgIGNvbnN0cnVjdG9yKGZpbGUsIGlzX2N1cnJlbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmZpbGUgPSBmaWxlO1xuICAgICAgICB0aGlzLmlzX2N1cnJlbnQgPSBpc19jdXJyZW50O1xuXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJmdWxsLXdpZHRoLWNvbHVtblwiIHN0eWxlPVwiZ3JpZC1jb2x1bW46IDEgLyBzcGFuIDI7XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5GaWxlIHNldHRpbmdzPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdC1oZHUtZmlsZVwiIGNsYXNzPVwiZm9ybS1zZWxlY3RcIj5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXItcm93XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0LWNvbHVtblwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5IZWFkZXI8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXItaGR1LWZpbGVcIiBjbGFzcz1cImZpbGUtZGF0YS1jb250YWluZXJcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cInRhYmxlLWhlYWRlci1kYXRhXCIgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk5hbWU8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5WYWx1ZTwvdGg+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPkNvbW1lbnQ8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3M9XCJ0YWJsZS1ncm91cC1kaXZpZGVyXCI+XFxuJyArXG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHQtY29sdW1uXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPkRhdGE8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkYXRhLWhkdS1maWxlXCIgY2xhc3M9XCJmaWxlLWRhdGEtY29udGFpbmVyXCI+XFxuJyArXG4gICAgICAgICAgICAnPHRhYmxlIGlkPVwidGFibGUtZGF0YVwiIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICcgICAgICAgPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAnICAgICAgIDwvdHI+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8L3RoZWFkPicgK1xuICAgICAgICAgICAgICAgICcgICAgPHRib2R5IGNsYXNzPVwidGFibGUtZ3JvdXAtZGl2aWRlclwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgPC90Ym9keT4nICtcbiAgICAgICAgICAgICAgICAnPC90YWJsZT4nK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGlkPVwic2F2ZS1maWxlLXNldHRpbmdzXCI+U2F2ZSBjaGFuZ2VzPC9idXR0b24gLS0+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwiYWRkLXRvLXBsb3RcIj5BZGQgdG8gcGxvdDwvYnV0dG9uPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIGlkPVwicmVtb3ZlLWZyb20tcGxvdFwiPlJlbW92ZSBmcm9tIHBsb3Q8L2J1dHRvbj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nXG5cbiAgICB9XG5cbiAgICBzZXR1cENvbXBvbmVudCgpIHtcbiAgICAgICAgdGhpcy5zZXRIRFVTZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zZXR1cEFjdGlvbkJ1dHRvbnMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2hkdSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0X2hkdV9pZCk7XG4gICAgICAgIGxldCBoZHVfaW5kZXggPSBzZWxlY3RfaGR1LnZhbHVlO1xuXG4gICAgICAgIHRoaXMuc2V0VGFibGVzKGhkdV9pbmRleCk7XG5cbiAgICAgICAgdGhpcy5zZXR1cElubmVyRWxlbWVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHNldEhEVVNlbGVjdCgpIHtcblxuICAgICAgICBsZXQgc2VsZWN0X2hkdSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0X2hkdV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2hkdS5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICBmcncuc2V0RmlsZSh0aGlzLmZpbGUuZmlsZSk7XG5cbiAgICAgICAgbGV0IGhkdXMgPSBmcncuZ2V0SERVcygpO1xuXG4gICAgICAgIGxldCBvcHRpb25zID0gW107XG4gICAgICAgIGhkdXMuZm9yRWFjaCgoaGR1KSA9PiB7XG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaGR1LmluZGV4O1xuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBoZHUubmFtZSArICcgJyArIGhkdS5leHRuYW1lO1xuXG4gICAgICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSlcblxuICAgICAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgc2VsZWN0X2hkdS5hZGQob3B0aW9uKTtcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHNldHVwSW5uZXJFbGVtZW50TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldEhEVVNlbGVjdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgc2V0dXBBY3Rpb25CdXR0b25zKCkge1xuXG4gICAgICAgIGxldCBhZGRfdG9fcGxvdF9idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFkZF90b19wbG90X2J0bl9pZCk7XG4gICAgICAgIGxldCByZW1vdmVfZnJvbV9wbG90X2J0biAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnJlbW92ZV9mcm9tX3Bsb3RfYnRuX2lkKTtcblxuICAgICAgICBpZih0aGlzLmlzX2N1cnJlbnQpIHtcbiAgICAgICAgICAgIGFkZF90b19wbG90X2J0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgcmVtb3ZlX2Zyb21fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZF90b19wbG90X2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgcmVtb3ZlX2Zyb21fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZF90b19wbG90X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LmFkZFRvQ3VycmVudEZpbGVzKHRoaXMuZmlsZSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNfY3VycmVudCA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG4gICAgICAgICAgICBmcmNlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q29udGFpbmVyRm9yQ3VycmVudEZpbGUoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZW1vdmVfZnJvbV9wbG90X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21DdXJyZW50RmlsZXModGhpcy5maWxlLmlkKTtcblxuICAgICAgICAgICAgdGhpcy5pc19jdXJyZW50ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG4gICAgICAgICAgICBmcmNlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q29udGFpbmVyRm9yQ3VycmVudEZpbGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0VGFibGVzKGhkdV9pbmRleCkge1xuICAgICAgICB0aGlzLnJlc2V0VGFibGVzKCk7XG5cbiAgICAgICAgbGV0IHRhYmxlX2hlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFibGVfaGVhZGVyX2lkKTtcbiAgICAgICAgbGV0IHRhYmxlX2RhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhYmxlX2RhdGFfaWQpO1xuXG4gICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgIGZydy5zZXRGaWxlKHRoaXMuZmlsZS5maWxlKTtcblxuICAgICAgICBsZXQgaGR1X2NhcmRzID0gZnJ3LmdldEhlYWRlckNhcmRzVmFsdWVGcm9tSERVKGhkdV9pbmRleClcblxuICAgICAgICBsZXQgdGJvZHkgPSB0YWJsZV9oZWFkZXIucXVlcnlTZWxlY3RvcigndGJvZHknKTtcblxuICAgICAgICBoZHVfY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcblxuICAgICAgICAgICAgbGV0IHJvdyA9IHRib2R5Lmluc2VydFJvdygpO1xuXG4gICAgICAgICAgICBsZXQgaW5kZXhfY2VsbCA9IHJvdy5pbnNlcnRDZWxsKDApO1xuICAgICAgICAgICAgbGV0IGNhcmRfY2VsbCA9IHJvdy5pbnNlcnRDZWxsKDEpO1xuICAgICAgICAgICAgbGV0IG5hbWVfY2VsbCA9IHJvdy5pbnNlcnRDZWxsKDIpO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uX2NlbGwgPSByb3cuaW5zZXJ0Q2VsbCgzKTtcblxuICAgICAgICAgICAgaW5kZXhfY2VsbC50ZXh0Q29udGVudCA9IGNhcmQuaW5kZXg7XG4gICAgICAgICAgICBjYXJkX2NlbGwudGV4dENvbnRlbnQgPSBjYXJkLmNhcmRfbmFtZTtcbiAgICAgICAgICAgIG5hbWVfY2VsbC50ZXh0Q29udGVudCA9IGNhcmQudmFsdWU7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbl9jZWxsLnRleHRDb250ZW50ID0gY2FyZC5jb21tZW50O1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBoZHVfY29sdW1uc19uYW1lID0gZnJ3LmdldENvbHVtbnNOYW1lRnJvbUhEVShoZHVfaW5kZXgpO1xuICAgICAgICAgICAgbGV0IGhkdV9kYXRhID0gZnJ3LmdldENvbHVtbnNKU09ORGF0YUZyb21IRFUoaGR1X2luZGV4KVxuXG4gICAgICAgICAgICBsZXQgaGVhZGVyX3JvdyA9IHRhYmxlX2RhdGEudEhlYWQuaW5zZXJ0Um93KCk7XG4gICAgICAgICAgICB0Ym9keSA9IHRhYmxlX2RhdGEucXVlcnlTZWxlY3RvcigndGJvZHknKTtcblxuICAgICAgICAgICAgaGR1X2NvbHVtbnNfbmFtZS5mb3JFYWNoKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaGVhZGVyX2NlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xuICAgICAgICAgICAgICAgIGhlYWRlcl9jZWxsLnRleHRDb250ZW50ID0gY29sdW1uO1xuICAgICAgICAgICAgICAgIGhlYWRlcl9yb3cuYXBwZW5kQ2hpbGQoaGVhZGVyX2NlbGwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhkdV9kYXRhLmZvckVhY2goZGF0YV9wb2ludCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSB0Ym9keS5pbnNlcnRSb3coKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YV9wb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoZGF0YV9wb2ludCwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IGRhdGFfcG9pbnRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEQVRBIFBBUlNJTkcgRVJST1JcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldFRhYmxlcygpIHtcbiAgICAgICAgbGV0IHRhYmxlX2hlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFibGVfaGVhZGVyX2lkKTtcbiAgICAgICAgbGV0IHRhYmxlX2RhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhYmxlX2RhdGFfaWQpO1xuXG4gICAgICAgIGxldCB0Ym9keSA9IHRhYmxlX2hlYWRlci5xdWVyeVNlbGVjdG9yKCd0Ym9keScpO1xuICAgICAgICB0Ym9keS5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICB0Ym9keSA9IHRhYmxlX2RhdGEucXVlcnlTZWxlY3RvcigndGJvZHknKTtcbiAgICAgICAgbGV0IHRoZWFkID0gdGFibGVfZGF0YS5xdWVyeVNlbGVjdG9yKCd0aGVhZCcpO1xuXG4gICAgICAgIHRib2R5LmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGVhZC5pbm5lckhUTUwgPSAnPHRyPjwvdHI+JztcbiAgICB9XG5cbiAgICBzZXRIRFVTZWxlY3RMaXN0ZW5lcigpIHtcblxuICAgICAgICBsZXQgc2VsZWN0X2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnNlbGVjdF9oZHVfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRUYWJsZXMoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXNldENvbnRhaW5lckZvckN1cnJlbnRGaWxlKCkge1xuICAgICAgICB0aGlzLnNldHVwQ29tcG9uZW50KCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRGF0YVByZVByb2Nlc3NvciB9IGZyb20gJy4uL2RhdGFfcHJvY2Vzc29ycy9EYXRhUHJlUHJvY2Vzc29yLmpzJ1xuaW1wb3J0IHsgTGlnaHRDdXJ2ZVByb2Nlc3NvciB9IGZyb20gJy4uL2RhdGFfcHJvY2Vzc29ycy9MaWdodEN1cnZlUHJvY2Vzc29yLmpzJ1xuaW1wb3J0IHsgU3BlY3RydW1Qcm9jZXNzb3IgfSBmcm9tICcuLi9kYXRhX3Byb2Nlc3NvcnMvU3BlY3RydW1Qcm9jZXNzb3IuanMnXG5cbmV4cG9ydCBjbGFzcyBEYXRhUHJvY2Vzc29yQ29udGFpbmVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0RGF0YVByZVByb2Nlc3NvcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRhUHJlUHJvY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDdXJ2ZVByb2Nlc3NvcihmaXRzX3JlYWRlcl93cmFwcGVyLCBoZHVfaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMaWdodEN1cnZlUHJvY2Vzc29yKGZpdHNfcmVhZGVyX3dyYXBwZXIsIGhkdV9pbmRleCk7XG4gICAgfVxuXG4gICAgZ2V0U3BlY3RydW1Qcm9jZXNzb3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3BlY3RydW1Qcm9jZXNzb3IoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RGF0YVByb2Nlc3NvckNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRhUHJvY2Vzc29yQ29udGFpbmVyKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5IH0gZnJvbSAnLi4vcmVnaXN0cmllcy9FdmVudFN1YnNjcmliZXJzUmVnaXN0cnkuanMnXG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeUNvbnRhaW5lciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0UmVnaXN0cnlDb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnaXN0cnlDb250YWluZXIoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBWaXN1YWxpemF0aW9uU2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncy9WaXN1YWxpemF0aW9uU2V0dGluZ3MuanMnXG5pbXBvcnQgeyBTZXR0aW5nc0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9zZXR0aW5ncy9TZXR0aW5nc0NvbmZpZ3VyYXRpb24uanMnXG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbnRhaW5lciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGdldFZpc3VhbGl6YXRpb25TZXR0aW5nc09iamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWaXN1YWxpemF0aW9uU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICBnZXRTZXR0aW5nc0NvbmZpZ3VyYXRpb25PYmplY3QoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0dGluZ3NDb25maWd1cmF0aW9uKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNldHRpbmdzQ29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNldHRpbmdzQ29udGFpbmVyKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQm9rZWhHcmFwaCB9IGZyb20gJy4uL3Zpc3VhbGl6YXRpb25zL0Jva2VoR3JhcGgnXG5pbXBvcnQgeyBEM0dyYXBoIH0gZnJvbSAnLi4vdmlzdWFsaXphdGlvbnMvRDNHcmFwaCdcblxuZXhwb3J0IGNsYXNzIFZpc3VhbGl6YXRpb25Db250YWluZXIge1xuXG4gICAgc3RhdGljIGJva2VoX2dyYXBoID0gbnVsbDtcbiAgICBzdGF0aWMgZDNfZ3JhcGggPSBudWxsO1xuXG4gICAgc3RhdGljIHZpc3VhbGl6YXRpb25fY29udGFpbmVyID0gJyN2aXN1YWxpemF0aW9uLWNvbnRhaW5lcidcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJva2VoVmlzdWFsaXphdGlvbihib2tlaF92aXN1YWxpemF0aW9uKSB7XG4gICAgICAgIFZpc3VhbGl6YXRpb25Db250YWluZXIuYm9rZWhfdmlzdWFsaXphdGlvbiA9IGJva2VoX3Zpc3VhbGl6YXRpb247XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEQzVmlzdWFsaXphdGlvbihkM192aXN1YWxpemF0aW9uKSB7XG4gICAgICAgIFZpc3VhbGl6YXRpb25Db250YWluZXIuZDNfdmlzdWFsaXphdGlvbiA9IGQzX3Zpc3VhbGl6YXRpb247XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEJva2VoVmlzdWFsaXphdGlvbigpIHtcbiAgICAgICAgaWYoVmlzdWFsaXphdGlvbkNvbnRhaW5lci5ib2tlaF92aXN1YWxpemF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5ib2tlaF92aXN1YWxpemF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb2tlaEdyYXBoKFZpc3VhbGl6YXRpb25Db250YWluZXIudmlzdWFsaXphdGlvbl9jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEQzVmlzdWFsaXphdGlvbigpIHtcbiAgICAgICAgaWYoVmlzdWFsaXphdGlvbkNvbnRhaW5lci5kM192aXN1YWxpemF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5kM192aXN1YWxpemF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEM0dyYXBoKFZpc3VhbGl6YXRpb25Db250YWluZXIudmlzdWFsaXphdGlvbl9jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRklUU1JlYWRlcldyYXBwZXIgfSBmcm9tICcuLi93cmFwcGVycy9GSVRTUmVhZGVyV3JhcHBlci5qcydcbmltcG9ydCB7IEJva2VoV3JhcHBlciB9IGZyb20gJy4uL3dyYXBwZXJzL0Jva2VoV3JhcHBlci5qcydcbmltcG9ydCB7IEQzV3JhcHBlciB9IGZyb20gJy4uL3dyYXBwZXJzL0QzV3JhcHBlci5qcydcblxuZXhwb3J0IGNsYXNzIFdyYXBwZXJDb250YWluZXIge1xuXG4gICAgc3RhdGljIGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBudWxsO1xuICAgIHN0YXRpYyBib2tlaF93cmFwcGVyID0gbnVsbDtcbiAgICBzdGF0aWMgZDNfd3JhcHBlciA9IG51bGw7XG5cbiAgICBzdGF0aWMgdmlzdWFsaXphdGlvbl9jb250YWluZXIgPSAndmlzdWFsaXphdGlvbi1jb250YWluZXInXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBzZXRGSVRTUmVhZGVyV3JhcHBlcihmaXRzX3JlYWRlcl93cmFwcGVyKSB7XG4gICAgICAgIFdyYXBwZXJDb250YWluZXIuZml0c19yZWFkZXJfd3JhcHBlciA9IGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJva2VoV3JhcHBlcihib2tlaF93cmFwcGVyKSB7XG4gICAgICAgIFdyYXBwZXJDb250YWluZXIuYm9rZWhfd3JhcHBlciA9IGJva2VoX3dyYXBwZXI7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEQzV3JhcHBlcihkM193cmFwcGVyKSB7XG4gICAgICAgIFdyYXBwZXJDb250YWluZXIuZDNfd3JhcHBlciA9IGQzX3dyYXBwZXI7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZJVFNSZWFkZXJXcmFwcGVyKCkge1xuICAgICAgICBpZihXcmFwcGVyQ29udGFpbmVyLmZpdHNfcmVhZGVyX3dyYXBwZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBXcmFwcGVyQ29udGFpbmVyLmZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZJVFNSZWFkZXJXcmFwcGVyKCcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRCb2tlaFdyYXBwZXIoKSB7XG4gICAgICAgIGlmKFdyYXBwZXJDb250YWluZXIuYm9rZWhfd3JhcHBlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFdyYXBwZXJDb250YWluZXIuYm9rZWhfd3JhcHBlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9rZWhXcmFwcGVyKFdyYXBwZXJDb250YWluZXIudmlzdWFsaXphdGlvbl9jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEQzV3JhcHBlcigpIHtcbiAgICAgICAgaWYoV3JhcHBlckNvbnRhaW5lci5kM193cmFwcGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gV3JhcHBlckNvbnRhaW5lci5kM193cmFwcGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEM1dyYXBwZXIoV3JhcHBlckNvbnRhaW5lci52aXN1YWxpemF0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7U3BlY3RydW1Qcm9jZXNzb3J9IGZyb20gXCIuL1NwZWN0cnVtUHJvY2Vzc29yXCI7XG5pbXBvcnQge0RhdGFQcm9jZXNzb3JDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL0RhdGFQcm9jZXNzb3JDb250YWluZXJcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFQcmVQcm9jZXNzb3Ige1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRQcm9jZXNzZWREYXRhc2V0KGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0KSB7XG4gICAgICAgIGxldCBkYXRhc2V0ID0ge307XG5cbiAgICAgICAgZGF0YXNldF9zZXR0aW5nc19vYmplY3QuYXhpcy5mb3JFYWNoKChheGlzKSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBmaWxlX29iamVjdCA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChheGlzLmZpbGVfaWQpO1xuXG4gICAgICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgZnJ3LnNldEZpbGUoZmlsZV9vYmplY3QuZmlsZSk7XG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5fZGF0YTtcblxuICAgICAgICAgICAgaWYoZGF0YXNldF9zZXR0aW5nc19vYmplY3QuZGF0YV90eXBlLnR5cGUgPT09ICdzcGVjdHJ1bScgJiZcbiAgICAgICAgICAgICAgICBTcGVjdHJ1bVByb2Nlc3Nvci5wcm9jZXNzZWRfY29sdW1uc19uYW1lLmluY2x1ZGVzKGF4aXMuY29sdW1uX25hbWUpKSB7XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IHRoaXMuZ2V0U3BlY3RydW1Qcm9jZXNzZWRDb2x1bW4oYXhpcy5oZHVfaW5kZXgsIGF4aXMuY29sdW1uX25hbWUsIGZydylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSBmcncuZ2V0Q29sdW1uRGF0YUZyb21IRFUoYXhpcy5oZHVfaW5kZXgsIGF4aXMuY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBheGlzLmRhdGEgPSBjb2x1bW5fZGF0YTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIGlmKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0Lmhhc093blByb3BlcnR5KCdlcnJvcl9iYXJzJykpIHtcbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmlsZV9vYmplY3QgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZXJyb3JfYmFyLmZpbGVfaWQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlX29iamVjdC5maWxlKTtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmRhdGFfdHlwZS50eXBlID09PSAnc3BlY3RydW0nICYmXG4gICAgICAgICAgICAgICAgICAgIFNwZWN0cnVtUHJvY2Vzc29yLnByb2Nlc3NlZF9jb2x1bW5zX25hbWUuaW5jbHVkZXMoZXJyb3JfYmFyLmNvbHVtbl9uYW1lKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9kYXRhID0gdGhpcy5nZXRTcGVjdHJ1bVByb2Nlc3NlZENvbHVtbihlcnJvcl9iYXIuaGR1X2luZGV4LCBlcnJvcl9iYXIuY29sdW1uX25hbWUsIGZydylcblxuICAgICAgICAgICAgICAgICAgICBpZihlcnJvcl9iYXIuY29sdW1uX25hbWUgPT09IFNwZWN0cnVtUHJvY2Vzc29yLkVfTUlEX0xPRykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uX2RhdGEuZm9yRWFjaChjb2xfZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29sX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSBmcncuZ2V0Q29sdW1uRGF0YUZyb21IRFUoZXJyb3JfYmFyLmhkdV9pbmRleCwgZXJyb3JfYmFyLmNvbHVtbl9uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXIuZGF0YSA9IGNvbHVtbl9kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFzZXQgPSBkYXRhc2V0X3NldHRpbmdzX29iamVjdDtcblxuICAgICAgICByZXR1cm4gZGF0YXNldDtcbiAgICB9XG5cbiAgICBkYXRhc2V0VG9KU09ORGF0YShkYXRhc2V0X3NldHRpbmdzX29iamVjdCkge1xuICAgICAgICBsZXQgcm93cyA9IFtdO1xuXG4gICAgICAgIGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmF4aXMuZm9yRWFjaCgoYXhpcykgPT4ge1xuXG4gICAgICAgICAgICBheGlzLmRhdGEuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyb3dzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICByb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3dzW2luZGV4XVtheGlzLmNvbHVtbl9uYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSlcblxuICAgICAgICBpZihkYXRhc2V0X3NldHRpbmdzX29iamVjdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JfYmFycycpKSB7XG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzX29iamVjdC5lcnJvcl9iYXJzLmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFyLmRhdGEuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcm93c1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93c1tpbmRleF1bZXJyb3JfYmFyLmNvbHVtbl9uYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfVxuXG4gICAgcHJvY2Vzc0Vycm9yQmFyRGF0YUpTT04oZGF0YXNldCwgYXhpcywgZXJyb3JfYmFycykge1xuXG4gICAgICAgIGxldCBlcnJvcl9iYXJfeF92YWx1ZXMgPSBbXTtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X3ZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGxldCBheGlzX3ggPSBheGlzLng7XG4gICAgICAgIGxldCBheGlzX3kgPSBheGlzLnk7XG5cbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X2NvbHVtbiA9IGVycm9yX2JhcnMueTtcblxuICAgICAgICBkYXRhc2V0LmZvckVhY2goZnVuY3Rpb24oZGF0YXBvaW50KXtcbiAgICAgICAgICAgIGxldCBlcnJvcl9iYXJfeCA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3ldKSAtIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl95X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICBbYXhpc194XTogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc194XSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm91bmQ6IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pICsgcGFyc2VGbG9hdChkYXRhcG9pbnRbZXJyb3JfYmFyX3lfY29sdW1uXSksXG4gICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl95ID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm91bmQ6IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeF0pIC0gcGFyc2VGbG9hdChkYXRhcG9pbnRbZXJyb3JfYmFyX3hfY29sdW1uXSksXG4gICAgICAgICAgICAgICAgICAgIFtheGlzX3ldOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3ldKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc194XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeF9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBlcnJvcl9iYXJfeF92YWx1ZXMucHVzaChlcnJvcl9iYXJfeCk7XG4gICAgICAgICAgICBlcnJvcl9iYXJfeV92YWx1ZXMucHVzaChlcnJvcl9iYXJfeSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHsgeDogZXJyb3JfYmFyX3hfdmFsdWVzLCB5OiBlcnJvcl9iYXJfeV92YWx1ZXMgfVxuICAgIH1cblxuICAgIGdldFNwZWN0cnVtUHJvY2Vzc2VkQ29sdW1uKGhkdV9pbmRleCwgY29sdW1uX25hbWUsIGZpdHNfcmVhZGVyX3dyYXBwZXIpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NlZF9jb2x1bW4gPSBbXTtcblxuICAgICAgICBsZXQgc3AgPSBEYXRhUHJvY2Vzc29yQ29udGFpbmVyLmdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKS5nZXRTcGVjdHJ1bVByb2Nlc3NvcigpO1xuXG4gICAgICAgIGxldCBlX21pbl9jb2wgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbkRhdGFGcm9tSERVKGhkdV9pbmRleCwgXCJFX01JTlwiKTtcbiAgICAgICAgbGV0IGVfbWF4X2NvbCA9IGZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uRGF0YUZyb21IRFUoaGR1X2luZGV4LCBcIkVfTUFYXCIpO1xuXG4gICAgICAgIGVfbWluX2NvbC5mb3JFYWNoKChlX21pbiwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9jb2x1bW4ucHVzaChTcGVjdHJ1bVByb2Nlc3Nvci5zcGVjdHJ1bV9jb2xfZnVuY3Rpb25zW2NvbHVtbl9uYW1lXShlX21pbiwgZV9tYXhfY29sW2luZGV4XSkpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWRfY29sdW1uO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2UocmFuZ2VzLCBkYXRhLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZGF0YSA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycyA9IHt9O1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeSA9IFtdO1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBbXTtcblxuICAgICAgICBkYXRhLmZvckVhY2goKGRhdGFfcG9pbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YV9wb2ludCk7XG4gICAgICAgICAgICBsZXQgeF9jb2x1bW4gPSBrZXlzWzBdO1xuICAgICAgICAgICAgbGV0IHlfY29sdW1uID0ga2V5c1sxXTtcblxuICAgICAgICAgICAgaWYgKHJhbmdlcy54ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV94ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YV9wb2ludFt4X2NvbHVtbl0gPj0gcmFuZ2VzLngubG93ZXJfYm91bmQgJiYgZGF0YV9wb2ludFt4X2NvbHVtbl0gPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRhdGFfcG9pbnRbeV9jb2x1bW5dID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnRbeV9jb2x1bW5dIDw9IHJhbmdlcy55LnVwcGVyX2JvdW5kKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZGF0YS5wdXNoKGRhdGFfcG9pbnQpO1xuICAgICAgICAgICAgICAgIGlmKGVycm9yX2JhcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Vycm9yX2Jhcl94LnB1c2goZXJyb3JfYmFycy54W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9lcnJvcl9iYXJfeS5wdXNoKGVycm9yX2JhcnMueVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoZXJyb3JfYmFycyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzLnggPSB0ZW1wX2Vycm9yX2Jhcl94O1xuICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycy55ID0gdGVtcF9lcnJvcl9iYXJfeTtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMgPSB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZGF0YSA9IHRlbXBfcHJvY2Vzc2VkX2RhdGE7XG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2VCb2tlaChyYW5nZXMsIGRhdGEsIGhhc19lcnJvcl9iYXJzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NlZF9kYXRhID0ge307XG4gICAgICAgIHByb2Nlc3NlZF9kYXRhLnggPSBbXTtcbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEueSA9IFtdXG5cbiAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnhfbG93ID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55X2xvdyA9IFtdO1xuICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEueV91cCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRlbXBfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF95ID0gW107XG5cbiAgICAgICAgZGF0YS54LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy54Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF94LnB1c2godGVtcF9kYXRhX29iamVjdCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZGF0YS55LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLnkudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF95LnB1c2godGVtcF9kYXRhX29iamVjdClcbiAgICAgICAgfSlcblxuICAgICAgICB0ZW1wX3guZm9yRWFjaCgoZGF0YV9wb2ludF94LCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YV9wb2ludF95ID0gdGVtcF95W2ldO1xuXG4gICAgICAgICAgICBpZihkYXRhX3BvaW50X3gubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnRfeS5tYXRjaF9yYW5nZV95ID09IDIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54LnB1c2goZGF0YV9wb2ludF94LnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55LnB1c2goZGF0YV9wb2ludF95LnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmKGhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfbG93LnB1c2goZGF0YS55X2xvd1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfdXAucHVzaChkYXRhLnlfdXBbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X2xvdy5wdXNoKGRhdGEueF9sb3dbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwLnB1c2goZGF0YS54X3VwW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBMaWdodEN1cnZlUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBoZWFkZXJfY2FyZHMgPSBbXG4gICAgICAgICdUSU1FUkVGJyxcbiAgICAgICAgJ1RJTUVERUwnLFxuICAgICAgICAnTUpEUkVGJyxcbiAgICAgICAgJ1RTVEFSVCcsXG4gICAgICAgICdUU1RPUCcsXG4gICAgICAgICdURUxBUFNFJyxcbiAgICAgICAgJ0VfTUlOJyxcbiAgICAgICAgJ0VfTUFYJyxcbiAgICAgICAgJ0VfVU5JVCddXG5cbiAgICBzdGF0aWMgY29sdW1uc19uYW1lcyA9IHtcbiAgICAgICAgdGltZTogJ1RJTUUnLFxuICAgICAgICB0aW1lZGVsOiAnVElNRURFTCcsXG4gICAgICAgIHJhdGU6ICdSQVRFJyxcbiAgICAgICAgZXJyb3I6ICdFUlJPUicsXG4gICAgICAgIGZyYWNleHA6ICdGUkFDRVhQJ1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5uaW5nX3R5cGVzID0ge1xuICAgICAgICAnVElNRV9CQVNFRCc6ICd0aW1lX2Jhc2VkJyxcbiAgICAgICAgJ0VRVUFMX0NPVU5UJzogJ2VxdWFsX2NvdW50J1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5fdmFsdWVfbWV0aG9kcyA9IFtcbiAgICAgICAgJ21lYW4nLFxuICAgICAgICAnd2VpZ2h0ZWRtZWFuJyxcbiAgICAgICAgJ21lZGlhbicsXG4gICAgICAgICd3bWVkaWFuJyxcbiAgICAgICAgJ3N0ZGRldicsXG4gICAgICAgICdtZWRkZXYnLFxuICAgICAgICAna3VydG9zaXMnLFxuICAgICAgICAnc2tld25lc3MnLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21pbicsXG4gICAgICAgICdzdW0nXG4gICAgXVxuXG4gICAgc3RhdGljIG1pbl9jb2x1bW5zX251bWJlciA9IDI7XG4gICAgc3RhdGljIG1hbmRhdG9yeV9jb2x1bW5zID0gWydSQVRFJ107XG4gICAgc3RhdGljIHJlcGxhY2VtZW50X2NvbHVtbnMgPSBbJ1RJTUVERUwnXTtcblxuICAgIGhkdTtcbiAgICBoZHVfaW5kZXggPSBudWxsO1xuXG4gICAgYmlubmluZ190eXBlO1xuICAgIG1ldGhvZDtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgaGVhZGVyX3ZhbHVlcyA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZml0c19yZWFkZXJfd3JhcHBlciwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuZml0c19yZWFkZXJfd3JhcHBlciA9IGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgICAgIHRoaXMuaGR1X2luZGV4ID0gaGR1X2luZGV4O1xuXG4gICAgICAgIHRoaXMuX3NldEhEVSgpO1xuICAgIH1cblxuICAgIF9zZXRIRFUoKSB7XG4gICAgICAgIHRoaXMuaGR1ID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhEVSh0aGlzLmhkdV9pbmRleCk7XG4gICAgfVxuXG4gICAgc2V0SERVKGhkdSwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuaGR1ID0gaGR1O1xuICAgICAgICB0aGlzLmhkdV9pbmRleCA9IGhkdV9pbmRleDtcbiAgICB9XG5cbiAgICBwcm9jZXNzRGF0YVJhd0pTT04oYXhpcywgZXJyb3JfYmFycyA9IG51bGwpIHtcbiAgICAgICAgLy9sZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCByYXdfZml0c19kYXRhID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldERhdGFGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcblxuICAgICAgICBsZXQgeDtcbiAgICAgICAgbGV0IHk7XG5cbiAgICAgICAgbGV0IHhfY29sdW1uID0gYXhpcy54O1xuICAgICAgICBsZXQgeV9jb2x1bW4gPSBheGlzLnk7XG5cbiAgICAgICAgcmF3X2ZpdHNfZGF0YS5nZXRDb2x1bW4oeF9jb2x1bW4sIGZ1bmN0aW9uKGNvbCl7eCA9IGNvbH0pO1xuICAgICAgICByYXdfZml0c19kYXRhLmdldENvbHVtbih5X2NvbHVtbiwgZnVuY3Rpb24oY29sKXt5ID0gY29sfSk7XG5cbiAgICAgICAgZGF0YS54ID0geDtcbiAgICAgICAgZGF0YS55ID0geTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgICAgIGxldCBkeTtcblxuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgICAgIGxldCBlcnJvcl9iYXJfeV9jb2x1bW4gPSBlcnJvcl9iYXJzLnk7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl95X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZHkgPSBjb2x9KTtcblxuICAgICAgICAgICAgZGF0YS5keSA9IGR5O1xuICAgICAgICAgICAgLy9kYXRhLnRpbWVkZWwgPSB0aGlzLmdldFRpbWVkZWwoZXJyb3JfYmFyX3hfY29sdW1uKTtcbiAgICAgICAgICAgIC8vZGF0YS50aW1lZGVsID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckZyb21IRFUodGhpcy5oZHVfaW5kZXgpLmdldChcIlRJTUVERUxcIik7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZGF0YS50aW1lZGVsID0gY29sfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhSlNPTihheGlzLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCBsaWdodF9jdXJ2ZV9kYXRhID0ge307XG5cbiAgICAgICAgaWYoIXRoaXMuX2NoZWNrQ29sdW1ucygpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaWdodF9jdXJ2ZV9kYXRhLm1haW4gPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc0pTT05EYXRhRnJvbUhEVSh0aGlzLmhkdV9pbmRleCk7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgbGlnaHRfY3VydmVfZGF0YS5lcnJvcl9iYXJzID0gdGhpcy5fcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGxpZ2h0X2N1cnZlX2RhdGEubWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlnaHRfY3VydmVfZGF0YTtcbiAgICB9XG5cbiAgICBfcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGRhdGEpIHtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X3ZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfdmFsdWVzID0gW107XG5cbiAgICAgICAgbGV0IGF4aXNfeCA9IGF4aXMueDtcbiAgICAgICAgbGV0IGF4aXNfeSA9IGF4aXMueTtcblxuICAgICAgICBsZXQgZXJyb3JfYmFyX3hfY29sdW1uID0gZXJyb3JfYmFycy54O1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfY29sdW1uID0gZXJyb3JfYmFycy55O1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhcG9pbnQpe1xuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94ID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm91bmQ6IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pIC0gcGFyc2VGbG9hdChkYXRhcG9pbnRbZXJyb3JfYmFyX3lfY29sdW1uXSksXG4gICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeF06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBsZXQgZXJyb3JfYmFyX3kgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc194XSkgLSBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeF9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSArIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICBbYXhpc195XTogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIGVycm9yX2Jhcl94X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl94KTtcbiAgICAgICAgICAgIGVycm9yX2Jhcl95X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl95KTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4ge3g6IGVycm9yX2Jhcl94X3ZhbHVlcywgeTogZXJyb3JfYmFyX3lfdmFsdWVzfVxuICAgIH1cblxuICAgIF9jaGVja0NvbHVtbnMocmVxdWlyZWRfbmJfY29sdW1ucykge1xuICAgICAgICBsZXQgaXNfY2hlY2tlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IGNvbHVtbnNfbnVtYmVyID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldE51bWJlck9mQ29sdW1uRnJvbUhEVSh0aGlzLmhkdV9pbmRleClcbiAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRDb2x1bW5zTmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgpXG5cbiAgICAgICAgaWYoY29sdW1uc19udW1iZXIgPCByZXF1aXJlZF9uYl9jb2x1bW5zIHx8ICFjb2x1bW5zX25hbWUuaW5jbHVkZXMoTGlnaHRDdXJ2ZVByb2Nlc3Nvci5jb2x1bW5zX25hbWVzLnJhdGUpKSB7XG4gICAgICAgICAgICBpc19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfY2hlY2tlZDtcbiAgICB9XG5cbiAgICBnZXRUaW1lZGVsKGVycm9yX2Jhcl94ID0gbnVsbCkge1xuICAgICAgICBsZXQgdGltZWRlbDtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKHRoaXMuaGR1X2luZGV4KS5pbmNsdWRlcyhcIlRJTUVERUxcIikpIHtcbiAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94LCBmdW5jdGlvbiAoY29sKSB7dGltZWRlbCA9IGNvbH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgICAgIHRpbWVkZWwgPSBoZWFkZXIuZ2V0KFwiVElNRURFTFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lZGVsO1xuICAgIH1cblxuICAgIF9nZXRWYWx1ZUZyb21IRFVIZWFkZXIoKSB7XG4gICAgICAgIGxldCBjYXJkX3ZhbHVlO1xuICAgICAgICBMaWdodEN1cnZlUHJvY2Vzc29yLmhlYWRlcl9jYXJkcy5mb3JFYWNoKChjYXJkX25hbWUpID0+IHtcbiAgICAgICAgICAgIGNhcmRfdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBjYXJkX3ZhbHVlID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgsIGNhcmRfbmFtZSlcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyX3ZhbHVlc1tjYXJkX25hbWVdID0gY2FyZF92YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRCaW5uaW5nVHlwZShiaW5uaW5nX3R5cGUpIHtcbiAgICAgICAgdGhpcy5iaW5uaW5nX3R5cGUgPSBiaW5uaW5nX3R5cGVcbiAgICB9XG5cbiAgICBzZXRCaW5WYWx1ZU1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuXG4gICAgZ2V0Qmluc0Zvck1ldGhvZChyYXRlX2NvbHVtbiwgZnJhY2V4cF9jb2x1bW4sIGJpbnMsIG1ldGhvZCkge1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2JpbnMgPSBbXTtcblxuICAgICAgICBiaW5zLmZvckVhY2goKGJpbikgPT4ge1xuICAgICAgICAgICAgbGV0IHRpbWVzID0gW107XG4gICAgICAgICAgICBsZXQgcmF0ZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCBmcmFjZXhwcyA9IFtdO1xuXG4gICAgICAgICAgICBiaW4uZm9yRWFjaCgoeyB0aW1lLCByYXRlLCBmcmFjZXhwIH0pID0+IHtcbiAgICAgICAgICAgICAgICB0aW1lcy5wdXNoKHRpbWUpO1xuICAgICAgICAgICAgICAgIHJhdGVzLnB1c2gocmF0ZSk7XG4gICAgICAgICAgICAgICAgZnJhY2V4cHMucHVzaChmcmFjZXhwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfbWF4ID0gTWF0aC5tYXgoLi4ucmF0ZXMpO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX21pbiA9IE1hdGgubWluKC4uLnJhdGVzKTtcbiAgICAgICAgICAgIGxldCBiaW5fcmF0ZV9tZWFuID0gcmF0ZXMucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApIC8gcmF0ZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX3N1bSA9IHJhdGVzLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB0b3RhbCArIHZhbHVlLCAwKTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWRfYmlucztcbiAgICB9XG5cbiAgICBnZXRSYXRlRnJhY2V4cFdlaWdodGVkTWVhbkJpbm5lZERhdGEocmF0ZV9jb2x1bW4sIGZyYWNleHBfY29sdW1uLCBiaW5fc2l6ZSkge1xuICAgICAgICBsZXQgbnVtX2RhdGFfcG9pbnRzID0gcmF0ZV9jb2x1bW4ubGVuZ3RoO1xuICAgICAgICBsZXQgbnVtX2JpbnMgPSBNYXRoLmNlaWwobnVtX2RhdGFfcG9pbnRzIC8gYmluX3NpemUpO1xuXG4gICAgICAgIGxldCBiaW5uZWRfcmF0ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9iaW5zOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydF9wb3MgPSBpICogYmluX3NpemU7XG4gICAgICAgICAgICBsZXQgZW5kX3BvcyA9IE1hdGgubWluKHN0YXJ0X3BvcyArIGJpbl9zaXplLCByYXRlX2NvbHVtbi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgd2VpZ2h0ZWRfc3VtID0gMDtcbiAgICAgICAgICAgIGxldCBudW1fZGF0YV9wb2ludHNfYmluID0gMDtcblxuICAgICAgICAgICAgZm9yKGxldCBqID0gc3RhcnRfcG9zOyBqIDwgZW5kX3BvczsgaisrKSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRfc3VtICs9IHJhdGVfY29sdW1uW2pdICogZnJhY2V4cF9jb2x1bW5bal07XG4gICAgICAgICAgICAgICAgbnVtX2RhdGFfcG9pbnRzX2JpbisrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfdmFsdWUgPSB3ZWlnaHRlZF9zdW0gLyBudW1fZGF0YV9wb2ludHNfYmluO1xuICAgICAgICAgICAgYmlubmVkX3JhdGVzLnB1c2goYmluX3JhdGVfdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpbm5lZF9yYXRlcztcbiAgICB9XG5cbiAgICBnZXRNZWRpYW5EYXRlKGRhdGVzKSB7XG4gICAgICAgIGxldCBzb3J0ZWRfZGF0ZXMgPSBkYXRlcy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgICAgbGV0IG1lZGlhbl9pbmRleCA9IE1hdGguZmxvb3Ioc29ydGVkX2RhdGVzLmxlbmd0aCAvIDIpO1xuXG4gICAgICAgIGlmIChzb3J0ZWRfZGF0ZXMubGVuZ3RoICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvcnRlZF9kYXRlc1ttZWRpYW5faW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREdXJhdGlvbkluU2Vjb25kcyh0aW1lX2NvbHVtbikge1xuICAgICAgICBsZXQgbG93ZXN0X3RpbWUgPSBNYXRoLm1pbiguLi50aW1lX2NvbHVtbik7XG4gICAgICAgIGxldCBoaWdoZXN0X3RpbWUgPSBNYXRoLm1heCguLi50aW1lX2NvbHVtbik7XG5cbiAgICAgICAgbGV0IGR1cmF0aW9uX3NlY29uZHMgPSAoaGlnaGVzdF90aW1lIC0gbG93ZXN0X3RpbWUpICogODY0MDA7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX3NlY29uZHM7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFNwZWN0cnVtUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBwcm9jZXNzZWRfY29sdW1uc19uYW1lID0gWydFX0hBTEZfV0lEVEgnLCAnRV9NSUQnLCAnRV9NSURfTE9HJ107XG5cbiAgICBzdGF0aWMgRF9FID0gJ0VfSEFMRl9XSURUSCc7XG4gICAgc3RhdGljIEVfTUlEID0gJ0VfTUlEJztcbiAgICBzdGF0aWMgRV9NSURfTE9HID0gJ0VfTUlEX0xPRyc7XG5cbiAgICBzdGF0aWMgc3BlY3RydW1fY29sX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgRV9IQUxGX1dJRFRIOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lIYWxmV2lkdGgsXG4gICAgICAgIEVfTUlEOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludCxcbiAgICAgICAgRV9NSURfTE9HOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludExvZyxcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vRF9FXG4gICAgc3RhdGljIGdldEVuZXJneUhhbGZXaWR0aChlX21pbiwgZV9tYXgpIHtcbiAgICAgICAgcmV0dXJuICgoZV9tYXggLSBlX21pbikgLyAyKTtcbiAgICB9XG5cbiAgICAvL0VfTUlEXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50KGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gKChlX21heCArIGVfbWluKSAvIDIpO1xuICAgIH1cblxuICAgIC8vRV9NSURfTE9HXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50TG9nKGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGVfbWF4ICogZV9taW4pO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBc3ltZXRyaWNFbmVyeUVycm9yQmFyKGVfbWluLCBlX21heCwgZV9taWQpIHtcbiAgICAgICAgbGV0IGVfZXJyb3JfdXAgPSBlX21heCAtIGVfbWlkO1xuICAgICAgICBsZXQgZV9lcnJvcl9kb3duID0gZV9taWQgLSBlX21pbjtcblxuICAgICAgICByZXR1cm4geydlX2Vycm9yX3VwJzogZV9lcnJvcl91cCwgJ2VfZXJyb3JfZG93bic6IGVfZXJyb3JfZG93bn07XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEV2ZW50Tm90Rm91bmRJblJlZ2lzdHJ5RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJFdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yXCI7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBIRFVOb3RUYWJ1bGFyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJIRFVOb3RUYWJ1bGFyRXJyb3JcIjtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEludmFsaWRVUkxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkludmFsaWRVUkxFcnJvclwiO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgTm9FdmVudFRvRGlzcGF0Y2hFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIk5vRXZlbnRUb0Rpc3BhdGNoXCI7XG4gICAgfVxufSIsImltcG9ydCB7UmVnaXN0cnlDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uRXZlbnQge1xuXG4gICAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjb21wb3NlZDogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcImNvbmZpZ3VyYXRpb25cIjtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb25fb2JqZWN0LCBkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCwgLi4ueydjb25maWd1cmF0aW9uX29iamVjdCc6IGNvbmZpZ3VyYXRpb25fb2JqZWN0fX07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uQ29uZmlndXJhdGlvbkV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChDb25maWd1cmF0aW9uRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvU3Vic2NyaWJlcnMoKSB7XG4gICAgICAgIGxldCBlc3IgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRSZWdpc3RyeUNvbnRhaW5lcigpLmdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpO1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnNfaWQgPSBlc3IuZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChDb25maWd1cmF0aW9uRXZlbnQubmFtZSlcblxuICAgICAgICBsZXQgc3Vic2NyaWJlcl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgc3Vic2NyaWJlcnNfaWQuZm9yRWFjaCgoc3Vic2NyaWJlcl9pZCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3Vic2NyaWJlcl9pZCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZUxvYWRlZEV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHN0YXRpYyBuYW1lID0gXCJmaWxlLWxvYWRlZFwiO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfaWQgPSAnanN2aXMtbWFpbic7XG4gICAgc3RhdGljIG1haW5fcm9vdF9lbGVtZW50ID0gbnVsbDtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGRldGFpbCA9IHt9LCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLmRldGFpbCA9IHsgLi4uZGV0YWlsIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRmlsZUxvYWRlZEV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChGaWxlTG9hZGVkRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvVGFyZ2V0KHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvTWFpblJvb3QoKSB7XG4gICAgICAgIGlmKEZpbGVMb2FkZWRFdmVudC5tYWluX3Jvb3RfZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgRmlsZUxvYWRlZEV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUxvYWRlZEV2ZW50Lm1haW5fcm9vdF9pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9TdWJzY3JpYmVycygpIHtcbiAgICAgICAgbGV0IGVzciA9IFJlZ2lzdHJ5Q29udGFpbmVyLmdldFJlZ2lzdHJ5Q29udGFpbmVyKCkuZ2V0RXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5KCk7XG4gICAgICAgIGxldCBzdWJzY3JpYmVyc19pZCA9IGVzci5nZXRTdWJzY3JpYmVyc0ZvckV2ZW50KEZpbGVMb2FkZWRFdmVudC5uYW1lKVxuXG4gICAgICAgIGxldCBzdWJzY3JpYmVyX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICBzdWJzY3JpYmVyc19pZC5mb3JFYWNoKChzdWJzY3JpYmVyX2lkKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdWJzY3JpYmVyX2lkKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXJfZWxlbWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImltcG9ydCB7UmVnaXN0cnlDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNvbXBvc2VkOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdGF0aWMgbmFtZSA9IFwiZmlsZS1yZWdpc3RyeS1jaGFuZ2VcIjtcbiAgICBzdGF0aWMgbWFpbl9yb290X2lkID0gJ2pzdmlzLW1haW4nO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfZWxlbWVudCA9IG51bGw7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBDdXN0b21FdmVudChGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5uYW1lLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHRoaXMuZGV0YWlsLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9UYXJnZXQodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9NYWluUm9vdCgpIHtcbiAgICAgICAgaWYoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubWFpbl9yb290X2VsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubWFpbl9yb290X2lkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvU3Vic2NyaWJlcnMoKSB7XG4gICAgICAgIGxldCBlc3IgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRSZWdpc3RyeUNvbnRhaW5lcigpLmdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpO1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnNfaWQgPSBlc3IuZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5uYW1lKTtcblxuICAgICAgICBsZXQgc3Vic2NyaWJlcl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgc3Vic2NyaWJlcnNfaWQuZm9yRWFjaCgoc3Vic2NyaWJlcl9pZCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3Vic2NyaWJlcl9pZCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge05vRXZlbnRUb0Rpc3BhdGNoRXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvTm9FdmVudFRvRGlzcGF0Y2hFcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDaGFuZ2VkRXZlbnQge1xuXG4gICAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjb21wb3NlZDogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcInNldHRpbmdzLWNoYW5nZWRcIjtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzX29iamVjdCwgZGV0YWlsID0ge30sIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuZGV0YWlsID0geyAuLi5kZXRhaWwsIC4uLnsnc2V0dGluZ3Nfb2JqZWN0Jzogc2V0dGluZ3Nfb2JqZWN0fX07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uU2V0dGluZ3NDaGFuZ2VkRXZlbnQuZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcblxuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFNldHRpbmdzQ2hhbmdlZEV2ZW50Lm5hbWUsIHtcbiAgICAgICAgICAgIGRldGFpbDogdGhpcy5kZXRhaWwsXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goKSB7XG4gICAgICAgIGlmKHRoaXMuZXZlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTm9FdmVudFRvRGlzcGF0Y2hFcnJvcihcIk5vIGV2ZW50IHRvIGRpc3BhdGNoXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTm9FdmVudFRvRGlzcGF0Y2hFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvTm9FdmVudFRvRGlzcGF0Y2hFcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudCB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNvbXBvc2VkOiBmYWxzZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH07XG5cbiAgICBzdGF0aWMgbmFtZSA9IFwidmlzdWFsaXphdGlvbi1nZW5lcmF0aW9uXCI7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nc19vYmplY3QsIGRldGFpbCA9IHt9LCBvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLmRldGFpbCA9IHsgLi4uZGV0YWlsLCAuLi57J3NldHRpbmdzX29iamVjdCc6IHNldHRpbmdzX29iamVjdH19O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLlZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcblxuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCgpIHtcbiAgICAgICAgaWYodGhpcy5ldmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOb0V2ZW50VG9EaXNwYXRjaEVycm9yKFwiTm8gZXZlbnQgdG8gZGlzcGF0Y2hcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQge0V2ZW50Tm90Rm91bmRJblJlZ2lzdHJ5RXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvRXZlbnROb3RGb3VuZEluUmVnaXN0cnlFcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5IHtcblxuICAgIHN0YXRpYyBldmVudHNfc3Vic2NyaWJlcnMgPSB7XG4gICAgICAgICdmaXRzLWxvYWRlZCc6IFsnc2V0dGluZ3MtY29tcG9uZW50JywgJ2ZpbGUtY29tcG9uZW50J10sXG4gICAgICAgICdjb25maWd1cmF0aW9uJzogWydzZXR0aW5ncy1jb21wb25lbnQnXSxcbiAgICAgICAgJ2ZpbGUtbG9hZGVkJzogWydmaWxlLWNvbXBvbmVudCddLFxuICAgICAgICAnZmlsZS1zZWxlY3RlZCc6IFsnc2V0dGluZ3MtY29tcG9uZW50J10sXG4gICAgICAgICdmaWxlLXJlZ2lzdHJ5LWNoYW5nZSc6IFsnc2V0dGluZ3MtY29tcG9uZW50JywgJ2ZpbGUtY29tcG9uZW50J11cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGdldFN1YnNjcmliZXJzRm9yRXZlbnQoZXZlbnRfbmFtZSkge1xuICAgICAgICBpZihFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkuZXZlbnRzX3N1YnNjcmliZXJzLmhhc093blByb3BlcnR5KGV2ZW50X25hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5LmV2ZW50c19zdWJzY3JpYmVyc1tldmVudF9uYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yKFwiRXZlbnQgbm90IGZvdW5kIDogXCIgKyBldmVudF9uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7RmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gXCIuLi91dGlscy9TdHJpbmdVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgRmlsZVJlZ2lzdHJ5IHtcblxuICAgIHN0YXRpYyBhdmFpbGFibGVfZmlsZXMgPSBbXTtcblxuICAgIHN0YXRpYyBjdXJyZW50X2ZpbGVzID0gW107XG5cbiAgICBzdGF0aWMgZmlsZV9jb3VudGVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEF2YWlsYWJsZUZpbGVzTGlzdCgpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcyA9IEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMuZmlsdGVyKG9iaiA9PiBvYmogIT09IHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDdXJyZW50RmlsZXNMaXN0KCkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcyA9IEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzLmZpbHRlcihvYmogPT4gb2JqICE9PSB1bmRlZmluZWQpO1xuICAgICAgICByZXR1cm4gRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFRvQXZhaWxhYmxlRmlsZXMoZmlsZV90b19hZGQpIHtcbiAgICAgICAgbGV0IGZpbGUgPSB7IC4uLmZpbGVfdG9fYWRkLFxuICAgICAgICAgICAgaWQ6IEZpbGVSZWdpc3RyeS5maWxlX2NvdW50ZXIsXG4gICAgICAgICAgICBmaWxlX25hbWU6IFN0cmluZ1V0aWxzLmNsZWFuRmlsZU5hbWUoZmlsZV90b19hZGQuZmlsZV9uYW1lKVxuICAgICAgICB9O1xuXG4gICAgICAgIEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMucHVzaChmaWxlKTtcblxuICAgICAgICBGaWxlUmVnaXN0cnkuZmlsZV9jb3VudGVyKys7XG4gICAgfVxuXG4gICAgc3RhdGljIG1vdmVUb0F2YWlsYWJsZUZpbGVzKGZpbGUpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5wdXNoKGZpbGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmVGcm9tQXZhaWxhYmxlRmlsZXMoZmlsZV9pZCkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmlkICE9PSBwYXJzZUludChmaWxlX2lkKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFRvQ3VycmVudEZpbGVzKGZpbGUpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21BdmFpbGFibGVGaWxlcyhmaWxlLmlkKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlRnJvbUN1cnJlbnRGaWxlcyhmaWxlX2lkKSB7XG4gICAgICAgIGxldCBmaWxlID0gRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKTtcblxuICAgICAgICBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcyA9IEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuaWQgIT09IHBhcnNlSW50KGZpbGVfaWQpKTtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5Lm1vdmVUb0F2YWlsYWJsZUZpbGVzKGZpbGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRGaWxlQnlJZChmaWxlX2lkKSB7XG4gICAgICAgIGxldCBmaWxlX2FycmF5ID0gWy4uLkZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMsIC4uLkZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzXTtcblxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVfYXJyYXkuZmluZChmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKTtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZpbGVCeU5hbWUoZmlsZV9uYW1lKSB7XG4gICAgICAgIGxldCBmaWxlX2FycmF5ID0gWy4uLkZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMsIC4uLkZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzXTtcblxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVfYXJyYXkuZmluZChmaWxlID0+IGZpbGUuZmlsZV9uYW1lID09PSBmaWxlX25hbWUpO1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNGaWxlQ3VycmVudChmaWxlX2lkKSB7XG4gICAgICAgIGxldCBpc19jdXJyZW50ID0gZmFsc2U7XG5cbiAgICAgICAgaWYoRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuc29tZShmaWxlID0+IGZpbGUuaWQgPT09IHBhcnNlSW50KGZpbGVfaWQpKSkge1xuICAgICAgICAgICAgaXNfY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfY3VycmVudDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2VuZFJlZ2lzdHJ5Q2hhbmdlRXZlbnQoKSB7XG4gICAgICAgIGxldCBmcmNlID0gbmV3IEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KCk7XG4gICAgICAgIGZyY2UuZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtPYmplY3RVdGlsc30gZnJvbSBcIi4uL3V0aWxzL09iamVjdFV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbmZpZ3VyYXRpb24ge1xuXG4gICAgc3RhdGljIGRlZmF1bHRfY29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgJ2xpYnJhcnktc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6ICdub25lJ1xuICAgICAgICB9LFxuICAgICAgICAnYm9rZWgtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICdib2tlaC1vcHRpb25zJzoge1xuICAgICAgICAgICAgICAgIHRvb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2QzLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogZmFsc2UsXG4gICAgICAgICAgICAnZDMtb3B0aW9ucyc6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnZGF0YS10eXBlLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkOiAnZ2VuZXJpYydcbiAgICAgICAgfSxcbiAgICAgICAgJ2xpZ2h0LWN1cnZlLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogZmFsc2UsXG4gICAgICAgICAgICAnbGlnaHQtY3VydmUtb3B0aW9ucyc6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnc3BlY3RydW0tc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICdzcGVjdHJ1bS1vcHRpb25zJzoge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdoZHVzLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgJ2F4aXMtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdlcnJvci1iYXJzLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnYmlubmluZy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2FkZGl0aW9uYWwtZGF0YXNldC1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbmZpZ3VyYXRpb24gPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbl9vYmplY3QgPSBudWxsKSB7XG4gICAgICAgIGlmKGNvbmZpZ3VyYXRpb25fb2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFNldHRpbmdzQ29uZmlndXJhdGlvbi5kZWZhdWx0X2NvbmZpZ3VyYXRpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uZmlndXJhdGlvbl9vYmplY3QpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvbmZpZ3VyYXRpb25PYmplY3Qod3JhcHBlcl9jb25maWd1cmF0aW9uKSB7XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uID0gbnVsbDtcblxuICAgICAgICBjb25maWd1cmF0aW9uID0gT2JqZWN0VXRpbHMuZGVlcF9tZXJnZShTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZGVmYXVsdF9jb25maWd1cmF0aW9uLCB3cmFwcGVyX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb25maWd1cmF0aW9uT2JqZWN0KHdyYXBwZXJfY29uZmlndXJhdGlvbikge1xuICAgICAgICBsZXQgY29uZmlndXJhdGlvbiA9IG51bGw7XG5cbiAgICAgICAgY29uZmlndXJhdGlvbiA9IE9iamVjdFV0aWxzLmRlZXBfbWVyZ2UoU2V0dGluZ3NDb25maWd1cmF0aW9uLmRlZmF1bHRfY29uZmlndXJhdGlvbiwgd3JhcHBlcl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbjtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgVmlzdWFsaXphdGlvblNldHRpbmdzIHtcblxuICAgIHN0YXRpYyBkZWZhdWx0X3NldHRpbmdzID0ge1xuICAgICAgICBsaWJyYXJ5OiAnJyxcbiAgICAgICAgZGF0YV90eXBlOiAnJyxcbiAgICAgICAgYXhpczoge30sXG4gICAgICAgIHNjYWxlczoge30sXG4gICAgICAgIGVycm9yX2JhcnM6IHt9XG4gICAgfVxuXG4gICAgc2V0dGluZ3MgPSB7fTtcblxuICAgIHNldHRpbmdzX2xpYnJhcnkgPSBudWxsO1xuICAgIHNldHRpbmdzX2RhdGFfdHlwZSA9IG51bGw7XG4gICAgc2V0dGluZ3NfaGR1cyA9IG51bGw7XG4gICAgc2V0dGluZ3NfYXhpcyA9IG51bGw7XG4gICAgc2V0dGluZ3Nfc2NhbGVzID0gbnVsbDtcbiAgICBzZXR0aW5nc19lcnJvcl9iYXJzID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzX29iamVjdCA9IG51bGwpIHtcbiAgICAgICAgaWYoc2V0dGluZ3Nfb2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZXR0aW5nc19vYmplY3QpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoVmlzdWFsaXphdGlvblNldHRpbmdzLmRlZmF1bHRfc2V0dGluZ3MpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGlicmFyeVNldHRpbmdzKGxpYnJhcnkpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19saWJyYXJ5ID0gbGlicmFyeTtcbiAgICB9XG5cbiAgICBnZXRMaWJyYXJ5U2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfbGlicmFyeSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfbGlicmFyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGF0YVR5cGVTZXR0aW5ncyhkYXRhX3R5cGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19kYXRhX3R5cGUgPSBkYXRhX3R5cGU7XG4gICAgfVxuXG4gICAgZ2V0RGF0YVR5cGVTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19kYXRhX3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX2RhdGFfdHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDdXJ2ZVNldHRpbmdzKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0U3BlY3RydW1TZXR0aW5ncygpIHtcblxuICAgIH1cblxuICAgIHNldEhEVXNTZXR0aW5ncyhoZHVzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfaGR1cyA9IGhkdXM7XG4gICAgfVxuXG4gICAgZ2V0SERVc1NldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX2hkdXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX2hkdXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEF4aXNTZXR0aW5ncyhheGlzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfYXhpcyA9IGF4aXM7XG4gICAgfVxuXG4gICAgZ2V0QXhpc1NldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX2F4aXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX2F4aXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNjYWxlc1NldHRpbmdzKHNjYWxlcykge1xuICAgICAgICB0aGlzLnNldHRpbmdzX3NjYWxlcyA9IHNjYWxlcztcbiAgICB9XG5cbiAgICBnZXRTY2FsZXNTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19zY2FsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX3NjYWxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RXJyb3JCYXJzU2V0dGluZ3MoZXJyb3JfYmFycykge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2Vycm9yX2JhcnMgPSBlcnJvcl9iYXJzO1xuICAgIH1cblxuICAgIGdldEVycm9yQmFyc1NldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX2Vycm9yX2JhcnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFJhbmdlc1NldHRpbmdzKHJhbmdlcykge1xuICAgICAgICB0aGlzLnNldHRpbmdzX3JhbmdlcyA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBnZXRSYW5nZXNTZXR0aW5ncygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NfcmFuZ2VzO1xuICAgIH1cblxuICAgIGdldEFkZGl0aW9uYWxEYXRhc2V0c1NldHRpbmdzKCkge1xuXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfbGlicmFyeSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfZGF0YV90eXBlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19oZHVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19heGlzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19zY2FsZXMgPSBudWxsO1xuICAgICAgICB0aGlzLnNldHRpbmdzX2Vycm9yX2JhcnMgPSBudWxsO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgT2JqZWN0VXRpbHMge1xuXG4gICAgc3RhdGljIGRlZXBfbWVyZ2UoYmFzZV9vYmplY3QsIG1lcmdpbmdfb2JqZWN0KSB7XG4gICAgICAgIGxldCBtZXJnZWRfb2JqZWN0ID0ge307XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGJhc2Vfb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoYmFzZV9vYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZF9vYmplY3Rba2V5XSA9IGJhc2Vfb2JqZWN0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWVyZ2luZ19vYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChtZXJnaW5nX29iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShtZXJnaW5nX29iamVjdFtrZXldKSkge1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXJnZWRfb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgJiYgdHlwZW9mIG1lcmdpbmdfb2JqZWN0W2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlZF9vYmplY3Rba2V5XSA9IE9iamVjdFV0aWxzLmRlZXBfbWVyZ2UobWVyZ2VkX29iamVjdFtrZXldLCBtZXJnaW5nX29iamVjdFtrZXldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRfb2JqZWN0W2tleV0gPSBtZXJnaW5nX29iamVjdFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZXJnZWRfb2JqZWN0O1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBTdHJpbmdVdGlscyB7XG5cbiAgICBzdGF0aWMgY2xlYW5GaWxlTmFtZShzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5zdGFydHNXaXRoKCcuJykgfHwgc3RyLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcblxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZ1V0aWxzLmNsZWFuRmlsZU5hbWUoc3RyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQm9rZWhHcmFwaCB7XG5cbiAgICBjb250YWluZXJfaWQgPSBudWxsO1xuICAgIGNvbnRhaW5lciA9IG51bGw7XG5cbiAgICBzdGF0aWMgcGx0ID0gQm9rZWguUGxvdHRpbmc7XG5cbiAgICBzdGF0aWMgc2NhbGVfZnVuY3Rpb25zID0ge1xuICAgICAgICBcImxpbmVhclwiOiBCb2tlaC5MaW5lYXJTY2FsZSxcbiAgICAgICAgXCJsb2dcIjogQm9rZWguTG9nU2NhbGVcbiAgICB9XG5cbiAgICBzb3VyY2UgPSBudWxsO1xuXG4gICAgeV9lcnJvcl9iYXI7XG4gICAgeF9lcnJvcl9iYXI7XG5cbiAgICBjb2x1bW5zO1xuICAgIGRhdGFfdGFibGU7XG5cbiAgICBzdGF0aWMgc3VwcG9ydGVkX3Rvb2xfYXJyYXkgPSBbXG4gICAgICAgIFwicGFuXCIsXG4gICAgICAgIFwiYm94X3pvb21cIixcbiAgICAgICAgXCJ3aGVlbF96b29tXCIsXG4gICAgICAgIFwiaG92ZXJcIixcbiAgICAgICAgXCJjcm9zc2hhaXJcIixcbiAgICAgICAgXCJyZXNldFwiLFxuICAgICAgICBcInNhdmVcIixcbiAgICAgICAgXCJsYXNzb19zZWxlY3RcIixcbiAgICAgICAgXCJwb2x5X3NlbGVjdFwiLFxuICAgICAgICBcInRhcFwiLFxuICAgICAgICBcImV4YW1pbmUsXCIsXG4gICAgICAgIFwidW5kb1wiLFxuICAgICAgICBcInJlZG9cIl07XG5cbiAgICBzdGF0aWMgZGVmYXVsdF90b29sX2FycmF5ID0gW1xuICAgICAgICBcInBhblwiLFxuICAgICAgICBcImJveF96b29tXCIsXG4gICAgICAgIFwid2hlZWxfem9vbVwiLFxuICAgICAgICBcImhvdmVyXCIsXG4gICAgICAgIFwiY3Jvc3NoYWlyXCIsXG4gICAgICAgIFwicmVzZXRcIixcbiAgICAgICAgXCJzYXZlXCJdO1xuXG4gICAgc3RhdGljIGRlZmF1bHRfdG9vbF9zdHJpbmcgPSBcInBhbixib3hfem9vbSx3aGVlbF96b29tLGhvdmVyLGNyb3NzaGFpcixyZXNldCxzYXZlXCI7XG5cbiAgICB0b29sX2FycmF5ID0gW107XG4gICAgdG9vbF9zdHJpbmcgPSBcIlwiO1xuXG4gICAgaGFzX2RhdGFfdGFibGUgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcl9pZCA9ICcjdmlzdWFsaXphdGlvbi1jb250YWluZXInKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplU2V0dGluZ3MoZGF0YSwgbGFiZWxzLCBzY2FsZXMsIHRpdGxlLCBlcnJvcl9iYXJzID0gbnVsbCwgY3VzdG9tX3JhbmdlID0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldHVwU291cmNlKGRhdGEpO1xuXG4gICAgICAgIGlmKGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBQbG90KHRpdGxlLCBkYXRhWyd5X2xvdyddLCBkYXRhWyd5X3VwJ10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoY3VzdG9tX3JhbmdlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHhfbG93ID0gW107XG4gICAgICAgICAgICAgICAgbGV0IHhfdXAgPSBbXTtcblxuICAgICAgICAgICAgICAgIGxldCB5X2xvdyA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCB5X3VwID0gW107XG5cbiAgICAgICAgICAgICAgICBpZihjdXN0b21fcmFuZ2UueCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2UueC5sb3dlcl9ib3VuZCAhPT0gbnVsbCA/IHhfbG93LnB1c2goY3VzdG9tX3JhbmdlLngubG93ZXJfYm91bmQpIDogeF9sb3cgPSBkYXRhWyd4J107XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZS54LnVwcGVyX2JvdW5kICE9PSBudWxsID8geF91cC5wdXNoKGN1c3RvbV9yYW5nZS54LnVwcGVyX2JvdW5kKSA6IHhfdXAgPSBkYXRhWyd4J107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeF9sb3cgPSBkYXRhWyd4J107XG4gICAgICAgICAgICAgICAgICAgIHhfdXAgPSBkYXRhWyd4J107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoY3VzdG9tX3JhbmdlLnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlLnkubG93ZXJfYm91bmQgIT09IG51bGwgPyB5X2xvdy5wdXNoKGN1c3RvbV9yYW5nZS55Lmxvd2VyX2JvdW5kKSA6IHlfbG93ID0gZGF0YVsneSddO1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2UueS51cHBlcl9ib3VuZCAhPT0gbnVsbCA/IHlfdXAucHVzaChjdXN0b21fcmFuZ2UueS51cHBlcl9ib3VuZCkgOiB5X3VwID0gZGF0YVsneSddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHlfbG93ID0gZGF0YVsneSddO1xuICAgICAgICAgICAgICAgICAgICB5X3VwID0gZGF0YVsneSddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBQbG90KHRpdGxlLCB5X2xvdywgeV91cCwgeF9sb3csIHhfdXApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBQbG90KHRpdGxlLCBkYXRhWyd5J10sIGRhdGFbJ3knXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBEYXRhKCk7XG4gICAgICAgIHRoaXMuc2V0dXBTY2FsZXMoc2NhbGVzKTtcbiAgICAgICAgdGhpcy5zZXR1cExhYmVscyhsYWJlbHMpO1xuXG4gICAgICAgIGlmKGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBFcnJvckJhcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRpYWxpemVHcmFwaCgpIHtcblxuICAgICAgICBpZih0aGlzLmhhc19kYXRhX3RhYmxlKSB7XG4gICAgICAgICAgICBCb2tlaEdyYXBoLnBsdC5zaG93KG5ldyBCb2tlaC5Db2x1bW4oe2NoaWxkcmVuOiBbcCwgZGF0YV90YWJsZV19KSwgXCIjZ3JhcGgtY29udGFpbmVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQm9rZWhHcmFwaC5wbHQuc2hvdyh0aGlzLnBsb3QsIHRoaXMuY29udGFpbmVyX2lkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwUGxvdCh0aXRsZSwgeV9yYW5nZV9sb3csIHlfcmFuZ2VfdXAsIHhfcmFuZ2VfbG93ID0gbnVsbCwgeF9yYW5nZV91cD0gbnVsbCkge1xuXG4gICAgICAgIGlmKHhfcmFuZ2VfbG93KSB7XG4gICAgICAgICAgICB0aGlzLnBsb3QgPSBCb2tlaEdyYXBoLnBsdC5maWd1cmUoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgICAgICB0b29sczogQm9rZWhHcmFwaC5kZWZhdWx0X3Rvb2xfc3RyaW5nLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGxvdCA9IEJva2VoR3JhcGgucGx0LmZpZ3VyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgICAgIHRvb2xzOiBCb2tlaEdyYXBoLmRlZmF1bHRfdG9vbF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBTb3VyY2UoZGF0YV9zb3VyY2VzKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEJva2VoLkNvbHVtbkRhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgZGF0YTogZGF0YV9zb3VyY2VzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldHVwRGF0YSgpIHtcbiAgICAgICAgY29uc3QgY2lyY2xlcyA9IHRoaXMucGxvdC5jaXJjbGUoeyBmaWVsZDogXCJ4XCIgfSwgeyBmaWVsZDogXCJ5XCIgfSwge1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNpemU6IDQsXG4gICAgICAgICAgICBmaWxsX2NvbG9yOiBcIm5hdnlcIixcbiAgICAgICAgICAgIGxpbmVfY29sb3I6IG51bGwsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldHVwRXJyb3JCYXJzKCkge1xuICAgICAgICB0aGlzLnlfZXJyb3JfYmFyID0gbmV3IEJva2VoLldoaXNrZXIoe1xuICAgICAgICAgICAgZGltZW5zaW9uOiBcImhlaWdodFwiLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIGJhc2U6IHtmaWVsZDogXCJ4XCJ9LFxuICAgICAgICAgICAgbG93ZXI6IHtmaWVsZDogXCJ5X2xvd1wifSxcbiAgICAgICAgICAgIHVwcGVyOiB7ZmllbGQ6IFwieV91cFwifSxcbiAgICAgICAgICAgIGxpbmVfY29sb3I6IFwibmF2eVwiLFxuICAgICAgICAgICAgbG93ZXJfaGVhZDogbnVsbCxcbiAgICAgICAgICAgIHVwcGVyX2hlYWQ6IG51bGwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMueF9lcnJvcl9iYXIgPSBuZXcgQm9rZWguV2hpc2tlcih7XG4gICAgICAgICAgICBkaW1lbnNpb246IFwid2lkdGhcIixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBiYXNlOiB7ZmllbGQ6IFwieVwifSxcbiAgICAgICAgICAgIGxvd2VyOiB7ZmllbGQ6IFwieF9sb3dcIn0sXG4gICAgICAgICAgICB1cHBlcjoge2ZpZWxkOiBcInhfdXBcIn0sXG4gICAgICAgICAgICBsaW5lX2NvbG9yOiBcIm5hdnlcIixcbiAgICAgICAgICAgIGxvd2VyX2hlYWQ6IG51bGwsXG4gICAgICAgICAgICB1cHBlcl9oZWFkOiBudWxsLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBsb3QuYWRkX2xheW91dCh0aGlzLnlfZXJyb3JfYmFyKTtcbiAgICAgICAgdGhpcy5wbG90LmFkZF9sYXlvdXQodGhpcy54X2Vycm9yX2Jhcik7XG4gICAgfVxuXG4gICAgc2V0dXBTY2FsZXMgKHNjYWxlcykge1xuICAgICAgICBpZihzY2FsZXMpIHtcbiAgICAgICAgICAgIHRoaXMucGxvdC54X3NjYWxlID0gbmV3IEJva2VoR3JhcGguc2NhbGVfZnVuY3Rpb25zW3NjYWxlcy54XSgpO1xuICAgICAgICAgICAgdGhpcy5wbG90Lnlfc2NhbGUgPSBuZXcgQm9rZWhHcmFwaC5zY2FsZV9mdW5jdGlvbnNbc2NhbGVzLnldKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cExhYmVscyhsYWJlbHMpIHtcbiAgICAgICAgdGhpcy5wbG90LnhheGlzLmF4aXNfbGFiZWwgPSBsYWJlbHMueDtcbiAgICAgICAgdGhpcy5wbG90LnlheGlzLmF4aXNfbGFiZWwgPSBsYWJlbHMueTtcbiAgICB9XG5cbiAgICBzZXR1cENvbHVtbnMobGFiZWxzLCBjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IFtcbiAgICAgICAgICAgIG5ldyBCb2tlaC5UYWJsZXMuVGFibGVDb2x1bW4oe2ZpZWxkOiAneCcsIHRpdGxlOiBsYWJlbHMueH0pLFxuICAgICAgICAgICAgbmV3IEJva2VoLlRhYmxlcy5UYWJsZUNvbHVtbih7ZmllbGQ6ICd5JywgdGl0bGU6IGxhYmVscy55fSlcbiAgICAgICAgXVxuICAgIH1cblxuICAgIHNldHVwRGF0YVRhYmxlKCkge1xuICAgICAgICB0aGlzLmRhdGFfdGFibGUgPSBuZXcgQm9rZWguVGFibGVzLkRhdGFUYWJsZSh7XG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zLFxuICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlVG9vbEFycmF5KHRvb2xfYXJyYXkpIHtcbiAgICAgICAgdGhpcy50b29sX2FycmF5ID0gdG9vbF9hcnJheTtcbiAgICB9XG5cbiAgICBhZGRUb29sVG9Ub29sQXJyYXkodG9vbF9uYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy50b29sX2FycmF5LmluY2x1ZGVzKHRvb2xfbmFtZSkgJiYgQm9rZWhHcmFwaC5zdXBwb3J0ZWRfdG9vbF9hcnJheS5pbmNsdWRlcyh0b29sX25hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2xfYXJyYXkucHVzaCh0b29sX25hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlVG9vbEZyb21Ub29sQXJyYXkodG9vbF9uYW1lKSB7XG4gICAgICAgIHRoaXMudG9vbF9hcnJheSA9IHRoaXMudG9vbF9hcnJheS5maWx0ZXIoc3RyID0+IHN0ciAhPT0gdG9vbF9uYW1lKTtcbiAgICB9XG5cbiAgICBzZXRUb29sU3RyaW5nRnJvbVRvb2xBcnJheSgpIHtcbiAgICAgICAgdGhpcy50b29sX3N0cmluZyA9IHRoaXMudG9vbF9hcnJheS5qb2luKCcsJyk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEQzR3JhcGgge1xuXG4gICAgeF9zY2FsZTtcbiAgICB4X3NjYWxlX3R5cGU7XG5cbiAgICB5X3NjYWxlO1xuICAgIHlfc2NhbGVfdHlwZTtcblxuICAgIHhfYXhpcztcbiAgICB4X2F4aXNfZGF0YV9jb2w7XG5cbiAgICB5X2F4aXM7XG4gICAgeV9heGlzX2RhdGFfY29sO1xuXG4gICAgZGF0YXNldDtcbiAgICBzdmc7IHBsb3Q7IGNsaXA7IHpvb21fcmVjdDtcblxuICAgIHpvb207XG5cbiAgICBsaW5lX2NvbnRhaW5lcjsgcGF0aDtcblxuICAgIGNvbnRhaW5lcjtcbiAgICBjb250YWluZXJfaWQ7XG5cbiAgICBtYXJnaW4gPSB7dG9wOiAxMCwgcmlnaHQ6IDMwLCBib3R0b206IDMwLCBsZWZ0OiA2MH07XG4gICAgd2lkdGggPSA4MDAgLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgaGVpZ2h0ID0gNDAwIC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tO1xuXG4gICAgaGFzX2Vycm9yX2JhcnMgPSBmYWxzZTtcbiAgICB4X2F4aXNfZGF0YV9jb2xfZXJyb3JfYmFyO1xuICAgIHlfYXhpc19kYXRhX2NvbF9lcnJvcl9iYXI7XG5cbiAgICBoYXNfbGluZSA9IGZhbHNlO1xuXG4gICAgaGFzX211bHRpcGxlX3Bsb3RzID0gZmFsc2U7XG4gICAgYWRkaXRpb25hbF9wbG90cyA9IFtdO1xuXG4gICAgaW5pdGlhbGl6ZWQ7XG5cbiAgICBzdGF0aWMgc2NhbGVfZnVuY3Rpb25zID0ge1xuICAgICAgICBcImxpbmVhclwiOiBkMy5zY2FsZUxpbmVhcixcbiAgICAgICAgXCJsb2dcIjogZDMuc2NhbGVMb2dcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRfc2NhbGVzID0ge1xuICAgICAgICBcInhcIjogJ2xpbmVhcicsXG4gICAgICAgIFwieVwiOiAnbGluZWFyJ1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWZhdWx0X2F4aXNfdGlja19mb3JtYXQgPSBcIi4yZlwiO1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyX2lkID0gJ3Zpc3VhbGl6YXRpb24tY29udGFpbmVyJywgZGF0YXNldCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJfaWQgPSBjb250YWluZXJfaWQ7XG4gICAgICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlQ2hhcnQgPSB0aGlzLl91cGRhdGVDaGFydC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplU2V0dGluZ3MoZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgYXhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVzID0gRDNHcmFwaC5kZWZhdWx0X3NjYWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgIGhhc19saW5lID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxfcGxvdHMgPSBudWxsKSB7XG5cbiAgICAgICAgbGV0IGlzX3NldCA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuZGF0YXNldCA9IGRhdGE7XG5cbiAgICAgICAgICAgIHRoaXMueF9heGlzX2RhdGFfY29sID0gYXhpc1sneCddO1xuICAgICAgICAgICAgdGhpcy55X2F4aXNfZGF0YV9jb2wgPSBheGlzWyd5J107XG5cbiAgICAgICAgICAgIHRoaXMueF9zY2FsZV90eXBlID0gc2NhbGVzWyd4J107XG4gICAgICAgICAgICB0aGlzLnlfc2NhbGVfdHlwZSA9IHNjYWxlc1sneSddO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzX2Vycm9yX2JhcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JfYmFycyA9IGVycm9yX2JhcnM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnhfYXhpc19kYXRhX2NvbF9lcnJvcl9iYXIgPSBheGlzWyd4J10udmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy55X2F4aXNfZGF0YV9jb2xfZXJyb3JfYmFyID0gYXhpc1sneSddLnZhbHVlO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzX2Vycm9yX2JhcnMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxfcGxvdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc19tdWx0aXBsZV9wbG90cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRpdGlvbmFsX3Bsb3RzID0gW107XG5cbiAgICAgICAgICAgICAgICBsZXQgYWRkaXRpb25hbF9wbG90c190ZW1wID0gW107XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbF9wbG90cy5mb3JFYWNoKGZ1bmN0aW9uIChwbG90KSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxfcGxvdHNfdGVtcC5wdXNoKHBsb3QpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRpdGlvbmFsX3Bsb3RzID0gYWRkaXRpb25hbF9wbG90c190ZW1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmhhc19saW5lID0gaGFzX2xpbmU7XG5cbiAgICAgICAgICAgIGlzX3NldCA9IHRydWU7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBncmFwaCBzZXR0aW5ncyBwcm9jZXNzXCIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfc2V0O1xuICAgIH1cblxuICAgIGluaXRpYWxpemVHcmFwaCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNWR0NvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRYU2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRYQXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fc2V0WEF4aXNMYWJlbCgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRZQXhpcygpO1xuICAgICAgICAgICAgdGhpcy5fc2V0WUF4aXNMYWJlbCgpXG5cbiAgICAgICAgICAgIHRoaXMuX3NldERhdGFQbG90KCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFpvb21CZWhhdmlvcigpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RXJyb3JCYXJzKHRoaXMuZXJyb3JfYmFycyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaGFzX2xpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRBeGlzTGluZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmhhc19tdWx0aXBsZV9wbG90cykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEFkZGl0aW9uYWxQbG90cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBncmFwaCBpbml0aWFsaXphdGlvblwiKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICAgIH1cblxuICAgIF9zZXRTVkdDb250YWluZXIoKSB7XG5cbiAgICAgICAgbGV0IGZ1bGxfd2lkdGggPSB0aGlzLl9nZXRGdWxsV2lkdGgoKTtcbiAgICAgICAgbGV0IGZ1bGxfaGVpZ2h0ID0gdGhpcy5fZ2V0RnVsbEhlaWdodCgpO1xuXG4gICAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuY29udGFpbmVyKVxuICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdWxsX3dpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVsbF9oZWlnaHQpXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIixcbiAgICAgICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHRoaXMubWFyZ2luLmxlZnQgKyBcIixcIiArIHRoaXMubWFyZ2luLnRvcCArIFwiKVwiKTtcbiAgICB9XG5cbiAgICBfc2V0WFNjYWxlKCkge1xuICAgICAgICB0aGlzLnhfc2NhbGUgPSBEM0dyYXBoLnNjYWxlX2Z1bmN0aW9uc1t0aGlzLnhfc2NhbGVfdHlwZV0oKVxuICAgICAgICAgICAgLmRvbWFpbihkMy5leHRlbnQodGhpcy5kYXRhc2V0LCBkID0+IGRbdGhpcy54X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgIC5yYW5nZShbIDAsIHRoaXMud2lkdGggXSk7XG4gICAgfVxuXG4gICAgX3NldFlTY2FsZSgpIHtcbiAgICAgICAgdGhpcy55X3NjYWxlID0gRDNHcmFwaC5zY2FsZV9mdW5jdGlvbnNbdGhpcy55X3NjYWxlX3R5cGVdKClcbiAgICAgICAgICAgIC5kb21haW4oZDMuZXh0ZW50KHRoaXMuZGF0YXNldCwgZCA9PiBkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAucmFuZ2UoWyB0aGlzLmhlaWdodCwgMF0pO1xuICAgIH1cblxuICAgIF9zZXRYQXhpcyh0aWNrX2Zvcm1hdCA9IEQzR3JhcGguZGVmYXVsdF9heGlzX3RpY2tfZm9ybWF0KSB7XG4gICAgICAgICB0aGlzLnhfYXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ4XCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgdGhpcy5oZWlnaHQgKyBcIilcIilcbiAgICAgICAgICAgIC5jYWxsKGQzLmF4aXNCb3R0b20odGhpcy54X3NjYWxlKVxuICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KGQzLmZvcm1hdCh0aWNrX2Zvcm1hdCkpKVxuICAgICAgICAgICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0aWNrLWxpbmVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInkyXCIsIC10aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMikpXG4gICAgfVxuXG4gICAgX3NldFlBeGlzKHRpY2tfZm9ybWF0ID0gRDNHcmFwaC5kZWZhdWx0X2F4aXNfdGlja19mb3JtYXQpIHtcbiAgICAgICAgdGhpcy55X2F4aXMgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieVwiKVxuICAgICAgICAgICAgLmNhbGwoZDMuYXhpc0xlZnQodGhpcy55X3NjYWxlKVxuICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KGQzLmZvcm1hdCh0aWNrX2Zvcm1hdCkpKVxuICAgICAgICAgICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMikpO1xuICAgIH1cblxuICAgIF9zZXRYQXhpc0xhYmVsKCkge1xuICAgICAgICB0aGlzLnhfYXhpcy5zZWxlY3QoXCIudGljazpsYXN0LW9mLXR5cGUgdGV4dFwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieC1sYWJlbFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC0xMSlcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAyKVxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgICAgICAgICAuYXR0cihcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnRleHQodGhpcy54X2F4aXNfZGF0YV9jb2wpO1xuICAgIH1cblxuICAgIF9zZXRZQXhpc0xhYmVsKCkge1xuICAgICAgICB0aGlzLnlfYXhpcy5zZWxlY3QoXCIudGljazpsYXN0LW9mLXR5cGUgdGV4dFwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwieS1sYWJlbFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDMpXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgLTUpXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAudGV4dCh0aGlzLnlfYXhpc19kYXRhX2NvbCk7XG4gICAgfVxuXG4gICAgX3NldERhdGFQbG90KCkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy54X3NjYWxlO1xuICAgICAgICBsZXQgeSA9IHRoaXMueV9zY2FsZTtcblxuICAgICAgICBsZXQgeF9jb2xfZGF0YSA9IHRoaXMueF9heGlzX2RhdGFfY29sO1xuICAgICAgICBsZXQgeV9jb2xfZGF0YSA9IHRoaXMueV9heGlzX2RhdGFfY29sO1xuXG4gICAgICAgIHRoaXMuY2xpcCA9IHRoaXMuc3ZnLmFwcGVuZChcImRlZnNcIikuYXBwZW5kKFwiU1ZHOmNsaXBQYXRoXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiY2xpcFwiKVxuICAgICAgICAgICAgLmFwcGVuZChcIlNWRzpyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5oZWlnaHQgKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMCk7XG5cbiAgICAgICAgdGhpcy5wbG90ID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKFwiY2xpcC1wYXRoXCIsIFwidXJsKCNjbGlwKVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRhdGEtcGxvdFwiKVxuXG4gICAgICAgIHRoaXMucGxvdFxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEodGhpcy5kYXRhc2V0KVxuICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHgoZFt4X2NvbF9kYXRhXSk7IH0gKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4geShkW3lfY29sX2RhdGFdKTsgfSApXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgNClcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSlcbiAgICB9XG5cbiAgICBfc2V0QWRkaXRpb25hbFBsb3RzKCkge1xuICAgICAgICBsZXQgcGxvdDtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYWRkaXRpb25hbF9wbG90cy5sZW5ndGgsIGkrKzspIHtcbiAgICAgICAgICAgIHBsb3QgPSB0aGlzLmFkZGl0aW9uYWxfcGxvdHNbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXJyb3JCYXJzKGVycm9yX2JhcnMpIHtcblxuICAgICAgICB0aGlzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzO1xuXG4gICAgICAgIGxldCBlcnJvcl9iYXJfeCA9IHt4OiBlcnJvcl9iYXJzLnh9O1xuXG4gICAgICAgIGxldCBsaW5lX2Vycm9yX2Jhcl94ID0gZDMubGluZSgpXG4gICAgICAgICAgICAueChkID0+IHRoaXMueF9zY2FsZShkW3RoaXMueF9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAueShkID0+IHRoaXMueV9zY2FsZShkLmJvdW5kKSk7XG5cbiAgICAgICAgZXJyb3JfYmFycy54LmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuICAgICAgICAgICAgZDMuc2VsZWN0KCcjZGF0YS1wbG90JykuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJlcnJvci1iYXIteFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgbGluZV9lcnJvcl9iYXJfeChlcnJvcl9iYXIpKTtcbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgbGluZV9lcnJvcl9iYXJfeSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgLngoZCA9PiB0aGlzLnhfc2NhbGUoZC5ib3VuZCkpXG4gICAgICAgICAgICAueShkID0+IHRoaXMueV9zY2FsZShkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpO1xuXG4gICAgICAgIGVycm9yX2JhcnMueS5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgIGQzLnNlbGVjdCgnI2RhdGEtcGxvdCcpLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZXJyb3ItYmFyLXhcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJzdGVlbGJsdWVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAxLjUpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3koZXJyb3JfYmFyKSk7XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBfc2V0QXhpc0xpbmUoKSB7XG4gICAgICAgIGxldCBsaW5lID0gZDMubGluZSgpXG4gICAgICAgICAgICAuY3VydmUoZDMuY3VydmVDYXRtdWxsUm9tKVxuICAgICAgICAgICAgLngoZCA9PiB0aGlzLnhfYXhpcyhkW3RoaXMueF9heGlzX2RhdGFfY29sXSkpXG4gICAgICAgICAgICAueShkID0+IHRoaXMueV9heGlzKGRbdGhpcy55X2F4aXNfZGF0YV9jb2xdKSk7XG5cbiAgICAgICAgdGhpcy5saW5lX2NvbnRhaW5lciA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJwYXRoLWNvbnRhaW5lclwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGlwLXBhdGhcIiwgXCJ1cmwoI2NsaXApXCIpO1xuXG4gICAgICAgIHRoaXMucGF0aCA9IHRoaXMubGluZV9jb250YWluZXIuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInBhdGhcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIikuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUoZGF0YSkpO1xuICAgIH1cblxuICAgIF9zZXRab29tQmVoYXZpb3IoKSB7XG5cbiAgICAgICAgdGhpcy56b29tID0gZDMuem9vbSgpXG4gICAgICAgICAgICAuc2NhbGVFeHRlbnQoWy41LCAyMF0pXG4gICAgICAgICAgICAuZXh0ZW50KFtbMCwgMF0sIFt0aGlzLndpZHRoLCB0aGlzLmhlaWdodF1dKVxuICAgICAgICAgICAgLm9uKFwiem9vbVwiLCB0aGlzLl91cGRhdGVDaGFydCk7XG5cbiAgICAgICAgdGhpcy56b29tX3JlY3QgPSB0aGlzLnN2Zy5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcImFsbFwiKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHRoaXMubWFyZ2luLmxlZnQgKyAnLCcgKyB0aGlzLm1hcmdpbi50b3AgKyAnKScpXG4gICAgICAgICAgICAuY2FsbCh0aGlzLnpvb20pO1xuXG4gICAgfVxuXG4gICAgX3VwZGF0ZUNoYXJ0KGUpIHtcblxuICAgICAgICBsZXQgcmVzY2FsZWRfeCA9IGUudHJhbnNmb3JtLnJlc2NhbGVYKHRoaXMueF9zY2FsZSk7XG4gICAgICAgIGxldCByZXNjYWxlZF95ID0gZS50cmFuc2Zvcm0ucmVzY2FsZVkodGhpcy55X3NjYWxlKTtcblxuICAgICAgICB0aGlzLnhfYXhpcy5jYWxsKGQzLmF4aXNCb3R0b20ocmVzY2FsZWRfeCkudGlja0Zvcm1hdChkMy5mb3JtYXQoRDNHcmFwaC5kZWZhdWx0X2F4aXNfdGlja19mb3JtYXQpKSlcbiAgICAgICAgdGhpcy55X2F4aXMuY2FsbChkMy5heGlzTGVmdChyZXNjYWxlZF95KS50aWNrRm9ybWF0KGQzLmZvcm1hdChEM0dyYXBoLmRlZmF1bHRfYXhpc190aWNrX2Zvcm1hdCkpKVxuXG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcIi50aWNrLWxpbmVcIikucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcIiN5LWxhYmVsXCIpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCIjeC1sYWJlbFwiKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiLmVycm9yLWJhci14XCIpLnJlbW92ZSgpO1xuXG4gICAgICAgIHRoaXMueF9heGlzLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIikuY2xvbmUoKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRpY2stbGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCAtdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMilcblxuICAgICAgICB0aGlzLnlfYXhpcy5zZWxlY3RBbGwoXCIudGljayBsaW5lXCIpLmNsb25lKClcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0aWNrLWxpbmVcIilcbiAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLW9wYWNpdHlcIiwgMC4yKVxuXG4gICAgICAgIHRoaXMuX3NldFhBeGlzTGFiZWwoKTtcbiAgICAgICAgdGhpcy5fc2V0WUF4aXNMYWJlbCgpO1xuXG4gICAgICAgIGxldCB4X2RhdGFfY29sID0gdGhpcy54X2F4aXNfZGF0YV9jb2w7XG4gICAgICAgIGxldCB5X2RhdGFfY29sID0gdGhpcy55X2F4aXNfZGF0YV9jb2w7XG5cbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmRhdGFzZXQpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTUwKVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gcmVzY2FsZWRfeChkW3hfZGF0YV9jb2xdKTsgfSApXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiByZXNjYWxlZF95KGRbeV9kYXRhX2NvbF0pOyB9IClcblxuICAgICAgICBpZih0aGlzLmhhc19saW5lKSB7XG4gICAgICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJwYXRoXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5fc2V0QXhpc0xpbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuaGFzX2Vycm9yX2JhcnMpIHtcblxuICAgICAgICAgICAgbGV0IGxpbmVfZXJyb3JfYmFyX3ggPSBkMy5saW5lKClcbiAgICAgICAgICAgICAgICAueChkID0+IHJlc2NhbGVkX3goZFt0aGlzLnhfYXhpc19kYXRhX2NvbF0pKVxuICAgICAgICAgICAgICAgIC55KGQgPT4gcmVzY2FsZWRfeShkLmJvdW5kKSk7XG5cbiAgICAgICAgICAgIHRoaXMuZXJyb3JfYmFycy54LmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCgnI2RhdGEtcGxvdCcpLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImVycm9yLWJhci14XCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJzdGVlbGJsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMS41KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgbGluZV9lcnJvcl9iYXJfeChlcnJvcl9iYXIpKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGxldCBsaW5lX2Vycm9yX2Jhcl95ID0gZDMubGluZSgpXG4gICAgICAgICAgICAgICAgLngoZCA9PiByZXNjYWxlZF94KGQuYm91bmQpKVxuICAgICAgICAgICAgICAgIC55KGQgPT4gcmVzY2FsZWRfeShkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpO1xuXG4gICAgICAgICAgICB0aGlzLmVycm9yX2JhcnMueS5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoJyNkYXRhLXBsb3QnKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJlcnJvci1iYXIteFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwic3RlZWxibHVlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3koZXJyb3JfYmFyKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZ2V0RnVsbFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodFxuICAgIH1cblxuICAgIF9nZXRGdWxsSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b21cbiAgICB9XG59IiwiaW1wb3J0IHtDb25maWd1cmF0aW9uRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvQ29uZmlndXJhdGlvbkV2ZW50XCI7XG5pbXBvcnQge0RhdGFQcm9jZXNzb3JDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL0RhdGFQcm9jZXNzb3JDb250YWluZXJcIjtcbmltcG9ydCB7VmlzdWFsaXphdGlvbkNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvVmlzdWFsaXphdGlvbkNvbnRhaW5lclwiO1xuaW1wb3J0IHtXcmFwcGVyQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyXCI7XG5pbXBvcnQge1NldHRpbmdzQ29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL3NldHRpbmdzL1NldHRpbmdzQ29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgQm9rZWhXcmFwcGVyIHtcblxuICAgIHN0YXRpYyBjb250YWluZXJfaWQgPSAndmlzdWFsaXphdGlvbi1jb250YWluZXInO1xuXG4gICAgc3RhdGljIGxpYnJhcnkgPSAnYm9rZWgnO1xuXG4gICAgc3RhdGljIHRpdGxlID0ge1xuICAgICAgICAnbGlnaHQtY3VydmUnOiAnTGlnaHQgY3VydmUnLFxuICAgICAgICAnc3BlY3RydW0nOiAnc3BlY3RydW0nXG4gICAgfVxuXG4gICAgc3RhdGljIHNwZWNpZmljX3NldHRpbmdzID0ge1xuICAgICAgICAnYm9rZWgtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgJ2Jva2VoLW9wdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgdG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gbnVsbDtcblxuICAgIGNvbmZpZ3VyYXRpb25fb2JqZWN0ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEJva2VoV3JhcHBlci5jb250YWluZXJfaWQpO1xuICAgIH1cblxuICAgIF9yZXNldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG5cbiAgICBfc2V0dXBMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NldHRpbmdzLWNoYW5nZWQnLCB0aGlzLmhhbmRsZVNldHRpbmdzQ2hhbmdlZEV2ZW50LmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXN1YWxpemF0aW9uLWdlbmVyYXRpb24nLCB0aGlzLmhhbmRsZVZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgaGFuZGxlU2V0dGluZ3NDaGFuZ2VkRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzX29iamVjdCA9IGV2ZW50LmRldGFpbC5zZXR0aW5nc19vYmplY3Q7XG5cbiAgICAgICAgbGV0IGxpYnJhcnlfc2V0dGluZ3MgPSBzZXR0aW5nc19vYmplY3QuZ2V0TGlicmFyeVNldHRpbmdzKCk7XG5cbiAgICAgICAgaWYobGlicmFyeV9zZXR0aW5ncy5saWJyYXJ5ID09PSBCb2tlaFdyYXBwZXIubGlicmFyeSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25maWd1cmF0aW9uT2JqZWN0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuY29uZmlndXJhdGlvbl9vYmplY3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29uZmlndXJhdGlvbl9ldmVudCA9IG5ldyBDb25maWd1cmF0aW9uRXZlbnQodGhpcy5jb25maWd1cmF0aW9uX29iamVjdCk7XG5cbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uX2V2ZW50LmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudChldmVudCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdCA9IGV2ZW50LmRldGFpbC5zZXR0aW5nc19vYmplY3Q7XG5cbiAgICAgICAgbGV0IGxpYnJhcnlfc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRMaWJyYXJ5U2V0dGluZ3MoKTtcblxuICAgICAgICBpZihsaWJyYXJ5X3NldHRpbmdzLmxpYnJhcnkgPT09IEJva2VoV3JhcHBlci5saWJyYXJ5KSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgICAgIGxldCBkYXRhc2V0X3NldHRpbmdzID0ge307XG5cbiAgICAgICAgICAgIGxldCBheGlzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0QXhpc1NldHRpbmdzKCk7XG4gICAgICAgICAgICBsZXQgYXhpc19zZXR0aW5ncyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IGF4aXNfY29sdW1uIGluIGF4aXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXhpc19jb2x1bW5fb2JqZWN0ID0gdGhpcy5fZ2V0Q29sdW1uU2V0dGluZ3MoYXhpc1theGlzX2NvbHVtbl0pO1xuICAgICAgICAgICAgICAgIGF4aXNfY29sdW1uX29iamVjdCA9IHsuLi5heGlzX2NvbHVtbl9vYmplY3QsIC4uLntheGlzOiBheGlzX2NvbHVtbn19XG5cbiAgICAgICAgICAgICAgICBheGlzX3NldHRpbmdzLnB1c2goYXhpc19jb2x1bW5fb2JqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YXNldF9zZXR0aW5ncy5heGlzID0gYXhpc19zZXR0aW5ncztcbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3MuZGF0YV90eXBlID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RGF0YVR5cGVTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICBsZXQgZXJyb3JfYmFycyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldEVycm9yQmFyc1NldHRpbmdzKCk7XG4gICAgICAgICAgICBsZXQgaGFzX2Vycm9yX2JhcnMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYoZXJyb3JfYmFycyAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2JhcnNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGF4aXNfY29sdW1uIGluIGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNfY29sdW1uX29iamVjdCA9IHRoaXMuX2dldENvbHVtblNldHRpbmdzKGVycm9yX2JhcnNbYXhpc19jb2x1bW5dKTtcbiAgICAgICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzX3NldHRpbmdzLnB1c2goYXhpc19jb2x1bW5fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzX3NldHRpbmdzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZHBwID0gRGF0YVByb2Nlc3NvckNvbnRhaW5lci5nZXREYXRhUHJvY2Vzc29yQ29udGFpbmVyKCkuZ2V0RGF0YVByZVByb2Nlc3NvcigpO1xuXG4gICAgICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBkcHAuZ2V0UHJvY2Vzc2VkRGF0YXNldChkYXRhc2V0X3NldHRpbmdzKTtcblxuICAgICAgICAgICAgbGV0IHByb2Nlc3NlZF9qc29uX2RhdGEgPSBkcHAuZGF0YXNldFRvSlNPTkRhdGEocHJvY2Vzc2VkX2RhdGEpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YV90eXBlID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RGF0YVR5cGVTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGhkdSA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldEhEVXNTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICBsZXQgc2NhbGVzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0U2NhbGVzU2V0dGluZ3MoKTtcblxuXG4gICAgICAgICAgICBheGlzID0ge3g6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uY29sdW1uX25hbWUsIHk6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uY29sdW1uX25hbWV9O1xuICAgICAgICAgICAgbGV0IGxhYmVscyA9IGF4aXM7XG5cbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uZGF0YSA9IHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YSA9IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcblxuXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt4OiBwcm9jZXNzZWRfZGF0YS5heGlzWzBdLmRhdGEsIHk6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMV0uZGF0YX07XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJzID0ge3g6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uY29sdW1uX25hbWUsIHk6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMV0uY29sdW1uX25hbWV9O1xuXG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1swXS5kYXRhID0gcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1swXS5kYXRhLm1hcCh2YWx1ZSA9PiAhaXNGaW5pdGUodmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzFdLmRhdGEgPSBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzFdLmRhdGEubWFwKHZhbHVlID0+ICFpc0Zpbml0ZSh2YWx1ZSkgPyAwIDogdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5keCA9IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICBkYXRhLmR5ID0gcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1sxXS5kYXRhLm1hcCh2YWx1ZSA9PiBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGFzeW1tZXRyaWNfdW5jZXJ0YWludGllcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZGF0YV90eXBlID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW1tZXRyaWNfdW5jZXJ0YWludGllcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3Byb2Nlc3NFcnJvckJhckRhdGEoZGF0YSwgYXN5bW1ldHJpY191bmNlcnRhaW50aWVzKTtcblxuICAgICAgICAgICAgICAgIGhhc19lcnJvcl9iYXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldFJhbmdlc1NldHRpbmdzKCk7XG4gICAgICAgICAgICBsZXQgaGFzX2N1c3RvbV9yYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGN1c3RvbV9yYW5nZV9kYXRhID0gbnVsbDtcblxuICAgICAgICAgICAgaWYocmFuZ2VzICE9IG51bGwpIHtcblxuICAgICAgICAgICAgICAgIGlmKGhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZV9kYXRhID0gZHBwLnByb2Nlc3NEYXRhRm9yUmFuZ2VCb2tlaChyYW5nZXMsIGRhdGEsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZV9kYXRhID0gZHBwLnByb2Nlc3NEYXRhRm9yUmFuZ2VCb2tlaChyYW5nZXMsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGEgPSBjdXN0b21fcmFuZ2VfZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZpc3VhbGl6YXRpb24gPSBWaXN1YWxpemF0aW9uQ29udGFpbmVyLmdldEJva2VoVmlzdWFsaXphdGlvbigpO1xuXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uLmluaXRpYWxpemVTZXR0aW5ncyhkYXRhLCBsYWJlbHMsIHNjYWxlcywgQm9rZWhXcmFwcGVyLnRpdGxlWydkYXRhX3R5cGUnXSwgZXJyb3JfYmFycywgcmFuZ2VzKTtcblxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbi5pbml0aWFsaXplR3JhcGgoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFByb2Nlc3NlZERhdGEoZGF0YV90eXBlLCBoZHVfaW5kZXgsIGF4aXMsIGVycm9yX2JhcnMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xuXG4gICAgICAgIGxldCBkcGMgPSBEYXRhUHJvY2Vzc29yQ29udGFpbmVyLmdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKTtcbiAgICAgICAgbGV0IGRhdGFfcHJvY2Vzc29yO1xuXG4gICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgaWYoZGF0YV90eXBlID09PSAnbGlnaHQtY3VydmUnKSB7XG4gICAgICAgICAgICBkYXRhX3Byb2Nlc3NvciA9IGRwYy5nZXRMaWdodEN1cnZlUHJvY2Vzc29yKGZydywgaGR1X2luZGV4KTtcbiAgICAgICAgfSBlbHNlIGlmKGRhdGFfdHlwZSA9PT0gJ3NwZWN0cnVtJykge1xuICAgICAgICAgICAgZGF0YV9wcm9jZXNzb3IgPSBkcGMuZ2V0U3BlY3RydW1Qcm9jZXNzb3IoZnJ3LCBoZHVfaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YSA9IGRhdGFfcHJvY2Vzc29yLnByb2Nlc3NEYXRhUmF3SlNPTihheGlzLCBlcnJvcl9iYXJzKTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5fcHJvY2Vzc0Vycm9yQmFyRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIF9nZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5fc2V0dGluZ3MpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gY29sdW1uX3NldHRpbmdzLnNwbGl0KCckJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbl9sb2NhdGlvbiA9IHNldHRpbmdzWzBdLnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IHNldHRpbmdzWzFdIHx8ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2lkID0gY29sdW1uX2xvY2F0aW9uWzBdO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gY29sdW1uX2xvY2F0aW9uLmxlbmd0aCA+IDEgPyBjb2x1bW5fbG9jYXRpb25bMV0gOiAnJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsZV9pZDogZmlsZV9pZCxcbiAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgY29sdW1uX25hbWU6IGNvbHVtbl9uYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX3Byb2Nlc3NFcnJvckJhckRhdGEoZGF0YSwgYXN5bWV0cmljX3VuY2VydGFpbnRpZXMgPSBmYWxzZSkge1xuXG4gICAgICAgIGxldCBkaXZfZmFjdG9yPSAyO1xuXG4gICAgICAgIGlmKGFzeW1ldHJpY191bmNlcnRhaW50aWVzKSB7XG4gICAgICAgICAgICBkaXZfZmFjdG9yID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB5X2xvdyA9IFtdLCB5X3VwID0gW10sIHhfbG93ID0gW10sIHhfdXAgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpIGluIGRhdGEuZHkpIHtcbiAgICAgICAgICAgIHlfbG93W2ldID0gZGF0YS55W2ldIC0gZGF0YS5keVtpXTtcbiAgICAgICAgICAgIHlfdXBbaV0gPSBkYXRhLnlbaV0gKyBkYXRhLmR5W2ldO1xuICAgICAgICAgICAgeF9sb3dbaV0gPSBkYXRhLnhbaV0gLSBkYXRhLmR4W2ldIC8gZGl2X2ZhY3RvcjtcbiAgICAgICAgICAgIHhfdXBbaV0gPSBkYXRhLnhbaV0gKyBkYXRhLmR4W2ldIC8gZGl2X2ZhY3RvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEueV9sb3cgPSB5X2xvdztcbiAgICAgICAgZGF0YS55X3VwID0geV91cDtcbiAgICAgICAgZGF0YS54X2xvdyA9IHhfbG93O1xuICAgICAgICBkYXRhLnhfdXAgPSB4X3VwO1xuXG4gICAgICAgIGRlbGV0ZSBkYXRhLmR5O1xuICAgICAgICBkZWxldGUgZGF0YS5keDtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb25maWd1cmF0aW9uT2JqZWN0KCkge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0ID0gU2V0dGluZ3NDb25maWd1cmF0aW9uLmdldENvbmZpZ3VyYXRpb25PYmplY3QoQm9rZWhXcmFwcGVyLnNwZWNpZmljX3NldHRpbmdzKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NvbmZpZ3VyYXRpb25FdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnRcIjtcbmltcG9ydCB7RGF0YVByb2Nlc3NvckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lclwiO1xuaW1wb3J0IHtWaXN1YWxpemF0aW9uQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyXCI7XG5pbXBvcnQge1NldHRpbmdzQ29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL3NldHRpbmdzL1NldHRpbmdzQ29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcblxuICAgIHN0YXRpYyBsaWJyYXJ5ID0gXCJkM1wiO1xuICAgIHN0YXRpYyBjb250YWluZXJfaWQgPSBcInZpc3VhbGl6YXRpb24tY29udGFpbmVyXCI7XG5cbiAgICBzdGF0aWMgc3BlY2lmaWNfc2V0dGluZ3MgPSB7XG4gICAgICAgICdkMy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAnZDMtb3B0aW9ucyc6IHtcbiAgICAgICAgICAgICAgICAnaGFzX2xpbmUnOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyO1xuICAgIGNvbnRhaW5lcl9pZDtcblxuICAgIHNldHRpbmdzX29iamVjdDtcbiAgICBjb25maWd1cmF0aW9uX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQgPSBEM1dyYXBwZXIuY29udGFpbmVyX2lkKSB7XG4gICAgICAgIHRoaXMuX3NldHVwTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJfaWQgPSBjb250YWluZXJfaWQ7XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgIH1cblxuICAgIF9zZXR1cExpc3RlbmVycygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2V0dGluZ3MtY2hhbmdlZCcsIHRoaXMuaGFuZGxlU2V0dGluZ3NDaGFuZ2VkRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc3VhbGl6YXRpb24tZ2VuZXJhdGlvbicsIHRoaXMuaGFuZGxlVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTZXR0aW5nc0NoYW5nZWRFdmVudChldmVudCkge1xuICAgICAgICBsZXQgc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHNldHRpbmdzX29iamVjdC5nZXRMaWJyYXJ5U2V0dGluZ3MoKTtcblxuICAgICAgICBpZihsaWJyYXJ5X3NldHRpbmdzLmxpYnJhcnkgPT09IEQzV3JhcHBlci5saWJyYXJ5KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5jb25maWd1cmF0aW9uX29iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjb25maWd1cmF0aW9uX2V2ZW50ID0gbmV3IENvbmZpZ3VyYXRpb25FdmVudCh0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uX2V2ZW50LmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldExpYnJhcnlTZXR0aW5ncygpO1xuXG4gICAgICAgIGlmKGxpYnJhcnlfc2V0dGluZ3MubGlicmFyeSA9PT0gRDNXcmFwcGVyLmxpYnJhcnkpIHtcblxuICAgICAgICAgICAgdGhpcy5yZXNldENvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YXNldF9zZXR0aW5ncyA9IHt9O1xuXG4gICAgICAgICAgICBsZXQgZGF0YV90eXBlID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RGF0YVR5cGVTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGF4aXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRBeGlzU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBzY2FsZXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRTY2FsZXNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGVycm9yX2JhcnMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRFcnJvckJhcnNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldFJhbmdlc1NldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGxldCBoYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmRhdGFfdHlwZSA9IGRhdGFfdHlwZTtcblxuICAgICAgICAgICAgbGV0IGF4aXNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gYXhpcykge1xuICAgICAgICAgICAgICAgIGxldCBheGlzX2NvbHVtbl9vYmplY3QgPSB0aGlzLl9nZXRDb2x1bW5TZXR0aW5ncyhheGlzW2F4aXNfY29sdW1uXSk7XG4gICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgIGF4aXNfc2V0dGluZ3MucHVzaChheGlzX2NvbHVtbl9vYmplY3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmF4aXMgPSBheGlzX3NldHRpbmdzO1xuXG4gICAgICAgICAgICBpZihlcnJvcl9iYXJzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGFzX2Vycm9yX2JhcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2JhcnNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGF4aXNfY29sdW1uIGluIGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNfY29sdW1uX29iamVjdCA9IHRoaXMuX2dldENvbHVtblNldHRpbmdzKGVycm9yX2JhcnNbYXhpc19jb2x1bW5dKTtcbiAgICAgICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzX3NldHRpbmdzLnB1c2goYXhpc19jb2x1bW5fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzX3NldHRpbmdzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZHBwID0gRGF0YVByb2Nlc3NvckNvbnRhaW5lci5nZXREYXRhUHJvY2Vzc29yQ29udGFpbmVyKCkuZ2V0RGF0YVByZVByb2Nlc3NvcigpO1xuXG4gICAgICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBkcHAuZ2V0UHJvY2Vzc2VkRGF0YXNldChkYXRhc2V0X3NldHRpbmdzKTtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzZWRfanNvbl9kYXRhID0gZHBwLmRhdGFzZXRUb0pTT05EYXRhKHByb2Nlc3NlZF9kYXRhKTtcblxuICAgICAgICAgICAgYXhpcyA9IHt4OiBwcm9jZXNzZWRfZGF0YS5heGlzWzBdLmNvbHVtbl9uYW1lLCB5OiBwcm9jZXNzZWRfZGF0YS5heGlzWzFdLmNvbHVtbl9uYW1lfTtcblxuICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJzID0ge3g6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uY29sdW1uX25hbWUsIHk6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMV0uY29sdW1uX25hbWV9O1xuICAgICAgICAgICAgICAgIGVycm9yX2JhcnMgPSBkcHAucHJvY2Vzc0Vycm9yQmFyRGF0YUpTT04ocHJvY2Vzc2VkX2pzb25fZGF0YSwgYXhpcywgZXJyb3JfYmFycylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VzdG9tX3JhbmdlX2RhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEsIGVycm9yX2JhcnMpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IGN1c3RvbV9yYW5nZV9kYXRhLmVycm9yX2JhcnM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2aXN1YWxpemF0aW9uID0gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5nZXREM1Zpc3VhbGl6YXRpb24oKTtcblxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbi5pbml0aWFsaXplU2V0dGluZ3MocHJvY2Vzc2VkX2pzb25fZGF0YSwgYXhpcywgc2NhbGVzLCBlcnJvcl9iYXJzLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIHJlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbl9vYmplY3QgPSBTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZ2V0Q29uZmlndXJhdGlvbk9iamVjdChEM1dyYXBwZXIuc3BlY2lmaWNfc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9nZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5fc2V0dGluZ3MpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gY29sdW1uX3NldHRpbmdzLnNwbGl0KCckJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbl9sb2NhdGlvbiA9IHNldHRpbmdzWzBdLnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IHNldHRpbmdzWzFdIHx8ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2lkID0gY29sdW1uX2xvY2F0aW9uWzBdO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gY29sdW1uX2xvY2F0aW9uLmxlbmd0aCA+IDEgPyBjb2x1bW5fbG9jYXRpb25bMV0gOiAnJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsZV9pZDogZmlsZV9pZCxcbiAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgY29sdW1uX25hbWU6IGNvbHVtbl9uYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG59IiwiaW1wb3J0IHtJbnZhbGlkVVJMRXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvSW52YWxpZFVSTEVycm9yXCI7XG5pbXBvcnQge0hEVU5vdFRhYnVsYXJFcnJvcn0gZnJvbSBcIi4uL2Vycm9ycy9IRFVOb3RUYWJ1bGFyRXJyb3JcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gXCIuLi91dGlscy9TdHJpbmdVdGlsc1wiO1xuaW1wb3J0IHtGaWxlTG9hZGVkRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvRmlsZUxvYWRlZEV2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBGSVRTUmVhZGVyV3JhcHBlciB7XG5cbiAgICBmaWxlX3BhdGggPSBudWxsO1xuICAgIGZpbGUgPSBudWxsO1xuXG4gICAgc3RhdGljIEJJTlRBQkxFID0gJ0JJTlRBQkxFJztcbiAgICBzdGF0aWMgVEFCTEUgPSAnVEFCTEUnO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZV9wYXRoID0gbnVsbCkge1xuICAgICAgICBpZihmaWxlX3BhdGgpIHtcbiAgICAgICAgICAgIGlmIChGSVRTUmVhZGVyV3JhcHBlci5pc19wYXRoX3ZhbGlkKGZpbGVfcGF0aCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVfcGF0aCA9IGZpbGVfcGF0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRGaWxlKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRVUkxFcnJvcihcIkludmFsaWQgZmlsZSBwYXRoIDogXCIgKyBmaWxlX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUZyb21QYXRoKGZpbGVfcGF0aCkge1xuICAgICAgICBpZihGSVRTUmVhZGVyV3JhcHBlci5pc19wYXRoX3ZhbGlkKGZpbGVfcGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZV9wYXRoID0gZmlsZV9wYXRoO1xuICAgICAgICAgICAgdGhpcy5fZ2V0RmlsZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFVSTEVycm9yKFwiSW52YWxpZCBmaWxlIHBhdGggOiBcIiArIGZpbGVfcGF0aCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGluaXRpYWxpemVGcm9tQnVmZmVyKGFycmF5X2J1ZmZlciwgZmlsZV9uYW1lKSB7XG4gICAgICAgIHRoaXMuZmlsZV9wYXRoID0gZmlsZV9uYW1lO1xuICAgICAgICB0aGlzLl9yZWFkRmlsZShhcnJheV9idWZmZXIpO1xuICAgIH1cblxuICAgIF9nZXRGaWxlKCkge1xuXG4gICAgICAgIHJldHVybiBmZXRjaCh0aGlzLmZpbGVfcGF0aClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yLCBzdGF0dXMgPSAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKGJ1ZmZlcikgPT4gdGhpcy5fcmVhZEZpbGUoYnVmZmVyKSk7XG4gICAgfVxuXG4gICAgX3JlYWRGaWxlKGFycmF5QnVmZmVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmZpbGUgPSB3aW5kb3cuRklUU1JlYWRlci5wYXJzZUZJVFMoYXJyYXlCdWZmZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnNlbmRGSVRTTG9hZGVkRXZlbnRzKCk7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluaXRpYWxpemluZyBpbnRlcmZhY2VcIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEZpbGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlX3BhdGg7XG4gICAgfVxuXG4gICAgc2V0RmlsZShmaWxlKSB7XG4gICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgfVxuXG4gICAgZ2V0SERVKGhkdV9pbmRleCkge1xuICAgICAgICBpZihoZHVfaW5kZXggPj0gMCAmJiBoZHVfaW5kZXggPCB0aGlzLmZpbGUuaGR1cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGUuaGR1c1toZHVfaW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIRFVzKCkge1xuXG4gICAgICAgIGxldCBIRFVzID0gW107XG4gICAgICAgIGxldCBoZHVfb2JqZWN0O1xuICAgICAgICBsZXQgdHlwZTtcbiAgICAgICAgbGV0IGV4dG5hbWUgPSAnJztcblxuICAgICAgICB0aGlzLmZpbGUuaGR1cy5mb3JFYWNoKGZ1bmN0aW9uKGhkdSwgaW5kZXgpIHtcblxuICAgICAgICAgICAgaWYgKGhkdS5oZWFkZXIucHJpbWFyeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSBcIlBSSU1BUllcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuICAgICAgICAgICAgICAgIGV4dG5hbWUgPSBoZHUuaGVhZGVyLmdldCgnRVhUTkFNRScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoZHVfb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiB0eXBlLFxuICAgICAgICAgICAgICAgIFwiaW5kZXhcIjogaW5kZXgsXG4gICAgICAgICAgICAgICAgXCJleHRuYW1lXCI6IGV4dG5hbWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEhEVXMucHVzaChoZHVfb2JqZWN0KTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gSERVcztcbiAgICB9XG5cbiAgICBnZXRUYWJ1bGFySERVcygpIHtcbiAgICAgICAgbGV0IHRhYnVsYXJfaGR1c19pbmRleCA9IFtdO1xuXG4gICAgICAgIHRoaXMuZmlsZS5oZHVzLmZvckVhY2goZnVuY3Rpb24oaGR1LCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGhkdS5oZWFkZXIucHJpbWFyeSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmKGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpID09PSBcIlRBQkxFXCIgfHwgaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJykgPT09IFwiQklOVEFCTEVcIikge1xuICAgICAgICAgICAgICAgICAgICB0YWJ1bGFyX2hkdXNfaW5kZXgucHVzaChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB0YWJ1bGFyX2hkdXNfaW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZDb2x1bW5Gcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sdW1uX251bWJlciA9IG51bGw7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGNvbHVtbl9udW1iZXIgPSBkYXRhLmNvbHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSERVTm90VGFidWxhckVycm9yKFwiU2VsZWN0ZWQgSERVIGlzIG5vdCB0YWJ1bGFyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW1iZXI7XG4gICAgfVxuXG4gICAgZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcbiAgICAgICAgbGV0IGNvbHVtbl9uYW1lO1xuXG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG4gICAgICAgICAgICBkYXRhLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uX25hbWUgPSBjb2x1bW47XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sdW1ucztcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5zSlNPTkRhdGFGcm9tSERVKGhkdV9pbmRleCkge1xuXG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG4gICAgICAgIGxldCBkYXRhID0gaGR1LmRhdGE7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZHUuaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sdW1uc19kYXRhX2pzb24gPSBbXTtcbiAgICAgICAgbGV0IHJhd19jb2x1bW5zX2RhdGFfYXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IGNvbHVtbl9kYXRhO1xuXG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG4gICAgICAgICAgICBkYXRhLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4pIHtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGNvbHVtbiwgZnVuY3Rpb24gKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSBjb2w7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByYXdfY29sdW1uc19kYXRhX2FycmF5W2NvbHVtbl0gPSBjb2x1bW5fZGF0YTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5fbmFtZXMgPSBPYmplY3Qua2V5cyhyYXdfY29sdW1uc19kYXRhX2FycmF5KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdfY29sdW1uc19kYXRhX2FycmF5W2NvbHVtbl9uYW1lc1swXV0ubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fanNvbl9kYXRhX29iamVjdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29sdW1uX25hbWVzLmZvckVhY2goKGNvbHVtbl9uYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9qc29uX2RhdGFfb2JqZWN0W2NvbHVtbl9uYW1lXSA9IHJhd19jb2x1bW5zX2RhdGFfYXJyYXlbY29sdW1uX25hbWVdW2ldO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29sdW1uc19kYXRhX2pzb24ucHVzaChjb2x1bW5fanNvbl9kYXRhX29iamVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sdW1uc19kYXRhX2pzb247XG4gICAgfVxuXG4gICAgZ2V0Q29sdW1uRGF0YUZyb21IRFUoaGR1X2luZGV4LCBjb2x1bW5fbmFtZSkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIGxldCB0eXBlID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG5cbiAgICAgICAgbGV0IGNvbF9kYXRhID0gW107XG4gICAgICAgIGlmKHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IHR5cGUgPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFKSB7XG5cbiAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGNvbHVtbl9uYW1lLCBmdW5jdGlvbihjb2wpe1xuICAgICAgICAgICAgICAgIGlmKGNvbFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoZWFkZXJfY29sX2RhdGEgPSBoZHUuaGVhZGVyLmdldChjb2x1bW5fbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IGNvbC5tYXAoKCkgPT4gaGVhZGVyX2NvbF9kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb2xfZGF0YSA9IGNvbDtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sX2RhdGE7XG4gICAgfVxuXG4gICAgZ2V0SGVhZGVyRnJvbUhEVShoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcjtcbiAgICB9XG5cbiAgICBnZXREYXRhRnJvbUhEVShoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGRhdGEgPSBoZHUuZGF0YTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBnZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGhkdV9pbmRleCwgY2FyZF9uYW1lKSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG4gICAgICAgIGxldCBoZWFkZXIgPSBoZHUuaGVhZGVyO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGhlYWRlci5nZXQoY2FyZF9uYW1lKTtcblxuICAgICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldEhlYWRlckNhcmRzVmFsdWVGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgIGNvbnN0IGNhcmRzX2FycmF5ID0gW107XG5cbiAgICAgICAgT2JqZWN0LmVudHJpZXMoaGR1LmhlYWRlci5jYXJkcykuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBsZXQgaXRlbV92YWx1ZV9hcnJheSA9IGl0ZW1bMV07XG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiBpdGVtX3ZhbHVlX2FycmF5ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtX3ZhbHVlX2FycmF5KSkge1xuICAgICAgICAgICAgICAgIGl0ZW1fdmFsdWVfYXJyYXlbJ2NhcmRfbmFtZSddID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjYXJkc19hcnJheS5wdXNoKGl0ZW1fdmFsdWVfYXJyYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBzb3J0ZWRfaGR1X2NhcmRzID0gY2FyZHNfYXJyYXkuc29ydCgoYSwgYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gICAgICAgIHJldHVybiBzb3J0ZWRfaGR1X2NhcmRzO1xuICAgIH1cblxuICAgIGlzSERVVGFidWxhcihoZHVfaW5kZXgpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuXG4gICAgICAgIGxldCBpc190YWJ1bGFyID0gZmFsc2U7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGlzX3RhYnVsYXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzX3RhYnVsYXI7XG4gICAgfVxuXG4gICAgX2lzSERVVGFidWxhcihoZHUpIHtcbiAgICAgICAgbGV0IGV4dGVuc2lvbiA9IGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuICAgICAgICByZXR1cm4gZXh0ZW5zaW9uID09PSBGSVRTUmVhZGVyV3JhcHBlci5CSU5UQUJMRSB8fCBleHRlbnNpb24gPT09IEZJVFNSZWFkZXJXcmFwcGVyLlRBQkxFO1xuICAgIH1cblxuICAgIGdldEFsbENvbHVtbnMoKSB7XG4gICAgICAgIGxldCBjb2x1bW5zID0gW107XG5cbiAgICAgICAgdGhpcy5maWxlLmhkdXMuZm9yRWFjaCgoaGR1LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICBpZih0aGlzLl9pc0hEVVRhYnVsYXIoaGR1KSkge1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWUgPSB0aGlzLmdldENvbHVtbnNOYW1lRnJvbUhEVShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5zX25hbWUuZm9yRWFjaCgoY29sdW1uX25hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbHVtbl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGlmKGhkdS5oZWFkZXIuZ2V0KCdUSU1FREVMJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdUSU1FREVMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoaGR1LmhlYWRlci5nZXQoJ0FOQ1JGSUxFJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY3JmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeU5hbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmdVdGlscy5jbGVhbkZpbGVOYW1lKGhkdS5oZWFkZXIuZ2V0KCdBTkNSRklMRScpKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGFuY3JmaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcncgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGFuY3JmaWxlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihoZHUuaGVhZGVyLmdldCgnUkVTUEZJTEUnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5TmFtZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZ1V0aWxzLmNsZWFuRmlsZU5hbWUoaGR1LmhlYWRlci5nZXQoJ1JFU1BGSUxFJykpXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcGZpbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZydyA9IG5ldyBGSVRTUmVhZGVyV3JhcHBlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShyZXNwZmlsZS5maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhkdXNfaW5kZXggPSBmcncuZ2V0VGFidWxhckhEVXMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc19lX21pbl9tYXggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhkdXNfaW5kZXguZm9yRWFjaCgoaGR1X2luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IGZydy5nZXRDb2x1bW5zTmFtZUZyb21IRFUoaGR1X2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uc19uYW1lLmluY2x1ZGVzKFwiRV9NSU5cIikgJiYgY29sdW1uc19uYW1lLmluY2x1ZGVzKFwiRV9NQVhcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzX2VfbWluX21heCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlX21pbl9tYXhfaGR1c19pbmRleCA9IGhkdV9pbmRleDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0VfSEFMRl9XSURUSCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Byb2Nlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZmlsZTogcmVzcGZpbGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX01JRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Byb2Nlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZmlsZTogcmVzcGZpbGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX01JRF9MT0cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgIH1cblxuICAgIHNlbmRGSVRTTG9hZGVkRXZlbnRzKCkge1xuICAgICAgICBsZXQgZmlsZWxlID0gbmV3IEZpbGVMb2FkZWRFdmVudCh7XG4gICAgICAgICAgICBmaWxlX25hbWU6IHRoaXMuZmlsZV9wYXRoLFxuICAgICAgICAgICAgdHlwZTogJ2ZpdHMnLFxuICAgICAgICAgICAgZmlsZTogdGhpcy5maWxlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGVsZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNfcGF0aF92YWxpZChwYXRoKSB7XG4gICAgICAgIGxldCBpc192YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmKEZJVFNSZWFkZXJXcmFwcGVyLl9pc1BhdGhWYWxpZChwYXRoKSB8fCBGSVRTUmVhZGVyV3JhcHBlci5faXNVUkxWYWxpZChwYXRoKSkge1xuICAgICAgICAgICAgaXNfdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzX3ZhbGlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNVUkxWYWxpZCh1cmwpIHtcbiAgICAgICAgY29uc3QgdXJsUmVnZXggPSAvXihmdHB8aHR0cHxodHRwcyk6XFwvXFwvW14gXCJdKyQvO1xuICAgICAgICByZXR1cm4gdXJsUmVnZXgudGVzdCh1cmwpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNQYXRoVmFsaWQocGF0aCkge1xuICAgICAgICBjb25zdCBwYXRoUmVnZXggPSAvXihcXC9bYS16QS1aMC05Ll8tXSspK1xcLz8kLztcbiAgICAgICAgcmV0dXJuIHBhdGhSZWdleC50ZXN0KHBhdGgpO1xuICAgIH1cblxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRklUU1JlYWRlcldyYXBwZXIgfSBmcm9tICcuL3dyYXBwZXJzL0ZJVFNSZWFkZXJXcmFwcGVyLmpzJ1xuaW1wb3J0IHsgQm9rZWhXcmFwcGVyIH0gZnJvbSAnLi93cmFwcGVycy9Cb2tlaFdyYXBwZXIuanMnXG5pbXBvcnQgeyBEM1dyYXBwZXIgfSBmcm9tICcuL3dyYXBwZXJzL0QzV3JhcHBlci5qcydcbmltcG9ydCB7IFdyYXBwZXJDb250YWluZXIgfSBmcm9tICcuL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lci5qcydcbmltcG9ydCB7IFZpc3VhbGl6YXRpb25Db250YWluZXIgfSBmcm9tICcuL2NvbnRhaW5lcnMvVmlzdWFsaXphdGlvbkNvbnRhaW5lci5qcydcbmltcG9ydCB7IEZpbGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvRmlsZUNvbXBvbmVudC5qcydcbmltcG9ydCB7IFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL1NldHRpbmdzQ29tcG9uZW50LmpzJ1xuaW1wb3J0IHsgVmlzdWFsaXphdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9WaXN1YWxpemF0aW9uQ29tcG9uZW50LmpzJ1xuaW1wb3J0IHsgRklUU1NldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9GSVRTU2V0dGluZ3NDb21wb25lbnQuanMnXG5pbXBvcnQgeyBDU1ZTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9maWxlX3R5cGUvQ1NWU2V0dGluZ3NDb21wb25lbnQuanMnXG5pbXBvcnQgeyBEM0dyYXBoIH0gZnJvbSBcIi4vdmlzdWFsaXphdGlvbnMvRDNHcmFwaFwiO1xuaW1wb3J0IHsgQm9rZWhHcmFwaCB9IGZyb20gXCIuL3Zpc3VhbGl6YXRpb25zL0Jva2VoR3JhcGhcIjtcblxubGV0IGZpbGVfcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgXCJfdGVzdF9maWxlcy9zcGlhY3NfbGNfcXVlcnkuZml0c1wiO1xuXG5sZXQgZml0c19yZWFkZXJfd3JhcHBlciA9IG5ldyBGSVRTUmVhZGVyV3JhcHBlcihmaWxlX3BhdGgpO1xuXG5sZXQgYm9rZWhfd3JhcHBlciA9IG5ldyBCb2tlaFdyYXBwZXIoKTtcblxubGV0IGQzX3dyYXBwZXIgPSBuZXcgRDNXcmFwcGVyKCk7XG5cbldyYXBwZXJDb250YWluZXIuc2V0RklUU1JlYWRlcldyYXBwZXIoZml0c19yZWFkZXJfd3JhcHBlcik7XG5XcmFwcGVyQ29udGFpbmVyLnNldEJva2VoV3JhcHBlcihib2tlaF93cmFwcGVyKTtcbldyYXBwZXJDb250YWluZXIuc2V0RDNXcmFwcGVyKGQzX3dyYXBwZXIpO1xuXG5WaXN1YWxpemF0aW9uQ29udGFpbmVyLnNldEJva2VoVmlzdWFsaXphdGlvbihuZXcgQm9rZWhHcmFwaCgpKTtcblZpc3VhbGl6YXRpb25Db250YWluZXIuc2V0RDNWaXN1YWxpemF0aW9uKG5ldyBEM0dyYXBoKCkpO1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2ZpbGUtY29tcG9uZW50JywgRmlsZUNvbXBvbmVudCk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3NldHRpbmdzLWNvbXBvbmVudCcsIFNldHRpbmdzQ29tcG9uZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndmlzdWFsaXphdGlvbi1jb21wb25lbnQnLCBWaXN1YWxpemF0aW9uQ29tcG9uZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZml0cy1jb21wb25lbnQnLCBGSVRTU2V0dGluZ3NDb21wb25lbnQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjc3YtY29tcG9uZW50JywgQ1NWU2V0dGluZ3NDb21wb25lbnQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9