export class CSVSettingsComponent extends HTMLElement {

    file = null;
    is_current = null;

    constructor(file, is_current) {
        super();

        this.file = file;
        this.is_current = is_current;
    }

}