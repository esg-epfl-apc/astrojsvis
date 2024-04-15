class BokehGraph {

    container_id = null;

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

    constructor(container_id) {
        this.container_id = container_id;
    }

    initializeSettings() {

    }

    initializeGraph() {

        if(this.has_data_table) {
            plt.show(new Bokeh.Column({children: [p, data_table]}), "#graph-container");
        } else {
            BokehGraph.plt.show(this.plot, this.container_id);
        }
    }

    setupPlot(title, y_range) {
        this.plot = BokehGraph.plt.figure({
            title: title,
            tools: this.tool_string,
            width: 800,
            height: 600,
            y_range: [Math.min(...y_range['low']), Math.max(...y_range['up'])],
        });
    }

    setupSource(data_sources) {
        this.source = new Bokeh.ColumnDataSource({
            data: data_sources
        });
    }

    setupData() {
        const circles = p.circle({ field: "x" }, { field: "y" }, {
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
            lower: {field: "ylow"},
            upper: {field: "yup"},
            line_color: "navy",
            lower_head: null,
            upper_head: null,
        });

        this.x_error_bar = new Bokeh.Whisker({
            dimension: "width",
            source: this.source,
            base: {field: "y"},
            lower: {field: "xlow"},
            upper: {field: "xup"},
            line_color: "navy",
            lower_head: null,
            upper_head: null,
        });
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