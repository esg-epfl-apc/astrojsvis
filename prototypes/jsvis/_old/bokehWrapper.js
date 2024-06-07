function createGraph(fits_file, settings) {

    let container_element = document.getElementById('graph-container');

    container_element.innerHTML = "";

    let fits_data = [];
    let labels = {
        "x": "TIME",
        "y": "RATE"
    }

    let hdu = fits_file.getHDU();
    let header = hdu.header;
    let data = hdu.data;

    console.log(fits_file);
    console.log(hdu);
    console.log(data);

    let timedel = header.get('TIMEDEL');

    console.log("HEADER");
    console.log(header);

    console.log("TIMEDEL");
    console.log(timedel);

    let x, y, dy;

    let scales = null;

    if(settings) {
        console.log("Axis");
        console.log(settings['select-axis-x']);
        console.log(settings['select-axis-y']);

        console.log("Error bars");
        console.log(settings['select-axis-x-error-bars']);
        console.log(settings['select-axis-y-error-bars']);

        console.log(settings['select-axis-x']);
        console.log(settings['select-axis-y']);

        let x_column = settings['select-axis-x'].value;
        let y_column = settings['select-axis-y'].value;

        let error_bar_x_column = settings['select-axis-x-error-bars'].value;
        let error_bar_y_column = settings['select-axis-y-error-bars'].value;

        data.getColumn(x_column, function(col){x = col});
        data.getColumn(y_column, function(col){y = col});
        data.getColumn(error_bar_y_column, function(col){dy = col});

        labels.x = x_column;
        labels.y = y_column;

        let x_scale = settings['select-axis-x-scale'].value;
        let y_scale = settings['select-axis-y-scale'].value;

        scales = {
            "x": x_scale,
            "y": y_scale
        }

    } else {
        data.getColumn("TIME", function(col){x = col});
        data.getColumn("RATE", function(col){y = col});
        data.getColumn("ERROR", function(col){dy = col});

        fits_data['x'] = x;
        fits_data['y'] = y;
        fits_data['dy'] = dy;
    }

    plot_light_curve(x, y, dy, timedel, labels, scales);

}

function plot_light_curve(x, y, dy, timedel, labels, scales = null) {
    const plt = Bokeh.Plotting;

    console.log("TIMEDEL plot :" + timedel);

    let ylow = [], yup = [], xlow = [], xup = [];
    for (let i in dy) {
        ylow[i] = y[i] - dy[i];
        yup[i] = y[i] + dy[i];
        xlow[i] = x[i] - timedel / 2;
        xup[i] = x[i] + timedel / 2; // bin width calculation needs to be improved
    }

    const source = new Bokeh.ColumnDataSource({
        data: { x: x, y: y, ylow: ylow, yup: yup, xlow: xlow, xup: xup }
    });

    const tools = "pan,box_zoom,wheel_zoom,hover,crosshair,reset,save";
    const p = plt.figure({
        title: "Lightcurve",
        tools: tools,
        width: 800,
        height: 600,
        y_range: [Math.min(...ylow), Math.max(...yup)],
    });

    p.xaxis.axis_label = labels.x;
    p.yaxis.axis_label = labels.y;

    const circles = p.circle({ field: "x" }, { field: "y" }, {
        source: source,
        size: 4,
        fill_color: "navy",
        line_color: null,
    });

    const yerr_bar = new Bokeh.Whisker({
        dimension: "height",
        source: source,
        base: {field: "x"},
        lower: {field: "ylow"},
        upper: {field: "yup"},
        line_color: "navy",
        lower_head: null,
        upper_head: null,
    });
    p.add_layout(yerr_bar);

    const xerr_bar = new Bokeh.Whisker({
        dimension: "width",
        source: source,
        base: {field: "y"},
        lower: {field: "xlow"},
        upper: {field: "xup"},
        line_color: "navy",
        lower_head: null,
        upper_head: null,
    });
    p.add_layout(xerr_bar);

    let scale_functions = {
        "linear": Bokeh.LinearScale,
        "log": Bokeh.LogScale
    }

    if(scales) {
        p.x_scale = new scale_functions[scales.x]();

        p.y_scale = new scale_functions[scales.y]();
    }

    const columns = [
        new Bokeh.Tables.TableColumn({field: 'x', title: labels.x}),
        new Bokeh.Tables.TableColumn({field: 'y', title: labels.y}),
        new Bokeh.Tables.TableColumn({field: 'dy', title: 'ERROR'}),
    ]
    const data_table = new Bokeh.Tables.DataTable({
        source: source,
        columns: columns,
        width: 800,
    });

    //const table_doc = new Bokeh.Document();

    //table_doc.add_root(data_table);

    //Bokeh.embed.add_document_standalone(table_doc, '#div-data');

    //plt.show(p, "#graph-container");
    plt.show(new Bokeh.Column({children: [p, data_table]}), "#graph-container");
    //plt.show(data_table, "#graph-container");
    //plt.show(data_table, "#div-data");

    /*
    let data_div = document.getElementById('div-data');
    let table_data_div = document.getElementsByClassName('bk-DataTable')[0];

    console.log(table_data_div);

    data_div.appendChild(table_data_div);
    */

}