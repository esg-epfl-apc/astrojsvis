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

        this.settings_object = SettingsContainer.getSettingsContainer().getVisualizationSettingsObject();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleConfigurationEvent = this.handleConfigurationEvent.bind(this);

        this.handleLibraryChangeEvent = this.handleLibraryChangeEvent.bind(this);
        this.handleDataTypeChangeEvent = this.handleDataTypeChangeEvent.bind(this);
        this.handleHDUsChangeEvent = this.handleHDUsChangeEvent.bind(this);
        this.handleGenerateEvent = this.handleGenerateEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
        this.addEventListener('configuration', this.handleConfigurationEvent);
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

        console.log(configuration_object);

        this.updateSettings(configuration_object);
    }

    handleLibraryChangeEvent(event) {
        event.stopPropagation();

        this.updateSettingsObject();

        let settings_changed_event = new SettingsChangedEvent(this.settings_object);
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

        let visualization_generation_event = new VisualizationGenerationEvent(this.settings_object);
        visualization_generation_event.dispatch();

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

            console.log(setting);
            console.log(values);

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

        console.log(values);

        let library = {};
        library.library = values['select-library'].value;
        this.settings_object.setLibrarySettings(library);

        console.log(library)

        let hdu = {};
        hdu['hdu_index'] = values['select-hdus'].value;
        this.settings_object.setHDUsSettings(hdu);

        console.log(hdu);

        let data_type = {};

        data_type.type = values['select-data-type'].value;
        this.settings_object.setDataTypeSettings(data_type);

        console.log(data_type)

        if(values['select-axis-x'] && values['select-axis-y']) {
            let axis = {};
            let scales = {};

            axis.x = values['select-axis-x'].value;
            axis.y = values['select-axis-y'].value;

            console.log(axis)

            scales.x = values['select-axis-x-scale'].value;
            scales.y = values['select-axis-y-scale'].value;

            console.log(scales);

            this.settings_object.setAxisSettings(axis);
            this.settings_object.setScalesSettings(scales);
        }

        if(values['has-error-bars-checkbox']) {
            if(values['has-error-bars-checkbox'].checked === true) {
                let error_bars = {};

                error_bars.x = values['select-axis-x-error-bar'].value;
                error_bars.y = values['select-axis-y-error-bar'].value;

                console.log(error_bars);

                this.settings_object.setErrorBarsSettings(error_bars);
            }
        }

        console.log(this.settings_object);

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

            console.log("Checkbox");

            let id = checkbox.id;
            let classes = checkbox.className.split(' ');
            let checked = checkbox.checked;

            console.log(id);
            console.log(checked);

            form_values[id] = { classes, checked };
        });

        return form_values;
    }

}