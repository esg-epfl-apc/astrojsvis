class HeaderComponent extends HTMLElement {

    container_id;
    container

    static component_id = "header_component";
    static select_hdus_id = "select-header-hdus";
    static table_id = "table-header-data";

    fits_reader_wrapper = null;

    constructor(container_id) {
        super();
        this.container_id = container_id;
        this._setContainer();

        this.handleFITSLoadedEvent = this.handleFITSLoadedEvent.bind(this);
        this.handleSelectChangeEvent = this.handleSelectChangeEvent.bind(this);

        this._setupExternalListeners();
        this._setupInnerListeners();

        this._setupInnerElementsListeners();
    }

    _setupExternalListeners() {
        this.addEventListener('fits-loaded', this.handleFITSLoadedEvent);
    }

    _setupInnerListeners() {
        this.addEventListener('select-change', this.handleSelectChangeEvent);
    }

    _setupInnerElementsListeners() {
        this._setSelectListener();
    }

    _setSelectListener() {
        let select_element = document.getElementById(HeaderComponent.select_hdus_id);

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

        let hdu_cards = this.fits_reader_wrapper.getHeaderCardsValueFromHDU(hdus[0].index);
        this.setTable(hdu_cards);
    }

    handleSelectChangeEvent(event) {
        event.stopPropagation();
        let hdu_index = event.detail.hdu_index;

        let hdu_cards = this.fits_reader_wrapper.getHeaderCardsValueFromHDU(hdu_index);
        this.setTable(hdu_cards);
    }

    _setContainer() {
        this.container = document.getElementById(this.container_id)
    }

    resetContainer() {
        this.container.innerHTML = "";
    }

    setSelect(hdus) {
        this.resetSelect();

        let select = document.getElementById(HeaderComponent.select_hdus_id);

        let options = this._createHDUsOptions(hdus);

        options.forEach(function(option) {
            select.add(option);
        });
    }

    resetSelect() {
        let select = document.getElementById(HeaderComponent.select_hdus_id);
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

    setTable(hdu_cards) {
        this.resetTable();

        let table_element = document.getElementById(HeaderComponent.table_id);

        let tbody = table_element.querySelector('tbody');

        hdu_cards.forEach(card => {

            const row = tbody.insertRow();

            const index_cell = row.insertCell(0);
            const card_cell = row.insertCell(1);
            const name_cell = row.insertCell(2);
            const description_cell = row.insertCell(3);

            index_cell.textContent = card.index;
            card_cell.textContent = card.card_name;
            name_cell.textContent = card.value;
            description_cell.textContent = card.comment;
        });

    }

    resetTable() {
        let table_element = document.getElementById(HeaderComponent.table_id);

        let tbody = table_element.querySelector('tbody');

        tbody.innerHTML = '';
    }
}