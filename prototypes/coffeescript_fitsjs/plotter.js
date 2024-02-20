const showPlot = function() {
    const fpath = "./spi_acs_FULL_SKY_lc.fits";
    let FITS = astro.FITS;

    const plot_lc = function(x, y, dy, timedel) {
        const plt = Bokeh.Plotting;

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

        p.xaxis.axis_label = 'TIME';
        p.yaxis.axis_label = 'RATE';

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

        // show the plot
        plt.show(p, "#container");
    }

    const callback = function() {
        let hdu = this.getHDU();
        let header = hdu.header;
        let data = hdu.data;

        let timedel = header.get('TIMEDEL');

        let x, y, dy;
        data.getColumn("TIME", function(col){x = col});
        data.getColumn("RATE", function(col){y = col});
        data.getColumn("ERROR", function(col){dy = col});

        plot_lc(x, y, dy, timedel);
    }

    let fits = new FITS(fpath, callback);
}