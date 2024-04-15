let fits_data_json;
let fits_data_file
let fits_data_columns;

function getFile(file_path) {

    return fetch(file_path)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then((buffer) => readFile(buffer, file_path));
}

function readFile(arrayBuffer, file_path) {
    let fits_file = window.FITSReader.parseFITS(arrayBuffer);
    console.log(fits_file);

    let hdu = fits_file.getHDU();
    console.log(hdu);

    let header = hdu.header;
    let data = hdu.data;

    initializeFromFITS(fits_file);

    //let fits_data = getDataFromFITS(fits_file, 1);

    //console.log("FITS Data");
    //console.log(fits_data);

    fits_data_file = fits_file;

    //fits_data_file = fits_data[0];
    //fits_data_json = fits_data[1];
    //fits_data_columns = fits_data[2];
}

getFile("spi_acs_FULL_SKY_lc.fits");

function extractFormValues() {

    let formValues = {};

    let selects = document.querySelectorAll('.form-select');

    selects.forEach(select => {
        let id = select.id;
        let classes = select.className.split(' ');
        let value = select.value;

        if(window.getComputedStyle(select, null).getPropertyValue("display") !== 'none' && value !== 'none') {
            formValues[id] = {classes, value};
        }
    });

    let checkboxes = document.querySelectorAll('.checkbox');

    checkboxes.forEach(checkbox => {
        let id = checkbox.id;
        let classes = checkbox.className.split(' ');
        let checked = checkbox.checked;

        console.log(id);
        console.log(checked);

        if (id.includes('select-error-bar') && checked) {
            let correspondingSelect = document.querySelector(`#${id.replace('checkbox', 'select')}`);
            if (correspondingSelect) {
                formValues[id] = { classes: correspondingSelect.className.split(' '), value: correspondingSelect.value };
            }
        } else {
            formValues[id] = { classes, checked };
        }
    });

    return formValues;
}


function setGenerateButtonListener() {
    let button_generate = document.getElementById('button-generate');
    button_generate.addEventListener('click', function() {
        let settings_data = extractFormValues();
        console.log(settings_data);

        if(parseInt(settings_data['select-lib'].value) === 0) {
            createGraph0('graph-container1', fits_data_json, settings_data);
            setDataContainer(fits_data_json);
            setHeaderContainer(fits_data_file.hdus[settings_data['select-hdus'].value])
        } else if(parseInt(settings_data['select-lib'].value) === 1) {
            createGraph(fits_data_file, settings_data);
            setDataContainer(fits_data_json);
            setHeaderContainer(fits_data_file.hdus[settings_data['select-hdus'].value])
        }
    });
}

function setHDUSelectListener() {
    let select_hdu = document.getElementById('select-hdus');
    select_hdu.addEventListener('change', function(e) {
        console.log(e);
        let hdu_index = e.target.value;

        resetSettingsOptions();

        let fits_data = getDataFromFITS(fits_data_file, hdu_index)

        fits_data_file = fits_data[0];
        fits_data_json = fits_data[1];
        fits_data_columns = fits_data[2];
    });
}

function setHDUDataSelectListener() {
    let select_hdu = document.getElementById('select-data-hdus');
    select_hdu.addEventListener('change', function(e) {
        console.log(e);
        let hdu_index = e.target.value

        getDataFromFITS(fits_data_file, hdu_index)
    });

    select_hdu = document.getElementById('select-header-hdus');
    select_hdu.addEventListener('change', function(e) {
        console.log(e);
        let hdu_index = e.target.value

        getDataFromFITS(fits_data_file, hdu_index)
    });
}

setGenerateButtonListener();
setHDUSelectListener();
setHDUDataSelectListener();
