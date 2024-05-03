class FileComponent extends HTMLElement {

    container_id;
    container

    static component_id = "file_component";
    static select_file = "select-file";
    static input_file_url = "file-input-url";
    static input_file_local = "file-input-local";
    static input_file_type = "select-file-type";
    static load_button = "load-file";

    static available_files_list_id = 'available-files-list';
    static current_files_list_id = 'current-files-list';

    static save_button_id = 'save-file-settings';
    static add_button_id = 'add-to-plot'
    static remove_button_id = 'remove-from-plot'

    fits_reader_wrapper = null;

    constructor(container_id) {
        super();
        this.container_id = container_id;
        this._setContainer();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleSelectChangeEvent = this.handleSelectChangeEvent.bind(this);
        this.handleLoadFileEvent = this.handleLoadFileEvent.bind(this);
        this.handleFileLoadedEvent = this.handleFileLoadedEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
        this.addEventListener('file-loaded', this.handleFileLoadedEvent)
    }

    _setupInnerListeners() {
        this.addEventListener('select-change', this.handleSelectChangeEvent);
        this.addEventListener('load-file', this.handleLoadFileEvent);
    }

    _setupInnerElementsListeners() {
        this._setSelectListener();
        this._setLoadFileURLButtonListener();
        this._setLoadLocalFileButtonListener();
        this._setFilesListsListeners();
        this._setFileSettingsButtonsListeners();
    }

    _setSelectListener() {
        const select_element = document.getElementById(FileComponent.select_file);

        select_element.addEventListener('change-file', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('select-change', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    file: select_element.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });

    }

    _setLoadFileURLButtonListener() {
        const button_element = document.getElementById(FileComponent.load_button);
        const input_element = document.getElementById(FileComponent.input_file_url);

        console.log('load button');
        console.log(input_element.value);

        button_element.addEventListener('click', (event) => {
            event.preventDefault();
            const custom_change_event = new CustomEvent('load-file', {
                bubbles: false,
                compose: false,
                cancelable: true,
                detail: {
                    file_url: input_element.value
                }
            });

            this.dispatchEvent(custom_change_event);
        });

    }

    _setLoadLocalFileButtonListener() {
        let file_input = document.getElementById(FileComponent.input_file_local);
        let type_input = document.getElementById(FileComponent.input_file_type);

        let file_type = type_input.value;

        console.log("file");
        console.log(file_type);

        file_input.addEventListener('change', function(event) {
            let file = event.target.files[0];

            console.log("FILE INFO");
            console.log(file);

            console.log(type_input);
            console.log(file_type);

            if(file_type === 'fits') {
                file.arrayBuffer().then(arrayBuffer => {
                    console.log(arrayBuffer);

                    let fits_reader_wrapper = WrapperContainer.getFITSReaderWrapper();

                    fits_reader_wrapper.initializeFromBuffer(arrayBuffer, file.name);

                }).catch(error => {
                    console.error('Error reading file as ArrayBuffer:', error);
                });
            } else if(file_type === 'csv') {
                let reader = new FileReader();
                reader.onload = function(event) {
                    let csv_file = event.target.result;
                    console.log(csv_file);
                };
            }

        });

    }

    _setFilesListsListeners() {
        let list = document.getElementById(FileComponent.available_files_list_id);

        let buttons = list.querySelectorAll("button");

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                console.log(button);
                console.log(button.textContent);

                button.classList.toggle("active");

                let aria_current = button.getAttribute("aria-current");
                if (aria_current && aria_current === "true") {
                    button.removeAttribute("aria-current");
                } else {
                    button.setAttribute("aria-current", "true");

                    console.log("Listener file id");
                    console.log(button.getAttribute("data-id"));

                    let file = FileRegistry.getFileById(button.getAttribute("data-id"));
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

            let file = FileRegistry.getFileById(file_id);

            FileRegistry.addToCurrentFiles(file);

            this.updateCurrentFilesList();
            this.updateAvailableFilesList();

            console.log(FileRegistry.current_files);

            let frce = new FileRegistryChangeEvent();
            frce.dispatchToSubscribers();
        });
    }

    handleFITSLoadedEvent(event) {
        console.log(event);
        console.log(event.detail['fits_reader_wrapper']);

        this.fits_reader_wrapper = event.detail['fits_reader_wrapper'];

        let file_path = this.fits_reader_wrapper.getFilePath();

        this._addFileToSelect(file_path);
    }

    handleFileLoadedEvent(event) {
        console.log("File loaded");
        console.log(event);

        console.log(event.detail);

        FileRegistry.addToAvailableFiles(event.detail);
        console.log(FileRegistry.getAvailableFilesList());

        this.updateAvailableFilesList();
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
        console.log(file_elements);

        file_elements.forEach((file_element) => {
            available_files_list_element.appendChild(file_element);
        })

        this._setFilesListsListeners();
    }

    updateCurrentFilesList() {
        let current_files_list_element = document.getElementById(FileComponent.current_files_list_id);

        current_files_list_element.innerHTML = '';

        let file_elements = this._createFileSelection('current');
        console.log(file_elements);

        file_elements.forEach((file_element) => {
            current_files_list_element.appendChild(file_element);
        })

        //this._setFilesListsListeners();
    }

    setFileSettingsPanel(file) {
        console.log(file);
        let save_button = document.getElementById(FileComponent.save_button_id);
        let add_button = document.getElementById(FileComponent.add_button_id);
        let remove_button = document.getElementById(FileComponent.remove_button_id);

        let select_hdu = document.getElementById('select-hdu-file');
        select_hdu.innerHTML = '';

        save_button.setAttribute("data-id", file.id);
        add_button.setAttribute("data-id", file.id);
        remove_button.setAttribute("data-id", file.id);

        let frw = WrapperContainer.getFITSReaderWrapper();
        frw.setFile(file.file);

        let hdus = frw.getHDUs();
        console.log(hdus);

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

    _addFileToSelect(file) {
        let file_option = this._createSelectOption(file);

        let select = document.getElementById(FileComponent.select_file);

        select.add(file_option);
    }

    _createFileSelection(list = 'available') {

        let files;

        if(list === 'available') {
            files = FileRegistry.getAvailableFilesList();
        } else {
            files = FileRegistry.getCurrentFilesList();
        }

        let selection_elements = [];

        let file_selection;
        files.forEach((available_file) => {
            console.log(available_file);

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