function initializeFromFITS(fits_file) {
    initializeHDUSettings(fits_file);
}

function getDataFromFITS(fits_file, hdu_index) {

    let fits_data = [];
    let raw_data_array = [];

    let hdu = fits_file.getHDU(hdu_index);
    let header = hdu.header;
    let data = hdu.data;

    //let timedel = header.get('TIMEDEL');

    let x, y, dy;
    data.getColumn("TIME", function(col){x = col});
    data.getColumn("RATE", function(col){y = col});
    data.getColumn("ERROR", function(col){dy = col});

    /*
    x.forEach(function(d) {

    })
    */

    let columns = [];

    data.columns.forEach(function(column) {
        let col_name = column;
        let col_data_json = [];

        columns.push(col_name);

        let col_data;

        data.getColumn(column, function(col){
            col_data = col;
        })

        col_data.forEach(function(col) {
            let col_json_object = `{"${column}": ${col}}`;

            col_data_json.push(col_json_object);
        })

        raw_data_array[column] = col_data;
        fits_data[column] = col_data_json;
        //console.log(JSON.stringify(col_data_json));
    })

    fits_data['x'] = x;
    fits_data['y'] = y;
    fits_data['dy'] = dy;

    //initializeHDUSettings(fits_file);
    initializeDatasetSettings(columns);
    initializeAxisSettings(columns);
    initializeErrorBarsSettings(columns);

    const column_names = Object.keys(raw_data_array);

    const fits_data_json = [];

    for (let i = 0; i < raw_data_array[column_names[0]].length; i++) {
        const obj = {};

        column_names.forEach(column_name => {
            obj[column_name] = raw_data_array[column_name][i];
        });

        fits_data_json.push(obj);
    }

    createGraph(fits_file);
    createGraph0('graph-container1', fits_data_json);

    let file_data = [fits_file, fits_data_json, columns];

    return file_data;
}

function initializeHDUSettings(fits_file) {
    let HDUs = [];
    let hdu_object = {};

    fits_file.hdus.forEach(function(hdu, index) {

        let is_hdu_type_supported = false;

        if (hdu.header.primary === true) {
            hdu_object = {
                "name": "Primary",
                "index": index
            };

            is_hdu_type_supported = true;

        } else {
            let type = hdu.header.get('XTENSION');

            if (type === 'BINTABLE' || type === 'TABLE') {
                is_hdu_type_supported = true;
            }

            hdu_object = {
                "name": type,
                "index": index
            };
        }

        if (is_hdu_type_supported) {
            HDUs.push(hdu_object);
        }
    })

    setupHDUControls(HDUs);
    setupDataContainerControls(HDUs);
}

function initializeDatasetSettings(columns) {
    addDatasetControls(columns);
    setupDatasetControls(columns);
}

function initializeAxisSettings(columns) {
    setupAxisControls(columns)
}

function initializeErrorBarsSettings(columns) {
    setupErrorBarsControls(columns)
}


function setupHDUControls(HDUs) {

    let options_hdu = getHDUsOptionsFromData(HDUs, 'Primary');

    let select_hdu = document.getElementById("select-hdus");

    options_hdu.forEach(function(option) {
        select_hdu.add(option);
    });

}

function setupDatasetControls(columns) {

    let options_dataset = getDatasetsOptionsFromData(columns, null);

    let select_datasets = document.querySelectorAll(".select-dataset, .select-errorbar");

    options_dataset.forEach(function(option) {

        select_datasets.forEach(function(select_dataset) {
            let cloned_option = option.cloneNode(true);
            select_dataset.add(cloned_option);
        })
    });

}

function setupAxisControls(columns) {

    let options_axis = getDatasetsOptionsFromData(columns, null);

    let select_axis = document.querySelectorAll(".select-axis");

    select_axis.forEach(function(select_dataset) {
        select_axis.innerHTML = "";
    })

    options_axis.forEach(function(option) {
        select_axis.forEach(function(select_axis) {
            let cloned_option = option.cloneNode(true);
            select_axis.add(cloned_option);
        })
    });

}

function setupErrorBarsControls(columns) {

    let options_axis_error_bars = getDatasetsOptionsFromData(columns, null);

    let select_axis_error_bars = document.querySelectorAll(".select-axis-error-bars");

    options_axis_error_bars.forEach(function(option) {
        select_axis_error_bars.forEach(function(select_axis_error_bar) {
            let cloned_option = option.cloneNode(true);
            select_axis_error_bar.add(cloned_option);
        })
    });

}

function addDatasetControls(columns) {

    let div_id = 'card-body-dataset';

    let div = document.getElementById(div_id);

    for (let i = 0; i < columns.length; i++) {
        let select_id = `select-dataset-${i}`;
        let select_error_bar_id = `select-error-bar-${i}`;
        let checkbox_error_bar_id = `checkbox-error-bar-${i}`;

        div.innerHTML += `<select id="${select_id}" class="form-select select-dataset">
                            <option selected value="none">Dataset</option>
                          </select>`;

        div.innerHTML += `<input id="${checkbox_error_bar_id}" type="checkbox" class="checkbox-error-bar"> Add Error Bar`;

        div.innerHTML += `<select class="form-select select-errorbar" id="${select_error_bar_id}" style="display: none;">
                          </select>`;
    }

    let checkboxes = div.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox, i) {
        let selectId = `select-error-bar-${i}`;
        checkbox.addEventListener('change', function() {
            let errorBar = document.getElementById(selectId);
            errorBar.style.display = checkbox.checked ? 'block' : 'none';
        });
    });
}

function getHDUsOptionsFromData(HDUs, selected) {
    let options = [];
    let option;

    HDUs.forEach(function(hdu) {
        option = document.createElement("option");

        if(hdu.name === selected) option.setAttribute('selected', 'true');

        option.value = hdu.index;
        option.text = hdu.name;

        options.push(option);
    })

    return options;
}

function getDatasetsOptionsFromData(columns, selected) {
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

function resetSettingsOptions() {
    let div_select;

    let div_ids = ['card-body-dataset', 'card-body-axis', 'card-body-error-bars'];

    div_ids.forEach(function(div_id) {

        div_select = document.getElementById(div_id);

        const selectElements = div_select.querySelectorAll('select:not(.static-select)');

        selectElements.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                if (option.value !== 'none') {
                    option.remove();
                }
            });
        });

    });
}

function setupDataContainerControls(HDUs) {
    let options_hdu = getHDUsOptionsFromData(HDUs, 'Primary');

    let select_hdu = document.getElementById("select-data-hdus");

    options_hdu.forEach(function(option) {
        select_hdu.add(option);
    });

    select_hdu = document.getElementById("select-header-hdus");

    options_hdu.forEach(function(option) {
        select_hdu.add(option.cloneNode(true));
    });
}

function setDataContainer(data) {

    const table_element = document.getElementById('table-data');
    const tbody = table_element.tBodies[0];
    const thead = table_element.tHead;

    tbody.innerHTML = '';
    thead.innerHTML = '';

    const header_row = table_element.tHead.insertRow();
    for (const key in data[0]) {
        if (Object.hasOwnProperty.call(data[0], key)) {
            const header_cell = document.createElement('th');
            header_cell.textContent = key;
            header_row.appendChild(header_cell);
        }
    }

    data.forEach(obj => {
        const row = tbody.insertRow();
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const cell = row.insertCell();
                cell.textContent = obj[key];
            }
        }
    });
}

function setHeaderContainer(hdu) {

    /*
    const cards_array = Object.values(hdu.header.cards)
        .filter(([key, item]) => typeof item === 'object' && !Array.isArray(item));
    */

    const cards_array = [];

    Object.entries(hdu.header.cards).forEach(function(item) {
        let item_value_array = item[1];


        if(typeof item_value_array === 'object' && !Array.isArray(item_value_array)) {
            item_value_array['card_name'] = item[0];
            cards_array.push(item_value_array);
        }
    })

    const cards_array_key = Object.keys(hdu.header.cards);

    let sorted_hdu_cards = cards_array.sort((a, b) => a.index - b.index);

    const table_element = document.getElementById('table-header-data');

    const tbody = table_element.tBodies[0];
    tbody.innerHTML = '';

    sorted_hdu_cards.forEach(card => {

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

function setupControlsFromData(columns) {
    initializeDatasetSettings(columns);
    initializeAxisSettings(columns);
    initializeErrorBarsSettings(columns);
}