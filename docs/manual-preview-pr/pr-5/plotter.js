const showPlot = function() {
    const fpath = "./IBIS_lc.fits";
    let FITS = astro.FITS;

    const plot_lc = function(x, y, dy, timedel) {
        const plt = Bokeh.Plotting;

        // bin width calculation is from oda_api, simplified, e.g. timepix = 0.5 always
        let t_lc = x;
        let dt_lc = new Array(x.length).fill(timedel / 2);
        for (let i=0; i < dt_lc.length - 1; i++) {
            dt_lc[i+1] = Math.abs(Math.min(timedel / 2, t_lc[i+1] - t_lc[i] - dt_lc[i]))
        }

        let yer_xs = [], yer_ys = [], xer_xs = [], xer_ys = [];
        let ylow, yup; 
        for (let i in dy) {
            ylow = ylow ? Math.min(ylow, y[i] - dy[i]) : y[i] - dy[i];
            yup = yup ? Math.max(yup, y[i] + dy[i]): y[i] + dy[i];
            yer_xs[i] = [x[i], x[i]];
            yer_ys[i] = [y[i] - dy[i], y[i] + dy[i]];
            xer_xs[i] = [x[i] - dt_lc[i], x[i] + dt_lc[i]];
            xer_ys[i] = [y[i], y[i]];
        }

        const source = new Bokeh.ColumnDataSource({
            data: {
                x: x, 
                y: y, 
                dy: dy, 
                yer_xs: yer_xs, 
                yer_ys: yer_ys,
                xer_xs: xer_xs,
                xer_ys: xer_ys
            }
        });

        const tools = "pan,box_zoom,box_select,wheel_zoom,hover,crosshair,reset,save";
        const p = plt.figure({ 
            title: "Lightcurve", 
            tools: tools,
            width: 800,
            height: 500,
            y_range: [ylow, yup],
        });

        p.xaxis.axis_label = 'TIME';
        p.yaxis.axis_label = 'RATE';
    
        const circles = p.circle({ field: "x" }, { field: "y" }, {
            source: source,
            size: 4,
            fill_color: "navy",
            line_color: null,
        });
        circles.selection_glyph = new Bokeh.Circle({fill_color: "red", line_color: null})
        circles.nonselection_glyph = new Bokeh.Circle({fill_color: "navy", line_color: null})

        const yerr_bar = new Bokeh.MultiLine({
            xs: {field: 'yer_xs'},
            ys: {field: 'yer_ys'},
            line_color: "navy",
        });
        const yb = p.add_glyph(yerr_bar, source);
        yb.selection_glyph = new Bokeh.MultiLine({line_color: 'red'});

        const xerr_bar = new Bokeh.MultiLine({
            xs: {field: 'xer_xs'},
            ys: {field: 'xer_ys'},
            line_color: "navy",
        });
        const xb = p.add_glyph(xerr_bar, source);
        xb.selection_glyph = new Bokeh.MultiLine({line_color: 'red'});

        const columns = [
            new Bokeh.Tables.TableColumn({field: 'x', title: 'TIME'}),
            new Bokeh.Tables.TableColumn({field: 'y', title: 'RATE'}),
            new Bokeh.Tables.TableColumn({field: 'dy', title: 'ERROR'}),
        ]
        const data_table = new Bokeh.Tables.DataTable({
            source: source,
            columns: columns,
            width: 800,
        });

        // show the plot
        plt.show(new Bokeh.Column({children: [p, data_table]}), "#plot_container");
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


