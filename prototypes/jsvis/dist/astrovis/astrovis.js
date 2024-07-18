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
        //this._setSelectAxis()
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

    _createGenericColumnOptionsGroup() {
        let opt_group = document.createElement("optgroup");
        opt_group.label = "Genereic columns";
        opt_group.className += "generic";

        let option = document.createElement("option");

        option.text = 'None';
        option.value = `none`;

        opt_group.appendChild(option);

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
            ' <!--label for="product-type-select">Product type :</label>' +
            ' <select id="product-type-select" class="form-select"><option selected="selected" value="none">None</option><option value="lightcurve">Light Curve</option><option value="spectrum">Spectrum</option></select> ' +
            ' <label for="product-type-select" class="spectrum-settings">ARF file : </label>' +
            ' <select id="arf-file-select" class="form-select spectrum-settings"></select>' +
            ' <label for="product-type-select" class="spectrum-settings">RMF file :</label>' +
            ' <select id="rmf-file-select" class="form-select spectrum-settings"></select>' +
            ' <label for="select-hdu-file">HDU :</label-->' +
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
        //this.setProductTypeSelectListener();
        //this.setARFFileSelectListener();
        //this.setRMFFileSelectListener();
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

        //this.setProductTypeSelect(product_type);
        //this.setRMFFileSelect(rmf_file);
        //this.setARFFileSelect(arf_file);
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
                this.addColumnToDisplay(input_display.value);

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
        li_expression.innerHTML = expression+' <button class="btn btn-danger">X</button>';
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
        //'arithmetic-column-change': ['settings-component']
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVM7O0FBRVQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0MsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsWUFBWTtBQUN0RixjQUFjO0FBQ2Q7QUFDQSxrQ0FBa0MsZUFBZSxHQUFHLGlCQUFpQixHQUFHLFlBQVk7QUFDcEY7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBLFNBQVM7QUFDVDs7QUFFQTtB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O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQ3ZTTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3REFBd0QsUUFBUTtBQUNoRSx3REFBd0QsUUFBUTs7QUFFaEU7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHVFQUF1RSxTQUFTOztBQUVoRjtBQUNBO0FBQ0E7O0FBRUEsdUVBQXVFLG1CQUFtQjs7QUFFMUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFF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VjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDL0hPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNsQk87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMxQk87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNaTzs7QUFFUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGtEQUFrRCwwQkFBMEI7QUFDNUUsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSwyQ0FBMkMsWUFBWSxJQUFJLFlBQVk7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QixvQkFBb0IsZUFBZTtBQUNuQyxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixXQUFXO0FBQzlCLG9CQUFvQixlQUFlO0FBQ25DLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLDRCQUE0QjtBQUN0RSwwQ0FBMEMsNEJBQTRCO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQzVOTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxNQUFNLE1BQU07O0FBRXJCOztBQUVBLG9CQUFvQjs7QUFFcEI7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBOztBQUVBOztBQUVBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsMkJBQTJCO0FBQ2xFLHVDQUF1QywyQkFBMkI7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHNDQUFzQztBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsb0NBQW9DO0FBQzNFLHVDQUF1QyxvQ0FBb0M7O0FB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QUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7VUN0ZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1FO0FBQ1Y7QUFDTjtBQUNnQjtBQUNZO0FBQ2xCO0FBQ1E7QUFDVTtBQUNRO0FBQ0Y7QUFDbEM7QUFDTTtBQUNGO0FBQ1U7QUFDZTs7QUFFaEY7O0FBRUEsOEJBQThCLDZFQUFpQjs7QUFFL0Msd0JBQXdCLG1FQUFZOztBQUVwQyxxQkFBcUIsNkRBQVM7O0FBRTlCLDZFQUFnQjtBQUNoQiw2RUFBZ0I7QUFDaEIsNkVBQWdCOztBQUVoQix5RkFBc0IsMkJBQTJCLG1FQUFVO0FBQzNELHlGQUFzQix3QkFBd0IsNkRBQU87O0FBRXJELDZFQUFpQixxQkFBcUIsbUVBQVk7O0FBRWxELHdDQUF3Qyx1RUFBYTtBQUNyRCw0Q0FBNEMsK0VBQWlCO0FBQzdELGlEQUFpRCx5RkFBc0I7QUFDdkUsd0NBQXdDLGlHQUFxQjtBQUM3RCx1Q0FBdUMsK0ZBQW9CO0FBQzNELHFEQUFxRCw0RkFBcUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Bc3Ryb3Zpcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL0ZpbGVDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL1NldHRpbmdzQ29tcG9uZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29tcG9uZW50cy9WaXN1YWxpemF0aW9uQ29tcG9uZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29tcG9uZW50cy9maWxlX3R5cGUvQ1NWU2V0dGluZ3NDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9GSVRTU2V0dGluZ3NDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb21wb25lbnRzL2lucHV0cy9Bcml0aG1ldGljQ29sdW1uSW5wdXQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb250YWluZXJzL0RhdGFQcm9jZXNzb3JDb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vY29udGFpbmVycy9TZXR0aW5nc0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvVmlzdWFsaXphdGlvbkNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2RhdGFfcHJvY2Vzc29ycy9EYXRhUHJlUHJvY2Vzc29yLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZGF0YV9wcm9jZXNzb3JzL0xpZ2h0Q3VydmVQcm9jZXNzb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9kYXRhX3Byb2Nlc3NvcnMvU3BlY3RydW1Qcm9jZXNzb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9lcnJvcnMvRXZlbnROb3RGb3VuZEluUmVnaXN0cnlFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2Vycm9ycy9IRFVOb3RUYWJ1bGFyRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9lcnJvcnMvSW52YWxpZFVSTEVycm9yLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXJyb3JzL05vRXZlbnRTdWJzY3JpYmVyRXJyb3IuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9lcnJvcnMvTm9FdmVudFRvRGlzcGF0Y2hFcnJvci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9ldmVudHMvRmlsZUxvYWRlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1NldHRpbmdzQ2hhbmdlZEV2ZW50LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vZXZlbnRzL1Zpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi9yZWdpc3RyaWVzL0V2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5LmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vc2V0dGluZ3MvU2V0dGluZ3NDb25maWd1cmF0aW9uLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vc2V0dGluZ3MvVmlzdWFsaXphdGlvblNldHRpbmdzLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdXRpbHMvQ29sdW1uVXRpbHMuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi91dGlscy9PYmplY3RVdGlscy5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3V0aWxzL1N0cmluZ1V0aWxzLmpzIiwid2VicGFjazovL0FzdHJvdmlzLy4vdmlzdWFsaXphdGlvbnMvQm9rZWhHcmFwaC5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy8uL3Zpc3VhbGl6YXRpb25zL0QzR3JhcGguanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi93cmFwcGVycy9Cb2tlaFdyYXBwZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi93cmFwcGVycy9EM1dyYXBwZXIuanMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvLi93cmFwcGVycy9GSVRTUmVhZGVyV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQXN0cm92aXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Bc3Ryb3Zpcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0FzdHJvdmlzLy4vbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJBc3Ryb3Zpc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBc3Ryb3Zpc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJpbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7RklUU1NldHRpbmdzQ29tcG9uZW50fSBmcm9tIFwiLi9maWxlX3R5cGUvRklUU1NldHRpbmdzQ29tcG9uZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgc3RhdGljIGNvbXBvbmVudF9pZCA9IFwiZmlsZV9jb21wb25lbnRcIjtcbiAgICBzdGF0aWMgc2VsZWN0X2ZpbGUgPSBcInNlbGVjdC1maWxlXCI7XG4gICAgc3RhdGljIGlucHV0X2ZpbGVfdXJsID0gXCJmaWxlLWlucHV0LXVybFwiO1xuICAgIHN0YXRpYyBpbnB1dF9maWxlX2xvY2FsID0gXCJmaWxlLWlucHV0LWxvY2FsXCI7XG4gICAgc3RhdGljIGlucHV0X2ZpbGVfdHlwZSA9IFwic2VsZWN0LWZpbGUtdHlwZVwiO1xuICAgIHN0YXRpYyBsb2FkX2J1dHRvbiA9IFwibG9hZC1maWxlXCI7XG5cbiAgICBzdGF0aWMgYXZhaWxhYmxlX2ZpbGVzX2xpc3RfaWQgPSAnYXZhaWxhYmxlLWZpbGVzLWxpc3QnO1xuICAgIHN0YXRpYyBjdXJyZW50X2ZpbGVzX2xpc3RfaWQgPSAnY3VycmVudC1maWxlcy1saXN0JztcblxuICAgIHN0YXRpYyBmaWxlX3NldHRpbmdzX2NvbnRhaW5lcl9pZCA9ICdmaWxlLXNldHRpbmdzLWNvbnRhaW5lcic7XG5cbiAgICBzdGF0aWMgc2F2ZV9idXR0b25faWQgPSAnc2F2ZS1maWxlLXNldHRpbmdzJztcbiAgICBzdGF0aWMgYWRkX2J1dHRvbl9pZCA9ICdhZGQtdG8tcGxvdCdcbiAgICBzdGF0aWMgcmVtb3ZlX2J1dHRvbl9pZCA9ICdyZW1vdmUtZnJvbS1wbG90J1xuXG4gICAgY29udGFpbmVyX2lkO1xuICAgIGNvbnRhaW5lcjtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyX2lkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcblxuICAgICAgICB0aGlzLmhhbmRsZUZJVFNMb2FkZWRFdmVudCA9IHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2VsZWN0Q2hhbmdlRXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdENoYW5nZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlTG9hZEZpbGVFdmVudCA9IHRoaXMuaGFuZGxlTG9hZEZpbGVFdmVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZUZpbGVMb2FkZWRFdmVudCA9IHRoaXMuaGFuZGxlRmlsZUxvYWRlZEV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQgPSB0aGlzLmhhbmRsZUZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBFeHRlcm5hbExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zZXR1cElubmVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBJbm5lckVsZW1lbnRzTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZml0cy1sb2FkZWQnLCB0aGlzLmhhbmRsZUZJVFNMb2FkZWRFdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1sb2FkZWQnLCB0aGlzLmhhbmRsZUZpbGVMb2FkZWRFdmVudClcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmaWxlLXJlZ2lzdHJ5LWNoYW5nZScsIHRoaXMuaGFuZGxlRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQpXG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0LWNoYW5nZScsIHRoaXMuaGFuZGxlU2VsZWN0Q2hhbmdlRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQtZmlsZScsIHRoaXMuaGFuZGxlTG9hZEZpbGVFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0TG9hZExvY2FsRmlsZUJ1dHRvbkxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldEZpbGVzTGlzdHNMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBfc2V0TG9hZExvY2FsRmlsZUJ1dHRvbkxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgZmlsZV9pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuaW5wdXRfZmlsZV9sb2NhbCk7XG4gICAgICAgIGxldCB0eXBlX2lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5pbnB1dF9maWxlX3R5cGUpO1xuXG4gICAgICAgIGxldCBmaWxlX3R5cGUgPSB0eXBlX2lucHV0LnZhbHVlO1xuXG4gICAgICAgIGZpbGVfaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGxldCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuXG4gICAgICAgICAgICBpZihmaWxlX3R5cGUgPT09ICdmaXRzJykge1xuICAgICAgICAgICAgICAgIGZpbGUuYXJyYXlCdWZmZXIoKS50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZml0c19yZWFkZXJfd3JhcHBlci5pbml0aWFsaXplRnJvbUJ1ZmZlcihhcnJheUJ1ZmZlciwgZmlsZS5uYW1lKTtcblxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcmVhZGluZyBmaWxlIGFzIEFycmF5QnVmZmVyOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihmaWxlX3R5cGUgPT09ICdjc3YnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjc3ZfZmlsZSA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIF9zZXRGaWxlc0xpc3RzTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdF9hdmFpbGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmF2YWlsYWJsZV9maWxlc19saXN0X2lkKTtcbiAgICAgICAgbGV0IGxpc3RfY3VycmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuY3VycmVudF9maWxlc19saXN0X2lkKTtcblxuICAgICAgICBsZXQgYnV0dG9uc19hdmFpbGFibGUgPSBsaXN0X2F2YWlsYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgICAgICBsZXQgYnV0dG9uc19jdXJyZW50ID0gbGlzdF9jdXJyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG5cbiAgICAgICAgbGV0IGJ1dHRvbnMgPSBBcnJheS5mcm9tKGJ1dHRvbnNfYXZhaWxhYmxlKS5jb25jYXQoQXJyYXkuZnJvbShidXR0b25zX2N1cnJlbnQpKTtcblxuICAgICAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG5cbiAgICAgICAgICAgICAgICBsZXQgYXJpYV9jdXJyZW50ID0gYnV0dG9uLmdldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJpYV9jdXJyZW50ICYmIGFyaWFfY3VycmVudCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckZpbGVTZXR0aW5nc1BhbmVsKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInRydWVcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIikpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEZpbGVTZXR0aW5nc1BhbmVsKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBidXR0b25zX3RvX2ZpbHRlciA9IEFycmF5LmZyb20oYnV0dG9ucyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWRfYnV0dG9ucyA9IGJ1dHRvbnNfdG9fZmlsdGVyLmZpbHRlcihsaXN0X2J1dHRvbiA9PiBsaXN0X2J1dHRvbiAhPT0gYnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIGZpbHRlcmVkX2J1dHRvbnMuZm9yRWFjaChmaWx0ZXJlZF9idXR0b24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZF9idXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkX2J1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0RmlsZVNldHRpbmdzQnV0dG9uc0xpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHNhdmVfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5zYXZlX2J1dHRvbl9pZCk7XG4gICAgICAgIGxldCBhZGRfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5hZGRfYnV0dG9uX2lkKTtcblxuICAgICAgICBzYXZlX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFkZF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBidG4gPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBsZXQgZmlsZV9pZCA9IGJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcblxuICAgICAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZmlsZV9pZCk7XG5cbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5hZGRUb0N1cnJlbnRGaWxlcyhmaWxlKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50RmlsZXNMaXN0KCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuXG4gICAgICAgICAgICBsZXQgZnJjZSA9IG5ldyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCgpO1xuICAgICAgICAgICAgZnJjZS5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlRklUU0xvYWRlZEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZml0c19yZWFkZXJfd3JhcHBlciA9IGV2ZW50LmRldGFpbFsnZml0c19yZWFkZXJfd3JhcHBlciddO1xuICAgICAgICBsZXQgZmlsZV9wYXRoID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEZpbGVQYXRoKCk7XG5cbiAgICAgICAgdGhpcy5fYWRkRmlsZVRvU2VsZWN0KGZpbGVfcGF0aCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRmlsZUxvYWRlZEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIEZpbGVSZWdpc3RyeS5hZGRUb0F2YWlsYWJsZUZpbGVzKGV2ZW50LmRldGFpbCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVBdmFpbGFibGVGaWxlc0xpc3QoKTtcbiAgICAgICAgdGhpcy5fc2V0RmlsZXNMaXN0c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGhhbmRsZUZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmxlRmlsZXNMaXN0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudEZpbGVzTGlzdCgpO1xuXG4gICAgICAgIHRoaXMuX3NldEZpbGVzTGlzdHNMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVMb2FkRmlsZUV2ZW50KGV2ZW50KSB7XG5cbiAgICB9XG5cbiAgICB1cGRhdGVGaWxlc0xpc3RzKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVBdmFpbGFibGVGaWxlc0xpc3QoKSB7XG4gICAgICAgIGxldCBhdmFpbGFibGVfZmlsZXNfbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5hdmFpbGFibGVfZmlsZXNfbGlzdF9pZCk7XG5cbiAgICAgICAgYXZhaWxhYmxlX2ZpbGVzX2xpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgZmlsZV9lbGVtZW50cyA9IHRoaXMuX2NyZWF0ZUZpbGVTZWxlY3Rpb24oJ2F2YWlsYWJsZScpO1xuXG4gICAgICAgIGZpbGVfZWxlbWVudHMuZm9yRWFjaCgoZmlsZV9lbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBhdmFpbGFibGVfZmlsZXNfbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGZpbGVfZWxlbWVudCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlQ3VycmVudEZpbGVzTGlzdCgpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRfZmlsZXNfbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRmlsZUNvbXBvbmVudC5jdXJyZW50X2ZpbGVzX2xpc3RfaWQpO1xuXG4gICAgICAgIGN1cnJlbnRfZmlsZXNfbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2VsZW1lbnRzID0gdGhpcy5fY3JlYXRlRmlsZVNlbGVjdGlvbignY3VycmVudCcpO1xuXG4gICAgICAgIGZpbGVfZWxlbWVudHMuZm9yRWFjaCgoZmlsZV9lbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50X2ZpbGVzX2xpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChmaWxlX2VsZW1lbnQpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNsZWFyRmlsZVNldHRpbmdzUGFuZWwoKSB7XG4gICAgICAgIGxldCBmaWxlX3NldHRpbmdzX2NvbXBvbmVudF9jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGaWxlQ29tcG9uZW50LmZpbGVfc2V0dGluZ3NfY29udGFpbmVyX2lkKTtcbiAgICAgICAgZmlsZV9zZXR0aW5nc19jb21wb25lbnRfY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIHNldEZpbGVTZXR0aW5nc1BhbmVsKGZpbGUpIHtcbiAgICAgICAgdGhpcy5jbGVhckZpbGVTZXR0aW5nc1BhbmVsKCk7XG5cbiAgICAgICAgaWYoZmlsZS50eXBlID09PSAnZml0cycpIHtcblxuICAgICAgICAgICAgbGV0IGlzX2N1cnJlbnQgPSBGaWxlUmVnaXN0cnkuaXNGaWxlQ3VycmVudChmaWxlLmlkKTtcblxuICAgICAgICAgICAgbGV0IGZpbGVfc2V0dGluZ3NfY29tcG9uZW50ID0gbmV3IEZJVFNTZXR0aW5nc0NvbXBvbmVudChmaWxlLCBpc19jdXJyZW50KTtcblxuICAgICAgICAgICAgbGV0IGZpbGVfc2V0dGluZ3NfY29tcG9uZW50X2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuZmlsZV9zZXR0aW5nc19jb250YWluZXJfaWQpO1xuICAgICAgICAgICAgZmlsZV9zZXR0aW5nc19jb21wb25lbnRfY29udGFpbmVyLmFwcGVuZENoaWxkKGZpbGVfc2V0dGluZ3NfY29tcG9uZW50KTtcblxuICAgICAgICAgICAgZmlsZV9zZXR0aW5nc19jb21wb25lbnQuc2V0dXBDb21wb25lbnQoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2FkZEZpbGVUb1NlbGVjdChmaWxlKSB7XG4gICAgICAgIGxldCBmaWxlX29wdGlvbiA9IHRoaXMuX2NyZWF0ZVNlbGVjdE9wdGlvbihmaWxlKTtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVDb21wb25lbnQuc2VsZWN0X2ZpbGUpO1xuXG4gICAgICAgIHNlbGVjdC5hZGQoZmlsZV9vcHRpb24pO1xuICAgIH1cblxuICAgIF9jcmVhdGVGaWxlU2VsZWN0aW9uKGxpc3QgPSAnYXZhaWxhYmxlJykge1xuICAgICAgICBsZXQgZmlsZXM7XG5cbiAgICAgICAgaWYobGlzdCA9PT0gJ2F2YWlsYWJsZScpIHtcbiAgICAgICAgICAgIGZpbGVzID0gRmlsZVJlZ2lzdHJ5LmdldEF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZXMgPSBGaWxlUmVnaXN0cnkuZ2V0Q3VycmVudEZpbGVzTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGVjdGlvbl9lbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIGxldCBmaWxlX3NlbGVjdGlvbjtcbiAgICAgICAgZmlsZXMuZm9yRWFjaCgoYXZhaWxhYmxlX2ZpbGUpID0+IHtcbiAgICAgICAgICAgIGxldCBmaWxlX3VpZCA9IGF2YWlsYWJsZV9maWxlLmlkKycuJythdmFpbGFibGVfZmlsZS5maWxlX25hbWU7XG5cbiAgICAgICAgICAgIGZpbGVfc2VsZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIGZpbGVfc2VsZWN0aW9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgICAgICBmaWxlX3NlbGVjdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImF2YWlsYWJsZS1maWxlLXNlbGVjdGlvbiBsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWFjdGlvblwiKTtcbiAgICAgICAgICAgIGZpbGVfc2VsZWN0aW9uLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgYXZhaWxhYmxlX2ZpbGUuaWQpO1xuICAgICAgICAgICAgZmlsZV9zZWxlY3Rpb24udGV4dENvbnRlbnQgPSBmaWxlX3VpZDtcblxuICAgICAgICAgICAgc2VsZWN0aW9uX2VsZW1lbnRzLnB1c2goZmlsZV9zZWxlY3Rpb24pO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb25fZWxlbWVudHM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZVNlbGVjdE9wdGlvbihmaWxlX3BhdGgpIHtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgb3B0aW9uLnZhbHVlID0gZmlsZV9wYXRoO1xuICAgICAgICBvcHRpb24udGV4dCA9IGZpbGVfcGF0aDtcblxuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH1cblxuICAgIGhhbmRsZVNlbGVjdENoYW5nZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIF9zZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJfaWQpXG4gICAgfVxuXG4gICAgcmVzZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtTZXR0aW5nc0NvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvU2V0dGluZ3NDb250YWluZXJcIjtcbmltcG9ydCB7U2V0dGluZ3NDaGFuZ2VkRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvU2V0dGluZ3NDaGFuZ2VkRXZlbnRcIjtcbmltcG9ydCB7VmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9WaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50XCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7Q29sdW1uVXRpbHN9IGZyb20gXCIuLi91dGlscy9Db2x1bW5VdGlsc1wiO1xuaW1wb3J0IHtSZWdpc3RyeUNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvUmVnaXN0cnlDb250YWluZXJcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgY29udGFpbmVyX2lkO1xuICAgIGNvbnRhaW5lclxuXG4gICAgc3RhdGljIGNvbXBvbmVudF9pZCA9IFwic2V0dGluZ3NfY29tcG9uZW50XCI7XG4gICAgc3RhdGljIGNvbnRhaW5lcl9pZCA9IFwic2V0dGluZ3MtY29tcG9uZW50XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2xpYnJhcnlfaWQgPSBcInNlbGVjdC1saWJyYXJ5XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2RhdGFfdHlwZV9pZCA9IFwic2VsZWN0LWRhdGEtdHlwZVwiO1xuXG4gICAgc3RhdGljIGxpZ2h0X2N1cnZlX3NldHRpbmdzX2lkID0gXCJsaWdodC1jdXJ2ZS1zZXR0aW5nc1wiXG4gICAgc3RhdGljIHNwZWN0cnVtX3NldHRpbmdzX2lkID0gXCJzcGVjdHJ1bS1zZXR0aW5nc1wiXG5cbiAgICBzdGF0aWMgc2VsZWN0X2hkdXNfaWQgPSBcInNlbGVjdC1oZHVzXCI7XG5cbiAgICBzdGF0aWMgY2FsY3VsYXRpb25fcmFkaW9fY2xhc3MgPSBcImNhbGN1bGF0aW9uLXJhZGlvXCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2F4aXNfeF9pZCA9IFwic2VsZWN0LWF4aXMteFwiO1xuICAgIHN0YXRpYyBzZWxlY3RfYXhpc195X2lkID0gXCJzZWxlY3QtYXhpcy15XCI7XG5cbiAgICBzdGF0aWMgc2VsZWN0X2Vycm9yX2Jhcl94X2lkID0gXCJzZWxlY3QtYXhpcy14LWVycm9yLWJhclwiO1xuICAgIHN0YXRpYyBzZWxlY3RfZXJyb3JfYmFyX3lfaWQgPSBcInNlbGVjdC1heGlzLXktZXJyb3ItYmFyXCI7XG5cbiAgICBzdGF0aWMgc3VwcG9ydGVkX2RhdGFfdHlwZXMgPSBbJ2dlbmVyaWMnLCAnbGlnaHQtY3VydmUnLCAnc3BlY3RydW0nXTtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBudWxsO1xuICAgIHNldHRpbmdzX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IFNldHRpbmdzQ29tcG9uZW50LmNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QgPSBTZXR0aW5nc0NvbnRhaW5lci5nZXRTZXR0aW5nc0NvbnRhaW5lcigpLmdldFZpc3VhbGl6YXRpb25TZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRklUU0xvYWRlZEV2ZW50ID0gdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDb25maWd1cmF0aW9uRXZlbnQgPSB0aGlzLmhhbmRsZUNvbmZpZ3VyYXRpb25FdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlTGlicmFyeUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlSERVc0NoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVIRFVzQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50ID0gdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQgPSB0aGlzLmhhbmRsZUFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBJbm5lckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIF9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpdHMtbG9hZGVkJywgdGhpcy5oYW5kbGVGSVRTTG9hZGVkRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbmZpZ3VyYXRpb24nLCB0aGlzLmhhbmRsZUNvbmZpZ3VyYXRpb25FdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1yZWdpc3RyeS1jaGFuZ2UnLCB0aGlzLmhhbmRsZUZpbGVDaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0LWxpYnJhcnktY2hhbmdlJywgdGhpcy5oYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdC1kYXRhLXR5cGUtY2hhbmdlJywgdGhpcy5oYW5kbGVEYXRhVHlwZUNoYW5nZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3QtaGR1cy1jaGFuZ2UnLCB0aGlzLmhhbmRsZUhEVXNDaGFuZ2VFdmVudCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uLWdlbmVyYXRlLWNsaWNrJywgdGhpcy5oYW5kbGVHZW5lcmF0ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdhcml0aG1ldGljLWNvbHVtbi1jaGFuZ2UnLCB0aGlzLmhhbmRsZUFyaXRobWV0aWNDb2x1bW5DaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0TGlicmFyeUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdERhdGFUeXBlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLl9zZXRTZWxlY3RIRFVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0QXhpc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldEdlbmVyYXRlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0Q2FsY3VsYXRpb25SYWRpb0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGhhbmRsZUZJVFNMb2FkZWRFdmVudChldmVudCkge1xuICAgICAgICB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIgPSBldmVudC5kZXRhaWxbJ2ZpdHNfcmVhZGVyX3dyYXBwZXInXTtcblxuICAgICAgICBsZXQgaGR1cyA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRIRFVzKCk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdEhEVXMoaGR1cyk7XG5cbiAgICAgICAgaWYodGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmlzSERVVGFidWxhcihoZHVzWzBdLmluZGV4KSkge1xuICAgICAgICAgICAgbGV0IGhkdV9jb2x1bW5zX25hbWUgPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdXNbMF0uaW5kZXgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RBeGlzKGhkdV9jb2x1bW5zX25hbWUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0U2VsZWN0RXJyb3JCYXJzKGhkdV9jb2x1bW5zX25hbWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0RXJyb3JCYXJzKClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlQ29uZmlndXJhdGlvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uX29iamVjdCA9IGV2ZW50LmRldGFpbC5jb25maWd1cmF0aW9uX29iamVjdDtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzKGNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcbiAgICB9XG5cbiAgICBoYW5kbGVMaWJyYXJ5Q2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZXR0aW5nc09iamVjdCgpO1xuXG4gICAgICAgIGxldCBzZXR0aW5nc19jaGFuZ2VkX2V2ZW50ID0gbmV3IFNldHRpbmdzQ2hhbmdlZEV2ZW50KHRoaXMuc2V0dGluZ3Nfb2JqZWN0KTtcbiAgICAgICAgc2V0dGluZ3NfY2hhbmdlZF9ldmVudC5kaXNwYXRjaCgpO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGFUeXBlQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxldCBkYXRhX3R5cGUgPSBldmVudC5kZXRhaWwuZGF0YV90eXBlO1xuXG4gICAgICAgIGlmKFNldHRpbmdzQ29tcG9uZW50LnN1cHBvcnRlZF9kYXRhX3R5cGVzLmluY2x1ZGVzKGRhdGFfdHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3NPYmplY3QoKTtcblxuICAgICAgICAgICAgc3dpdGNoKGRhdGFfdHlwZSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGlnaHQtY3VydmUnOlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5saWdodF9jdXJ2ZV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNwZWN0cnVtX3NldHRpbmdzX2lkKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3NwZWN0cnVtJzpcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc3BlY3RydW1fc2V0dGluZ3NfaWQpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5saWdodF9jdXJ2ZV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zcGVjdHJ1bV9zZXR0aW5nc19pZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQubGlnaHRfY3VydmVfc2V0dGluZ3NfaWQpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlSERVc0NoYW5nZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gZXZlbnQuZGV0YWlsLmhkdV9pbmRleDtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuaXNIRFVUYWJ1bGFyKGhkdV9pbmRleCkpIHtcbiAgICAgICAgICAgIGxldCBoZHVfY29sdW1uc19uYW1lID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbnNOYW1lRnJvbUhEVShoZHVfaW5kZXgpO1xuXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RBeGlzKGhkdV9jb2x1bW5zX25hbWUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0U2VsZWN0RXJyb3JCYXJzKGhkdV9jb2x1bW5zX25hbWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0RXJyb3JCYXJzKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUdlbmVyYXRlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QucmVzZXQoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzT2JqZWN0KCk7XG5cbiAgICAgICAgbGV0IHZpc3VhbGl6YXRpb25fZ2VuZXJhdGlvbl9ldmVudCA9IG5ldyBWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KHRoaXMuc2V0dGluZ3Nfb2JqZWN0KTtcbiAgICAgICAgdmlzdWFsaXphdGlvbl9nZW5lcmF0aW9uX2V2ZW50LmRpc3BhdGNoKCk7XG5cbiAgICB9XG5cbiAgICBoYW5kbGVGaWxlQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRfZmlsZV9saXN0ID0gRmlsZVJlZ2lzdHJ5LmdldEN1cnJlbnRGaWxlc0xpc3QoKTtcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVfbGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICBpZihmaWxlLnByb2R1Y3RfdHlwZSAhPT0gJ3NwZWN0cnVtJykge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGUoZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGVGcm9tRmlsZU9iamVjdChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZml0c19jb2x1bW5zID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX2NvbHVtbnMuZm9yRWFjaCgoZml0c19jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHsuLi5maXRzX2NvbHVtbiwgZmlsZV9pZDogZmlsZS5pZH07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZihmaWxlLnR5cGUgPT09ICdjc3YnKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sdW1uc19ieV9maWxlID0gY29sdW1ucy5yZWR1Y2UoKGFjYywgY29sdW1uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY1tjb2x1bW4uZmlsZV9pZF0pIHtcbiAgICAgICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBsZXQgc2VsZWN0X29wdGlvbnMgPSBbXTtcblxuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIGZvciAobGV0IGZpbGVfaWQgaW4gY29sdW1uc19ieV9maWxlKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uc19ieV9maWxlLmhhc093blByb3BlcnR5KGZpbGVfaWQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoZmlsZV9pZCk7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfbmFtZSA9IGZpbGUuZmlsZV9uYW1lO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlLmZpbGUpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0X29wdGlvbnMucHVzaCh0aGlzLl9jcmVhdGVGaWxlQ29sdW1uc09wdGlvbnNHcm91cChjb2x1bW5zX2J5X2ZpbGVbZmlsZV9pZF0sIGZpbGVfbmFtZSwgJ29wdC1ncm91cCcsIGZydykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0R3JvdXBBeGlzKHNlbGVjdF9vcHRpb25zKTtcblxuICAgICAgICBzZWxlY3Rfb3B0aW9ucy51bnNoaWZ0KHRoaXMuX2NyZWF0ZUdlbmVyaWNDb2x1bW5PcHRpb25zR3JvdXAoKSk7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdEdyb3VwRXJyb3JCYXJzKHNlbGVjdF9vcHRpb25zKTtcbiAgICB9XG5cbiAgICBoYW5kbGVBcml0aG1ldGljQ29sdW1uQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgLy90aGlzLl9zZXRTZWxlY3RBeGlzKClcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIF9yZXNldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0SERVcyhoZHVzKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0SERVcygpO1xuXG4gICAgICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfaGR1c19pZCk7XG5cbiAgICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLl9jcmVhdGVIRFVzT3B0aW9ucyhoZHVzKTtcblxuICAgICAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICBzZWxlY3QuYWRkKG9wdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZXNldFNlbGVjdEhEVXMoKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfaGR1c19pZCk7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfY3JlYXRlSERVc09wdGlvbnMoSERVcykge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgb3B0aW9uO1xuXG4gICAgICAgIEhEVXMuZm9yRWFjaChmdW5jdGlvbihoZHUsIGluZGV4KSB7XG4gICAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgICAgICBpZihpbmRleCA9PT0gMCkgb3B0aW9uLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBoZHUuaW5kZXg7XG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGhkdS5uYW1lO1xuXG4gICAgICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICBfY3JlYXRlRmlsZUNvbHVtbnNPcHRpb25zR3JvdXAoZmlsZV9jb2x1bW5zLCBncm91cF9uYW1lLCBncm91cF9jbGFzcywgZml0c19yZWFkZXJfd3JhcHBlcikge1xuXG4gICAgICAgIGxldCBvcHRfZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0Z3JvdXBcIik7XG4gICAgICAgIG9wdF9ncm91cC5sYWJlbCA9IGdyb3VwX25hbWU7XG4gICAgICAgIG9wdF9ncm91cC5jbGFzc05hbWUgKz0gZ3JvdXBfY2xhc3M7XG5cbiAgICAgICAgZmlsZV9jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgICAgICBsZXQgaGR1X3R5cGUgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUoY29sdW1uLmhkdV9pbmRleCwgJ1hURU5TSU9OJyk7XG4gICAgICAgICAgICBsZXQgaGR1X2V4dG5hbWUgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUoY29sdW1uLmhkdV9pbmRleCwgJ0VYVE5BTUUnKTtcbiAgICAgICAgICAgIGxldCBuYW1lID0gaGR1X3R5cGUrJy0nK2hkdV9leHRuYW1lKycgJytjb2x1bW4ubmFtZTtcblxuICAgICAgICAgICAgaWYoY29sdW1uLmlzX2Zyb21faGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnKEhFQURFUiknO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb2x1bW4uaXNfcHJvY2Vzc2VkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBuYW1lO1xuICAgICAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGAke2NvbHVtbi5mcm9tX2ZpbGV9LiR7Y29sdW1uLmhkdV9pbmRleH0kJHtjb2x1bW4ubmFtZX1gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRpb24udGV4dCA9IG5hbWU7XG4gICAgICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gYCR7Y29sdW1uLmZpbGVfaWR9LiR7Y29sdW1uLmhkdV9pbmRleH0kJHtjb2x1bW4ubmFtZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBvcHRfZ3JvdXAuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG9wdF9ncm91cFxuICAgIH1cblxuICAgIF9jcmVhdGVHZW5lcmljQ29sdW1uT3B0aW9uc0dyb3VwKCkge1xuICAgICAgICBsZXQgb3B0X2dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGdyb3VwXCIpO1xuICAgICAgICBvcHRfZ3JvdXAubGFiZWwgPSBcIkdlbmVyZWljIGNvbHVtbnNcIjtcbiAgICAgICAgb3B0X2dyb3VwLmNsYXNzTmFtZSArPSBcImdlbmVyaWNcIjtcblxuICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICBvcHRpb24udGV4dCA9ICdOb25lJztcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gYG5vbmVgO1xuXG4gICAgICAgIG9wdF9ncm91cC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG4gICAgICAgIHJldHVybiBvcHRfZ3JvdXA7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEF4aXMoY29sdW1ucykge1xuICAgICAgICB0aGlzLl9yZXNldFNlbGVjdEF4aXMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3lfaWQpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfYXhpcyA9IFtzZWxlY3RfYXhpc194LCBzZWxlY3RfYXhpc195XTtcblxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuX2NyZWF0ZUNvbHVtbnNPcHRpb25zKGNvbHVtbnMpO1xuXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHNlbGVjdF9heGlzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5hZGQoY2xvbmVkX29wdGlvbik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0R3JvdXBBeGlzKGNvbHVtbnNfb3B0Z3JvdXApIHtcbiAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RBeGlzKCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9heGlzX3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfYXhpc194X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9heGlzX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfYXhpc195X2lkKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2F4aXMgPSBbc2VsZWN0X2F4aXNfeCwgc2VsZWN0X2F4aXNfeV07XG5cbiAgICAgICAgY29sdW1uc19vcHRncm91cC5mb3JFYWNoKChjb2x1bW5fb3B0Z3JvdXApID0+IHtcbiAgICAgICAgICAgIHNlbGVjdF9heGlzLmZvckVhY2goKHNlbGVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjbG9uZWRfb3B0Z3JvdXAgPSBjb2x1bW5fb3B0Z3JvdXAuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5hZGQoY2xvbmVkX29wdGdyb3VwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBfcmVzZXRTZWxlY3RBeGlzKCkge1xuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2F4aXNfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9heGlzX3lfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9heGlzX3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHNlbGVjdF9heGlzX3kuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEVycm9yQmFycyhjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0U2VsZWN0RXJyb3JCYXJzKCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3lfaWQpO1xuXG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFycyA9IFtzZWxlY3RfZXJyb3JfYmFyX3gsIHNlbGVjdF9lcnJvcl9iYXJfeV07XG5cbiAgICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLl9jcmVhdGVDb2x1bW5zT3B0aW9ucyhjb2x1bW5zKTtcblxuICAgICAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICBzZWxlY3RfZXJyb3JfYmFycy5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdCkge1xuICAgICAgICAgICAgICAgIGxldCBjbG9uZWRfb3B0aW9uID0gb3B0aW9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZWxlY3QuYWRkKGNsb25lZF9vcHRpb24pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldFNlbGVjdEdyb3VwRXJyb3JCYXJzKGNvbHVtbnNfb3B0Z3JvdXApIHtcbiAgICAgICAgdGhpcy5fcmVzZXRTZWxlY3RFcnJvckJhcnMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl94X2lkKTtcbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJzID0gW3NlbGVjdF9lcnJvcl9iYXJfeCwgc2VsZWN0X2Vycm9yX2Jhcl95XTtcblxuICAgICAgICBjb2x1bW5zX29wdGdyb3VwLmZvckVhY2goKGNvbHVtbl9vcHRncm91cCkgPT4ge1xuICAgICAgICAgICAgc2VsZWN0X2Vycm9yX2JhcnMuZm9yRWFjaCgoc2VsZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZF9vcHRncm91cCA9IGNvbHVtbl9vcHRncm91cC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmFkZChjbG9uZWRfb3B0Z3JvdXApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBfcmVzZXRTZWxlY3RFcnJvckJhcnMoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3hfaWQpO1xuICAgICAgICBsZXQgc2VsZWN0X2Vycm9yX2Jhcl95ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2Vycm9yX2Jhcl95X2lkKTtcblxuICAgICAgICBzZWxlY3RfZXJyb3JfYmFyX3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ29sdW1uc09wdGlvbnMoY29sdW1ucykge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgb3B0aW9uO1xuXG4gICAgICAgIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4pIHtcblxuICAgICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gY29sdW1uO1xuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBjb2x1bW47XG5cbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RMaWJyYXJ5TGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfbGlicmFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9saWJyYXJ5X2lkKTtcblxuICAgICAgICBzZWxlY3RfbGlicmFyeS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCBjdXN0b21fY2hhbmdlX2V2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZWxlY3QtbGlicmFyeS1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29tcG9zZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlicmFyeTogc2VsZWN0X2xpYnJhcnkudmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGN1c3RvbV9jaGFuZ2VfZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfc2V0U2VsZWN0RGF0YVR5cGVMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGVjdF9kYXRhX3R5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZGF0YV90eXBlX2lkKTtcblxuICAgICAgICBzZWxlY3RfZGF0YV90eXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC1kYXRhLXR5cGUtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbXBvc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFfdHlwZTogc2VsZWN0X2RhdGFfdHlwZS52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2NoYW5nZV9ldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RIRFVzTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfaGR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9oZHVzX2lkKTtcblxuICAgICAgICBzZWxlY3RfaGR1cy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCBjdXN0b21fY2hhbmdlX2V2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZWxlY3QtaGR1cy1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29tcG9zZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBzZWxlY3RfaGR1cy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2NoYW5nZV9ldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRTZWxlY3RBeGlzTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc194ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfYXhpc195ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU2V0dGluZ3NDb21wb25lbnQuc2VsZWN0X2F4aXNfeV9pZCk7XG5cbiAgICAgICAgbGV0IHNlbGVjdF9lcnJvcl9iYXJfeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9lcnJvcl9iYXJfeF9pZCk7XG4gICAgICAgIGxldCBzZWxlY3RfZXJyb3JfYmFyX3kgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZXJyb3JfYmFyX3lfaWQpO1xuXG4gICAgICAgIHNlbGVjdF9heGlzX3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5faWQgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgICAgICAgICAgbGV0IGRhdGFfdHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNldHRpbmdzQ29tcG9uZW50LnNlbGVjdF9kYXRhX3R5cGVfaWQpLnZhbHVlO1xuXG4gICAgICAgICAgICBpZihkYXRhX3R5cGUgPT09ICdsaWdodC1jdXJ2ZScpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fZGVzY3JpcHRvciA9IENvbHVtblV0aWxzLmdldENvbHVtblNldHRpbmdzKGNvbHVtbl9pZClcblxuICAgICAgICAgICAgICAgIGxldCBmaWxlX29iamVjdCA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChjb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkKTtcblxuICAgICAgICAgICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUoZmlsZV9vYmplY3QuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uc19uYW1lPSBmcncuZ2V0QWxsQ29sdW1ucygpO1xuXG4gICAgICAgICAgICAgICAgaWYoY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1JBVEUnICYmXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnNfbmFtZS5zb21lKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1uLm5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0VSUk9SJyAmJiBwYXJzZUludChjb2x1bW4uaGR1X2luZGV4KSA9PT0gcGFyc2VJbnQoY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4KVxuICAgICAgICAgICAgICAgICAgICB9KSkge1xuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oc2VsZWN0X2Vycm9yX2Jhcl94Lm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvciA9IENvbHVtblV0aWxzLmdldENvbHVtblNldHRpbmdzKG9wdGlvbi52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkID09PSBjb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleCA9PT0gY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmNvbHVtbl9uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdFUlJPUicpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RfZXJyb3JfYmFyX3gudmFsdWUgPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RJTUUnICYmXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnNfbmFtZS5zb21lKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1uLm5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RJTUVERUwnICYmIHBhcnNlSW50KGNvbHVtbi5oZHVfaW5kZXgpID09PSBwYXJzZUludChjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RfZXJyb3JfYmFyX3gub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yID0gQ29sdW1uVXRpbHMuZ2V0Q29sdW1uU2V0dGluZ3Mob3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbl9jb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkID09PSBjb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleCA9PT0gY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmNvbHVtbl9uYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUSU1FREVMJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICBzZWxlY3RfYXhpc195LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29sdW1uX2lkID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgICAgIGxldCBkYXRhX3R5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTZXR0aW5nc0NvbXBvbmVudC5zZWxlY3RfZGF0YV90eXBlX2lkKS52YWx1ZTtcblxuICAgICAgICAgICAgaWYoZGF0YV90eXBlID09PSAnbGlnaHQtY3VydmUnKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2Rlc2NyaXB0b3I9IENvbHVtblV0aWxzLmdldENvbHVtblNldHRpbmdzKGNvbHVtbl9pZClcblxuICAgICAgICAgICAgICAgIGxldCBmaWxlX29iamVjdCA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChjb2x1bW5fZGVzY3JpcHRvci5maWxlX2lkKTtcblxuICAgICAgICAgICAgICAgIGxldCBmcnc9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShmaWxlX29iamVjdC5maWxlKTtcblxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWU9IGZydy5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBpZihjb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnUkFURScgJiZcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uc19uYW1lLnNvbWUoY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW4ubmFtZS50b1VwcGVyQ2FzZSgpID09PSAnRVJST1InICYmIHBhcnNlSW50KGNvbHVtbi5oZHVfaW5kZXgpID09PSBwYXJzZUludChjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIH0pKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RfZXJyb3JfYmFyX3kub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yID0gQ29sdW1uVXRpbHMuZ2V0Q29sdW1uU2V0dGluZ3Mob3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgPT09IGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ID09PSBjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0VSUk9SJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdF9lcnJvcl9iYXJfeS52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihjb2x1bW5fZGVzY3JpcHRvci5jb2x1bW5fbmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVElNRScgJiZcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uc19uYW1lLnNvbWUoY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW4ubmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVElNRURFTCcgJiYgcGFyc2VJbnQoY29sdW1uLmhkdV9pbmRleCkgPT09IHBhcnNlSW50KGNvbHVtbl9kZXNjcmlwdG9yLmhkdV9pbmRleClcbiAgICAgICAgICAgICAgICAgICAgfSkpIHtcblxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHNlbGVjdF9lcnJvcl9iYXJfeS5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IgPSBDb2x1bW5VdGlscy5nZXRDb2x1bW5TZXR0aW5ncyhvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uX2NvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgPT09IGNvbHVtbl9kZXNjcmlwdG9yLmZpbGVfaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuaGR1X2luZGV4ID09PSBjb2x1bW5fZGVzY3JpcHRvci5oZHVfaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25fY29sdW1uX2Rlc2NyaXB0b3IuY29sdW1uX25hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RJTUVERUwnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0X2Vycm9yX2Jhcl95LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgX3NldENhbGN1bGF0aW9uUmFkaW9MaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCByYWRpb19idXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBTZXR0aW5nc0NvbXBvbmVudC5jYWxjdWxhdGlvbl9yYWRpb19jbGFzcyk7XG4gICAgICAgIHJhZGlvX2J1dHRvbnMuZm9yRWFjaChyYWRpb19idXR0b24gPT4ge1xuICAgICAgICAgICAgcmFkaW9fYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXRHZW5lcmF0ZUJ1dHRvbkxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgYnV0dG9uX2dlbmVyYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1nZW5lcmF0ZScpO1xuXG4gICAgICAgIGJ1dHRvbl9nZW5lcmF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbV9jaGFuZ2VfZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2J1dHRvbi1nZW5lcmF0ZS1jbGljaycsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb21wb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjdXN0b21fY2hhbmdlX2V2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2V0dGluZ3MoY29uZmlndXJhdGlvbikge1xuICAgICAgICBmb3IgKGxldCBbc2V0dGluZywgdmFsdWVzXSBvZiBPYmplY3QuZW50cmllcyhjb25maWd1cmF0aW9uKSkge1xuXG4gICAgICAgICAgICBsZXQgc2V0dGluZ19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZyk7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ19lbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmRpc3BsYXkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ19lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNldHRpbmdzT2JqZWN0KCkge1xuICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy5fZXh0cmFjdEZvcm1WYWx1ZXMoKTtcblxuICAgICAgICBsZXQgbGlicmFyeSA9IHt9O1xuICAgICAgICBsaWJyYXJ5LmxpYnJhcnkgPSB2YWx1ZXNbJ3NlbGVjdC1saWJyYXJ5J10udmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldExpYnJhcnlTZXR0aW5ncyhsaWJyYXJ5KTtcblxuICAgICAgICBsZXQgaGR1ID0ge307XG4gICAgICAgIGhkdVsnaGR1X2luZGV4J10gPSB2YWx1ZXNbJ3NlbGVjdC1oZHVzJ10udmFsdWU7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldEhEVXNTZXR0aW5ncyhoZHUpO1xuXG4gICAgICAgIGxldCBkYXRhX3R5cGUgPSB7fTtcblxuICAgICAgICBkYXRhX3R5cGUudHlwZSA9IHZhbHVlc1snc2VsZWN0LWRhdGEtdHlwZSddLnZhbHVlO1xuICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXREYXRhVHlwZVNldHRpbmdzKGRhdGFfdHlwZSk7XG5cbiAgICAgICAgaWYodmFsdWVzWydzZWxlY3QtYXhpcy14J10gJiYgdmFsdWVzWydzZWxlY3QtYXhpcy15J10pIHtcbiAgICAgICAgICAgIGxldCBheGlzID0ge307XG4gICAgICAgICAgICBsZXQgc2NhbGVzID0ge307XG5cbiAgICAgICAgICAgIGF4aXMueCA9IHZhbHVlc1snc2VsZWN0LWF4aXMteCddLnZhbHVlO1xuICAgICAgICAgICAgYXhpcy55ID0gdmFsdWVzWydzZWxlY3QtYXhpcy15J10udmFsdWU7XG5cbiAgICAgICAgICAgIHNjYWxlcy54ID0gdmFsdWVzWydzZWxlY3QtYXhpcy14LXNjYWxlJ10udmFsdWU7XG4gICAgICAgICAgICBzY2FsZXMueSA9IHZhbHVlc1snc2VsZWN0LWF4aXMteS1zY2FsZSddLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRBeGlzU2V0dGluZ3MoYXhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRTY2FsZXNTZXR0aW5ncyhzY2FsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodmFsdWVzWydoYXMtZXJyb3ItYmFycy1jaGVja2JveCddKSB7XG4gICAgICAgICAgICBpZih2YWx1ZXNbJ2hhcy1lcnJvci1iYXJzLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvcl9iYXJzID0ge307XG5cbiAgICAgICAgICAgICAgICBpZih2YWx1ZXNbJ3NlbGVjdC1heGlzLXgtZXJyb3ItYmFyJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzLnggPSB2YWx1ZXNbJ3NlbGVjdC1heGlzLXgtZXJyb3ItYmFyJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGVycm9yX2JhcnMueFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKHZhbHVlc1snc2VsZWN0LWF4aXMteS1lcnJvci1iYXInXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnMueSA9IHZhbHVlc1snc2VsZWN0LWF4aXMteS1lcnJvci1iYXInXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXJyb3JfYmFycy55XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3Quc2V0RXJyb3JCYXJzU2V0dGluZ3MoZXJyb3JfYmFycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih2YWx1ZXNbJ2hhcy14LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSB8fCB2YWx1ZXNbJ2hhcy15LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBsZXQgcmFuZ2VzID0ge1xuICAgICAgICAgICAgICAgIHg6IHt9LFxuICAgICAgICAgICAgICAgIHk6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZih2YWx1ZXNbJ2hhcy14LXJhbmdlLWNoZWNrYm94J10uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneCddLmxvd2VyX2JvdW5kID0gdmFsdWVzWyd4LWxvd2VyLWJvdW5kJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgcmFuZ2VzWyd4J10udXBwZXJfYm91bmQgPSB2YWx1ZXNbJ3gtaGlnaGVyLWJvdW5kJ10udmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneCddID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVzWydoYXMteS1yYW5nZS1jaGVja2JveCddLmNoZWNrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3knXS5sb3dlcl9ib3VuZCA9IHZhbHVlc1sneS1sb3dlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJhbmdlc1sneSddLnVwcGVyX2JvdW5kID0gdmFsdWVzWyd5LWhpZ2hlci1ib3VuZCddLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbJ3knXSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0LnNldFJhbmdlc1NldHRpbmdzKHJhbmdlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzX29iamVjdC5zZXRSYW5nZXNTZXR0aW5ncyhudWxsKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2V4dHJhY3RGb3JtVmFsdWVzKCkge1xuXG4gICAgICAgIGxldCBmb3JtX3ZhbHVlcyA9IHt9O1xuXG4gICAgICAgIGxldCBzZWxlY3RzID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0tc2VsZWN0Jyk7XG5cbiAgICAgICAgc2VsZWN0cy5mb3JFYWNoKHNlbGVjdCA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSBzZWxlY3QuaWQ7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9IHNlbGVjdC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlbGVjdC52YWx1ZTtcblxuICAgICAgICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUoc2VsZWN0LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKSAhPT0gJ25vbmUnICYmIHZhbHVlICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgdmFsdWV9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgY2hlY2tib3hlcyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLWNoZWNrYm94Jyk7XG5cbiAgICAgICAgY2hlY2tib3hlcy5mb3JFYWNoKGNoZWNrYm94ID0+IHtcblxuICAgICAgICAgICAgbGV0IGlkID0gY2hlY2tib3guaWQ7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9IGNoZWNrYm94LmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSBjaGVja2JveC5jaGVja2VkO1xuXG4gICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgY2hlY2tlZH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dHMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybS1pbnB1dCcpO1xuXG4gICAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9IGlucHV0LmlkO1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBpbnB1dC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICAgICAgICBmb3JtX3ZhbHVlc1tpZF0gPSB7Y2xhc3NlcywgdmFsdWV9O1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBmb3JtX3ZhbHVlcztcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgVmlzdWFsaXphdGlvbkNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIGNvbnRhaW5lcl9pZDtcbiAgICBjb250YWluZXJcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcl9pZCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIHJlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBDU1ZTZXR0aW5nc0NvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVfaWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge1dyYXBwZXJDb250YWluZXJ9IGZyb20gXCIuLi8uLi9jb250YWluZXJzL1dyYXBwZXJDb250YWluZXJcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnR9IGZyb20gXCIuLi8uLi9ldmVudHMvRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7UmVnaXN0cnlDb250YWluZXJ9IGZyb20gXCIuLi8uLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBGSVRTU2V0dGluZ3NDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBjb250YWluZXJfaWQgPSBcImZpdHMtc2V0dGluZ3MtY29udGFpbmVyXCI7XG4gICAgc2VsZWN0X2hkdV9pZCA9IFwic2VsZWN0LWhkdS1maWxlXCI7XG4gICAgdGFibGVfaGVhZGVyX2lkID0gXCJ0YWJsZS1oZWFkZXItZGF0YVwiO1xuICAgIHRhYmxlX2RhdGFfaWQgPSBcInRhYmxlLWRhdGFcIjtcblxuICAgIGZpbGUgPSBudWxsO1xuICAgIGlzX2N1cnJlbnQgPSBmYWxzZTtcblxuICAgIGFkZF90b19wbG90X2J0bl9pZCA9IFwiYWRkLXRvLXBsb3RcIjtcbiAgICByZW1vdmVfZnJvbV9wbG90X2J0bl9pZCA9IFwicmVtb3ZlLWZyb20tcGxvdFwiO1xuICAgIHNhdmVfYnRuX2lkID0gJ3NhdmUtZmlsZS1zZXR0aW5ncyc7XG5cbiAgICBwcm9kdWN0X3R5cGVfc2VsZWN0X2lkID0gJ3Byb2R1Y3QtdHlwZS1zZWxlY3QnO1xuICAgIGFyZl9maWxlX3NlbGVjdF9pZCA9ICdhcmYtZmlsZS1zZWxlY3QnO1xuICAgIHJtZl9maWxlX3NlbGVjdF9pZCA9ICdybWYtZmlsZS1zZWxlY3QnO1xuXG4gICAgY29udGFpbmVyID0gJzxkaXYgaWQ9XCJmaXRzLXNldHRpbmdzLWNvbnRhaW5lclwiIGNsYXNzPVwiZnVsbC13aWR0aC1jb2x1bW5cIiBzdHlsZT1cImdyaWQtY29sdW1uOiAxIC8gc3BhbiAyO1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmRcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuXG4gICAgc2VsZWN0X2hkdV9maWxlID0gJzxzZWxlY3QgaWQ9XCJzZWxlY3QtaGR1LWZpbGVcIiBjbGFzcz1cImZvcm0tc2VsZWN0XCI+PC9zZWxlY3Q+JztcblxuICAgIGlubmVyX2NvbnRhaW5lciA9ICc8ZGl2IGNsYXNzPVwiaW5uZXItcm93XCI+PC9kaXY+JztcblxuICAgIGhlYWRlcl9jb2x1bW4gPSAnPGRpdiBjbGFzcz1cImxlZnQtY29sdW1uXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5IZWFkZXI8L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJoZWFkZXItaGR1LWZpbGVcIj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JztcblxuICAgIHRhYmxlX2hlYWRlciA9ICc8dGFibGUgaWQ9XCJ0YWJsZS1oZWFkZXItZGF0YVwiIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPicgK1xuICAgICAgICAnICAgIDx0aGVhZD4nICtcbiAgICAgICAgJyAgICA8dHI+JyArXG4gICAgICAgICcgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPiM8L3RoPicgK1xuICAgICAgICAnICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5OYW1lPC90aD4nICtcbiAgICAgICAgJyAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+VmFsdWU8L3RoPicgK1xuICAgICAgICAnICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5Db21tZW50PC90aD4nICtcbiAgICAgICAgJyAgICA8L3RyPicgK1xuICAgICAgICAnICAgIDwvdGhlYWQ+JyArXG4gICAgICAgICcgICAgPHRib2R5IGNsYXNzPVwidGFibGUtZ3JvdXAtZGl2aWRlclwiPicgK1xuICAgICAgICAnICAgIDwvdGJvZHk+JyArXG4gICAgICAgICc8L3RhYmxlPidcblxuICAgIGRhdGFfY29sdW1uID0gJzxkaXYgY2xhc3M9XCJyaWdodC1jb2x1bW5cIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPkRhdGE8L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj4nICtcbiAgICAgICAgJyAgIDxkaXYgaWQ9XCJkYXRhLWhkdS1maWxlXCI+JyArXG4gICAgICAgICcgICA8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG5cbiAgICB0YWJsZV9kYXRhID0gJzx0YWJsZSBpZD1cInRhYmxlLWRhdGFcIiBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj4nICtcbiAgICAgICAgJyAgICA8dGhlYWQ+JyArXG4gICAgICAgICcgICAgICAgPHRyPicgK1xuICAgICAgICAnICAgICAgIDwvdHI+JyArXG4gICAgICAgICcgICAgPC90aGVhZD4nICtcbiAgICAgICAgJyAgICA8dGJvZHkgY2xhc3M9XCJ0YWJsZS1ncm91cC1kaXZpZGVyXCI+JyArXG4gICAgICAgICcgICAgPC90Ym9keT4nICtcbiAgICAgICAgJzwvdGFibGU+J1xuXG4gICAgYnRuX3NhdmVfc2V0dGluZ3MgPSAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGlkPVwic2F2ZS1maWxlLXNldHRpbmdzXCI+U2F2ZSBjaGFuZ2VzPC9idXR0b24+JztcbiAgICBidG5fYWRkX3RvX3Bsb3QgPSAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwiYWRkLXRvLXBsb3RcIj5BZGQgdG8gcGxvdDwvYnV0dG9uPjsnXG4gICAgYnRuX3JlbW92ZV9mcm9tX3Bsb3QgPSAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgaWQ9XCJyZW1vdmUtZnJvbS1wbG90XCI+UmVtb3ZlIGZyb20gcGxvdDwvYnV0dG9uPic7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlLCBpc19jdXJyZW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgdGhpcy5pc19jdXJyZW50ID0gaXNfY3VycmVudDtcblxuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZnVsbC13aWR0aC1jb2x1bW5cIiBzdHlsZT1cImdyaWQtY29sdW1uOiAxIC8gc3BhbiAyO1wiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+RmlsZSBzZXR0aW5nczwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPlxcbicgK1xuICAgICAgICAgICAgJyA8IS0tbGFiZWwgZm9yPVwicHJvZHVjdC10eXBlLXNlbGVjdFwiPlByb2R1Y3QgdHlwZSA6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICcgPHNlbGVjdCBpZD1cInByb2R1Y3QtdHlwZS1zZWxlY3RcIiBjbGFzcz1cImZvcm0tc2VsZWN0XCI+PG9wdGlvbiBzZWxlY3RlZD1cInNlbGVjdGVkXCIgdmFsdWU9XCJub25lXCI+Tm9uZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJsaWdodGN1cnZlXCI+TGlnaHQgQ3VydmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic3BlY3RydW1cIj5TcGVjdHJ1bTwvb3B0aW9uPjwvc2VsZWN0PiAnICtcbiAgICAgICAgICAgICcgPGxhYmVsIGZvcj1cInByb2R1Y3QtdHlwZS1zZWxlY3RcIiBjbGFzcz1cInNwZWN0cnVtLXNldHRpbmdzXCI+QVJGIGZpbGUgOiA8L2xhYmVsPicgK1xuICAgICAgICAgICAgJyA8c2VsZWN0IGlkPVwiYXJmLWZpbGUtc2VsZWN0XCIgY2xhc3M9XCJmb3JtLXNlbGVjdCBzcGVjdHJ1bS1zZXR0aW5nc1wiPjwvc2VsZWN0PicgK1xuICAgICAgICAgICAgJyA8bGFiZWwgZm9yPVwicHJvZHVjdC10eXBlLXNlbGVjdFwiIGNsYXNzPVwic3BlY3RydW0tc2V0dGluZ3NcIj5STUYgZmlsZSA6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICcgPHNlbGVjdCBpZD1cInJtZi1maWxlLXNlbGVjdFwiIGNsYXNzPVwiZm9ybS1zZWxlY3Qgc3BlY3RydW0tc2V0dGluZ3NcIj48L3NlbGVjdD4nICtcbiAgICAgICAgICAgICcgPGxhYmVsIGZvcj1cInNlbGVjdC1oZHUtZmlsZVwiPkhEVSA6PC9sYWJlbC0tPicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzZWxlY3QtaGR1LWZpbGVcIiBjbGFzcz1cImZvcm0tc2VsZWN0XCI+XFxuJyArXG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XFxuJyArXG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyLXJvd1wiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdC1jb2x1bW5cIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+SGVhZGVyPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiaGVhZGVyLWhkdS1maWxlXCIgY2xhc3M9XCJmaWxlLWRhdGEtY29udGFpbmVyXCI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJ0YWJsZS1oZWFkZXItZGF0YVwiIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPiM8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5OYW1lPC90aD5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+VmFsdWU8L3RoPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5Db21tZW50PC90aD5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzPVwidGFibGUtZ3JvdXAtZGl2aWRlclwiPlxcbicgK1xuICAgICAgICAgICAgJ1xcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0LWNvbHVtblwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRcIj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj5EYXRhPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZGF0YS1oZHUtZmlsZVwiIGNsYXNzPVwiZmlsZS1kYXRhLWNvbnRhaW5lclwiPlxcbicgK1xuICAgICAgICAgICAgJzx0YWJsZSBpZD1cInRhYmxlLWRhdGFcIiBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgIDx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgICA8L3RyPicgK1xuICAgICAgICAgICAgICAgICcgICAgPC90aGVhZD4nICtcbiAgICAgICAgICAgICAgICAnICAgIDx0Ym9keSBjbGFzcz1cInRhYmxlLWdyb3VwLWRpdmlkZXJcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvdGJvZHk+JyArXG4gICAgICAgICAgICAgICAgJzwvdGFibGU+JytcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGlkPVwic2F2ZS1maWxlLXNldHRpbmdzXCI+U2F2ZSBjaGFuZ2VzPC9idXR0b24+XFxuJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwiYWRkLXRvLXBsb3RcIj5BZGQgdG8gcGxvdDwvYnV0dG9uPlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIGlkPVwicmVtb3ZlLWZyb20tcGxvdFwiPlJlbW92ZSBmcm9tIHBsb3Q8L2J1dHRvbj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nXG5cbiAgICB9XG5cbiAgICBzZXR1cENvbXBvbmVudCgpIHtcbiAgICAgICAgdGhpcy5zZXRIRFVTZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zZXR1cEFjdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5zZXRQcm9kdWN0U2V0dGluZ3MoKTtcblxuICAgICAgICBsZXQgc2VsZWN0X2hkdSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0X2hkdV9pZCk7XG4gICAgICAgIGxldCBoZHVfaW5kZXggPSBzZWxlY3RfaGR1LnZhbHVlO1xuXG4gICAgICAgIHRoaXMuc2V0VGFibGVzKGhkdV9pbmRleCk7XG5cbiAgICAgICAgdGhpcy5zZXR1cElubmVyRWxlbWVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHNldEhEVVNlbGVjdCgpIHtcblxuICAgICAgICBsZXQgc2VsZWN0X2hkdSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0X2hkdV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2hkdS5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICBmcncuc2V0RmlsZSh0aGlzLmZpbGUuZmlsZSk7XG5cbiAgICAgICAgbGV0IGhkdXMgPSBmcncuZ2V0SERVcygpO1xuXG4gICAgICAgIGxldCBvcHRpb25zID0gW107XG4gICAgICAgIGhkdXMuZm9yRWFjaCgoaGR1KSA9PiB7XG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcblxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaGR1LmluZGV4O1xuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBoZHUubmFtZSArICcgJyArIGhkdS5leHRuYW1lO1xuXG4gICAgICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSlcblxuICAgICAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgc2VsZWN0X2hkdS5hZGQob3B0aW9uKTtcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHNldHVwSW5uZXJFbGVtZW50TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldEhEVVNlbGVjdExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0U2F2ZUJ1dHRvbkxpc3RlbmVyKCk7XG4gICAgICAgIC8vdGhpcy5zZXRQcm9kdWN0VHlwZVNlbGVjdExpc3RlbmVyKCk7XG4gICAgICAgIC8vdGhpcy5zZXRBUkZGaWxlU2VsZWN0TGlzdGVuZXIoKTtcbiAgICAgICAgLy90aGlzLnNldFJNRkZpbGVTZWxlY3RMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHNldHVwQWN0aW9uQnV0dG9ucygpIHtcblxuICAgICAgICBsZXQgYWRkX3RvX3Bsb3RfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hZGRfdG9fcGxvdF9idG5faWQpO1xuICAgICAgICBsZXQgcmVtb3ZlX2Zyb21fcGxvdF9idG4gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5yZW1vdmVfZnJvbV9wbG90X2J0bl9pZCk7XG5cbiAgICAgICAgaWYodGhpcy5pc19jdXJyZW50KSB7XG4gICAgICAgICAgICBhZGRfdG9fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHJlbW92ZV9mcm9tX3Bsb3RfYnRuLnN0eWxlLmRpc3BsYXkgPSAnaW5pdGlhbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGRfdG9fcGxvdF9idG4uc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcbiAgICAgICAgICAgIHJlbW92ZV9mcm9tX3Bsb3RfYnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRfdG9fcGxvdF9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5hZGRUb0N1cnJlbnRGaWxlcyh0aGlzLmZpbGUpO1xuXG4gICAgICAgICAgICB0aGlzLmlzX2N1cnJlbnQgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgZnJjZSA9IG5ldyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCgpO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZyY2UuZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHN1YnNyaWJlcnMgZm9yIGV2ZW50IDogXCIgKyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5uYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXNldENvbnRhaW5lckZvckN1cnJlbnRGaWxlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVtb3ZlX2Zyb21fcGxvdF9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIEZpbGVSZWdpc3RyeS5yZW1vdmVGcm9tQ3VycmVudEZpbGVzKHRoaXMuZmlsZS5pZCk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNfY3VycmVudCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBsZXQgZnJjZSA9IG5ldyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCgpO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZyY2UuZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHN1YnNjcmliZXJzIGZvciBzcGVjaWZpZWQgZXZlbnQgOiBcIiArIEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q29udGFpbmVyRm9yQ3VycmVudEZpbGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0UHJvZHVjdFNldHRpbmdzKCkge1xuICAgICAgICBsZXQgcHJvZHVjdF90eXBlID0gbnVsbDtcbiAgICAgICAgbGV0IHJtZl9maWxlID0gbnVsbDtcbiAgICAgICAgbGV0IGFyZl9maWxlID0gbnVsbDtcblxuICAgICAgICBpZih0aGlzLmZpbGUucHJvZHVjdF90eXBlKSBwcm9kdWN0X3R5cGUgPSB0aGlzLmZpbGUucHJvZHVjdF90eXBlO1xuICAgICAgICBpZih0aGlzLmZpbGUucm1mX2ZpbGUpIHJtZl9maWxlID0gdGhpcy5maWxlLnJtZl9maWxlO1xuICAgICAgICBpZih0aGlzLmZpbGUuYXJmX2ZpbGUpIGFyZl9maWxlID0gdGhpcy5maWxlLmFyZl9maWxlO1xuXG4gICAgICAgIC8vdGhpcy5zZXRQcm9kdWN0VHlwZVNlbGVjdChwcm9kdWN0X3R5cGUpO1xuICAgICAgICAvL3RoaXMuc2V0Uk1GRmlsZVNlbGVjdChybWZfZmlsZSk7XG4gICAgICAgIC8vdGhpcy5zZXRBUkZGaWxlU2VsZWN0KGFyZl9maWxlKTtcbiAgICB9XG5cbiAgICBzZXRUYWJsZXMoaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMucmVzZXRUYWJsZXMoKTtcblxuICAgICAgICBsZXQgdGFibGVfaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YWJsZV9oZWFkZXJfaWQpO1xuICAgICAgICBsZXQgdGFibGVfZGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFibGVfZGF0YV9pZCk7XG5cbiAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgZnJ3LnNldEZpbGUodGhpcy5maWxlLmZpbGUpO1xuXG4gICAgICAgIGxldCBoZHVfY2FyZHMgPSBmcncuZ2V0SGVhZGVyQ2FyZHNWYWx1ZUZyb21IRFUoaGR1X2luZGV4KVxuXG4gICAgICAgIGxldCB0Ym9keSA9IHRhYmxlX2hlYWRlci5xdWVyeVNlbGVjdG9yKCd0Ym9keScpO1xuXG4gICAgICAgIGhkdV9jYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcm93ID0gdGJvZHkuaW5zZXJ0Um93KCk7XG5cbiAgICAgICAgICAgIGxldCBpbmRleF9jZWxsID0gcm93Lmluc2VydENlbGwoMCk7XG4gICAgICAgICAgICBsZXQgY2FyZF9jZWxsID0gcm93Lmluc2VydENlbGwoMSk7XG4gICAgICAgICAgICBsZXQgbmFtZV9jZWxsID0gcm93Lmluc2VydENlbGwoMik7XG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb25fY2VsbCA9IHJvdy5pbnNlcnRDZWxsKDMpO1xuXG4gICAgICAgICAgICBpbmRleF9jZWxsLnRleHRDb250ZW50ID0gY2FyZC5pbmRleDtcbiAgICAgICAgICAgIGNhcmRfY2VsbC50ZXh0Q29udGVudCA9IGNhcmQuY2FyZF9uYW1lO1xuICAgICAgICAgICAgbmFtZV9jZWxsLnRleHRDb250ZW50ID0gY2FyZC52YWx1ZTtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uX2NlbGwudGV4dENvbnRlbnQgPSBjYXJkLmNvbW1lbnQ7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGhkdV9jb2x1bW5zX25hbWUgPSBmcncuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCk7XG4gICAgICAgICAgICBsZXQgaGR1X2RhdGEgPSBmcncuZ2V0Q29sdW1uc0pTT05EYXRhRnJvbUhEVShoZHVfaW5kZXgpXG5cbiAgICAgICAgICAgIGxldCBoZWFkZXJfcm93ID0gdGFibGVfZGF0YS50SGVhZC5pbnNlcnRSb3coKTtcbiAgICAgICAgICAgIHRib2R5ID0gdGFibGVfZGF0YS5xdWVyeVNlbGVjdG9yKCd0Ym9keScpO1xuXG4gICAgICAgICAgICBoZHVfY29sdW1uc19uYW1lLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBoZWFkZXJfY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XG4gICAgICAgICAgICAgICAgaGVhZGVyX2NlbGwudGV4dENvbnRlbnQgPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgaGVhZGVyX3Jvdy5hcHBlbmRDaGlsZChoZWFkZXJfY2VsbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaGR1X2RhdGEuZm9yRWFjaChkYXRhX3BvaW50ID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IHRib2R5Lmluc2VydFJvdygpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhX3BvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhX3BvaW50LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0gZGF0YV9wb2ludFtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRBVEEgUEFSU0lORyBFUlJPUlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0VGFibGVzKCkge1xuICAgICAgICBsZXQgdGFibGVfaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YWJsZV9oZWFkZXJfaWQpO1xuICAgICAgICBsZXQgdGFibGVfZGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFibGVfZGF0YV9pZCk7XG5cbiAgICAgICAgbGV0IHRib2R5ID0gdGFibGVfaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG4gICAgICAgIHRib2R5LmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIHRib2R5ID0gdGFibGVfZGF0YS5xdWVyeVNlbGVjdG9yKCd0Ym9keScpO1xuICAgICAgICBsZXQgdGhlYWQgPSB0YWJsZV9kYXRhLnF1ZXJ5U2VsZWN0b3IoJ3RoZWFkJyk7XG5cbiAgICAgICAgdGJvZHkuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoZWFkLmlubmVySFRNTCA9ICc8dHI+PC90cj4nO1xuICAgIH1cblxuICAgIHNldEhEVVNlbGVjdExpc3RlbmVyKCkge1xuXG4gICAgICAgIGxldCBzZWxlY3RfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0X2hkdV9pZCk7XG5cbiAgICAgICAgc2VsZWN0X2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFRhYmxlcyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNldFNhdmVCdXR0b25MaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNhdmVfc2V0dGluZ3NfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zYXZlX2J0bl9pZCk7XG5cbiAgICAgICAgc2F2ZV9zZXR0aW5nc19idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0X3R5cGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9kdWN0X3R5cGVfc2VsZWN0X2lkKTtcblxuICAgICAgICAgICAgaWYocHJvZHVjdF90eXBlX3NlbGVjdC52YWx1ZSA9PT0gJ3NwZWN0cnVtJykge1xuICAgICAgICAgICAgICAgIGxldCBybWZfZmlsZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnJtZl9maWxlX3NlbGVjdF9pZCk7XG4gICAgICAgICAgICAgICAgbGV0IGFyZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYXJmX2ZpbGVfc2VsZWN0X2lkKTtcblxuICAgICAgICAgICAgICAgIGxldCBybWZfZmlsZV9pZCA9IHJtZl9maWxlX3NlbGVjdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBsZXQgYXJmX2ZpbGVfaWQgPSBhcmZfZmlsZV9zZWxlY3QudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBGaWxlUmVnaXN0cnkuc2V0RmlsZU1ldGFkYXRhKHRoaXMuZmlsZS5pZCwge1xuICAgICAgICAgICAgICAgICAgICBybWZfZmlsZTogcm1mX2ZpbGVfaWQsXG4gICAgICAgICAgICAgICAgICAgIGFyZl9maWxlOiBhcmZfZmlsZV9pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBzZXRQcm9kdWN0VHlwZVNlbGVjdCh2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RfdHlwZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb2R1Y3RfdHlwZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgIGlmKHZhbHVlKSB7XG4gICAgICAgICAgICBwcm9kdWN0X3R5cGVfc2VsZWN0LnZhbHVlID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvZHVjdF90eXBlX3NlbGVjdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UHJvZHVjdFR5cGVTZWxlY3RMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHByb2R1Y3RfdHlwZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb2R1Y3RfdHlwZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgIHByb2R1Y3RfdHlwZV9zZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZihwcm9kdWN0X3R5cGVfc2VsZWN0LnZhbHVlID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9kdWN0U2V0dGluZ3NWaXNpYmlsaXR5KCdzcGVjdHJ1bScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHByb2R1Y3RfdHlwZV9zZWxlY3QudmFsdWUgPT09ICdsaWdodGN1cnZlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJvZHVjdFNldHRpbmdzVmlzaWJpbGl0eSgnbGlnaHRjdXJ2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByb2R1Y3RTZXR0aW5nc1Zpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHNldFJNRkZpbGVTZWxlY3QodmFsdWUgPSBudWxsKSB7XG4gICAgICAgIGxldCBybWZfZmlsZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnJtZl9maWxlX3NlbGVjdF9pZCk7XG5cbiAgICAgICAgbGV0IGZpbGVfb3B0aW9ucyA9IHRoaXMuZ2V0RmlsZXNPcHRpb25zTGlzdCgpO1xuXG4gICAgICAgIGZpbGVfb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgIHJtZl9maWxlX3NlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKCF2YWx1ZSkge1xuICAgICAgICAgICAgcm1mX2ZpbGVfc2VsZWN0LnZhbHVlID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm1mX2ZpbGVfc2VsZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRSTUZGaWxlU2VsZWN0TGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBybWZfZmlsZV9zZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnJtZl9maWxlX3NlbGVjdF9pZCk7XG5cbiAgICB9XG5cbiAgICBzZXRBUkZGaWxlU2VsZWN0KHZhbHVlID0gbnVsbCkge1xuICAgICAgICBsZXQgYXJmX2ZpbGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcmZfZmlsZV9zZWxlY3RfaWQpO1xuXG4gICAgICAgIGxldCBmaWxlX29wdGlvbnMgPSB0aGlzLmdldEZpbGVzT3B0aW9uc0xpc3QoKTtcblxuICAgICAgICBmaWxlX29wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICBhcmZfZmlsZV9zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZighdmFsdWUpIHtcbiAgICAgICAgICAgIGFyZl9maWxlX3NlbGVjdC52YWx1ZSA9ICdub25lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZl9maWxlX3NlbGVjdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QVJGRmlsZVNlbGVjdExpc3RlbmVyKCkge1xuICAgICAgICBsZXQgYXJmX2ZpbGVfc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcmZfZmlsZV9zZWxlY3RfaWQpO1xuXG4gICAgfVxuXG4gICAgc2V0UHJvZHVjdFNldHRpbmdzVmlzaWJpbGl0eShzZXR0aW5ncyA9IG51bGwpIHtcbiAgICAgICAgbGV0IHJtZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucm1mX2ZpbGVfc2VsZWN0X2lkKTtcbiAgICAgICAgbGV0IGFyZl9maWxlX3NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYXJmX2ZpbGVfc2VsZWN0X2lkKTtcblxuICAgICAgICBybWZfZmlsZV9zZWxlY3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgYXJmX2ZpbGVfc2VsZWN0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgbGV0IHNwZWN0cnVtX2VsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3BlY3RydW0tc2V0dGluZ3MnKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwZWN0cnVtX2VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzcGVjdHJ1bV9lbGVtZW50c1tpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXNldHRpbmdzKSB7XG5cbiAgICAgICAgfSBlbHNlIGlmKHNldHRpbmdzID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgICAgICBybWZfZmlsZV9zZWxlY3Quc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBhcmZfZmlsZV9zZWxlY3Quc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY3RydW1fZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzcGVjdHJ1bV9lbGVtZW50c1tpXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKHNldHRpbmdzID09PSAnbGlnaHRjdXJ2ZScpIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRDb250YWluZXJGb3JDdXJyZW50RmlsZSgpIHtcbiAgICAgICAgdGhpcy5zZXR1cENvbXBvbmVudCgpO1xuICAgIH1cblxuICAgIGdldEZpbGVzT3B0aW9uc0xpc3QoKSB7XG4gICAgICAgIGxldCBmaWxlX29wdGlvbnMgPSBbXTtcbiAgICAgICAgbGV0IGZpbGVfbGlzdCA9IEZpbGVSZWdpc3RyeS5nZXRBbGxGaWxlcygpO1xuXG4gICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3RydWUnKTtcblxuICAgICAgICBvcHRpb24udmFsdWUgPSAnbm9uZSc7XG4gICAgICAgIG9wdGlvbi50ZXh0ID0gJ05vbmUnO1xuXG4gICAgICAgIGZpbGVfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cbiAgICAgICAgZmlsZV9saXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGZpbGUuaWQ7XG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGZpbGUuZmlsZV9uYW1lO1xuXG4gICAgICAgICAgICBmaWxlX29wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBmaWxlX29wdGlvbnM7XG4gICAgfVxufSIsImltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7V3JhcHBlckNvbnRhaW5lcn0gZnJvbSBcIi4uLy4uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgQXJpdGhtZXRpY0NvbHVtbklucHV0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgc3RhdGljIGNvbHVtbl9kaXNwbGF5X2lkID0gJ2NvbHVtbi1kaXNwbGF5LWxpc3QnO1xuICAgIHN0YXRpYyBjb2x1bW5fY3JlYXRlX2J1dHRvbl9pZCA9ICdjb2x1bW4tZWRpdC1idXR0b24nO1xuICAgIHN0YXRpYyBjb2x1bW5fbWFpbl9pbnB1dF9pZCA9ICdjb2x1bW4tbWFpbi1pbnB1dCc7XG4gICAgc3RhdGljIGNvbHVtbl9saXN0X2lkID0gJ2NvbHVtbi1pbnB1dC1saXN0JztcbiAgICBzdGF0aWMgaW5wdXRfZXhwcmVzc2lvbiA9ICdpbnB1dC1leHByZXNzaW9uJztcblxuICAgIHN0YXRpYyBidXR0b25fY29tbWFuZHMgPSBbJ0MnLCAnPC0tJywgJy0tPicsICdWJ11cblxuICAgIGNvbHVtbl9kaXNwbGF5ID0gXCI8dWwgaWQ9J2NvbHVtbi1kaXNwbGF5LWxpc3QnPjwvdWw+XCI7XG4gICAgY29sdW1uX2NyZWF0ZV9idXR0b24gPSBcIjxidXR0b24gaWQ9J2NvbHVtbi1lZGl0LWJ1dHRvbicgY2xhc3M9J2J0biBidG4tcHJpbWFyeSc+Q3JlYXRlIGNvbHVtbjwvYnV0dG9uPlwiO1xuICAgIGNvbHVtbl9tYWluX2lucHV0ID0gXCI8ZGl2IGlkPSdjb2x1bW4tbWFpbi1pbnB1dCc+XCIgK1xuICAgICAgICBcIjxkaXYgaWQ9J2lucHV0LWRpc3BsYXknPjxpbnB1dCBpZD0naW5wdXQtZXhwcmVzc2lvbicgdHlwZT0ndGV4dCc+PC9kaXY+XCIgK1xuICAgICAgICBcIjxkaXYgaWQ9J2lucHV0LWNvbnRhaW5lcicgY2xhc3M9J2NvbHVtbi1pbnB1dC1jb250YWluZXInPlwiICtcbiAgICAgICAgXCI8ZGl2IGlkPSdpbnB1dC1rZXlib2FyZCcgY2xhc3M9J2NvbHVtbi1pbnB1dC1rZXlib2FyZCc+XCIgK1xuICAgICAgICBcIjxkaXYgY2xhc3M9J2J1dHRvbi1ncmlkJz5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPis8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPi08L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPio8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPi88L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPC9kaXY+XCIgK1xuICAgICAgICBcIjxkaXYgY2xhc3M9J2J1dHRvbi1ncmlkJz5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPig8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPik8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPnBvdzIoKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+cG93MygpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdidXR0b24tZ3JpZCc+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5zcXJ0KCk8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknPm1pbigpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5tYXgoKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+bWVhbigpPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdidXR0b24tZ3JpZCc+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz5sb2coKTwvYnV0dG9uPlwiICtcbiAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeSc+PC0tPC9idXR0b24+XCIgK1xuICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5Jz4tLT48L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1kYW5nZXInPkM8L2J1dHRvbj5cIiArXG4gICAgICAgIFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zdWNjZXNzJz5WPC9idXR0b24+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8L2Rpdj5cIiArXG4gICAgICAgIFwiPGRpdiBpZD0naW5wdXQtY29sdW1ucyc+XCIgK1xuICAgICAgICBcIjx1bCBpZD0nY29sdW1uLWlucHV0LWxpc3QnPjwvdWw+XCIgK1xuICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgXCI8L2Rpdj5cIiArXG4gICAgICAgIFwiPC9kaXY+XCJcblxuICAgIGRpc3BsYXlfZm9ybXVsYSA9ICcnO1xuICAgIGlubmVyX2Zvcm11bGEgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy5jb2x1bW5fZGlzcGxheSArIHRoaXMuY29sdW1uX21haW5faW5wdXQgKyB0aGlzLmNvbHVtbl9jcmVhdGVfYnV0dG9uO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUNoYW5nZUV2ZW50ID0gdGhpcy5oYW5kbGVGaWxlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKTtcblxuXG4gICAgICAgIHRoaXMuX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zZXR1cEV4dGVybmFsTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgX3NldHVwRXh0ZXJuYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZmlsZS1yZWdpc3RyeS1jaGFuZ2UnLCB0aGlzLmhhbmRsZUZpbGVDaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgX3NldHVwSW5uZXJFbGVtZW50c0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0Q3JlYXRlQnV0dG9uTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fc2V0S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIF9zZXRDcmVhdGVCdXR0b25MaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IGNyZWF0ZV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuY29sdW1uX2NyZWF0ZV9idXR0b25faWQpO1xuXG4gICAgICAgIGNyZWF0ZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGRpc3BsYXlfbWFpbl9pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEFyaXRobWV0aWNDb2x1bW5JbnB1dC5jb2x1bW5fbWFpbl9pbnB1dF9pZCk7XG4gICAgICAgICAgICBkaXNwbGF5X21haW5faW5wdXQuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGhhbmRsZUZpbGVDaGFuZ2VFdmVudChldmVudCkge1xuICAgICAgICBsZXQgY3VycmVudF9maWxlX2xpc3QgPSBGaWxlUmVnaXN0cnkuZ2V0Q3VycmVudEZpbGVzTGlzdCgpO1xuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX3Jlc2V0Q29sdW1uSW5wdXQoKTtcblxuICAgICAgICBjdXJyZW50X2ZpbGVfbGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmKGZpbGUudHlwZSA9PT0gJ2ZpdHMnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX3JlYWRlcl93cmFwcGVyLnNldEZpbGUoZmlsZS5maWxlKTtcbiAgICAgICAgICAgICAgICBsZXQgZml0c19jb2x1bW5zID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRBbGxDb2x1bW5zKCk7XG5cbiAgICAgICAgICAgICAgICBmaXRzX2NvbHVtbnMuZm9yRWFjaCgoZml0c19jb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHsuLi5maXRzX2NvbHVtbiwgZmlsZV9pZDogZmlsZS5pZH07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sdW1uc19ieV9maWxlID0gY29sdW1ucy5yZWR1Y2UoKGFjYywgY29sdW1uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY1tjb2x1bW4uZmlsZV9pZF0pIHtcbiAgICAgICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbY29sdW1uLmZpbGVfaWRdLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBsZXQgbGlfZ3JvdXBfbGlzdCA9IFtdO1xuXG4gICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgZm9yIChsZXQgZmlsZV9pZCBpbiBjb2x1bW5zX2J5X2ZpbGUpIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5zX2J5X2ZpbGUuaGFzT3duUHJvcGVydHkoZmlsZV9pZCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVSZWdpc3RyeS5nZXRGaWxlQnlJZChmaWxlX2lkKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZV9uYW1lID0gZmlsZS5maWxlX25hbWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgZnJ3ID0gV3JhcHBlckNvbnRhaW5lci5nZXRGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGZpbGUuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBsaV9ncm91cF9saXN0LnB1c2godGhpcy5jcmVhdGVDb2x1bW5zTGlzdChjb2x1bW5zX2J5X2ZpbGVbZmlsZV9pZF0sIGZydykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDb2x1bW5JbnB1dChsaV9ncm91cF9saXN0KTtcbiAgICAgICAgdGhpcy5fc2V0Q29sdW1uSW5wdXRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgbGV0IGlucHV0X2Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuaW5wdXRfZXhwcmVzc2lvbik7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ0MnOlxuICAgICAgICAgICAgICAgIGlucHV0X2Rpc3BsYXkudmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdWJzpcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbHVtblRvRGlzcGxheShpbnB1dF9kaXNwbGF5LnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc8LS0nOlxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJy0tPic6XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sdW1uc0xpc3QoZmlsZV9jb2x1bW5zLCBmaXRzX3JlYWRlcl93cmFwcGVyKSB7XG5cbiAgICAgICAgbGV0IGxpX2dyb3VwID0gW107XG5cbiAgICAgICAgZmlsZV9jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblxuICAgICAgICAgICAgbGV0IGhkdV90eXBlID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGNvbHVtbi5oZHVfaW5kZXgsICdYVEVOU0lPTicpO1xuICAgICAgICAgICAgbGV0IGhkdV9leHRuYW1lID0gZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJDYXJkVmFsdWVCeU5hbWVGcm9tSERVKGNvbHVtbi5oZHVfaW5kZXgsICdFWFROQU1FJyk7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGhkdV90eXBlKyctJytoZHVfZXh0bmFtZSsnICcrY29sdW1uLm5hbWU7XG5cbiAgICAgICAgICAgIGlmKGNvbHVtbi5pc19mcm9tX2hlYWRlcikge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJyhIRUFERVIpJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY29sdW1uLmlzX3Byb2Nlc3NlZCkge1xuICAgICAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IG5hbWU7XG4gICAgICAgICAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhc2V0LWlkJyxgJHtjb2x1bW4uZnJvbV9maWxlfS4ke2NvbHVtbi5oZHVfaW5kZXh9JCR7Y29sdW1uLm5hbWV9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IG5hbWU7XG4gICAgICAgICAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhLWlkJyxgJHtjb2x1bW4uZmlsZV9pZH0uJHtjb2x1bW4uaGR1X2luZGV4fSQke2NvbHVtbi5uYW1lfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaV9ncm91cC5wdXNoKGxpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGxpX2dyb3VwO1xuICAgIH1cblxuICAgIHNldENvbHVtbklucHV0KGxpX2dyb3VwX2xpc3QpIHtcbiAgICAgICAgbGV0IHVsX2NvbHVtbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuY29sdW1uX2xpc3RfaWQpO1xuXG4gICAgICAgIGxpX2dyb3VwX2xpc3QuZm9yRWFjaCgobGlfZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGxpX2dyb3VwLmZvckVhY2goKGxpKSA9PiB7XG4gICAgICAgICAgICAgICAgdWxfY29sdW1ucy5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIF9zZXRLZXlib2FyZExpc3RlbmVyKCkge1xuICAgICAgICBsZXQgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5idXR0b24tZ3JpZCBidXR0b24nKTtcbiAgICAgICAgbGV0IGlucHV0X2Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuaW5wdXRfZXhwcmVzc2lvbik7XG5cbiAgICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG9wZXJhdG9yID0gYnV0dG9uLnRleHRDb250ZW50O1xuXG4gICAgICAgICAgICAgICAgaWYoIUFyaXRobWV0aWNDb2x1bW5JbnB1dC5idXR0b25fY29tbWFuZHMuaW5jbHVkZXMob3BlcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0X2Rpc3BsYXkudmFsdWUgKz0gb3BlcmF0b3I7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZChvcGVyYXRvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZXNldENvbHVtbklucHV0KCkge1xuICAgICAgICBsZXQgY29sdW1uX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuY29sdW1uX2xpc3RfaWQpO1xuICAgICAgICBjb2x1bW5fbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfc2V0Q29sdW1uSW5wdXRMaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IGxpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3VsI2NvbHVtbi1pbnB1dC1saXN0IGxpJyk7XG4gICAgICAgIGxldCBpbnB1dF9kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQXJpdGhtZXRpY0NvbHVtbklucHV0LmlucHV0X2V4cHJlc3Npb24pO1xuXG4gICAgICAgIGxpcy5mb3JFYWNoKGZ1bmN0aW9uKGxpKSB7XG4gICAgICAgICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbl9pZCA9IGxpLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgICAgICBpbnB1dF9kaXNwbGF5LnZhbHVlICs9IGNvbHVtbl9pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRDb2x1bW5Ub0Rpc3BsYXkoZXhwcmVzc2lvbikge1xuICAgICAgICBsZXQgY29sdW1uX2Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChBcml0aG1ldGljQ29sdW1uSW5wdXQuY29sdW1uX2Rpc3BsYXlfaWQpO1xuXG4gICAgICAgIGxldCBsaV9leHByZXNzaW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlfZXhwcmVzc2lvbi5pbm5lckhUTUwgPSBleHByZXNzaW9uKycgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCI+WDwvYnV0dG9uPic7XG4gICAgICAgIGxpX2V4cHJlc3Npb24uc2V0QXR0cmlidXRlKCdkYXRhLWNvbHVtbicsIGV4cHJlc3Npb24pO1xuXG4gICAgICAgIGNvbHVtbl9kaXNwbGF5LmFwcGVuZENoaWxkKGxpX2V4cHJlc3Npb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IERhdGFQcmVQcm9jZXNzb3IgfSBmcm9tICcuLi9kYXRhX3Byb2Nlc3NvcnMvRGF0YVByZVByb2Nlc3Nvci5qcydcbmltcG9ydCB7IExpZ2h0Q3VydmVQcm9jZXNzb3IgfSBmcm9tICcuLi9kYXRhX3Byb2Nlc3NvcnMvTGlnaHRDdXJ2ZVByb2Nlc3Nvci5qcydcbmltcG9ydCB7IFNwZWN0cnVtUHJvY2Vzc29yIH0gZnJvbSAnLi4vZGF0YV9wcm9jZXNzb3JzL1NwZWN0cnVtUHJvY2Vzc29yLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGF0YVByb2Nlc3NvckNvbnRhaW5lciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGdldERhdGFQcmVQcm9jZXNzb3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0YVByZVByb2Nlc3NvcigpO1xuICAgIH1cblxuICAgIGdldExpZ2h0Q3VydmVQcm9jZXNzb3IoZml0c19yZWFkZXJfd3JhcHBlciwgaGR1X2luZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlnaHRDdXJ2ZVByb2Nlc3NvcihmaXRzX3JlYWRlcl93cmFwcGVyLCBoZHVfaW5kZXgpO1xuICAgIH1cblxuICAgIGdldFNwZWN0cnVtUHJvY2Vzc29yKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNwZWN0cnVtUHJvY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0YVByb2Nlc3NvckNvbnRhaW5lcigpO1xuICAgIH1cblxufSIsImltcG9ydCB7IEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSB9IGZyb20gJy4uL3JlZ2lzdHJpZXMvRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5LmpzJ1xuaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuLi9yZWdpc3RyaWVzL0ZpbGVSZWdpc3RyeVwiO1xuXG5leHBvcnQgY2xhc3MgUmVnaXN0cnlDb250YWluZXIge1xuXG4gICAgc3RhdGljIGZpbGVfcmVnaXN0cnkgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5KCk7XG4gICAgfVxuXG4gICAgZ2V0RmlsZVJlZ2lzdHJ5KCkge1xuICAgICAgICByZXR1cm4gUmVnaXN0cnlDb250YWluZXIuZmlsZV9yZWdpc3RyeTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RmlsZVJlZ2lzdHJ5KGZpbGVfcmVnaXN0cnkpIHtcbiAgICAgICAgUmVnaXN0cnlDb250YWluZXIuZmlsZV9yZWdpc3RyeSA9IGZpbGVfcmVnaXN0cnk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJlZ2lzdHJ5Q29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ2lzdHJ5Q29udGFpbmVyKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVmlzdWFsaXphdGlvblNldHRpbmdzIH0gZnJvbSAnLi4vc2V0dGluZ3MvVmlzdWFsaXphdGlvblNldHRpbmdzLmpzJ1xuaW1wb3J0IHsgU2V0dGluZ3NDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vc2V0dGluZ3MvU2V0dGluZ3NDb25maWd1cmF0aW9uLmpzJ1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb250YWluZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRWaXN1YWxpemF0aW9uU2V0dGluZ3NPYmplY3QoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmlzdWFsaXphdGlvblNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgZ2V0U2V0dGluZ3NDb25maWd1cmF0aW9uT2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFNldHRpbmdzQ29uZmlndXJhdGlvbigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTZXR0aW5nc0NvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXR0aW5nc0NvbnRhaW5lcigpO1xuICAgIH1cblxufSIsImltcG9ydCB7IEJva2VoR3JhcGggfSBmcm9tICcuLi92aXN1YWxpemF0aW9ucy9Cb2tlaEdyYXBoJ1xuaW1wb3J0IHsgRDNHcmFwaCB9IGZyb20gJy4uL3Zpc3VhbGl6YXRpb25zL0QzR3JhcGgnXG5cbmV4cG9ydCBjbGFzcyBWaXN1YWxpemF0aW9uQ29udGFpbmVyIHtcblxuICAgIHN0YXRpYyBib2tlaF9ncmFwaCA9IG51bGw7XG4gICAgc3RhdGljIGQzX2dyYXBoID0gbnVsbDtcblxuICAgIHN0YXRpYyB2aXN1YWxpemF0aW9uX2NvbnRhaW5lciA9ICcjdmlzdWFsaXphdGlvbi1jb250YWluZXInXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBzZXRCb2tlaFZpc3VhbGl6YXRpb24oYm9rZWhfdmlzdWFsaXphdGlvbikge1xuICAgICAgICBWaXN1YWxpemF0aW9uQ29udGFpbmVyLmJva2VoX3Zpc3VhbGl6YXRpb24gPSBib2tlaF92aXN1YWxpemF0aW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREM1Zpc3VhbGl6YXRpb24oZDNfdmlzdWFsaXphdGlvbikge1xuICAgICAgICBWaXN1YWxpemF0aW9uQ29udGFpbmVyLmQzX3Zpc3VhbGl6YXRpb24gPSBkM192aXN1YWxpemF0aW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRCb2tlaFZpc3VhbGl6YXRpb24oKSB7XG4gICAgICAgIGlmKFZpc3VhbGl6YXRpb25Db250YWluZXIuYm9rZWhfdmlzdWFsaXphdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFZpc3VhbGl6YXRpb25Db250YWluZXIuYm9rZWhfdmlzdWFsaXphdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9rZWhHcmFwaChWaXN1YWxpemF0aW9uQ29udGFpbmVyLnZpc3VhbGl6YXRpb25fY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXREM1Zpc3VhbGl6YXRpb24oKSB7XG4gICAgICAgIGlmKFZpc3VhbGl6YXRpb25Db250YWluZXIuZDNfdmlzdWFsaXphdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFZpc3VhbGl6YXRpb25Db250YWluZXIuZDNfdmlzdWFsaXphdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRDNHcmFwaChWaXN1YWxpemF0aW9uQ29udGFpbmVyLnZpc3VhbGl6YXRpb25fY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7IEZJVFNSZWFkZXJXcmFwcGVyIH0gZnJvbSAnLi4vd3JhcHBlcnMvRklUU1JlYWRlcldyYXBwZXIuanMnXG5pbXBvcnQgeyBCb2tlaFdyYXBwZXIgfSBmcm9tICcuLi93cmFwcGVycy9Cb2tlaFdyYXBwZXIuanMnXG5pbXBvcnQgeyBEM1dyYXBwZXIgfSBmcm9tICcuLi93cmFwcGVycy9EM1dyYXBwZXIuanMnXG5cbmV4cG9ydCBjbGFzcyBXcmFwcGVyQ29udGFpbmVyIHtcblxuICAgIHN0YXRpYyBmaXRzX3JlYWRlcl93cmFwcGVyID0gbnVsbDtcbiAgICBzdGF0aWMgYm9rZWhfd3JhcHBlciA9IG51bGw7XG4gICAgc3RhdGljIGQzX3dyYXBwZXIgPSBudWxsO1xuXG4gICAgc3RhdGljIHZpc3VhbGl6YXRpb25fY29udGFpbmVyID0gJ3Zpc3VhbGl6YXRpb24tY29udGFpbmVyJ1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RklUU1JlYWRlcldyYXBwZXIoZml0c19yZWFkZXJfd3JhcHBlcikge1xuICAgICAgICBXcmFwcGVyQ29udGFpbmVyLmZpdHNfcmVhZGVyX3dyYXBwZXIgPSBmaXRzX3JlYWRlcl93cmFwcGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRCb2tlaFdyYXBwZXIoYm9rZWhfd3JhcHBlcikge1xuICAgICAgICBXcmFwcGVyQ29udGFpbmVyLmJva2VoX3dyYXBwZXIgPSBib2tlaF93cmFwcGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREM1dyYXBwZXIoZDNfd3JhcHBlcikge1xuICAgICAgICBXcmFwcGVyQ29udGFpbmVyLmQzX3dyYXBwZXIgPSBkM193cmFwcGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRGSVRTUmVhZGVyV3JhcHBlcigpIHtcbiAgICAgICAgaWYoV3JhcHBlckNvbnRhaW5lci5maXRzX3JlYWRlcl93cmFwcGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gV3JhcHBlckNvbnRhaW5lci5maXRzX3JlYWRlcl93cmFwcGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGSVRTUmVhZGVyV3JhcHBlcignJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Qm9rZWhXcmFwcGVyKCkge1xuICAgICAgICBpZihXcmFwcGVyQ29udGFpbmVyLmJva2VoX3dyYXBwZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBXcmFwcGVyQ29udGFpbmVyLmJva2VoX3dyYXBwZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJva2VoV3JhcHBlcihXcmFwcGVyQ29udGFpbmVyLnZpc3VhbGl6YXRpb25fY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXREM1dyYXBwZXIoKSB7XG4gICAgICAgIGlmKFdyYXBwZXJDb250YWluZXIuZDNfd3JhcHBlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFdyYXBwZXJDb250YWluZXIuZDNfd3JhcHBlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRDNXcmFwcGVyKFdyYXBwZXJDb250YWluZXIudmlzdWFsaXphdGlvbl9jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHtXcmFwcGVyQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyXCI7XG5pbXBvcnQge0ZpbGVSZWdpc3RyeX0gZnJvbSBcIi4uL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge1NwZWN0cnVtUHJvY2Vzc29yfSBmcm9tIFwiLi9TcGVjdHJ1bVByb2Nlc3NvclwiO1xuaW1wb3J0IHtEYXRhUHJvY2Vzc29yQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9EYXRhUHJvY2Vzc29yQ29udGFpbmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhUHJlUHJvY2Vzc29yIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgZ2V0UHJvY2Vzc2VkRGF0YXNldChkYXRhc2V0X3NldHRpbmdzX29iamVjdCkge1xuICAgICAgICBsZXQgZGF0YXNldCA9IHt9O1xuXG4gICAgICAgIGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmF4aXMuZm9yRWFjaCgoYXhpcykgPT4ge1xuXG4gICAgICAgICAgICBsZXQgZmlsZV9vYmplY3QgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5SWQoYXhpcy5maWxlX2lkKTtcblxuICAgICAgICAgICAgbGV0IGZydyA9IFdyYXBwZXJDb250YWluZXIuZ2V0RklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgIGZydy5zZXRGaWxlKGZpbGVfb2JqZWN0LmZpbGUpO1xuXG4gICAgICAgICAgICBsZXQgY29sdW1uX2RhdGE7XG5cbiAgICAgICAgICAgIGlmKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmRhdGFfdHlwZS50eXBlID09PSAnc3BlY3RydW0nICYmXG4gICAgICAgICAgICAgICAgU3BlY3RydW1Qcm9jZXNzb3IucHJvY2Vzc2VkX2NvbHVtbnNfbmFtZS5pbmNsdWRlcyhheGlzLmNvbHVtbl9uYW1lKSkge1xuXG4gICAgICAgICAgICAgICAgY29sdW1uX2RhdGEgPSB0aGlzLmdldFNwZWN0cnVtUHJvY2Vzc2VkQ29sdW1uKGF4aXMuaGR1X2luZGV4LCBheGlzLmNvbHVtbl9uYW1lLCBmcncpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbHVtbl9kYXRhID0gZnJ3LmdldENvbHVtbkRhdGFGcm9tSERVKGF4aXMuaGR1X2luZGV4LCBheGlzLmNvbHVtbl9uYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpcy5kYXRhID0gY29sdW1uX2RhdGE7XG5cbiAgICAgICAgfSlcblxuICAgICAgICBpZihkYXRhc2V0X3NldHRpbmdzX29iamVjdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JfYmFycycpKSB7XG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzX29iamVjdC5lcnJvcl9iYXJzLmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVfb2JqZWN0ID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKGVycm9yX2Jhci5maWxlX2lkKTtcblxuICAgICAgICAgICAgICAgIGxldCBmcncgPSBXcmFwcGVyQ29udGFpbmVyLmdldEZJVFNSZWFkZXJXcmFwcGVyKCk7XG4gICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUoZmlsZV9vYmplY3QuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2RhdGE7XG5cbiAgICAgICAgICAgICAgICBpZihkYXRhc2V0X3NldHRpbmdzX29iamVjdC5kYXRhX3R5cGUudHlwZSA9PT0gJ3NwZWN0cnVtJyAmJlxuICAgICAgICAgICAgICAgICAgICBTcGVjdHJ1bVByb2Nlc3Nvci5wcm9jZXNzZWRfY29sdW1uc19uYW1lLmluY2x1ZGVzKGVycm9yX2Jhci5jb2x1bW5fbmFtZSkpIHtcblxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IHRoaXMuZ2V0U3BlY3RydW1Qcm9jZXNzZWRDb2x1bW4oZXJyb3JfYmFyLmhkdV9pbmRleCwgZXJyb3JfYmFyLmNvbHVtbl9uYW1lLCBmcncpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3JfYmFyLmNvbHVtbl9uYW1lID09PSBTcGVjdHJ1bVByb2Nlc3Nvci5FX01JRF9MT0cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbl9kYXRhLmZvckVhY2goY29sX2RhdGEgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IGZydy5nZXRDb2x1bW5EYXRhRnJvbUhEVShlcnJvcl9iYXIuaGR1X2luZGV4LCBlcnJvcl9iYXIuY29sdW1uX25hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVycm9yX2Jhci5kYXRhID0gY29sdW1uX2RhdGE7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgZGF0YXNldCA9IGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0O1xuXG4gICAgICAgIHJldHVybiBkYXRhc2V0O1xuICAgIH1cblxuICAgIGRhdGFzZXRUb0pTT05EYXRhKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0KSB7XG4gICAgICAgIGxldCByb3dzID0gW107XG5cbiAgICAgICAgZGF0YXNldF9zZXR0aW5nc19vYmplY3QuYXhpcy5mb3JFYWNoKChheGlzKSA9PiB7XG5cbiAgICAgICAgICAgIGF4aXMuZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJvd3NbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvd3NbaW5kZXhdW2F4aXMuY29sdW1uX25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIGlmKGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0Lmhhc093blByb3BlcnR5KCdlcnJvcl9iYXJzJykpIHtcbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3Nfb2JqZWN0LmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXIuZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3dzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tpbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dzW2luZGV4XVtlcnJvcl9iYXIuY29sdW1uX25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBwcm9jZXNzRXJyb3JCYXJEYXRhSlNPTihkYXRhc2V0LCBheGlzLCBlcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coZXJyb3JfYmFycyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFzZXQpO1xuXG4gICAgICAgIGxldCBlcnJvcl9iYXJfeF92YWx1ZXMgPSBbXTtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X3ZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGxldCBheGlzX3ggPSBheGlzLng7XG4gICAgICAgIGxldCBheGlzX3kgPSBheGlzLnk7XG5cbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl95X2NvbHVtbiA9IGVycm9yX2JhcnMueTtcblxuICAgICAgICBsZXQgZXJyb3JfYmFyc19vYmplY3QgPSB7fTtcblxuICAgICAgICBkYXRhc2V0LmZvckVhY2goZnVuY3Rpb24oZGF0YXBvaW50KXtcblxuICAgICAgICAgICAgaWYoZXJyb3JfYmFycy54KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlhcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YXBvaW50W2F4aXNfeF0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yX2Jhcl94X2NvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyX3ggPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSAtIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSArIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJfeF92YWx1ZXMucHVzaChlcnJvcl9iYXJfeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMueSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJZXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFwb2ludFtheGlzX3hdKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcl9iYXJfeV9jb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl95ID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgLSBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFyX3lfdmFsdWVzLnB1c2goZXJyb3JfYmFyX3kpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoZXJyb3JfYmFycy54KSBlcnJvcl9iYXJzX29iamVjdC54ID0gZXJyb3JfYmFyX3hfdmFsdWVzO1xuICAgICAgICBpZihlcnJvcl9iYXJzLnkpIGVycm9yX2JhcnNfb2JqZWN0LnkgPSBlcnJvcl9iYXJfeV92YWx1ZXM7XG5cbiAgICAgICAgcmV0dXJuIGVycm9yX2JhcnNfb2JqZWN0O1xuICAgIH1cblxuICAgIGdldFNwZWN0cnVtUHJvY2Vzc2VkQ29sdW1uKGhkdV9pbmRleCwgY29sdW1uX25hbWUsIGZpdHNfcmVhZGVyX3dyYXBwZXIpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NlZF9jb2x1bW4gPSBbXTtcblxuICAgICAgICBsZXQgc3AgPSBEYXRhUHJvY2Vzc29yQ29udGFpbmVyLmdldERhdGFQcm9jZXNzb3JDb250YWluZXIoKS5nZXRTcGVjdHJ1bVByb2Nlc3NvcigpO1xuXG4gICAgICAgIGxldCBlX21pbl9jb2wgPSBmaXRzX3JlYWRlcl93cmFwcGVyLmdldENvbHVtbkRhdGFGcm9tSERVKGhkdV9pbmRleCwgXCJFX01JTlwiKTtcbiAgICAgICAgbGV0IGVfbWF4X2NvbCA9IGZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uRGF0YUZyb21IRFUoaGR1X2luZGV4LCBcIkVfTUFYXCIpO1xuXG4gICAgICAgIGVfbWluX2NvbC5mb3JFYWNoKChlX21pbiwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9jb2x1bW4ucHVzaChTcGVjdHJ1bVByb2Nlc3Nvci5zcGVjdHJ1bV9jb2xfZnVuY3Rpb25zW2NvbHVtbl9uYW1lXShlX21pbiwgZV9tYXhfY29sW2luZGV4XSkpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWRfY29sdW1uO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2UocmFuZ2VzLCBkYXRhLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZGF0YSA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycyA9IHt9O1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF9lcnJvcl9iYXJfeSA9IFtdO1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBbXTtcblxuICAgICAgICBkYXRhLmZvckVhY2goKGRhdGFfcG9pbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YV9wb2ludCk7XG4gICAgICAgICAgICBsZXQgeF9jb2x1bW4gPSBrZXlzWzBdO1xuICAgICAgICAgICAgbGV0IHlfY29sdW1uID0ga2V5c1sxXTtcblxuICAgICAgICAgICAgaWYgKHJhbmdlcy54ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV94ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YV9wb2ludFt4X2NvbHVtbl0gPj0gcmFuZ2VzLngubG93ZXJfYm91bmQgJiYgZGF0YV9wb2ludFt4X2NvbHVtbl0gPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhX3BvaW50Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRhdGFfcG9pbnRbeV9jb2x1bW5dID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnRbeV9jb2x1bW5dIDw9IHJhbmdlcy55LnVwcGVyX2JvdW5kKSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YV9wb2ludC5tYXRjaF9yYW5nZV95ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnQubWF0Y2hfcmFuZ2VfeSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZGF0YS5wdXNoKGRhdGFfcG9pbnQpO1xuICAgICAgICAgICAgICAgIGlmKGVycm9yX2JhcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wX2Vycm9yX2Jhcl94LnB1c2goZXJyb3JfYmFycy54W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcF9lcnJvcl9iYXJfeS5wdXNoKGVycm9yX2JhcnMueVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoZXJyb3JfYmFycyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzLnggPSB0ZW1wX2Vycm9yX2Jhcl94O1xuICAgICAgICAgICAgdGVtcF9wcm9jZXNzZWRfZXJyb3JfYmFycy55ID0gdGVtcF9lcnJvcl9iYXJfeTtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMgPSB0ZW1wX3Byb2Nlc3NlZF9lcnJvcl9iYXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZGF0YSA9IHRlbXBfcHJvY2Vzc2VkX2RhdGE7XG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhRm9yUmFuZ2VCb2tlaChyYW5nZXMsIGRhdGEsIGhhc19lcnJvcl9iYXJzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NlZF9kYXRhID0ge307XG4gICAgICAgIHByb2Nlc3NlZF9kYXRhLnggPSBbXTtcbiAgICAgICAgcHJvY2Vzc2VkX2RhdGEueSA9IFtdXG5cbiAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnhfbG93ID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwID0gW107XG4gICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55X2xvdyA9IFtdO1xuICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEueV91cCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRlbXBfeCA9IFtdO1xuICAgICAgICBsZXQgdGVtcF95ID0gW107XG5cbiAgICAgICAgZGF0YS54LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy54Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLngudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3ggPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF94LnB1c2godGVtcF9kYXRhX29iamVjdCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZGF0YS55LmZvckVhY2goKGRhdGFfcG9pbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBfZGF0YV9vYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRlbXBfZGF0YV9vYmplY3QudmFsdWUgPSBkYXRhX3BvaW50O1xuXG4gICAgICAgICAgICBpZiAocmFuZ2VzLnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhX3BvaW50ID49IHJhbmdlcy55Lmxvd2VyX2JvdW5kICYmIGRhdGFfcG9pbnQgPD0gcmFuZ2VzLnkudXBwZXJfYm91bmQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2RhdGFfb2JqZWN0Lm1hdGNoX3JhbmdlX3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcF95LnB1c2godGVtcF9kYXRhX29iamVjdClcbiAgICAgICAgfSlcblxuICAgICAgICB0ZW1wX3guZm9yRWFjaCgoZGF0YV9wb2ludF94LCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YV9wb2ludF95ID0gdGVtcF95W2ldO1xuXG4gICAgICAgICAgICBpZihkYXRhX3BvaW50X3gubWF0Y2hfcmFuZ2VfeCArIGRhdGFfcG9pbnRfeS5tYXRjaF9yYW5nZV95ID09IDIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54LnB1c2goZGF0YV9wb2ludF94LnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS55LnB1c2goZGF0YV9wb2ludF95LnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmKGhhc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfbG93LnB1c2goZGF0YS55X2xvd1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLnlfdXAucHVzaChkYXRhLnlfdXBbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X2xvdy5wdXNoKGRhdGEueF9sb3dbaV0pO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS54X3VwLnB1c2goZGF0YS54X3VwW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZF9kYXRhO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBMaWdodEN1cnZlUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBoZWFkZXJfY2FyZHMgPSBbXG4gICAgICAgICdUSU1FUkVGJyxcbiAgICAgICAgJ1RJTUVERUwnLFxuICAgICAgICAnTUpEUkVGJyxcbiAgICAgICAgJ1RTVEFSVCcsXG4gICAgICAgICdUU1RPUCcsXG4gICAgICAgICdURUxBUFNFJyxcbiAgICAgICAgJ0VfTUlOJyxcbiAgICAgICAgJ0VfTUFYJyxcbiAgICAgICAgJ0VfVU5JVCddXG5cbiAgICBzdGF0aWMgY29sdW1uc19uYW1lcyA9IHtcbiAgICAgICAgdGltZTogJ1RJTUUnLFxuICAgICAgICB0aW1lZGVsOiAnVElNRURFTCcsXG4gICAgICAgIHJhdGU6ICdSQVRFJyxcbiAgICAgICAgZXJyb3I6ICdFUlJPUicsXG4gICAgICAgIGZyYWNleHA6ICdGUkFDRVhQJ1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5uaW5nX3R5cGVzID0ge1xuICAgICAgICAnVElNRV9CQVNFRCc6ICd0aW1lX2Jhc2VkJyxcbiAgICAgICAgJ0VRVUFMX0NPVU5UJzogJ2VxdWFsX2NvdW50J1xuICAgIH1cblxuICAgIHN0YXRpYyBiaW5fdmFsdWVfbWV0aG9kcyA9IFtcbiAgICAgICAgJ21lYW4nLFxuICAgICAgICAnd2VpZ2h0ZWRtZWFuJyxcbiAgICAgICAgJ21lZGlhbicsXG4gICAgICAgICd3bWVkaWFuJyxcbiAgICAgICAgJ3N0ZGRldicsXG4gICAgICAgICdtZWRkZXYnLFxuICAgICAgICAna3VydG9zaXMnLFxuICAgICAgICAnc2tld25lc3MnLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21pbicsXG4gICAgICAgICdzdW0nXG4gICAgXVxuXG4gICAgc3RhdGljIG1pbl9jb2x1bW5zX251bWJlciA9IDI7XG4gICAgc3RhdGljIG1hbmRhdG9yeV9jb2x1bW5zID0gWydSQVRFJ107XG4gICAgc3RhdGljIHJlcGxhY2VtZW50X2NvbHVtbnMgPSBbJ1RJTUVERUwnXTtcblxuICAgIGhkdTtcbiAgICBoZHVfaW5kZXggPSBudWxsO1xuXG4gICAgYmlubmluZ190eXBlO1xuICAgIG1ldGhvZDtcblxuICAgIGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgaGVhZGVyX3ZhbHVlcyA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZml0c19yZWFkZXJfd3JhcHBlciwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuZml0c19yZWFkZXJfd3JhcHBlciA9IGZpdHNfcmVhZGVyX3dyYXBwZXI7XG4gICAgICAgIHRoaXMuaGR1X2luZGV4ID0gaGR1X2luZGV4O1xuXG4gICAgICAgIHRoaXMuX3NldEhEVSgpO1xuICAgIH1cblxuICAgIF9zZXRIRFUoKSB7XG4gICAgICAgIHRoaXMuaGR1ID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhEVSh0aGlzLmhkdV9pbmRleCk7XG4gICAgfVxuXG4gICAgc2V0SERVKGhkdSwgaGR1X2luZGV4KSB7XG4gICAgICAgIHRoaXMuaGR1ID0gaGR1O1xuICAgICAgICB0aGlzLmhkdV9pbmRleCA9IGhkdV9pbmRleDtcbiAgICB9XG5cbiAgICBwcm9jZXNzRGF0YVJhd0pTT04oYXhpcywgZXJyb3JfYmFycyA9IG51bGwpIHtcbiAgICAgICAgLy9sZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCByYXdfZml0c19kYXRhID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldERhdGFGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcblxuICAgICAgICBsZXQgeDtcbiAgICAgICAgbGV0IHk7XG5cbiAgICAgICAgbGV0IHhfY29sdW1uID0gYXhpcy54O1xuICAgICAgICBsZXQgeV9jb2x1bW4gPSBheGlzLnk7XG5cbiAgICAgICAgcmF3X2ZpdHNfZGF0YS5nZXRDb2x1bW4oeF9jb2x1bW4sIGZ1bmN0aW9uKGNvbCl7eCA9IGNvbH0pO1xuICAgICAgICByYXdfZml0c19kYXRhLmdldENvbHVtbih5X2NvbHVtbiwgZnVuY3Rpb24oY29sKXt5ID0gY29sfSk7XG5cbiAgICAgICAgZGF0YS54ID0geDtcbiAgICAgICAgZGF0YS55ID0geTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgICAgIGxldCBkeTtcblxuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94X2NvbHVtbiA9IGVycm9yX2JhcnMueDtcbiAgICAgICAgICAgIGxldCBlcnJvcl9iYXJfeV9jb2x1bW4gPSBlcnJvcl9iYXJzLnk7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl95X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZHkgPSBjb2x9KTtcblxuICAgICAgICAgICAgZGF0YS5keSA9IGR5O1xuICAgICAgICAgICAgLy9kYXRhLnRpbWVkZWwgPSB0aGlzLmdldFRpbWVkZWwoZXJyb3JfYmFyX3hfY29sdW1uKTtcbiAgICAgICAgICAgIC8vZGF0YS50aW1lZGVsID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckZyb21IRFUodGhpcy5oZHVfaW5kZXgpLmdldChcIlRJTUVERUxcIik7XG5cbiAgICAgICAgICAgIHJhd19maXRzX2RhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94X2NvbHVtbiwgZnVuY3Rpb24oY29sKSB7ZGF0YS50aW1lZGVsID0gY29sfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHByb2Nlc3NEYXRhSlNPTihheGlzLCBlcnJvcl9iYXJzID0gbnVsbCkge1xuICAgICAgICBsZXQgcmF3X2ZpdHNfZGF0YSA9IHRoaXMuaGR1LmRhdGE7XG4gICAgICAgIGxldCBsaWdodF9jdXJ2ZV9kYXRhID0ge307XG5cbiAgICAgICAgaWYoIXRoaXMuX2NoZWNrQ29sdW1ucygpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaWdodF9jdXJ2ZV9kYXRhLm1haW4gPSB0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc0pTT05EYXRhRnJvbUhEVSh0aGlzLmhkdV9pbmRleCk7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgbGlnaHRfY3VydmVfZGF0YS5lcnJvcl9iYXJzID0gdGhpcy5fcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGxpZ2h0X2N1cnZlX2RhdGEubWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlnaHRfY3VydmVfZGF0YTtcbiAgICB9XG5cbiAgICBfcHJvY2Vzc0Vycm9yQmFyc0RhdGFKU09OKGVycm9yX2JhcnMsIGF4aXMsIGRhdGEpIHtcbiAgICAgICAgbGV0IGVycm9yX2Jhcl94X3ZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfdmFsdWVzID0gW107XG5cbiAgICAgICAgbGV0IGF4aXNfeCA9IGF4aXMueDtcbiAgICAgICAgbGV0IGF4aXNfeSA9IGF4aXMueTtcblxuICAgICAgICBsZXQgZXJyb3JfYmFyX3hfY29sdW1uID0gZXJyb3JfYmFycy54O1xuICAgICAgICBsZXQgZXJyb3JfYmFyX3lfY29sdW1uID0gZXJyb3JfYmFycy55O1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhcG9pbnQpe1xuICAgICAgICAgICAgbGV0IGVycm9yX2Jhcl94ID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm91bmQ6IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pIC0gcGFyc2VGbG9hdChkYXRhcG9pbnRbZXJyb3JfYmFyX3lfY29sdW1uXSksXG4gICAgICAgICAgICAgICAgICAgIFtheGlzX3hdOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSkgKyBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeV9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeF06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBsZXQgZXJyb3JfYmFyX3kgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3VuZDogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc194XSkgLSBwYXJzZUZsb2F0KGRhdGFwb2ludFtlcnJvcl9iYXJfeF9jb2x1bW5dKSxcbiAgICAgICAgICAgICAgICAgICAgW2F4aXNfeV06IHBhcnNlRmxvYXQoZGF0YXBvaW50W2F4aXNfeV0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kOiBwYXJzZUZsb2F0KGRhdGFwb2ludFtheGlzX3hdKSArIHBhcnNlRmxvYXQoZGF0YXBvaW50W2Vycm9yX2Jhcl94X2NvbHVtbl0pLFxuICAgICAgICAgICAgICAgICAgICBbYXhpc195XTogcGFyc2VGbG9hdChkYXRhcG9pbnRbYXhpc195XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIGVycm9yX2Jhcl94X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl94KTtcbiAgICAgICAgICAgIGVycm9yX2Jhcl95X3ZhbHVlcy5wdXNoKGVycm9yX2Jhcl95KTtcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4ge3g6IGVycm9yX2Jhcl94X3ZhbHVlcywgeTogZXJyb3JfYmFyX3lfdmFsdWVzfVxuICAgIH1cblxuICAgIF9jaGVja0NvbHVtbnMocmVxdWlyZWRfbmJfY29sdW1ucykge1xuICAgICAgICBsZXQgaXNfY2hlY2tlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IGNvbHVtbnNfbnVtYmVyID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldE51bWJlck9mQ29sdW1uRnJvbUhEVSh0aGlzLmhkdV9pbmRleClcbiAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRDb2x1bW5zTmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgpXG5cbiAgICAgICAgaWYoY29sdW1uc19udW1iZXIgPCByZXF1aXJlZF9uYl9jb2x1bW5zIHx8ICFjb2x1bW5zX25hbWUuaW5jbHVkZXMoTGlnaHRDdXJ2ZVByb2Nlc3Nvci5jb2x1bW5zX25hbWVzLnJhdGUpKSB7XG4gICAgICAgICAgICBpc19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfY2hlY2tlZDtcbiAgICB9XG5cbiAgICBnZXRUaW1lZGVsKGVycm9yX2Jhcl94ID0gbnVsbCkge1xuICAgICAgICBsZXQgdGltZWRlbDtcblxuICAgICAgICBpZih0aGlzLmZpdHNfcmVhZGVyX3dyYXBwZXIuZ2V0Q29sdW1uc05hbWVGcm9tSERVKHRoaXMuaGR1X2luZGV4KS5pbmNsdWRlcyhcIlRJTUVERUxcIikpIHtcbiAgICAgICAgICAgIGRhdGEuZ2V0Q29sdW1uKGVycm9yX2Jhcl94LCBmdW5jdGlvbiAoY29sKSB7dGltZWRlbCA9IGNvbH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMuZml0c19yZWFkZXJfd3JhcHBlci5nZXRIZWFkZXJGcm9tSERVKHRoaXMuaGR1X2luZGV4KTtcbiAgICAgICAgICAgIHRpbWVkZWwgPSBoZWFkZXIuZ2V0KFwiVElNRURFTFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lZGVsO1xuICAgIH1cblxuICAgIF9nZXRWYWx1ZUZyb21IRFVIZWFkZXIoKSB7XG4gICAgICAgIGxldCBjYXJkX3ZhbHVlO1xuICAgICAgICBMaWdodEN1cnZlUHJvY2Vzc29yLmhlYWRlcl9jYXJkcy5mb3JFYWNoKChjYXJkX25hbWUpID0+IHtcbiAgICAgICAgICAgIGNhcmRfdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICBjYXJkX3ZhbHVlID0gdGhpcy5maXRzX3JlYWRlcl93cmFwcGVyLmdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUodGhpcy5oZHVfaW5kZXgsIGNhcmRfbmFtZSlcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyX3ZhbHVlc1tjYXJkX25hbWVdID0gY2FyZF92YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRCaW5uaW5nVHlwZShiaW5uaW5nX3R5cGUpIHtcbiAgICAgICAgdGhpcy5iaW5uaW5nX3R5cGUgPSBiaW5uaW5nX3R5cGVcbiAgICB9XG5cbiAgICBzZXRCaW5WYWx1ZU1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuXG4gICAgZ2V0Qmluc0Zvck1ldGhvZChyYXRlX2NvbHVtbiwgZnJhY2V4cF9jb2x1bW4sIGJpbnMsIG1ldGhvZCkge1xuICAgICAgICBsZXQgcHJvY2Vzc2VkX2JpbnMgPSBbXTtcblxuICAgICAgICBiaW5zLmZvckVhY2goKGJpbikgPT4ge1xuICAgICAgICAgICAgbGV0IHRpbWVzID0gW107XG4gICAgICAgICAgICBsZXQgcmF0ZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCBmcmFjZXhwcyA9IFtdO1xuXG4gICAgICAgICAgICBiaW4uZm9yRWFjaCgoeyB0aW1lLCByYXRlLCBmcmFjZXhwIH0pID0+IHtcbiAgICAgICAgICAgICAgICB0aW1lcy5wdXNoKHRpbWUpO1xuICAgICAgICAgICAgICAgIHJhdGVzLnB1c2gocmF0ZSk7XG4gICAgICAgICAgICAgICAgZnJhY2V4cHMucHVzaChmcmFjZXhwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfbWF4ID0gTWF0aC5tYXgoLi4ucmF0ZXMpO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX21pbiA9IE1hdGgubWluKC4uLnJhdGVzKTtcbiAgICAgICAgICAgIGxldCBiaW5fcmF0ZV9tZWFuID0gcmF0ZXMucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApIC8gcmF0ZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGJpbl9yYXRlX3N1bSA9IHJhdGVzLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB0b3RhbCArIHZhbHVlLCAwKTtcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWRfYmlucztcbiAgICB9XG5cbiAgICBnZXRSYXRlRnJhY2V4cFdlaWdodGVkTWVhbkJpbm5lZERhdGEocmF0ZV9jb2x1bW4sIGZyYWNleHBfY29sdW1uLCBiaW5fc2l6ZSkge1xuICAgICAgICBsZXQgbnVtX2RhdGFfcG9pbnRzID0gcmF0ZV9jb2x1bW4ubGVuZ3RoO1xuICAgICAgICBsZXQgbnVtX2JpbnMgPSBNYXRoLmNlaWwobnVtX2RhdGFfcG9pbnRzIC8gYmluX3NpemUpO1xuXG4gICAgICAgIGxldCBiaW5uZWRfcmF0ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9iaW5zOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydF9wb3MgPSBpICogYmluX3NpemU7XG4gICAgICAgICAgICBsZXQgZW5kX3BvcyA9IE1hdGgubWluKHN0YXJ0X3BvcyArIGJpbl9zaXplLCByYXRlX2NvbHVtbi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQgd2VpZ2h0ZWRfc3VtID0gMDtcbiAgICAgICAgICAgIGxldCBudW1fZGF0YV9wb2ludHNfYmluID0gMDtcblxuICAgICAgICAgICAgZm9yKGxldCBqID0gc3RhcnRfcG9zOyBqIDwgZW5kX3BvczsgaisrKSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ZWRfc3VtICs9IHJhdGVfY29sdW1uW2pdICogZnJhY2V4cF9jb2x1bW5bal07XG4gICAgICAgICAgICAgICAgbnVtX2RhdGFfcG9pbnRzX2JpbisrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmluX3JhdGVfdmFsdWUgPSB3ZWlnaHRlZF9zdW0gLyBudW1fZGF0YV9wb2ludHNfYmluO1xuICAgICAgICAgICAgYmlubmVkX3JhdGVzLnB1c2goYmluX3JhdGVfdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpbm5lZF9yYXRlcztcbiAgICB9XG5cbiAgICBnZXRNZWRpYW5EYXRlKGRhdGVzKSB7XG4gICAgICAgIGxldCBzb3J0ZWRfZGF0ZXMgPSBkYXRlcy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgICAgbGV0IG1lZGlhbl9pbmRleCA9IE1hdGguZmxvb3Ioc29ydGVkX2RhdGVzLmxlbmd0aCAvIDIpO1xuXG4gICAgICAgIGlmIChzb3J0ZWRfZGF0ZXMubGVuZ3RoICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvcnRlZF9kYXRlc1ttZWRpYW5faW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREdXJhdGlvbkluU2Vjb25kcyh0aW1lX2NvbHVtbikge1xuICAgICAgICBsZXQgbG93ZXN0X3RpbWUgPSBNYXRoLm1pbiguLi50aW1lX2NvbHVtbik7XG4gICAgICAgIGxldCBoaWdoZXN0X3RpbWUgPSBNYXRoLm1heCguLi50aW1lX2NvbHVtbik7XG5cbiAgICAgICAgbGV0IGR1cmF0aW9uX3NlY29uZHMgPSAoaGlnaGVzdF90aW1lIC0gbG93ZXN0X3RpbWUpICogODY0MDA7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX3NlY29uZHM7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFNwZWN0cnVtUHJvY2Vzc29yIHtcblxuICAgIHN0YXRpYyBwcm9jZXNzZWRfY29sdW1uc19uYW1lID0gWydFX0hBTEZfV0lEVEgnLCAnRV9NSUQnLCAnRV9NSURfTE9HJ107XG5cbiAgICBzdGF0aWMgRF9FID0gJ0VfSEFMRl9XSURUSCc7XG4gICAgc3RhdGljIEVfTUlEID0gJ0VfTUlEJztcbiAgICBzdGF0aWMgRV9NSURfTE9HID0gJ0VfTUlEX0xPRyc7XG5cbiAgICBzdGF0aWMgc3BlY3RydW1fY29sX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgRV9IQUxGX1dJRFRIOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lIYWxmV2lkdGgsXG4gICAgICAgIEVfTUlEOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludCxcbiAgICAgICAgRV9NSURfTE9HOiBTcGVjdHJ1bVByb2Nlc3Nvci5nZXRFbmVyZ3lNaWRQb2ludExvZyxcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vRF9FXG4gICAgc3RhdGljIGdldEVuZXJneUhhbGZXaWR0aChlX21pbiwgZV9tYXgpIHtcbiAgICAgICAgcmV0dXJuICgoZV9tYXggLSBlX21pbikgLyAyKTtcbiAgICB9XG5cbiAgICAvL0VfTUlEXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50KGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gKChlX21heCArIGVfbWluKSAvIDIpO1xuICAgIH1cblxuICAgIC8vRV9NSURfTE9HXG4gICAgc3RhdGljIGdldEVuZXJneU1pZFBvaW50TG9nKGVfbWluLCBlX21heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGVfbWF4ICogZV9taW4pO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBc3ltZXRyaWNFbmVyeUVycm9yQmFyKGVfbWluLCBlX21heCwgZV9taWQpIHtcbiAgICAgICAgbGV0IGVfZXJyb3JfdXAgPSBlX21heCAtIGVfbWlkO1xuICAgICAgICBsZXQgZV9lcnJvcl9kb3duID0gZV9taWQgLSBlX21pbjtcblxuICAgICAgICByZXR1cm4geydlX2Vycm9yX3VwJzogZV9lcnJvcl91cCwgJ2VfZXJyb3JfZG93bic6IGVfZXJyb3JfZG93bn07XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEV2ZW50Tm90Rm91bmRJblJlZ2lzdHJ5RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJFdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yXCI7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBIRFVOb3RUYWJ1bGFyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJIRFVOb3RUYWJ1bGFyRXJyb3JcIjtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEludmFsaWRVUkxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkludmFsaWRVUkxFcnJvclwiO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgTm9FdmVudFN1YnNjcmliZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIk5vRXZlbnRTdWJzY3JpYmVyRXJyb3JcIjtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIE5vRXZlbnRUb0Rpc3BhdGNoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJOb0V2ZW50VG9EaXNwYXRjaFwiO1xuICAgIH1cbn0iLCJpbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IGZhbHNlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfTtcblxuICAgIHN0YXRpYyBuYW1lID0gXCJjb25maWd1cmF0aW9uXCI7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uX29iamVjdCwgZGV0YWlsID0ge30sIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuZGV0YWlsID0geyAuLi5kZXRhaWwsIC4uLnsnY29uZmlndXJhdGlvbl9vYmplY3QnOiBjb25maWd1cmF0aW9uX29iamVjdH19O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkNvbmZpZ3VyYXRpb25FdmVudC5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoQ29uZmlndXJhdGlvbkV2ZW50Lm5hbWUsIHtcbiAgICAgICAgICAgIGRldGFpbDogdGhpcy5kZXRhaWwsXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCkge1xuICAgICAgICBsZXQgZXNyID0gUmVnaXN0cnlDb250YWluZXIuZ2V0UmVnaXN0cnlDb250YWluZXIoKS5nZXRFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKTtcbiAgICAgICAgbGV0IHN1YnNjcmliZXJzX2lkID0gZXNyLmdldFN1YnNjcmliZXJzRm9yRXZlbnQoQ29uZmlndXJhdGlvbkV2ZW50Lm5hbWUpXG5cbiAgICAgICAgbGV0IHN1YnNjcmliZXJfZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHN1YnNjcmliZXJzX2lkLmZvckVhY2goKHN1YnNjcmliZXJfaWQpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXJfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN1YnNjcmliZXJfaWQpO1xuICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiaW1wb3J0IHtSZWdpc3RyeUNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvUmVnaXN0cnlDb250YWluZXJcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVMb2FkZWRFdmVudCB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNvbXBvc2VkOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdGF0aWMgbmFtZSA9IFwiZmlsZS1sb2FkZWRcIjtcbiAgICBzdGF0aWMgbWFpbl9yb290X2lkID0gJ2pzdmlzLW1haW4nO1xuICAgIHN0YXRpYyBtYWluX3Jvb3RfZWxlbWVudCA9IG51bGw7XG5cbiAgICBldmVudCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkZpbGVMb2FkZWRFdmVudC5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRmlsZUxvYWRlZEV2ZW50Lm5hbWUsIHtcbiAgICAgICAgICAgIGRldGFpbDogdGhpcy5kZXRhaWwsXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hUb1RhcmdldCh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hUb01haW5Sb290KCkge1xuICAgICAgICBpZihGaWxlTG9hZGVkRXZlbnQubWFpbl9yb290X2VsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIEZpbGVMb2FkZWRFdmVudC5tYWluX3Jvb3RfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVMb2FkZWRFdmVudC5tYWluX3Jvb3RfaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvU3Vic2NyaWJlcnMoKSB7XG4gICAgICAgIGxldCBlc3IgPSBSZWdpc3RyeUNvbnRhaW5lci5nZXRSZWdpc3RyeUNvbnRhaW5lcigpLmdldEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeSgpO1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnNfaWQgPSBlc3IuZ2V0U3Vic2NyaWJlcnNGb3JFdmVudChGaWxlTG9hZGVkRXZlbnQubmFtZSlcblxuICAgICAgICBsZXQgc3Vic2NyaWJlcl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgc3Vic2NyaWJlcnNfaWQuZm9yRWFjaCgoc3Vic2NyaWJlcl9pZCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3Vic2NyaWJlcl9pZCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyX2VsZW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9SZWdpc3RyeUNvbnRhaW5lclwiO1xuaW1wb3J0IHtOb0V2ZW50U3Vic2NyaWJlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzL05vRXZlbnRTdWJzY3JpYmVyRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgc3RhdGljIG5hbWUgPSBcImZpbGUtcmVnaXN0cnktY2hhbmdlXCI7XG4gICAgc3RhdGljIG1haW5fcm9vdF9pZCA9ICdqc3Zpcy1tYWluJztcbiAgICBzdGF0aWMgbWFpbl9yb290X2VsZW1lbnQgPSBudWxsO1xuXG4gICAgZXZlbnQgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoZGV0YWlsID0ge30sIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuZGV0YWlsID0geyAuLi5kZXRhaWwgfTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0geyAuLi5GaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvVGFyZ2V0KHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaFRvTWFpblJvb3QoKSB7XG4gICAgICAgIGlmKEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm1haW5fcm9vdF9lbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudC5tYWluX3Jvb3RfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50Lm1haW5fcm9vdF9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hUb1N1YnNjcmliZXJzKCkge1xuICAgICAgICBsZXQgZXNyID0gUmVnaXN0cnlDb250YWluZXIuZ2V0UmVnaXN0cnlDb250YWluZXIoKS5nZXRFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkoKTtcbiAgICAgICAgbGV0IHN1YnNjcmliZXJzX2lkID0gZXNyLmdldFN1YnNjcmliZXJzRm9yRXZlbnQoRmlsZVJlZ2lzdHJ5Q2hhbmdlRXZlbnQubmFtZSk7XG5cbiAgICAgICAgbGV0IHN1YnNjcmliZXJfZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyc19pZC5mb3JFYWNoKChzdWJzY3JpYmVyX2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3Vic2NyaWJlcl9pZCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9lbGVtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmKHN1YnNjcmliZXJzX2lkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vRXZlbnRTdWJzY3JpYmVyRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7Tm9FdmVudFRvRGlzcGF0Y2hFcnJvcn0gZnJvbSBcIi4uL2Vycm9ycy9Ob0V2ZW50VG9EaXNwYXRjaEVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NoYW5nZWRFdmVudCB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNvbXBvc2VkOiBmYWxzZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH07XG5cbiAgICBzdGF0aWMgbmFtZSA9IFwic2V0dGluZ3MtY2hhbmdlZFwiO1xuXG4gICAgZXZlbnQgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3Nfb2JqZWN0LCBkZXRhaWwgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy5kZXRhaWwgPSB7IC4uLmRldGFpbCwgLi4ueydzZXR0aW5nc19vYmplY3QnOiBzZXR0aW5nc19vYmplY3R9fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0geyAuLi5TZXR0aW5nc0NoYW5nZWRFdmVudC5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoU2V0dGluZ3NDaGFuZ2VkRXZlbnQubmFtZSwge1xuICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmRldGFpbCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCgpIHtcbiAgICAgICAgaWYodGhpcy5ldmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOb0V2ZW50VG9EaXNwYXRjaEVycm9yKFwiTm8gZXZlbnQgdG8gZGlzcGF0Y2hcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOb0V2ZW50VG9EaXNwYXRjaEVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9Ob0V2ZW50VG9EaXNwYXRjaEVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50IHtcblxuICAgIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY29tcG9zZWQ6IGZhbHNlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfTtcblxuICAgIHN0YXRpYyBuYW1lID0gXCJ2aXN1YWxpemF0aW9uLWdlbmVyYXRpb25cIjtcblxuICAgIGV2ZW50ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzX29iamVjdCwgZGV0YWlsID0ge30sIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuZGV0YWlsID0geyAuLi5kZXRhaWwsIC4uLnsnc2V0dGluZ3Nfb2JqZWN0Jzogc2V0dGluZ3Nfb2JqZWN0fX07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudC5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudC5uYW1lLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHRoaXMuZGV0YWlsLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKCkge1xuICAgICAgICBpZih0aGlzLmV2ZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE5vRXZlbnRUb0Rpc3BhdGNoRXJyb3IoXCJObyBldmVudCB0byBkaXNwYXRjaFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7RXZlbnROb3RGb3VuZEluUmVnaXN0cnlFcnJvcn0gZnJvbSBcIi4uL2Vycm9ycy9FdmVudE5vdEZvdW5kSW5SZWdpc3RyeUVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBFdmVudFN1YnNjcmliZXJzUmVnaXN0cnkge1xuXG4gICAgc3RhdGljIGV2ZW50c19zdWJzY3JpYmVycyA9IHtcbiAgICAgICAgJ2ZpdHMtbG9hZGVkJzogWydzZXR0aW5ncy1jb21wb25lbnQnLCAnZmlsZS1jb21wb25lbnQnXSxcbiAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBbJ3NldHRpbmdzLWNvbXBvbmVudCddLFxuICAgICAgICAnZmlsZS1sb2FkZWQnOiBbJ2ZpbGUtY29tcG9uZW50J10sXG4gICAgICAgICdmaWxlLXNlbGVjdGVkJzogWydzZXR0aW5ncy1jb21wb25lbnQnLCAnYXJpdGhtZXRpYy1jb2x1bW4tY29tcG9uZW50J10sXG4gICAgICAgICdmaWxlLXJlZ2lzdHJ5LWNoYW5nZSc6IFsnc2V0dGluZ3MtY29tcG9uZW50JywgJ2ZpbGUtY29tcG9uZW50JywgJ2FyaXRobWV0aWMtY29sdW1uLWNvbXBvbmVudCddLFxuICAgICAgICAvLydhcml0aG1ldGljLWNvbHVtbi1jaGFuZ2UnOiBbJ3NldHRpbmdzLWNvbXBvbmVudCddXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRTdWJzY3JpYmVyc0ZvckV2ZW50KGV2ZW50X25hbWUpIHtcbiAgICAgICAgaWYoRXZlbnRTdWJzY3JpYmVyc1JlZ2lzdHJ5LmV2ZW50c19zdWJzY3JpYmVycy5oYXNPd25Qcm9wZXJ0eShldmVudF9uYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIEV2ZW50U3Vic2NyaWJlcnNSZWdpc3RyeS5ldmVudHNfc3Vic2NyaWJlcnNbZXZlbnRfbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXZlbnROb3RGb3VuZEluUmVnaXN0cnlFcnJvcihcIkV2ZW50IG5vdCBmb3VuZCA6IFwiICsgZXZlbnRfbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQge0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL0ZpbGVSZWdpc3RyeUNoYW5nZUV2ZW50XCI7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tIFwiLi4vdXRpbHMvU3RyaW5nVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVSZWdpc3RyeSB7XG5cbiAgICBzdGF0aWMgYXZhaWxhYmxlX2ZpbGVzID0gW107XG5cbiAgICBzdGF0aWMgY3VycmVudF9maWxlcyA9IFtdO1xuXG4gICAgc3RhdGljIGZpbGVfY291bnRlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBdmFpbGFibGVGaWxlc0xpc3QoKSB7XG4gICAgICAgIEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMgPSBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzLmZpbHRlcihvYmogPT4gb2JqICE9PSB1bmRlZmluZWQpO1xuICAgICAgICByZXR1cm4gRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q3VycmVudEZpbGVzTGlzdCgpIHtcbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMgPSBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcy5maWx0ZXIob2JqID0+IG9iaiAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgcmV0dXJuIEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRUb0F2YWlsYWJsZUZpbGVzKGZpbGVfdG9fYWRkKSB7XG4gICAgICAgIGxldCBmaWxlID0geyAuLi5maWxlX3RvX2FkZCxcbiAgICAgICAgICAgIGlkOiBGaWxlUmVnaXN0cnkuZmlsZV9jb3VudGVyLFxuICAgICAgICAgICAgZmlsZV9uYW1lOiBTdHJpbmdVdGlscy5jbGVhbkZpbGVOYW1lKGZpbGVfdG9fYWRkLmZpbGVfbmFtZSlcbiAgICAgICAgfTtcblxuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzLnB1c2goZmlsZSk7XG5cbiAgICAgICAgRmlsZVJlZ2lzdHJ5LmZpbGVfY291bnRlcisrO1xuICAgIH1cblxuICAgIHN0YXRpYyBfYWRkVG9BdmFpbGFibGVGaWxlcyhmaWxlKSB7XG4gICAgICAgIEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbW92ZVRvQXZhaWxhYmxlRmlsZXMoZmlsZSkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzLnB1c2goZmlsZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUZyb21BdmFpbGFibGVGaWxlcyhmaWxlX2lkKSB7XG4gICAgICAgIEZpbGVSZWdpc3RyeS5hdmFpbGFibGVfZmlsZXMgPSBGaWxlUmVnaXN0cnkuYXZhaWxhYmxlX2ZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuaWQgIT09IHBhcnNlSW50KGZpbGVfaWQpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkVG9DdXJyZW50RmlsZXMoZmlsZSkge1xuICAgICAgICBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICBGaWxlUmVnaXN0cnkucmVtb3ZlRnJvbUF2YWlsYWJsZUZpbGVzKGZpbGUuaWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmVGcm9tQ3VycmVudEZpbGVzKGZpbGVfaWQpIHtcbiAgICAgICAgbGV0IGZpbGUgPSBGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcy5maW5kKGZpbGUgPT4gZmlsZS5pZCA9PT0gcGFyc2VJbnQoZmlsZV9pZCkpO1xuXG4gICAgICAgIEZpbGVSZWdpc3RyeS5jdXJyZW50X2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5pZCAhPT0gcGFyc2VJbnQoZmlsZV9pZCkpO1xuICAgICAgICBGaWxlUmVnaXN0cnkubW92ZVRvQXZhaWxhYmxlRmlsZXMoZmlsZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFsbEZpbGVzKCkge1xuICAgICAgICBsZXQgYXZhaWxhYmxlX2ZpbGVzID0gRmlsZVJlZ2lzdHJ5LmdldEF2YWlsYWJsZUZpbGVzTGlzdCgpO1xuICAgICAgICBsZXQgY3VycmVudF9maWxlcyA9IEZpbGVSZWdpc3RyeS5nZXRDdXJyZW50RmlsZXNMaXN0KCk7XG5cbiAgICAgICAgbGV0IGZpbGVzID0gYXZhaWxhYmxlX2ZpbGVzLmNvbmNhdChjdXJyZW50X2ZpbGVzKTtcblxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZpbGVCeUlkKGZpbGVfaWQpIHtcbiAgICAgICAgbGV0IGZpbGVfYXJyYXkgPSBbLi4uRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcywgLi4uRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXNdO1xuXG4gICAgICAgIGxldCBmaWxlID0gZmlsZV9hcnJheS5maW5kKGZpbGUgPT4gZmlsZS5pZCA9PT0gcGFyc2VJbnQoZmlsZV9pZCkpO1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RmlsZUJ5TmFtZShmaWxlX25hbWUpIHtcbiAgICAgICAgbGV0IGZpbGVfYXJyYXkgPSBbLi4uRmlsZVJlZ2lzdHJ5LmF2YWlsYWJsZV9maWxlcywgLi4uRmlsZVJlZ2lzdHJ5LmN1cnJlbnRfZmlsZXNdO1xuXG4gICAgICAgIGxldCBmaWxlID0gZmlsZV9hcnJheS5maW5kKGZpbGUgPT4gZmlsZS5maWxlX25hbWUgPT09IGZpbGVfbmFtZSk7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0ZpbGVDdXJyZW50KGZpbGVfaWQpIHtcbiAgICAgICAgbGV0IGlzX2N1cnJlbnQgPSBmYWxzZTtcblxuICAgICAgICBpZihGaWxlUmVnaXN0cnkuY3VycmVudF9maWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pZCA9PT0gcGFyc2VJbnQoZmlsZV9pZCkpKSB7XG4gICAgICAgICAgICBpc19jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc19jdXJyZW50O1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRGaWxlTWV0YWRhdGEoZmlsZV9pZCwgbWV0YWRhdGEpIHtcbiAgICAgICAgbGV0IGZpbGVzID0gRmlsZVJlZ2lzdHJ5LmdldEFsbEZpbGVzKCk7XG5cbiAgICAgICAgbGV0IGZpbGUgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmlkICE9PSBwYXJzZUludChmaWxlX2lkKSk7XG5cbiAgICAgICAgZmlsZSA9IHsgLi4uZmlsZSwgLi4ubWV0YWRhdGEgfTtcblxuICAgICAgICBpZihGaWxlUmVnaXN0cnkuaXNGaWxlQ3VycmVudChmaWxlX2lkKSkge1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5LnJlbW92ZUZyb21DdXJyZW50RmlsZXMoZmlsZV9pZCk7XG4gICAgICAgICAgICBGaWxlUmVnaXN0cnkuYWRkVG9DdXJyZW50RmlsZXMoZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBGaWxlUmVnaXN0cnkucmVtb3ZlRnJvbUF2YWlsYWJsZUZpbGVzKGZpbGVfaWQpO1xuICAgICAgICAgICAgRmlsZVJlZ2lzdHJ5Ll9hZGRUb0F2YWlsYWJsZUZpbGVzKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNlbmRSZWdpc3RyeUNoYW5nZUV2ZW50KCkge1xuICAgICAgICBsZXQgZnJjZSA9IG5ldyBGaWxlUmVnaXN0cnlDaGFuZ2VFdmVudCgpO1xuICAgICAgICBmcmNlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgIH1cblxufSIsImltcG9ydCB7T2JqZWN0VXRpbHN9IGZyb20gXCIuLi91dGlscy9PYmplY3RVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb25maWd1cmF0aW9uIHtcblxuICAgIHN0YXRpYyBkZWZhdWx0X2NvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAgICdsaWJyYXJ5LXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkOiAnbm9uZSdcbiAgICAgICAgfSxcbiAgICAgICAgJ2Jva2VoLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogZmFsc2UsXG4gICAgICAgICAgICAnYm9rZWgtb3B0aW9ucyc6IHtcbiAgICAgICAgICAgICAgICB0b29sczoge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5IDogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdkMy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgJ2QzLW9wdGlvbnMnOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2RhdGEtdHlwZS1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICBzZWxlY3RlZDogJ2dlbmVyaWMnXG4gICAgICAgIH0sXG4gICAgICAgICdsaWdodC1jdXJ2ZS1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgJ2xpZ2h0LWN1cnZlLW9wdGlvbnMnOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3NwZWN0cnVtLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogZmFsc2UsXG4gICAgICAgICAgICAnc3BlY3RydW0tb3B0aW9ucyc6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnaGR1cy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgICdheGlzLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZXJyb3ItYmFycy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2Jpbm5pbmctc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsLWRhdGFzZXQtc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25maWd1cmF0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb25fb2JqZWN0ID0gbnVsbCkge1xuICAgICAgICBpZihjb25maWd1cmF0aW9uX29iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZGVmYXVsdF9jb25maWd1cmF0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNvbmZpZ3VyYXRpb25fb2JqZWN0KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDb25maWd1cmF0aW9uT2JqZWN0KHdyYXBwZXJfY29uZmlndXJhdGlvbikge1xuICAgICAgICBsZXQgY29uZmlndXJhdGlvbiA9IG51bGw7XG5cbiAgICAgICAgY29uZmlndXJhdGlvbiA9IE9iamVjdFV0aWxzLmRlZXBfbWVyZ2UoU2V0dGluZ3NDb25maWd1cmF0aW9uLmRlZmF1bHRfY29uZmlndXJhdGlvbiwgd3JhcHBlcl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29uZmlndXJhdGlvbk9iamVjdCh3cmFwcGVyX2NvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgbGV0IGNvbmZpZ3VyYXRpb24gPSBudWxsO1xuXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gPSBPYmplY3RVdGlscy5kZWVwX21lcmdlKFNldHRpbmdzQ29uZmlndXJhdGlvbi5kZWZhdWx0X2NvbmZpZ3VyYXRpb24sIHdyYXBwZXJfY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFZpc3VhbGl6YXRpb25TZXR0aW5ncyB7XG5cbiAgICBzdGF0aWMgZGVmYXVsdF9zZXR0aW5ncyA9IHtcbiAgICAgICAgbGlicmFyeTogJycsXG4gICAgICAgIGRhdGFfdHlwZTogJycsXG4gICAgICAgIGF4aXM6IHt9LFxuICAgICAgICBzY2FsZXM6IHt9LFxuICAgICAgICBlcnJvcl9iYXJzOiB7fVxuICAgIH1cblxuICAgIHNldHRpbmdzID0ge307XG5cbiAgICBzZXR0aW5nc19saWJyYXJ5ID0gbnVsbDtcbiAgICBzZXR0aW5nc19kYXRhX3R5cGUgPSBudWxsO1xuICAgIHNldHRpbmdzX2hkdXMgPSBudWxsO1xuICAgIHNldHRpbmdzX2F4aXMgPSBudWxsO1xuICAgIHNldHRpbmdzX3NjYWxlcyA9IG51bGw7XG4gICAgc2V0dGluZ3NfZXJyb3JfYmFycyA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nc19vYmplY3QgPSBudWxsKSB7XG4gICAgICAgIGlmKHNldHRpbmdzX29iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3Nfb2JqZWN0KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFZpc3VhbGl6YXRpb25TZXR0aW5ncy5kZWZhdWx0X3NldHRpbmdzKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExpYnJhcnlTZXR0aW5ncyhsaWJyYXJ5KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfbGlicmFyeSA9IGxpYnJhcnk7XG4gICAgfVxuXG4gICAgZ2V0TGlicmFyeVNldHRpbmdzKCkge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzX2xpYnJhcnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX2xpYnJhcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERhdGFUeXBlU2V0dGluZ3MoZGF0YV90eXBlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfZGF0YV90eXBlID0gZGF0YV90eXBlO1xuICAgIH1cblxuICAgIGdldERhdGFUeXBlU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NfZGF0YV90eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19kYXRhX3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExpZ2h0Q3VydmVTZXR0aW5ncygpIHtcblxuICAgIH1cblxuICAgIGdldFNwZWN0cnVtU2V0dGluZ3MoKSB7XG5cbiAgICB9XG5cbiAgICBzZXRIRFVzU2V0dGluZ3MoaGR1cykge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2hkdXMgPSBoZHVzO1xuICAgIH1cblxuICAgIGdldEhEVXNTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19oZHVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19oZHVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRBeGlzU2V0dGluZ3MoYXhpcykge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2F4aXMgPSBheGlzO1xuICAgIH1cblxuICAgIGdldEF4aXNTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19heGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19heGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTY2FsZXNTZXR0aW5ncyhzY2FsZXMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19zY2FsZXMgPSBzY2FsZXM7XG4gICAgfVxuXG4gICAgZ2V0U2NhbGVzU2V0dGluZ3MoKSB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3Nfc2NhbGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19zY2FsZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEVycm9yQmFyc1NldHRpbmdzKGVycm9yX2JhcnMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19lcnJvcl9iYXJzID0gZXJyb3JfYmFycztcbiAgICB9XG5cbiAgICBnZXRFcnJvckJhcnNTZXR0aW5ncygpIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc19lcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5nc19lcnJvcl9iYXJzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRSYW5nZXNTZXR0aW5ncyhyYW5nZXMpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19yYW5nZXMgPSByYW5nZXM7XG4gICAgfVxuXG4gICAgZ2V0UmFuZ2VzU2V0dGluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzX3JhbmdlcztcbiAgICB9XG5cbiAgICBnZXRBZGRpdGlvbmFsRGF0YXNldHNTZXR0aW5ncygpIHtcblxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzX2xpYnJhcnkgPSBudWxsO1xuICAgICAgICB0aGlzLnNldHRpbmdzX2RhdGFfdHlwZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfaGR1cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0dGluZ3NfYXhpcyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfc2NhbGVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19lcnJvcl9iYXJzID0gbnVsbDtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbHVtblV0aWxzIHtcblxuICAgIHN0YXRpYyBnZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5fc2V0dGluZ3MpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gY29sdW1uX3NldHRpbmdzLnNwbGl0KCckJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbl9sb2NhdGlvbiA9IHNldHRpbmdzWzBdLnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IHNldHRpbmdzWzFdIHx8ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2lkID0gY29sdW1uX2xvY2F0aW9uWzBdO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gY29sdW1uX2xvY2F0aW9uLmxlbmd0aCA+IDEgPyBjb2x1bW5fbG9jYXRpb25bMV0gOiAnJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsZV9pZDogZmlsZV9pZCxcbiAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgY29sdW1uX25hbWU6IGNvbHVtbl9uYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIE9iamVjdFV0aWxzIHtcblxuICAgIHN0YXRpYyBkZWVwX21lcmdlKGJhc2Vfb2JqZWN0LCBtZXJnaW5nX29iamVjdCkge1xuICAgICAgICBsZXQgbWVyZ2VkX29iamVjdCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBiYXNlX29iamVjdCkge1xuICAgICAgICAgICAgaWYgKGJhc2Vfb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRfb2JqZWN0W2tleV0gPSBiYXNlX29iamVjdFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIG1lcmdpbmdfb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAobWVyZ2luZ19vYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkobWVyZ2luZ19vYmplY3Rba2V5XSkpIHtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWVyZ2VkX29iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiBtZXJnaW5nX29iamVjdFtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRfb2JqZWN0W2tleV0gPSBPYmplY3RVdGlscy5kZWVwX21lcmdlKG1lcmdlZF9vYmplY3Rba2V5XSwgbWVyZ2luZ19vYmplY3Rba2V5XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkX29iamVjdFtrZXldID0gbWVyZ2luZ19vYmplY3Rba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVyZ2VkX29iamVjdDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgU3RyaW5nVXRpbHMge1xuXG4gICAgc3RhdGljIGNsZWFuRmlsZU5hbWUoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuc3RhcnRzV2l0aCgnLicpIHx8IHN0ci5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmdVdGlscy5jbGVhbkZpbGVOYW1lKHN0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEJva2VoR3JhcGgge1xuXG4gICAgY29udGFpbmVyX2lkID0gbnVsbDtcbiAgICBjb250YWluZXIgPSBudWxsO1xuXG4gICAgc3RhdGljIHBsdCA9IEJva2VoLlBsb3R0aW5nO1xuXG4gICAgc3RhdGljIHNjYWxlX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgXCJsaW5lYXJcIjogQm9rZWguTGluZWFyU2NhbGUsXG4gICAgICAgIFwibG9nXCI6IEJva2VoLkxvZ1NjYWxlXG4gICAgfVxuXG4gICAgc291cmNlID0gbnVsbDtcblxuICAgIHlfZXJyb3JfYmFyO1xuICAgIHhfZXJyb3JfYmFyO1xuXG4gICAgY29sdW1ucztcbiAgICBkYXRhX3RhYmxlO1xuXG4gICAgc3RhdGljIHN1cHBvcnRlZF90b29sX2FycmF5ID0gW1xuICAgICAgICBcInBhblwiLFxuICAgICAgICBcImJveF96b29tXCIsXG4gICAgICAgIFwid2hlZWxfem9vbVwiLFxuICAgICAgICBcImhvdmVyXCIsXG4gICAgICAgIFwiY3Jvc3NoYWlyXCIsXG4gICAgICAgIFwicmVzZXRcIixcbiAgICAgICAgXCJzYXZlXCIsXG4gICAgICAgIFwibGFzc29fc2VsZWN0XCIsXG4gICAgICAgIFwicG9seV9zZWxlY3RcIixcbiAgICAgICAgXCJ0YXBcIixcbiAgICAgICAgXCJleGFtaW5lLFwiLFxuICAgICAgICBcInVuZG9cIixcbiAgICAgICAgXCJyZWRvXCJdO1xuXG4gICAgc3RhdGljIGRlZmF1bHRfdG9vbF9hcnJheSA9IFtcbiAgICAgICAgXCJwYW5cIixcbiAgICAgICAgXCJib3hfem9vbVwiLFxuICAgICAgICBcIndoZWVsX3pvb21cIixcbiAgICAgICAgXCJob3ZlclwiLFxuICAgICAgICBcImNyb3NzaGFpclwiLFxuICAgICAgICBcInJlc2V0XCIsXG4gICAgICAgIFwic2F2ZVwiXTtcblxuICAgIHN0YXRpYyBkZWZhdWx0X3Rvb2xfc3RyaW5nID0gXCJwYW4sYm94X3pvb20sd2hlZWxfem9vbSxob3Zlcixjcm9zc2hhaXIscmVzZXQsc2F2ZVwiO1xuXG4gICAgdG9vbF9hcnJheSA9IFtdO1xuICAgIHRvb2xfc3RyaW5nID0gXCJcIjtcblxuICAgIGhhc19kYXRhX3RhYmxlID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQgPSAnI3Zpc3VhbGl6YXRpb24tY29udGFpbmVyJykge1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl9pZCA9IGNvbnRhaW5lcl9pZDtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcl9pZCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZVNldHRpbmdzKGRhdGEsIGxhYmVscywgc2NhbGVzLCB0aXRsZSwgZXJyb3JfYmFycyA9IG51bGwsIGN1c3RvbV9yYW5nZSA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXR1cFNvdXJjZShkYXRhKTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwUGxvdCh0aXRsZSwgZGF0YVsneV9sb3cnXSwgZGF0YVsneV91cCddKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKGN1c3RvbV9yYW5nZSkge1xuICAgICAgICAgICAgICAgIGxldCB4X2xvdyA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCB4X3VwID0gW107XG5cbiAgICAgICAgICAgICAgICBsZXQgeV9sb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgeV91cCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYoY3VzdG9tX3JhbmdlLnggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlLngubG93ZXJfYm91bmQgIT09IG51bGwgPyB4X2xvdy5wdXNoKGN1c3RvbV9yYW5nZS54Lmxvd2VyX2JvdW5kKSA6IHhfbG93ID0gZGF0YVsneCddO1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2UueC51cHBlcl9ib3VuZCAhPT0gbnVsbCA/IHhfdXAucHVzaChjdXN0b21fcmFuZ2UueC51cHBlcl9ib3VuZCkgOiB4X3VwID0gZGF0YVsneCddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhfbG93ID0gZGF0YVsneCddO1xuICAgICAgICAgICAgICAgICAgICB4X3VwID0gZGF0YVsneCddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGN1c3RvbV9yYW5nZS55ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9yYW5nZS55Lmxvd2VyX2JvdW5kICE9PSBudWxsID8geV9sb3cucHVzaChjdXN0b21fcmFuZ2UueS5sb3dlcl9ib3VuZCkgOiB5X2xvdyA9IGRhdGFbJ3knXTtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlLnkudXBwZXJfYm91bmQgIT09IG51bGwgPyB5X3VwLnB1c2goY3VzdG9tX3JhbmdlLnkudXBwZXJfYm91bmQpIDogeV91cCA9IGRhdGFbJ3knXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB5X2xvdyA9IGRhdGFbJ3knXTtcbiAgICAgICAgICAgICAgICAgICAgeV91cCA9IGRhdGFbJ3knXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwUGxvdCh0aXRsZSwgeV9sb3csIHlfdXAsIHhfbG93LCB4X3VwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwUGxvdCh0aXRsZSwgZGF0YVsneSddLCBkYXRhWyd5J10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldHVwRGF0YSgpO1xuICAgICAgICB0aGlzLnNldHVwU2NhbGVzKHNjYWxlcyk7XG4gICAgICAgIHRoaXMuc2V0dXBMYWJlbHMobGFiZWxzKTtcblxuICAgICAgICBpZihlcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwRXJyb3JCYXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0aWFsaXplR3JhcGgoKSB7XG5cbiAgICAgICAgaWYodGhpcy5oYXNfZGF0YV90YWJsZSkge1xuICAgICAgICAgICAgQm9rZWhHcmFwaC5wbHQuc2hvdyhuZXcgQm9rZWguQ29sdW1uKHtjaGlsZHJlbjogW3AsIGRhdGFfdGFibGVdfSksIFwiI2dyYXBoLWNvbnRhaW5lclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEJva2VoR3JhcGgucGx0LnNob3codGhpcy5wbG90LCB0aGlzLmNvbnRhaW5lcl9pZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFBsb3QodGl0bGUsIHlfcmFuZ2VfbG93LCB5X3JhbmdlX3VwLCB4X3JhbmdlX2xvdyA9IG51bGwsIHhfcmFuZ2VfdXA9IG51bGwpIHtcblxuICAgICAgICBpZih4X3JhbmdlX2xvdykge1xuICAgICAgICAgICAgdGhpcy5wbG90ID0gQm9rZWhHcmFwaC5wbHQuZmlndXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgdG9vbHM6IEJva2VoR3JhcGguZGVmYXVsdF90b29sX3N0cmluZyxcbiAgICAgICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBsb3QgPSBCb2tlaEdyYXBoLnBsdC5maWd1cmUoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgICAgICB0b29sczogQm9rZWhHcmFwaC5kZWZhdWx0X3Rvb2xfc3RyaW5nLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwU291cmNlKGRhdGFfc291cmNlcykge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBCb2tlaC5Db2x1bW5EYXRhU291cmNlKHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGFfc291cmNlc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXR1cERhdGEoKSB7XG4gICAgICAgIGNvbnN0IGNpcmNsZXMgPSB0aGlzLnBsb3QuY2lyY2xlKHsgZmllbGQ6IFwieFwiIH0sIHsgZmllbGQ6IFwieVwiIH0sIHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgICAgZmlsbF9jb2xvcjogXCJuYXZ5XCIsXG4gICAgICAgICAgICBsaW5lX2NvbG9yOiBudWxsLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXR1cEVycm9yQmFycygpIHtcbiAgICAgICAgdGhpcy55X2Vycm9yX2JhciA9IG5ldyBCb2tlaC5XaGlza2VyKHtcbiAgICAgICAgICAgIGRpbWVuc2lvbjogXCJoZWlnaHRcIixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBiYXNlOiB7ZmllbGQ6IFwieFwifSxcbiAgICAgICAgICAgIGxvd2VyOiB7ZmllbGQ6IFwieV9sb3dcIn0sXG4gICAgICAgICAgICB1cHBlcjoge2ZpZWxkOiBcInlfdXBcIn0sXG4gICAgICAgICAgICBsaW5lX2NvbG9yOiBcIm5hdnlcIixcbiAgICAgICAgICAgIGxvd2VyX2hlYWQ6IG51bGwsXG4gICAgICAgICAgICB1cHBlcl9oZWFkOiBudWxsLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnhfZXJyb3JfYmFyID0gbmV3IEJva2VoLldoaXNrZXIoe1xuICAgICAgICAgICAgZGltZW5zaW9uOiBcIndpZHRoXCIsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgYmFzZToge2ZpZWxkOiBcInlcIn0sXG4gICAgICAgICAgICBsb3dlcjoge2ZpZWxkOiBcInhfbG93XCJ9LFxuICAgICAgICAgICAgdXBwZXI6IHtmaWVsZDogXCJ4X3VwXCJ9LFxuICAgICAgICAgICAgbGluZV9jb2xvcjogXCJuYXZ5XCIsXG4gICAgICAgICAgICBsb3dlcl9oZWFkOiBudWxsLFxuICAgICAgICAgICAgdXBwZXJfaGVhZDogbnVsbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbG90LmFkZF9sYXlvdXQodGhpcy55X2Vycm9yX2Jhcik7XG4gICAgICAgIHRoaXMucGxvdC5hZGRfbGF5b3V0KHRoaXMueF9lcnJvcl9iYXIpO1xuICAgIH1cblxuICAgIHNldHVwU2NhbGVzIChzY2FsZXMpIHtcbiAgICAgICAgaWYoc2NhbGVzKSB7XG4gICAgICAgICAgICB0aGlzLnBsb3QueF9zY2FsZSA9IG5ldyBCb2tlaEdyYXBoLnNjYWxlX2Z1bmN0aW9uc1tzY2FsZXMueF0oKTtcbiAgICAgICAgICAgIHRoaXMucGxvdC55X3NjYWxlID0gbmV3IEJva2VoR3JhcGguc2NhbGVfZnVuY3Rpb25zW3NjYWxlcy55XSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBMYWJlbHMobGFiZWxzKSB7XG4gICAgICAgIHRoaXMucGxvdC54YXhpcy5heGlzX2xhYmVsID0gbGFiZWxzLng7XG4gICAgICAgIHRoaXMucGxvdC55YXhpcy5heGlzX2xhYmVsID0gbGFiZWxzLnk7XG4gICAgfVxuXG4gICAgc2V0dXBDb2x1bW5zKGxhYmVscywgY29sdW1ucykge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBbXG4gICAgICAgICAgICBuZXcgQm9rZWguVGFibGVzLlRhYmxlQ29sdW1uKHtmaWVsZDogJ3gnLCB0aXRsZTogbGFiZWxzLnh9KSxcbiAgICAgICAgICAgIG5ldyBCb2tlaC5UYWJsZXMuVGFibGVDb2x1bW4oe2ZpZWxkOiAneScsIHRpdGxlOiBsYWJlbHMueX0pXG4gICAgICAgIF1cbiAgICB9XG5cbiAgICBzZXR1cERhdGFUYWJsZSgpIHtcbiAgICAgICAgdGhpcy5kYXRhX3RhYmxlID0gbmV3IEJva2VoLlRhYmxlcy5EYXRhVGFibGUoe1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZVRvb2xBcnJheSh0b29sX2FycmF5KSB7XG4gICAgICAgIHRoaXMudG9vbF9hcnJheSA9IHRvb2xfYXJyYXk7XG4gICAgfVxuXG4gICAgYWRkVG9vbFRvVG9vbEFycmF5KHRvb2xfbmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMudG9vbF9hcnJheS5pbmNsdWRlcyh0b29sX25hbWUpICYmIEJva2VoR3JhcGguc3VwcG9ydGVkX3Rvb2xfYXJyYXkuaW5jbHVkZXModG9vbF9uYW1lKSkge1xuICAgICAgICAgICAgdGhpcy50b29sX2FycmF5LnB1c2godG9vbF9uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVRvb2xGcm9tVG9vbEFycmF5KHRvb2xfbmFtZSkge1xuICAgICAgICB0aGlzLnRvb2xfYXJyYXkgPSB0aGlzLnRvb2xfYXJyYXkuZmlsdGVyKHN0ciA9PiBzdHIgIT09IHRvb2xfbmFtZSk7XG4gICAgfVxuXG4gICAgc2V0VG9vbFN0cmluZ0Zyb21Ub29sQXJyYXkoKSB7XG4gICAgICAgIHRoaXMudG9vbF9zdHJpbmcgPSB0aGlzLnRvb2xfYXJyYXkuam9pbignLCcpO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBEM0dyYXBoIHtcblxuICAgIHhfc2NhbGU7XG4gICAgeF9zY2FsZV90eXBlO1xuXG4gICAgeV9zY2FsZTtcbiAgICB5X3NjYWxlX3R5cGU7XG5cbiAgICB4X2F4aXM7XG4gICAgeF9heGlzX2RhdGFfY29sO1xuXG4gICAgeV9heGlzO1xuICAgIHlfYXhpc19kYXRhX2NvbDtcblxuICAgIGRhdGFzZXQ7XG4gICAgc3ZnOyBwbG90OyBjbGlwOyB6b29tX3JlY3Q7XG5cbiAgICB6b29tO1xuXG4gICAgbGluZV9jb250YWluZXI7IHBhdGg7XG5cbiAgICBjb250YWluZXI7XG4gICAgY29udGFpbmVyX2lkO1xuXG4gICAgbWFyZ2luID0ge3RvcDogMTAsIHJpZ2h0OiAzMCwgYm90dG9tOiAzMCwgbGVmdDogNjB9O1xuICAgIHdpZHRoID0gODAwIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIGhlaWdodCA9IDQwMCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcblxuICAgIGhhc19lcnJvcl9iYXJzID0gZmFsc2U7XG4gICAgeF9heGlzX2RhdGFfY29sX2Vycm9yX2JhcjtcbiAgICB5X2F4aXNfZGF0YV9jb2xfZXJyb3JfYmFyO1xuXG4gICAgaGFzX2xpbmUgPSBmYWxzZTtcblxuICAgIGhhc19tdWx0aXBsZV9wbG90cyA9IGZhbHNlO1xuICAgIGFkZGl0aW9uYWxfcGxvdHMgPSBbXTtcblxuICAgIGluaXRpYWxpemVkO1xuXG4gICAgc3RhdGljIHNjYWxlX2Z1bmN0aW9ucyA9IHtcbiAgICAgICAgXCJsaW5lYXJcIjogZDMuc2NhbGVMaW5lYXIsXG4gICAgICAgIFwibG9nXCI6IGQzLnNjYWxlTG9nXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0X3NjYWxlcyA9IHtcbiAgICAgICAgXCJ4XCI6ICdsaW5lYXInLFxuICAgICAgICBcInlcIjogJ2xpbmVhcidcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVmYXVsdF9heGlzX3RpY2tfZm9ybWF0ID0gXCIuMmZcIjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcl9pZCA9ICd2aXN1YWxpemF0aW9uLWNvbnRhaW5lcicsIGRhdGFzZXQgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyX2lkID0gY29udGFpbmVyX2lkO1xuICAgICAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUNoYXJ0ID0gdGhpcy5fdXBkYXRlQ2hhcnQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcl9pZCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZVNldHRpbmdzKGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgIGF4aXMsXG4gICAgICAgICAgICAgICAgICAgICAgIHNjYWxlcyA9IEQzR3JhcGguZGVmYXVsdF9zY2FsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnMgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICBoYXNfbGluZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsX3Bsb3RzID0gbnVsbCkge1xuXG4gICAgICAgIGxldCBpc19zZXQgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLmRhdGFzZXQgPSBkYXRhO1xuXG4gICAgICAgICAgICB0aGlzLnhfYXhpc19kYXRhX2NvbCA9IGF4aXNbJ3gnXTtcbiAgICAgICAgICAgIHRoaXMueV9heGlzX2RhdGFfY29sID0gYXhpc1sneSddO1xuXG4gICAgICAgICAgICB0aGlzLnhfc2NhbGVfdHlwZSA9IHNjYWxlc1sneCddO1xuICAgICAgICAgICAgdGhpcy55X3NjYWxlX3R5cGUgPSBzY2FsZXNbJ3knXTtcblxuICAgICAgICAgICAgaWYoZXJyb3JfYmFycykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzX2Vycm9yX2JhcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JfYmFycyA9IGVycm9yX2JhcnM7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcl9iYXJzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMueF9heGlzX2RhdGFfY29sX2Vycm9yX2JhciA9IGF4aXNbJ3gnXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnlfYXhpc19kYXRhX2NvbF9lcnJvcl9iYXIgPSBheGlzWyd5J10udmFsdWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWRkaXRpb25hbF9wbG90cykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzX211bHRpcGxlX3Bsb3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGl0aW9uYWxfcGxvdHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGxldCBhZGRpdGlvbmFsX3Bsb3RzX3RlbXAgPSBbXTtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsX3Bsb3RzLmZvckVhY2goZnVuY3Rpb24gKHBsb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbF9wbG90c190ZW1wLnB1c2gocGxvdCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZGl0aW9uYWxfcGxvdHMgPSBhZGRpdGlvbmFsX3Bsb3RzX3RlbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGFzX2xpbmUgPSBoYXNfbGluZTtcblxuICAgICAgICAgICAgaXNfc2V0ID0gdHJ1ZTtcblxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZHVyaW5nIGdyYXBoIHNldHRpbmdzIHByb2Nlc3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc19zZXQ7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUdyYXBoKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U1ZHQ29udGFpbmVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFhTY2FsZSgpO1xuICAgICAgICAgICAgdGhpcy5fc2V0WVNjYWxlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFhBeGlzKCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRYQXhpc0xhYmVsKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3NldFlBeGlzKCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRZQXhpc0xhYmVsKClcblxuICAgICAgICAgICAgdGhpcy5fc2V0RGF0YVBsb3QoKTtcblxuICAgICAgICAgICAgdGhpcy5fc2V0Wm9vbUJlaGF2aW9yKCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRFcnJvckJhcnModGhpcy5lcnJvcl9iYXJzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5oYXNfbGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEF4aXNMaW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaGFzX211bHRpcGxlX3Bsb3RzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0QWRkaXRpb25hbFBsb3RzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZHVyaW5nIGdyYXBoIGluaXRpYWxpemF0aW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQ7XG4gICAgfVxuXG4gICAgX3NldFNWR0NvbnRhaW5lcigpIHtcblxuICAgICAgICBsZXQgZnVsbF93aWR0aCA9IHRoaXMuX2dldEZ1bGxXaWR0aCgpO1xuICAgICAgICBsZXQgZnVsbF9oZWlnaHQgPSB0aGlzLl9nZXRGdWxsSGVpZ2h0KCk7XG5cbiAgICAgICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QodGhpcy5jb250YWluZXIpXG4gICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGZ1bGxfd2lkdGgpXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBmdWxsX2hlaWdodClcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLFxuICAgICAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgdGhpcy5tYXJnaW4ubGVmdCArIFwiLFwiICsgdGhpcy5tYXJnaW4udG9wICsgXCIpXCIpO1xuICAgIH1cblxuICAgIF9zZXRYU2NhbGUoKSB7XG4gICAgICAgIHRoaXMueF9zY2FsZSA9IEQzR3JhcGguc2NhbGVfZnVuY3Rpb25zW3RoaXMueF9zY2FsZV90eXBlXSgpXG4gICAgICAgICAgICAuZG9tYWluKGQzLmV4dGVudCh0aGlzLmRhdGFzZXQsIGQgPT4gZFt0aGlzLnhfYXhpc19kYXRhX2NvbF0pKVxuICAgICAgICAgICAgLnJhbmdlKFsgMCwgdGhpcy53aWR0aCBdKTtcbiAgICB9XG5cbiAgICBfc2V0WVNjYWxlKCkge1xuICAgICAgICB0aGlzLnlfc2NhbGUgPSBEM0dyYXBoLnNjYWxlX2Z1bmN0aW9uc1t0aGlzLnlfc2NhbGVfdHlwZV0oKVxuICAgICAgICAgICAgLmRvbWFpbihkMy5leHRlbnQodGhpcy5kYXRhc2V0LCBkID0+IGRbdGhpcy55X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgIC5yYW5nZShbIHRoaXMuaGVpZ2h0LCAwXSk7XG4gICAgfVxuXG4gICAgX3NldFhBeGlzKHRpY2tfZm9ybWF0ID0gRDNHcmFwaC5kZWZhdWx0X2F4aXNfdGlja19mb3JtYXQpIHtcbiAgICAgICAgIHRoaXMueF9heGlzID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInhcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyB0aGlzLmhlaWdodCArIFwiKVwiKVxuICAgICAgICAgICAgLmNhbGwoZDMuYXhpc0JvdHRvbSh0aGlzLnhfc2NhbGUpXG4gICAgICAgICAgICAgICAgLnRpY2tGb3JtYXQoZDMuZm9ybWF0KHRpY2tfZm9ybWF0KSkpXG4gICAgICAgICAgICAuY2FsbChnID0+IGcuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKS5jbG9uZSgpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRpY2stbGluZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgLXRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLW9wYWNpdHlcIiwgMC4yKSlcbiAgICB9XG5cbiAgICBfc2V0WUF4aXModGlja19mb3JtYXQgPSBEM0dyYXBoLmRlZmF1bHRfYXhpc190aWNrX2Zvcm1hdCkge1xuICAgICAgICB0aGlzLnlfYXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ5XCIpXG4gICAgICAgICAgICAuY2FsbChkMy5heGlzTGVmdCh0aGlzLnlfc2NhbGUpXG4gICAgICAgICAgICAgICAgLnRpY2tGb3JtYXQoZDMuZm9ybWF0KHRpY2tfZm9ybWF0KSkpXG4gICAgICAgICAgICAuY2FsbChnID0+IGcuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKS5jbG9uZSgpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB0aGlzLndpZHRoKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLW9wYWNpdHlcIiwgMC4yKSk7XG4gICAgfVxuXG4gICAgX3NldFhBeGlzTGFiZWwoKSB7XG4gICAgICAgIHRoaXMueF9heGlzLnNlbGVjdChcIi50aWNrOmxhc3Qtb2YtdHlwZSB0ZXh0XCIpLmNsb25lKClcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ4LWxhYmVsXCIpXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgLTExKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDIpXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAudGV4dCh0aGlzLnhfYXhpc19kYXRhX2NvbCk7XG4gICAgfVxuXG4gICAgX3NldFlBeGlzTGFiZWwoKSB7XG4gICAgICAgIHRoaXMueV9heGlzLnNlbGVjdChcIi50aWNrOmxhc3Qtb2YtdHlwZSB0ZXh0XCIpLmNsb25lKClcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJ5LWxhYmVsXCIpXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMylcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtNSlcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC50ZXh0KHRoaXMueV9heGlzX2RhdGFfY29sKTtcbiAgICB9XG5cbiAgICBfc2V0RGF0YVBsb3QoKSB7XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLnhfc2NhbGU7XG4gICAgICAgIGxldCB5ID0gdGhpcy55X3NjYWxlO1xuXG4gICAgICAgIGxldCB4X2NvbF9kYXRhID0gdGhpcy54X2F4aXNfZGF0YV9jb2w7XG4gICAgICAgIGxldCB5X2NvbF9kYXRhID0gdGhpcy55X2F4aXNfZGF0YV9jb2w7XG5cbiAgICAgICAgdGhpcy5jbGlwID0gdGhpcy5zdmcuYXBwZW5kKFwiZGVmc1wiKS5hcHBlbmQoXCJTVkc6Y2xpcFBhdGhcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJjbGlwXCIpXG4gICAgICAgICAgICAuYXBwZW5kKFwiU1ZHOnJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy53aWR0aCApXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmhlaWdodCApXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKTtcblxuICAgICAgICB0aGlzLnBsb3QgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGlwLXBhdGhcIiwgXCJ1cmwoI2NsaXApXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZGF0YS1wbG90XCIpXG5cbiAgICAgICAgdGhpcy5wbG90XG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmRhdGFzZXQpXG4gICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4geChkW3hfY29sX2RhdGFdKTsgfSApXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiB5KGRbeV9jb2xfZGF0YV0pOyB9IClcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCA0KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCJibGFja1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKVxuICAgIH1cblxuICAgIF9zZXRBZGRpdGlvbmFsUGxvdHMoKSB7XG4gICAgICAgIGxldCBwbG90O1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5hZGRpdGlvbmFsX3Bsb3RzLmxlbmd0aCwgaSsrOykge1xuICAgICAgICAgICAgcGxvdCA9IHRoaXMuYWRkaXRpb25hbF9wbG90c1tpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRFcnJvckJhcnMoZXJyb3JfYmFycykge1xuXG4gICAgICAgIHRoaXMuZXJyb3JfYmFycyA9IGVycm9yX2JhcnM7XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycy55KSB7XG4gICAgICAgICAgICBsZXQgbGluZV9lcnJvcl9iYXJfeCA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgICAgIC54KGQgPT4gdGhpcy54X3NjYWxlKGRbdGhpcy54X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgICAgICAueShkID0+IHRoaXMueV9zY2FsZShkLmJvdW5kKSk7XG5cbiAgICAgICAgICAgIGVycm9yX2JhcnMueS5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoJyNkYXRhLXBsb3QnKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJlcnJvci1iYXIteFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwic3RlZWxibHVlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3goZXJyb3JfYmFyKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoZXJyb3JfYmFycy54KSB7XG4gICAgICAgICAgICBsZXQgbGluZV9lcnJvcl9iYXJfeSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgICAgIC54KGQgPT4gdGhpcy54X3NjYWxlKGQuYm91bmQpKVxuICAgICAgICAgICAgICAgIC55KGQgPT4gdGhpcy55X3NjYWxlKGRbdGhpcy55X2F4aXNfZGF0YV9jb2xdKSk7XG5cbiAgICAgICAgICAgIGVycm9yX2JhcnMueC5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoJyNkYXRhLXBsb3QnKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJlcnJvci1iYXIteFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwic3RlZWxibHVlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuNSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3koZXJyb3JfYmFyKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldEF4aXNMaW5lKCkge1xuICAgICAgICBsZXQgbGluZSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgLmN1cnZlKGQzLmN1cnZlQ2F0bXVsbFJvbSlcbiAgICAgICAgICAgIC54KGQgPT4gdGhpcy54X2F4aXMoZFt0aGlzLnhfYXhpc19kYXRhX2NvbF0pKVxuICAgICAgICAgICAgLnkoZCA9PiB0aGlzLnlfYXhpcyhkW3RoaXMueV9heGlzX2RhdGFfY29sXSkpO1xuXG4gICAgICAgIHRoaXMubGluZV9jb250YWluZXIgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwicGF0aC1jb250YWluZXJcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xpcC1wYXRoXCIsIFwidXJsKCNjbGlwKVwiKTtcblxuICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmxpbmVfY29udGFpbmVyLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJwYXRoXCIpXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpLmF0dHIoXCJzdHJva2VcIiwgXCJzdGVlbGJsdWVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKGRhdGEpKTtcbiAgICB9XG5cbiAgICBfc2V0Wm9vbUJlaGF2aW9yKCkge1xuXG4gICAgICAgIHRoaXMuem9vbSA9IGQzLnpvb20oKVxuICAgICAgICAgICAgLnNjYWxlRXh0ZW50KFsuNSwgMjBdKVxuICAgICAgICAgICAgLmV4dGVudChbWzAsIDBdLCBbdGhpcy53aWR0aCwgdGhpcy5oZWlnaHRdXSlcbiAgICAgICAgICAgIC5vbihcInpvb21cIiwgdGhpcy5fdXBkYXRlQ2hhcnQpO1xuXG4gICAgICAgIHRoaXMuem9vbV9yZWN0ID0gdGhpcy5zdmcuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJhbGxcIilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0aGlzLm1hcmdpbi5sZWZ0ICsgJywnICsgdGhpcy5tYXJnaW4udG9wICsgJyknKVxuICAgICAgICAgICAgLmNhbGwodGhpcy56b29tKTtcblxuICAgIH1cblxuICAgIF91cGRhdGVDaGFydChlKSB7XG5cbiAgICAgICAgbGV0IHJlc2NhbGVkX3ggPSBlLnRyYW5zZm9ybS5yZXNjYWxlWCh0aGlzLnhfc2NhbGUpO1xuICAgICAgICBsZXQgcmVzY2FsZWRfeSA9IGUudHJhbnNmb3JtLnJlc2NhbGVZKHRoaXMueV9zY2FsZSk7XG5cbiAgICAgICAgdGhpcy54X2F4aXMuY2FsbChkMy5heGlzQm90dG9tKHJlc2NhbGVkX3gpLnRpY2tGb3JtYXQoZDMuZm9ybWF0KEQzR3JhcGguZGVmYXVsdF9heGlzX3RpY2tfZm9ybWF0KSkpXG4gICAgICAgIHRoaXMueV9heGlzLmNhbGwoZDMuYXhpc0xlZnQocmVzY2FsZWRfeSkudGlja0Zvcm1hdChkMy5mb3JtYXQoRDNHcmFwaC5kZWZhdWx0X2F4aXNfdGlja19mb3JtYXQpKSlcblxuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCIudGljay1saW5lXCIpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoXCIjeS1sYWJlbFwiKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwiI3gtbGFiZWxcIikucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcIi5lcnJvci1iYXIteFwiKS5yZW1vdmUoKTtcblxuICAgICAgICB0aGlzLnhfYXhpcy5zZWxlY3RBbGwoXCIudGljayBsaW5lXCIpLmNsb25lKClcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0aWNrLWxpbmVcIilcbiAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgLXRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAwLjIpXG5cbiAgICAgICAgdGhpcy55X2F4aXMuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKS5jbG9uZSgpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidGljay1saW5lXCIpXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDAuMilcblxuICAgICAgICB0aGlzLl9zZXRYQXhpc0xhYmVsKCk7XG4gICAgICAgIHRoaXMuX3NldFlBeGlzTGFiZWwoKTtcblxuICAgICAgICBsZXQgeF9kYXRhX2NvbCA9IHRoaXMueF9heGlzX2RhdGFfY29sO1xuICAgICAgICBsZXQgeV9kYXRhX2NvbCA9IHRoaXMueV9heGlzX2RhdGFfY29sO1xuXG4gICAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEodGhpcy5kYXRhc2V0KVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDE1MClcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIHJlc2NhbGVkX3goZFt4X2RhdGFfY29sXSk7IH0gKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gcmVzY2FsZWRfeShkW3lfZGF0YV9jb2xdKTsgfSApXG5cbiAgICAgICAgaWYodGhpcy5oYXNfbGluZSkge1xuICAgICAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX3NldEF4aXNMaW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmhhc19lcnJvcl9iYXJzKSB7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuZXJyb3JfYmFycy55KSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmVfZXJyb3JfYmFyX3ggPSBkMy5saW5lKClcbiAgICAgICAgICAgICAgICAgICAgLngoZCA9PiByZXNjYWxlZF94KGRbdGhpcy54X2F4aXNfZGF0YV9jb2xdKSlcbiAgICAgICAgICAgICAgICAgICAgLnkoZCA9PiByZXNjYWxlZF95KGQuYm91bmQpKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JfYmFycy55LmZvckVhY2goKGVycm9yX2JhcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QoJyNkYXRhLXBsb3QnKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZXJyb3ItYmFyLXhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwic3RlZWxibHVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAxLjUpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgbGluZV9lcnJvcl9iYXJfeChlcnJvcl9iYXIpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmVycm9yX2JhcnMueCkge1xuICAgICAgICAgICAgICAgIGxldCBsaW5lX2Vycm9yX2Jhcl95ID0gZDMubGluZSgpXG4gICAgICAgICAgICAgICAgICAgIC54KGQgPT4gcmVzY2FsZWRfeChkLmJvdW5kKSlcbiAgICAgICAgICAgICAgICAgICAgLnkoZCA9PiByZXNjYWxlZF95KGRbdGhpcy55X2F4aXNfZGF0YV9jb2xdKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yX2JhcnMueC5mb3JFYWNoKChlcnJvcl9iYXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjZGF0YS1wbG90JykuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImVycm9yLWJhci14XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcInN0ZWVsYmx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMS41KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmVfZXJyb3JfYmFyX3koZXJyb3JfYmFyKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2dldEZ1bGxXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHRcbiAgICB9XG5cbiAgICBfZ2V0RnVsbEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tXG4gICAgfVxufSIsImltcG9ydCB7Q29uZmlndXJhdGlvbkV2ZW50fSBmcm9tIFwiLi4vZXZlbnRzL0NvbmZpZ3VyYXRpb25FdmVudFwiO1xuaW1wb3J0IHtEYXRhUHJvY2Vzc29yQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9EYXRhUHJvY2Vzc29yQ29udGFpbmVyXCI7XG5pbXBvcnQge1Zpc3VhbGl6YXRpb25Db250YWluZXJ9IGZyb20gXCIuLi9jb250YWluZXJzL1Zpc3VhbGl6YXRpb25Db250YWluZXJcIjtcbmltcG9ydCB7V3JhcHBlckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvV3JhcHBlckNvbnRhaW5lclwiO1xuaW1wb3J0IHtTZXR0aW5nc0NvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9zZXR0aW5ncy9TZXR0aW5nc0NvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIEJva2VoV3JhcHBlciB7XG5cbiAgICBzdGF0aWMgY29udGFpbmVyX2lkID0gJ3Zpc3VhbGl6YXRpb24tY29udGFpbmVyJztcblxuICAgIHN0YXRpYyBsaWJyYXJ5ID0gJ2Jva2VoJztcblxuICAgIHN0YXRpYyB0aXRsZSA9IHtcbiAgICAgICAgJ2xpZ2h0LWN1cnZlJzogJ0xpZ2h0IGN1cnZlJyxcbiAgICAgICAgJ3NwZWN0cnVtJzogJ3NwZWN0cnVtJ1xuICAgIH1cblxuICAgIHN0YXRpYyBzcGVjaWZpY19zZXR0aW5ncyA9IHtcbiAgICAgICAgJ2Jva2VoLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICdib2tlaC1vcHRpb25zJzoge1xuICAgICAgICAgICAgICAgIHRvb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IG51bGw7XG5cbiAgICBjb25maWd1cmF0aW9uX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuX3NldHVwTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgX3NldENvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChCb2tlaFdyYXBwZXIuY29udGFpbmVyX2lkKTtcbiAgICB9XG5cbiAgICBfcmVzZXRDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuXG4gICAgX3NldHVwTGlzdGVuZXJzKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZXR0aW5ncy1jaGFuZ2VkJywgdGhpcy5oYW5kbGVTZXR0aW5nc0NoYW5nZWRFdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzdWFsaXphdGlvbi1nZW5lcmF0aW9uJywgdGhpcy5oYW5kbGVWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGhhbmRsZVNldHRpbmdzQ2hhbmdlZEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGxldCBzZXR0aW5nc19vYmplY3QgPSBldmVudC5kZXRhaWwuc2V0dGluZ3Nfb2JqZWN0O1xuXG4gICAgICAgIGxldCBsaWJyYXJ5X3NldHRpbmdzID0gc2V0dGluZ3Nfb2JqZWN0LmdldExpYnJhcnlTZXR0aW5ncygpO1xuXG4gICAgICAgIGlmKGxpYnJhcnlfc2V0dGluZ3MubGlicmFyeSA9PT0gQm9rZWhXcmFwcGVyLmxpYnJhcnkpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29uZmlndXJhdGlvbk9iamVjdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbmZpZ3VyYXRpb25fZXZlbnQgPSBuZXcgQ29uZmlndXJhdGlvbkV2ZW50KHRoaXMuY29uZmlndXJhdGlvbl9vYmplY3QpO1xuXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbl9ldmVudC5kaXNwYXRjaFRvU3Vic2NyaWJlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVZpc3VhbGl6YXRpb25HZW5lcmF0aW9uRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc19vYmplY3QgPSBldmVudC5kZXRhaWwuc2V0dGluZ3Nfb2JqZWN0O1xuXG4gICAgICAgIGxldCBsaWJyYXJ5X3NldHRpbmdzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0TGlicmFyeVNldHRpbmdzKCk7XG5cbiAgICAgICAgaWYobGlicmFyeV9zZXR0aW5ncy5saWJyYXJ5ID09PSBCb2tlaFdyYXBwZXIubGlicmFyeSkge1xuXG4gICAgICAgICAgICB0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YXNldF9zZXR0aW5ncyA9IHt9O1xuXG4gICAgICAgICAgICBsZXQgYXhpcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldEF4aXNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGF4aXNfc2V0dGluZ3MgPSBbXTtcblxuICAgICAgICAgICAgZm9yKGxldCBheGlzX2NvbHVtbiBpbiBheGlzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF4aXNfY29sdW1uX29iamVjdCA9IHRoaXMuX2dldENvbHVtblNldHRpbmdzKGF4aXNbYXhpc19jb2x1bW5dKTtcbiAgICAgICAgICAgICAgICBheGlzX2NvbHVtbl9vYmplY3QgPSB7Li4uYXhpc19jb2x1bW5fb2JqZWN0LCAuLi57YXhpczogYXhpc19jb2x1bW59fVxuXG4gICAgICAgICAgICAgICAgYXhpc19zZXR0aW5ncy5wdXNoKGF4aXNfY29sdW1uX29iamVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGFzZXRfc2V0dGluZ3MuYXhpcyA9IGF4aXNfc2V0dGluZ3M7XG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmRhdGFfdHlwZSA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldERhdGFUeXBlU2V0dGluZ3MoKTtcblxuICAgICAgICAgICAgbGV0IGVycm9yX2JhcnMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRFcnJvckJhcnNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGhhc19lcnJvcl9iYXJzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmKGVycm9yX2JhcnMgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgIGxldCBlcnJvcl9iYXJzX3NldHRpbmdzID0gW107XG4gICAgICAgICAgICAgICAgZm9yKGxldCBheGlzX2NvbHVtbiBpbiBlcnJvcl9iYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBheGlzX2NvbHVtbl9vYmplY3QgPSB0aGlzLl9nZXRDb2x1bW5TZXR0aW5ncyhlcnJvcl9iYXJzW2F4aXNfY29sdW1uXSk7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNfY29sdW1uX29iamVjdCA9IHsuLi5heGlzX2NvbHVtbl9vYmplY3QsIC4uLntheGlzOiBheGlzX2NvbHVtbn19XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFyc19zZXR0aW5ncy5wdXNoKGF4aXNfY29sdW1uX29iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YXNldF9zZXR0aW5ncy5lcnJvcl9iYXJzID0gZXJyb3JfYmFyc19zZXR0aW5ncztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGRwcCA9IERhdGFQcm9jZXNzb3JDb250YWluZXIuZ2V0RGF0YVByb2Nlc3NvckNvbnRhaW5lcigpLmdldERhdGFQcmVQcm9jZXNzb3IoKTtcblxuICAgICAgICAgICAgbGV0IHByb2Nlc3NlZF9kYXRhID0gZHBwLmdldFByb2Nlc3NlZERhdGFzZXQoZGF0YXNldF9zZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIGxldCBkYXRhX3R5cGUgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXREYXRhVHlwZVNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGxldCBzY2FsZXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRTY2FsZXNTZXR0aW5ncygpO1xuXG5cbiAgICAgICAgICAgIGF4aXMgPSB7eDogcHJvY2Vzc2VkX2RhdGEuYXhpc1swXS5jb2x1bW5fbmFtZSwgeTogcHJvY2Vzc2VkX2RhdGEuYXhpc1sxXS5jb2x1bW5fbmFtZX07XG4gICAgICAgICAgICBsZXQgbGFiZWxzID0gYXhpcztcblxuICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEuYXhpc1swXS5kYXRhID0gcHJvY2Vzc2VkX2RhdGEuYXhpc1swXS5kYXRhLm1hcCh2YWx1ZSA9PiBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWUpO1xuICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEuYXhpc1sxXS5kYXRhID0gcHJvY2Vzc2VkX2RhdGEuYXhpc1sxXS5kYXRhLm1hcCh2YWx1ZSA9PiBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWUpO1xuXG5cbiAgICAgICAgICAgIGxldCBkYXRhID0ge3g6IHByb2Nlc3NlZF9kYXRhLmF4aXNbMF0uZGF0YSwgeTogcHJvY2Vzc2VkX2RhdGEuYXhpc1sxXS5kYXRhfTtcblxuICAgICAgICAgICAgaWYoZXJyb3JfYmFycykge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFycyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyc19vYmplY3QgPSB7fTtcblxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2Jhci5kYXRhID0gZXJyb3JfYmFyLmRhdGEubWFwKHZhbHVlID0+ICFpc0Zpbml0ZSh2YWx1ZSkgPyAwIDogdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXIuZGF0YSA9IGVycm9yX2Jhci5kYXRhLm1hcCh2YWx1ZSA9PiBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnNfb2JqZWN0W2Vycm9yX2Jhci5heGlzXSA9IGVycm9yX2Jhci5jb2x1bW5fbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBpZihlcnJvcl9iYXIuYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmR4ID0gZXJyb3JfYmFyLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlcnJvcl9iYXIuYXhpcyA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmR5ID0gZXJyb3JfYmFyLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBlcnJvcl9iYXJzID0ge3g6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uY29sdW1uX25hbWUsIHk6IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMV0uY29sdW1uX25hbWV9O1xuXG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1swXS5kYXRhID0gcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1swXS5kYXRhLm1hcCh2YWx1ZSA9PiAhaXNGaW5pdGUodmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzFdLmRhdGEgPSBwcm9jZXNzZWRfZGF0YS5lcnJvcl9iYXJzWzFdLmRhdGEubWFwKHZhbHVlID0+ICFpc0Zpbml0ZSh2YWx1ZSkgPyAwIDogdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5keCA9IHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnNbMF0uZGF0YS5tYXAodmFsdWUgPT4gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlKTtcbiAgICAgICAgICAgICAgICBkYXRhLmR5ID0gcHJvY2Vzc2VkX2RhdGEuZXJyb3JfYmFyc1sxXS5kYXRhLm1hcCh2YWx1ZSA9PiBpc05hTih2YWx1ZSkgPyAwIDogdmFsdWUpO1xuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBsZXQgYXN5bW1ldHJpY191bmNlcnRhaW50aWVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihkYXRhX3R5cGUgPT09ICdzcGVjdHJ1bScpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bW1ldHJpY191bmNlcnRhaW50aWVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fcHJvY2Vzc0Vycm9yQmFyRGF0YShkYXRhLCBhc3ltbWV0cmljX3VuY2VydGFpbnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgaGFzX2Vycm9yX2JhcnMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcmFuZ2VzID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0UmFuZ2VzU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBjdXN0b21fcmFuZ2VfZGF0YSA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmKHJhbmdlcyAhPSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZihoYXNfZXJyb3JfYmFycykge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2VfZGF0YSA9IGRwcC5wcm9jZXNzRGF0YUZvclJhbmdlQm9rZWgocmFuZ2VzLCBkYXRhLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21fcmFuZ2VfZGF0YSA9IGRwcC5wcm9jZXNzRGF0YUZvclJhbmdlQm9rZWgocmFuZ2VzLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gY3VzdG9tX3JhbmdlX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2aXN1YWxpemF0aW9uID0gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5nZXRCb2tlaFZpc3VhbGl6YXRpb24oKTtcblxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbi5pbml0aWFsaXplU2V0dGluZ3MoZGF0YSwgbGFiZWxzLCBzY2FsZXMsIEJva2VoV3JhcHBlci50aXRsZVsnZGF0YV90eXBlJ10sIGVycm9yX2JhcnMsIHJhbmdlcyk7XG5cbiAgICAgICAgICAgIHZpc3VhbGl6YXRpb24uaW5pdGlhbGl6ZUdyYXBoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uX3NldHRpbmdzKSB7XG4gICAgICAgIGxldCBzZXR0aW5ncyA9IGNvbHVtbl9zZXR0aW5ncy5zcGxpdCgnJCcpO1xuXG4gICAgICAgIGxldCBjb2x1bW5fbG9jYXRpb24gPSBzZXR0aW5nc1swXS5zcGxpdCgnLicpO1xuICAgICAgICBsZXQgY29sdW1uX25hbWUgPSBzZXR0aW5nc1sxXSB8fCAnJztcblxuICAgICAgICBsZXQgZmlsZV9pZCA9IGNvbHVtbl9sb2NhdGlvblswXTtcbiAgICAgICAgbGV0IGhkdV9pbmRleCA9IGNvbHVtbl9sb2NhdGlvbi5sZW5ndGggPiAxID8gY29sdW1uX2xvY2F0aW9uWzFdIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVfaWQ6IGZpbGVfaWQsXG4gICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgIGNvbHVtbl9uYW1lOiBjb2x1bW5fbmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9wcm9jZXNzRXJyb3JCYXJEYXRhKGRhdGEsIGFzeW1ldHJpY191bmNlcnRhaW50aWVzID0gZmFsc2UpIHtcblxuICAgICAgICBsZXQgZGl2X2ZhY3Rvcj0gMjtcblxuICAgICAgICBpZihhc3ltZXRyaWNfdW5jZXJ0YWludGllcykge1xuICAgICAgICAgICAgZGl2X2ZhY3RvciA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZihkYXRhLmR4KSB7XG4gICAgICAgICAgICBsZXQgeF9sb3cgPSBbXTtcbiAgICAgICAgICAgIGxldCB4X3VwID0gW107XG5cbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiBkYXRhLmR4KSB7XG4gICAgICAgICAgICAgICAgeF9sb3dbaV0gPSBkYXRhLnhbaV0gLSBkYXRhLmR4W2ldIC8gZGl2X2ZhY3RvcjtcbiAgICAgICAgICAgICAgICB4X3VwW2ldID0gZGF0YS54W2ldICsgZGF0YS5keFtpXSAvIGRpdl9mYWN0b3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEueF9sb3cgPSB4X2xvdztcbiAgICAgICAgICAgIGRhdGEueF91cCA9IHhfdXA7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmR4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoZGF0YS5keSkge1xuICAgICAgICAgICAgbGV0IHlfbG93ID0gW107XG4gICAgICAgICAgICBsZXQgeV91cCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gZGF0YS5keSkge1xuICAgICAgICAgICAgICAgIHlfbG93W2ldID0gZGF0YS55W2ldIC0gZGF0YS5keVtpXTtcbiAgICAgICAgICAgICAgICB5X3VwW2ldID0gZGF0YS55W2ldICsgZGF0YS5keVtpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YS55X2xvdyA9IHlfbG93O1xuICAgICAgICAgICAgZGF0YS55X3VwID0geV91cDtcblxuICAgICAgICAgICAgZGVsZXRlIGRhdGEuZHk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgIGxldCB5X2xvdyA9IFtdLCB5X3VwID0gW10sIHhfbG93ID0gW10sIHhfdXAgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpIGluIGRhdGEuZHkpIHtcbiAgICAgICAgICAgIHlfbG93W2ldID0gZGF0YS55W2ldIC0gZGF0YS5keVtpXTtcbiAgICAgICAgICAgIHlfdXBbaV0gPSBkYXRhLnlbaV0gKyBkYXRhLmR5W2ldO1xuICAgICAgICAgICAgeF9sb3dbaV0gPSBkYXRhLnhbaV0gLSBkYXRhLmR4W2ldIC8gZGl2X2ZhY3RvcjtcbiAgICAgICAgICAgIHhfdXBbaV0gPSBkYXRhLnhbaV0gKyBkYXRhLmR4W2ldIC8gZGl2X2ZhY3RvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEueV9sb3cgPSB5X2xvdztcbiAgICAgICAgZGF0YS55X3VwID0geV91cDtcbiAgICAgICAgZGF0YS54X2xvdyA9IHhfbG93O1xuICAgICAgICBkYXRhLnhfdXAgPSB4X3VwO1xuXG4gICAgICAgIGRlbGV0ZSBkYXRhLmR5O1xuICAgICAgICBkZWxldGUgZGF0YS5keDtcbiAgICAgICAgKi9cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb25maWd1cmF0aW9uT2JqZWN0KCkge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0ID0gU2V0dGluZ3NDb25maWd1cmF0aW9uLmdldENvbmZpZ3VyYXRpb25PYmplY3QoQm9rZWhXcmFwcGVyLnNwZWNpZmljX3NldHRpbmdzKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NvbmZpZ3VyYXRpb25FdmVudH0gZnJvbSBcIi4uL2V2ZW50cy9Db25maWd1cmF0aW9uRXZlbnRcIjtcbmltcG9ydCB7RGF0YVByb2Nlc3NvckNvbnRhaW5lcn0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRGF0YVByb2Nlc3NvckNvbnRhaW5lclwiO1xuaW1wb3J0IHtWaXN1YWxpemF0aW9uQ29udGFpbmVyfSBmcm9tIFwiLi4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyXCI7XG5pbXBvcnQge1NldHRpbmdzQ29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL3NldHRpbmdzL1NldHRpbmdzQ29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRDNXcmFwcGVyIHtcblxuICAgIHN0YXRpYyBsaWJyYXJ5ID0gXCJkM1wiO1xuICAgIHN0YXRpYyBjb250YWluZXJfaWQgPSBcInZpc3VhbGl6YXRpb24tY29udGFpbmVyXCI7XG5cbiAgICBzdGF0aWMgc3BlY2lmaWNfc2V0dGluZ3MgPSB7XG4gICAgICAgICdkMy1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAnZDMtb3B0aW9ucyc6IHtcbiAgICAgICAgICAgICAgICAnaGFzX2xpbmUnOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyO1xuICAgIGNvbnRhaW5lcl9pZDtcblxuICAgIHNldHRpbmdzX29iamVjdDtcbiAgICBjb25maWd1cmF0aW9uX29iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJfaWQgPSBEM1dyYXBwZXIuY29udGFpbmVyX2lkKSB7XG4gICAgICAgIHRoaXMuX3NldHVwTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJfaWQgPSBjb250YWluZXJfaWQ7XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgIH1cblxuICAgIF9zZXR1cExpc3RlbmVycygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2V0dGluZ3MtY2hhbmdlZCcsIHRoaXMuaGFuZGxlU2V0dGluZ3NDaGFuZ2VkRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc3VhbGl6YXRpb24tZ2VuZXJhdGlvbicsIHRoaXMuaGFuZGxlVmlzdWFsaXphdGlvbkdlbmVyYXRpb25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTZXR0aW5nc0NoYW5nZWRFdmVudChldmVudCkge1xuICAgICAgICBsZXQgc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHNldHRpbmdzX29iamVjdC5nZXRMaWJyYXJ5U2V0dGluZ3MoKTtcblxuICAgICAgICBpZihsaWJyYXJ5X3NldHRpbmdzLmxpYnJhcnkgPT09IEQzV3JhcHBlci5saWJyYXJ5KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKTtcblxuICAgICAgICAgICAgaWYodGhpcy5jb25maWd1cmF0aW9uX29iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjb25maWd1cmF0aW9uX2V2ZW50ID0gbmV3IENvbmZpZ3VyYXRpb25FdmVudCh0aGlzLmNvbmZpZ3VyYXRpb25fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uX2V2ZW50LmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVWaXN1YWxpemF0aW9uR2VuZXJhdGlvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nfb2JqZWN0ID0gZXZlbnQuZGV0YWlsLnNldHRpbmdzX29iamVjdDtcblxuICAgICAgICBsZXQgbGlicmFyeV9zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldExpYnJhcnlTZXR0aW5ncygpO1xuXG4gICAgICAgIGlmKGxpYnJhcnlfc2V0dGluZ3MubGlicmFyeSA9PT0gRDNXcmFwcGVyLmxpYnJhcnkpIHtcblxuICAgICAgICAgICAgdGhpcy5yZXNldENvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YXNldF9zZXR0aW5ncyA9IHt9O1xuXG4gICAgICAgICAgICBsZXQgZGF0YV90eXBlID0gdGhpcy5zZXR0aW5nc19vYmplY3QuZ2V0RGF0YVR5cGVTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGF4aXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRBeGlzU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGxldCBzY2FsZXMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRTY2FsZXNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IGVycm9yX2JhcnMgPSB0aGlzLnNldHRpbmdzX29iamVjdC5nZXRFcnJvckJhcnNTZXR0aW5ncygpO1xuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuc2V0dGluZ3Nfb2JqZWN0LmdldFJhbmdlc1NldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGxldCBoYXNfZXJyb3JfYmFycyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmRhdGFfdHlwZSA9IGRhdGFfdHlwZTtcblxuICAgICAgICAgICAgbGV0IGF4aXNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgYXhpc19jb2x1bW4gaW4gYXhpcykge1xuICAgICAgICAgICAgICAgIGxldCBheGlzX2NvbHVtbl9vYmplY3QgPSB0aGlzLl9nZXRDb2x1bW5TZXR0aW5ncyhheGlzW2F4aXNfY29sdW1uXSk7XG4gICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgIGF4aXNfc2V0dGluZ3MucHVzaChheGlzX2NvbHVtbl9vYmplY3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmF4aXMgPSBheGlzX3NldHRpbmdzO1xuXG4gICAgICAgICAgICBpZihlcnJvcl9iYXJzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGFzX2Vycm9yX2JhcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yX2JhcnNfc2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGF4aXNfY29sdW1uIGluIGVycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNfY29sdW1uX29iamVjdCA9IHRoaXMuX2dldENvbHVtblNldHRpbmdzKGVycm9yX2JhcnNbYXhpc19jb2x1bW5dKTtcbiAgICAgICAgICAgICAgICAgICAgYXhpc19jb2x1bW5fb2JqZWN0ID0gey4uLmF4aXNfY29sdW1uX29iamVjdCwgLi4ue2F4aXM6IGF4aXNfY29sdW1ufX1cblxuICAgICAgICAgICAgICAgICAgICBlcnJvcl9iYXJzX3NldHRpbmdzLnB1c2goYXhpc19jb2x1bW5fb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhc2V0X3NldHRpbmdzLmVycm9yX2JhcnMgPSBlcnJvcl9iYXJzX3NldHRpbmdzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZHBwID0gRGF0YVByb2Nlc3NvckNvbnRhaW5lci5nZXREYXRhUHJvY2Vzc29yQ29udGFpbmVyKCkuZ2V0RGF0YVByZVByb2Nlc3NvcigpO1xuXG4gICAgICAgICAgICBsZXQgcHJvY2Vzc2VkX2RhdGEgPSBkcHAuZ2V0UHJvY2Vzc2VkRGF0YXNldChkYXRhc2V0X3NldHRpbmdzKTtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzZWRfanNvbl9kYXRhID0gZHBwLmRhdGFzZXRUb0pTT05EYXRhKHByb2Nlc3NlZF9kYXRhKTtcblxuICAgICAgICAgICAgYXhpcyA9IHt4OiBwcm9jZXNzZWRfZGF0YS5heGlzWzBdLmNvbHVtbl9uYW1lLCB5OiBwcm9jZXNzZWRfZGF0YS5heGlzWzFdLmNvbHVtbl9uYW1lfTtcblxuICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JfYmFyc19vYmplY3QgPSB7fTtcblxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZF9kYXRhLmVycm9yX2JhcnMuZm9yRWFjaCgoZXJyb3JfYmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2JhcnNfb2JqZWN0W2Vycm9yX2Jhci5heGlzXSA9IGVycm9yX2Jhci5jb2x1bW5fbmFtZTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IGRwcC5wcm9jZXNzRXJyb3JCYXJEYXRhSlNPTihwcm9jZXNzZWRfanNvbl9kYXRhLCBheGlzLCBlcnJvcl9iYXJzX29iamVjdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmFuZ2VzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VzdG9tX3JhbmdlX2RhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYoaGFzX2Vycm9yX2JhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEsIGVycm9yX2JhcnMpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfYmFycyA9IGN1c3RvbV9yYW5nZV9kYXRhLmVycm9yX2JhcnM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX3JhbmdlX2RhdGEgPSBkcHAucHJvY2Vzc0RhdGFGb3JSYW5nZShyYW5nZXMsIHByb2Nlc3NlZF9qc29uX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRfanNvbl9kYXRhID0gY3VzdG9tX3JhbmdlX2RhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2aXN1YWxpemF0aW9uID0gVmlzdWFsaXphdGlvbkNvbnRhaW5lci5nZXREM1Zpc3VhbGl6YXRpb24oKTtcblxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbi5pbml0aWFsaXplU2V0dGluZ3MocHJvY2Vzc2VkX2pzb25fZGF0YSwgYXhpcywgc2NhbGVzLCBlcnJvcl9iYXJzLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uLmluaXRpYWxpemVHcmFwaCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVyX2lkKVxuICAgIH1cblxuICAgIHJlc2V0Q29udGFpbmVyKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbmZpZ3VyYXRpb25PYmplY3QoKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbl9vYmplY3QgPSBTZXR0aW5nc0NvbmZpZ3VyYXRpb24uZ2V0Q29uZmlndXJhdGlvbk9iamVjdChEM1dyYXBwZXIuc3BlY2lmaWNfc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9nZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5fc2V0dGluZ3MpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gY29sdW1uX3NldHRpbmdzLnNwbGl0KCckJyk7XG5cbiAgICAgICAgbGV0IGNvbHVtbl9sb2NhdGlvbiA9IHNldHRpbmdzWzBdLnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IHNldHRpbmdzWzFdIHx8ICcnO1xuXG4gICAgICAgIGxldCBmaWxlX2lkID0gY29sdW1uX2xvY2F0aW9uWzBdO1xuICAgICAgICBsZXQgaGR1X2luZGV4ID0gY29sdW1uX2xvY2F0aW9uLmxlbmd0aCA+IDEgPyBjb2x1bW5fbG9jYXRpb25bMV0gOiAnJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsZV9pZDogZmlsZV9pZCxcbiAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgY29sdW1uX25hbWU6IGNvbHVtbl9uYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG59IiwiaW1wb3J0IHtJbnZhbGlkVVJMRXJyb3J9IGZyb20gXCIuLi9lcnJvcnMvSW52YWxpZFVSTEVycm9yXCI7XG5pbXBvcnQge0hEVU5vdFRhYnVsYXJFcnJvcn0gZnJvbSBcIi4uL2Vycm9ycy9IRFVOb3RUYWJ1bGFyRXJyb3JcIjtcbmltcG9ydCB7RmlsZVJlZ2lzdHJ5fSBmcm9tIFwiLi4vcmVnaXN0cmllcy9GaWxlUmVnaXN0cnlcIjtcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gXCIuLi91dGlscy9TdHJpbmdVdGlsc1wiO1xuaW1wb3J0IHtGaWxlTG9hZGVkRXZlbnR9IGZyb20gXCIuLi9ldmVudHMvRmlsZUxvYWRlZEV2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBGSVRTUmVhZGVyV3JhcHBlciB7XG5cbiAgICBmaWxlX3BhdGggPSBudWxsO1xuICAgIGZpbGUgPSBudWxsO1xuXG4gICAgc3RhdGljIEJJTlRBQkxFID0gJ0JJTlRBQkxFJztcbiAgICBzdGF0aWMgVEFCTEUgPSAnVEFCTEUnO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZV9wYXRoID0gbnVsbCkge1xuICAgICAgICBpZihmaWxlX3BhdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVfcGF0aCk7XG4gICAgICAgICAgICBpZiAoRklUU1JlYWRlcldyYXBwZXIuaXNfcGF0aF92YWxpZChmaWxlX3BhdGgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlX3BhdGggPSBmaWxlX3BhdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0RmlsZSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkVVJMRXJyb3IoXCJJbnZhbGlkIGZpbGUgcGF0aCA6IFwiICsgZmlsZV9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRpYWxpemVGcm9tUGF0aChmaWxlX3BhdGgpIHtcbiAgICAgICAgaWYoRklUU1JlYWRlcldyYXBwZXIuaXNfcGF0aF92YWxpZChmaWxlX3BhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVfcGF0aCA9IGZpbGVfcGF0aDtcbiAgICAgICAgICAgIHRoaXMuX2dldEZpbGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRVUkxFcnJvcihcIkludmFsaWQgZmlsZSBwYXRoIDogXCIgKyBmaWxlX3BhdGgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpbml0aWFsaXplRnJvbUJ1ZmZlcihhcnJheV9idWZmZXIsIGZpbGVfbmFtZSkge1xuICAgICAgICB0aGlzLmZpbGVfcGF0aCA9IGZpbGVfbmFtZTtcbiAgICAgICAgdGhpcy5fcmVhZEZpbGUoYXJyYXlfYnVmZmVyKTtcbiAgICB9XG5cbiAgICBfZ2V0RmlsZSgpIHtcblxuICAgICAgICByZXR1cm4gZmV0Y2godGhpcy5maWxlX3BhdGgpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciwgc3RhdHVzID0gJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChidWZmZXIpID0+IHRoaXMuX3JlYWRGaWxlKGJ1ZmZlcikpO1xuICAgIH1cblxuICAgIF9yZWFkRmlsZShhcnJheUJ1ZmZlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5maWxlID0gd2luZG93LkZJVFNSZWFkZXIucGFyc2VGSVRTKGFycmF5QnVmZmVyKTtcblxuICAgICAgICAgICAgdGhpcy5zZW5kRklUU0xvYWRlZEV2ZW50cygpO1xuXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbml0aWFsaXppbmcgaW50ZXJmYWNlXCIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGaWxlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZV9wYXRoO1xuICAgIH1cblxuICAgIHNldEZpbGUoZmlsZSkge1xuICAgICAgICB0aGlzLmZpbGUgPSBmaWxlO1xuICAgIH1cblxuICAgIHNldEZpbGVGcm9tRmlsZU9iamVjdChmaWxlX29iamVjdCkge1xuICAgICAgICB0aGlzLmZpbGUgPSBmaWxlX29iamVjdC5maWxlO1xuICAgICAgICB0aGlzLmFyZl9maWxlID0gZmlsZV9vYmplY3QuYXJmX2ZpbGVfaWQ7XG4gICAgICAgIHRoaXMucm1mX2ZpbGUgPSBmaWxlX29iamVjdC5ybWZfZmlsZV9pZDtcbiAgICB9XG5cbiAgICBnZXRIRFUoaGR1X2luZGV4KSB7XG4gICAgICAgIGlmKGhkdV9pbmRleCA+PSAwICYmIGhkdV9pbmRleCA8IHRoaXMuZmlsZS5oZHVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZS5oZHVzW2hkdV9pbmRleF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEhEVXMoKSB7XG5cbiAgICAgICAgbGV0IEhEVXMgPSBbXTtcbiAgICAgICAgbGV0IGhkdV9vYmplY3Q7XG4gICAgICAgIGxldCB0eXBlO1xuICAgICAgICBsZXQgZXh0bmFtZSA9ICcnO1xuXG4gICAgICAgIHRoaXMuZmlsZS5oZHVzLmZvckVhY2goZnVuY3Rpb24oaGR1LCBpbmRleCkge1xuXG4gICAgICAgICAgICBpZiAoaGR1LmhlYWRlci5wcmltYXJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IFwiUFJJTUFSWVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG4gICAgICAgICAgICAgICAgZXh0bmFtZSA9IGhkdS5oZWFkZXIuZ2V0KCdFWFROQU1FJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhkdV9vYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IHR5cGUsXG4gICAgICAgICAgICAgICAgXCJpbmRleFwiOiBpbmRleCxcbiAgICAgICAgICAgICAgICBcImV4dG5hbWVcIjogZXh0bmFtZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgSERVcy5wdXNoKGhkdV9vYmplY3QpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBIRFVzO1xuICAgIH1cblxuICAgIGdldFRhYnVsYXJIRFVzKCkge1xuICAgICAgICBsZXQgdGFidWxhcl9oZHVzX2luZGV4ID0gW107XG5cbiAgICAgICAgdGhpcy5maWxlLmhkdXMuZm9yRWFjaChmdW5jdGlvbihoZHUsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaGR1LmhlYWRlci5wcmltYXJ5ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYoaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJykgPT09IFwiVEFCTEVcIiB8fCBoZHUuaGVhZGVyLmdldCgnWFRFTlNJT04nKSA9PT0gXCJCSU5UQUJMRVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYnVsYXJfaGR1c19pbmRleC5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHRhYnVsYXJfaGR1c19pbmRleDtcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkNvbHVtbkZyb21IRFUoaGR1X2luZGV4KSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG4gICAgICAgIGxldCBkYXRhID0gaGR1LmRhdGE7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuXG4gICAgICAgIGxldCBjb2x1bW5fbnVtYmVyID0gbnVsbDtcblxuICAgICAgICBpZih0eXBlID09PSBGSVRTUmVhZGVyV3JhcHBlci5CSU5UQUJMRSB8fCB0eXBlID09PSBGSVRTUmVhZGVyV3JhcHBlci5UQUJMRSkge1xuICAgICAgICAgICAgY29sdW1uX251bWJlciA9IGRhdGEuY29scztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIRFVOb3RUYWJ1bGFyRXJyb3IoXCJTZWxlY3RlZCBIRFUgaXMgbm90IHRhYnVsYXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sdW1uX251bWJlcjtcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5zTmFtZUZyb21IRFUoaGR1X2luZGV4KSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG4gICAgICAgIGxldCBkYXRhID0gaGR1LmRhdGE7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZHUuaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuICAgICAgICBsZXQgY29sdW1uX25hbWU7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGRhdGEuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZSA9IGNvbHVtbjtcblxuICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW5fbmFtZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEhEVU5vdFRhYnVsYXJFcnJvcihcIlNlbGVjdGVkIEhEVSBpcyBub3QgdGFidWxhclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgIH1cblxuICAgIGdldENvbHVtbnNKU09ORGF0YUZyb21IRFUoaGR1X2luZGV4KSB7XG5cbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcblxuICAgICAgICBsZXQgaGVhZGVyID0gaGR1LmhlYWRlcjtcbiAgICAgICAgbGV0IGRhdGEgPSBoZHUuZGF0YTtcblxuICAgICAgICBsZXQgdHlwZSA9IGhkdS5oZWFkZXIuZ2V0KCdYVEVOU0lPTicpO1xuXG4gICAgICAgIGxldCBjb2x1bW5zX2RhdGFfanNvbiA9IFtdO1xuICAgICAgICBsZXQgcmF3X2NvbHVtbnNfZGF0YV9hcnJheSA9IFtdO1xuICAgICAgICBsZXQgY29sdW1uX2RhdGE7XG5cbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcbiAgICAgICAgICAgIGRhdGEuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbikge1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5nZXRDb2x1bW4oY29sdW1uLCBmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZGF0YSA9IGNvbDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJhd19jb2x1bW5zX2RhdGFfYXJyYXlbY29sdW1uXSA9IGNvbHVtbl9kYXRhO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgbGV0IGNvbHVtbl9uYW1lcyA9IE9iamVjdC5rZXlzKHJhd19jb2x1bW5zX2RhdGFfYXJyYXkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd19jb2x1bW5zX2RhdGFfYXJyYXlbY29sdW1uX25hbWVzWzBdXS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbl9qc29uX2RhdGFfb2JqZWN0ID0ge307XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZXMuZm9yRWFjaCgoY29sdW1uX25hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX2pzb25fZGF0YV9vYmplY3RbY29sdW1uX25hbWVdID0gcmF3X2NvbHVtbnNfZGF0YV9hcnJheVtjb2x1bW5fbmFtZV1baV07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5zX2RhdGFfanNvbi5wdXNoKGNvbHVtbl9qc29uX2RhdGFfb2JqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEhEVU5vdFRhYnVsYXJFcnJvcihcIlNlbGVjdGVkIEhEVSBpcyBub3QgdGFidWxhclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5zX2RhdGFfanNvbjtcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5EYXRhRnJvbUhEVShoZHVfaW5kZXgsIGNvbHVtbl9uYW1lKSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG4gICAgICAgIGxldCBkYXRhID0gaGR1LmRhdGE7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBoZHUuaGVhZGVyLmdldCgnWFRFTlNJT04nKTtcblxuICAgICAgICBsZXQgY29sX2RhdGEgPSBbXTtcbiAgICAgICAgaWYodHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuQklOVEFCTEUgfHwgdHlwZSA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEUpIHtcblxuICAgICAgICAgICAgZGF0YS5nZXRDb2x1bW4oY29sdW1uX25hbWUsIGZ1bmN0aW9uKGNvbCl7XG4gICAgICAgICAgICAgICAgaWYoY29sWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlYWRlcl9jb2xfZGF0YSA9IGhkdS5oZWFkZXIuZ2V0KGNvbHVtbl9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29sID0gY29sLm1hcCgoKSA9PiBoZWFkZXJfY29sX2RhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbF9kYXRhID0gY29sO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEhEVU5vdFRhYnVsYXJFcnJvcihcIlNlbGVjdGVkIEhEVSBpcyBub3QgdGFidWxhclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xfZGF0YTtcbiAgICB9XG5cbiAgICBnZXRIZWFkZXJGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuICAgICAgICBsZXQgaGVhZGVyID0gaGR1LmhlYWRlcjtcblxuICAgICAgICByZXR1cm4gaGVhZGVyO1xuICAgIH1cblxuICAgIGdldERhdGFGcm9tSERVKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuICAgICAgICBsZXQgZGF0YSA9IGhkdS5kYXRhO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGdldEhlYWRlckNhcmRWYWx1ZUJ5TmFtZUZyb21IRFUoaGR1X2luZGV4LCBjYXJkX25hbWUpIHtcbiAgICAgICAgbGV0IGhkdSA9IHRoaXMuZmlsZS5nZXRIRFUoaGR1X2luZGV4KTtcbiAgICAgICAgbGV0IGhlYWRlciA9IGhkdS5oZWFkZXI7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gaGVhZGVyLmdldChjYXJkX25hbWUpO1xuXG4gICAgICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0SGVhZGVyQ2FyZHNWYWx1ZUZyb21IRFUoaGR1X2luZGV4KSB7XG4gICAgICAgIGxldCBoZHUgPSB0aGlzLmZpbGUuZ2V0SERVKGhkdV9pbmRleCk7XG5cbiAgICAgICAgY29uc3QgY2FyZHNfYXJyYXkgPSBbXTtcblxuICAgICAgICBPYmplY3QuZW50cmllcyhoZHUuaGVhZGVyLmNhcmRzKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBpdGVtX3ZhbHVlX2FycmF5ID0gaXRlbVsxXTtcblxuICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW1fdmFsdWVfYXJyYXkgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW1fdmFsdWVfYXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgaXRlbV92YWx1ZV9hcnJheVsnY2FyZF9uYW1lJ10gPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGNhcmRzX2FycmF5LnB1c2goaXRlbV92YWx1ZV9hcnJheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHNvcnRlZF9oZHVfY2FyZHMgPSBjYXJkc19hcnJheS5zb3J0KChhLCBiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgICAgICAgcmV0dXJuIHNvcnRlZF9oZHVfY2FyZHM7XG4gICAgfVxuXG4gICAgaXNIRFVUYWJ1bGFyKGhkdV9pbmRleCkge1xuICAgICAgICBsZXQgaGR1ID0gdGhpcy5maWxlLmdldEhEVShoZHVfaW5kZXgpO1xuICAgICAgICBsZXQgaGVhZGVyID0gaGR1LmhlYWRlcjtcblxuICAgICAgICBsZXQgdHlwZSA9IGhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG5cbiAgICAgICAgbGV0IGlzX3RhYnVsYXIgPSBmYWxzZTtcblxuICAgICAgICBpZih0eXBlID09PSBGSVRTUmVhZGVyV3JhcHBlci5CSU5UQUJMRSB8fCB0eXBlID09PSBGSVRTUmVhZGVyV3JhcHBlci5UQUJMRSkge1xuICAgICAgICAgICAgaXNfdGFidWxhciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfdGFidWxhcjtcbiAgICB9XG5cbiAgICBfaXNIRFVUYWJ1bGFyKGhkdSkge1xuICAgICAgICBsZXQgZXh0ZW5zaW9uID0gaGR1LmhlYWRlci5nZXQoJ1hURU5TSU9OJyk7XG4gICAgICAgIHJldHVybiBleHRlbnNpb24gPT09IEZJVFNSZWFkZXJXcmFwcGVyLkJJTlRBQkxFIHx8IGV4dGVuc2lvbiA9PT0gRklUU1JlYWRlcldyYXBwZXIuVEFCTEU7XG4gICAgfVxuXG4gICAgZ2V0QWxsQ29sdW1ucygpIHtcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBbXTtcblxuICAgICAgICB0aGlzLmZpbGUuaGR1cy5mb3JFYWNoKChoZHUsIGluZGV4KSA9PiB7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuX2lzSERVVGFidWxhcihoZHUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IHRoaXMuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGNvbHVtbnNfbmFtZS5mb3JFYWNoKChjb2x1bW5fbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY29sdW1uX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNfZnJvbV9oZWFkZXI6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYoaGR1LmhlYWRlci5nZXQoJ1RJTUVERUwnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1RJTUVERUwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihoZHUuaGVhZGVyLmdldCgnQU5DUkZJTEUnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5jcmZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5TmFtZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZ1V0aWxzLmNsZWFuRmlsZU5hbWUoaGR1LmhlYWRlci5nZXQoJ0FOQ1JGSUxFJykpXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoYW5jcmZpbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZydyA9IG5ldyBGSVRTUmVhZGVyV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUoYW5jcmZpbGUuZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0aGlzLmFyZl9maWxlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY3JmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKHRoaXMuYXJmX2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGFuY3JmaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcncgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZydy5zZXRGaWxlKGFuY3JmaWxlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihoZHUuaGVhZGVyLmdldCgnUkVTUEZJTEUnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcGZpbGUgPSBGaWxlUmVnaXN0cnkuZ2V0RmlsZUJ5TmFtZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZ1V0aWxzLmNsZWFuRmlsZU5hbWUoaGR1LmhlYWRlci5nZXQoJ1JFU1BGSUxFJykpXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcGZpbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZydyA9IG5ldyBGSVRTUmVhZGVyV3JhcHBlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcncuc2V0RmlsZShyZXNwZmlsZS5maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhkdXNfaW5kZXggPSBmcncuZ2V0VGFidWxhckhEVXMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc19lX21pbl9tYXggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhkdXNfaW5kZXguZm9yRWFjaCgoaGR1X2luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbnNfbmFtZSA9IGZydy5nZXRDb2x1bW5zTmFtZUZyb21IRFUoaGR1X2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uc19uYW1lLmluY2x1ZGVzKFwiRV9NSU5cIikgJiYgY29sdW1uc19uYW1lLmluY2x1ZGVzKFwiRV9NQVhcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzX2VfbWluX21heCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlX21pbl9tYXhfaGR1c19pbmRleCA9IGhkdV9pbmRleDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0VfSEFMRl9XSURUSCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Byb2Nlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZmlsZTogcmVzcGZpbGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX01JRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZHVfaW5kZXg6IGhkdV9pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2Zyb21faGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Byb2Nlc3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21fZmlsZTogcmVzcGZpbGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX01JRF9MT0cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHRoaXMucm1mX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BmaWxlID0gRmlsZVJlZ2lzdHJ5LmdldEZpbGVCeUlkKHRoaXMucm1mX2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BmaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcncgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnJ3LnNldEZpbGUocmVzcGZpbGUuZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoZHVzX2luZGV4ID0gZnJ3LmdldFRhYnVsYXJIRFVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNfZV9taW5fbWF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZHVzX2luZGV4LmZvckVhY2goKGhkdV9pbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2x1bW5zX25hbWUgPSBmcncuZ2V0Q29sdW1uc05hbWVGcm9tSERVKGhkdV9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbnNfbmFtZS5pbmNsdWRlcyhcIkVfTUlOXCIpICYmIGNvbHVtbnNfbmFtZS5pbmNsdWRlcyhcIkVfTUFYXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc19lX21pbl9tYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZV9taW5fbWF4X2hkdXNfaW5kZXggPSBoZHVfaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdFX0hBTEZfV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRV9NSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGR1X2luZGV4OiBoZHVfaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19mcm9tX2hlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19wcm9jZXNzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tX2ZpbGU6IHJlc3BmaWxlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRV9NSURfTE9HJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhkdV9pbmRleDogaGR1X2luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZnJvbV9oZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbV9maWxlOiByZXNwZmlsZS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbnM7XG4gICAgfVxuXG4gICAgc2VuZEZJVFNMb2FkZWRFdmVudHMoKSB7XG4gICAgICAgIGxldCBmaWxlbGUgPSBuZXcgRmlsZUxvYWRlZEV2ZW50KHtcbiAgICAgICAgICAgIGZpbGVfbmFtZTogdGhpcy5maWxlX3BhdGgsXG4gICAgICAgICAgICB0eXBlOiAnZml0cycsXG4gICAgICAgICAgICBmaWxlOiB0aGlzLmZpbGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZWxlLmRpc3BhdGNoVG9TdWJzY3JpYmVycygpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc19wYXRoX3ZhbGlkKHBhdGgpIHtcbiAgICAgICAgbGV0IGlzX3ZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgaWYoRklUU1JlYWRlcldyYXBwZXIuX2lzUGF0aFZhbGlkKHBhdGgpIHx8IEZJVFNSZWFkZXJXcmFwcGVyLl9pc1VSTFZhbGlkKHBhdGgpKSB7XG4gICAgICAgICAgICBpc192YWxpZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNfdmFsaWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9pc1VSTFZhbGlkKHVybCkge1xuICAgICAgICBjb25zdCB1cmxSZWdleCA9IC9eKGZ0cHxodHRwfGh0dHBzKTpcXC9cXC9bXiBcIl0rJC87XG4gICAgICAgIHJldHVybiB1cmxSZWdleC50ZXN0KHVybCk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9pc1BhdGhWYWxpZChwYXRoKSB7XG4gICAgICAgIGNvbnN0IHBhdGhSZWdleCA9IC9eKFxcL1thLXpBLVowLTkuXy1dKykrXFwvPyQvO1xuICAgICAgICByZXR1cm4gcGF0aFJlZ2V4LnRlc3QocGF0aCk7XG4gICAgfVxuXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBGSVRTUmVhZGVyV3JhcHBlciB9IGZyb20gJy4vd3JhcHBlcnMvRklUU1JlYWRlcldyYXBwZXIuanMnXG5pbXBvcnQgeyBCb2tlaFdyYXBwZXIgfSBmcm9tICcuL3dyYXBwZXJzL0Jva2VoV3JhcHBlci5qcydcbmltcG9ydCB7IEQzV3JhcHBlciB9IGZyb20gJy4vd3JhcHBlcnMvRDNXcmFwcGVyLmpzJ1xuaW1wb3J0IHsgV3JhcHBlckNvbnRhaW5lciB9IGZyb20gJy4vY29udGFpbmVycy9XcmFwcGVyQ29udGFpbmVyLmpzJ1xuaW1wb3J0IHsgVmlzdWFsaXphdGlvbkNvbnRhaW5lciB9IGZyb20gJy4vY29udGFpbmVycy9WaXN1YWxpemF0aW9uQ29udGFpbmVyLmpzJ1xuaW1wb3J0IHsgRmlsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9GaWxlQ29tcG9uZW50LmpzJ1xuaW1wb3J0IHsgU2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvU2V0dGluZ3NDb21wb25lbnQuanMnXG5pbXBvcnQgeyBWaXN1YWxpemF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL1Zpc3VhbGl6YXRpb25Db21wb25lbnQuanMnXG5pbXBvcnQgeyBGSVRTU2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZmlsZV90eXBlL0ZJVFNTZXR0aW5nc0NvbXBvbmVudC5qcydcbmltcG9ydCB7IENTVlNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ZpbGVfdHlwZS9DU1ZTZXR0aW5nc0NvbXBvbmVudC5qcydcbmltcG9ydCB7IEQzR3JhcGggfSBmcm9tIFwiLi92aXN1YWxpemF0aW9ucy9EM0dyYXBoXCI7XG5pbXBvcnQgeyBCb2tlaEdyYXBoIH0gZnJvbSBcIi4vdmlzdWFsaXphdGlvbnMvQm9rZWhHcmFwaFwiO1xuaW1wb3J0IHtGaWxlUmVnaXN0cnl9IGZyb20gXCIuL3JlZ2lzdHJpZXMvRmlsZVJlZ2lzdHJ5XCI7XG5pbXBvcnQge1JlZ2lzdHJ5Q29udGFpbmVyfSBmcm9tIFwiLi9jb250YWluZXJzL1JlZ2lzdHJ5Q29udGFpbmVyXCI7XG5pbXBvcnQge0FyaXRobWV0aWNDb2x1bW5JbnB1dH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbnB1dHMvQXJpdGhtZXRpY0NvbHVtbklucHV0XCI7XG5cbmxldCBmaWxlX3BhdGggPSB3aW5kb3cubG9jYXRpb24uaHJlZiArIFwiX3Rlc3RfZmlsZXMvc3BpYWNzX2xjX3F1ZXJ5LmZpdHNcIjtcblxubGV0IGZpdHNfcmVhZGVyX3dyYXBwZXIgPSBuZXcgRklUU1JlYWRlcldyYXBwZXIoZmlsZV9wYXRoKTtcblxubGV0IGJva2VoX3dyYXBwZXIgPSBuZXcgQm9rZWhXcmFwcGVyKCk7XG5cbmxldCBkM193cmFwcGVyID0gbmV3IEQzV3JhcHBlcigpO1xuXG5XcmFwcGVyQ29udGFpbmVyLnNldEZJVFNSZWFkZXJXcmFwcGVyKGZpdHNfcmVhZGVyX3dyYXBwZXIpO1xuV3JhcHBlckNvbnRhaW5lci5zZXRCb2tlaFdyYXBwZXIoYm9rZWhfd3JhcHBlcik7XG5XcmFwcGVyQ29udGFpbmVyLnNldEQzV3JhcHBlcihkM193cmFwcGVyKTtcblxuVmlzdWFsaXphdGlvbkNvbnRhaW5lci5zZXRCb2tlaFZpc3VhbGl6YXRpb24obmV3IEJva2VoR3JhcGgoKSk7XG5WaXN1YWxpemF0aW9uQ29udGFpbmVyLnNldEQzVmlzdWFsaXphdGlvbihuZXcgRDNHcmFwaCgpKTtcblxuUmVnaXN0cnlDb250YWluZXIuc2V0RmlsZVJlZ2lzdHJ5KG5ldyBGaWxlUmVnaXN0cnkoKSk7XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZmlsZS1jb21wb25lbnQnLCBGaWxlQ29tcG9uZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc2V0dGluZ3MtY29tcG9uZW50JywgU2V0dGluZ3NDb21wb25lbnQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd2aXN1YWxpemF0aW9uLWNvbXBvbmVudCcsIFZpc3VhbGl6YXRpb25Db21wb25lbnQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdmaXRzLWNvbXBvbmVudCcsIEZJVFNTZXR0aW5nc0NvbXBvbmVudCk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2Nzdi1jb21wb25lbnQnLCBDU1ZTZXR0aW5nc0NvbXBvbmVudCk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2FyaXRobWV0aWMtY29sdW1uLWNvbXBvbmVudCcsIEFyaXRobWV0aWNDb2x1bW5JbnB1dCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=