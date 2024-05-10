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
        console.log(FileRegistry.file_counter);
        let file = { ...file_to_add,
            id: FileRegistry.file_counter,
            file_name: StringUtils.cleanFileName(file_to_add.file_name)
        };

        FileRegistry.available_files.push(file);

        FileRegistry.file_counter++;
        console.log(FileRegistry.file_counter);
        console.log(file);
    }

    static moveToAvailableFiles(file) {
        console.log("AVAILABLE");
        console.log(file);
        FileRegistry.available_files.push(file);
    }

    static removeFromAvailableFiles(file_id) {
        console.log("Remove");
        console.log(file_id);
        FileRegistry.available_files = FileRegistry.available_files.filter(file => file.id !== parseInt(file_id));
        console.log(FileRegistry.available_files);
    }

    static addToCurrentFiles(file) {

        console.log(file);

        FileRegistry.current_files.push(file);
        FileRegistry.removeFromAvailableFiles(file.id);

        console.log("CURRENT LIST");
        console.log(FileRegistry.current_files);
        console.log(FileRegistry.available_files);
    }

    static removeFromCurrentFiles(file_id) {
        //let temp_deep_list = JSON.parse(JSON.stringify(FileRegistry.current_files));
        let file = FileRegistry.current_files.find(file => file.id === parseInt(file_id));
        console.log("CURRENT");
        console.log(file_id);
        console.log(FileRegistry.current_files);
        console.log(file);
        FileRegistry.current_files = FileRegistry.current_files.filter(file => file.id !== parseInt(file_id));

        FileRegistry.moveToAvailableFiles(file);
    }

    static getFileById(file_id) {
        let file_array = [...FileRegistry.available_files, ...FileRegistry.current_files];

        console.log(file_array);

        let file = file_array.find(file => file.id === parseInt(file_id));

        console.log(file);

        return file;
    }

    static getFileByName(file_name) {
        let file_array = [...FileRegistry.available_files, ...FileRegistry.current_files];

        console.log(file_array);

        let file = file_array.find(file => file.file_name === file_name);

        console.log(file);

        return file;
    }

    static isFileCurrent(file_id) {
        let is_current = false;

        if(FileRegistry.current_files.some(file => file.id === parseInt(file_id))) {
            is_current = true;
        }

        return is_current;
    }

    static _saveToLocalStorage() {

        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }

        base64_buffer =  window.btoa( binary );

    }

    static initializeFromLocalStorage() {

    }

    static sendRegistryChangeEvent() {
        let frce = new FileRegistryChangeEvent();

        frce.dispatchToSubscribers();
    }

}