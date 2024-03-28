let x, y, xAxis, yAxis;
let dataset;
let svg, scatter, settings_data, line_container;

let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function createGraph0(container, data, settings = null) {

    console.log(data);
    console.log(settings);

    dataset = data;
    settings_data = settings;

    let container_element = document.getElementById('graph-container1');

    container_element.innerHTML = "";

    let graph_trans = {
        'x': {'data': 'time', 'scale': 'linear'},
        'y': {'data': 'rate', 'scale': 'linear'}
    }

    /*
    if(!settings) {

        console.log("No settings");

        svg = d3.select("#graph-container1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    } else {
        svg = d3.select("#graph-container-custom")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    }
    */

    svg = d3.select("#graph-container1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    if(settings) {

        console.log("Axis settings");

        console.log("Axis")
        console.log(settings['select-axis-x-scale']);
        console.log(settings['select-axis-y-scale']);

        console.log(settings['select-axis-x']);
        console.log(settings['select-axis-y']);

        let x_scale = settings['select-axis-x-scale'].value;
        let y_scale = settings['select-axis-y-scale'].value;

        let scales = {
            "x": x_scale,
            "y": y_scale
        }

        try {
            console.log("Error bars")
            console.log(settings['select-axis-x-error-bars']);
            console.log(settings['select-axis-y-error-bars']);

            let error_bar_x_column = settings['select-axis-x-error-bars'].value;
            let error_bar_y_column = settings['select-axis-y-error-bars'].value;
        } catch(e) {

        }

        let axis = createAxis(data, settings, svg, width, height, scales);

        x = axis[0];
        y = axis[1];
        xAxis = axis[2];
        yAxis = axis[3];
    } else {
        x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.TIME))
            .range([ 0, width ]);

        xAxis = svg.append("g")
            .attr("id", "x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.format(".1f")))
            .call(g => g.selectAll(".tick line").clone()
                .attr("class", "tick-line")
                .attr("y2", -height)
                .attr("stroke-opacity", 0.2))

        y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.RATE))
            .range([ height, 0]);

        let ylog = d3.scaleLog()
            .domain([1, d3.max(data, d => d.RATE)])
            .range([ height, 0]);

        yAxis = svg.append("g")
            .attr("id", "y")
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(".1f")))
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.2));

        yAxis.select(".tick:last-of-type text").clone()
            .attr("id", "y-label")
            .attr("x", 3)
            .attr("y", -5)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Rate");

        xAxis.select(".tick:last-of-type text").clone()
            .attr("id", "x-label")
            .attr("y", -11)
            .attr("x", 2)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Time");

    }

    let clip = svg.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    let tooltip = d3.select("#graph_container")
        .append("div")
        .attr("class", "tooltip_details")
        .style("float", "right")
        .style("width", "max-content")
        .style("height", "max-content")
        .style("margin-top", "100px")
        .style("margin-right", "169px")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("display", "none");

    scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")
        .attr("id", "light-data")

    let x_data = 'TIME';
    let y_data = 'RATE';

    if(settings) {
        console.log('settings');
        x_data = settings['select-axis-x'].value;
        y_data = settings['select-axis-y'].value;
        console.log(x_data + ' ' + y_data);
    } else {
        x_data = 'TIME';
        y_data = 'RATE';
    }

    scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[x_data]); } )
        .attr("cy", function (d) { return y(d[y_data]); } )
        .attr("r", 4)
        .style("fill", "transparent")
        .style("stroke", "black")
        .style("opacity", 1)

    let zoom = d3.zoom()
        .scaleExtent([.5, 20])
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    let line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d[x_data]))
        .y(d => y(d[y_data]));

    line_container = svg.append("g")
        .attr("id", "path-container")
        .attr("clip-path", "url(#clip)");

    let path = line_container.append("path")
        .attr("id", "light-path")
        .attr("fill", "none").attr("stroke", "steelblue")
        .attr("d", line(data));

}

function createAxis(data, settings, _svg, width, height, scales) {

    let scale_functions = {
        "linear": d3.scaleLinear,
        "log": d3.scaleLog
    };

    console.log(settings['select-axis-x']);
    console.log(settings['select-axis-y']);

    let x_axis_col = settings['select-axis-x'].value;
    let y_axis_col = settings['select-axis-y'].value;

    console.log("Axis columns");
    console.log(x_axis_col+" "+y_axis_col);

    let _x = scale_functions[scales.x]()
        .domain(d3.extent(data, d => d[x_axis_col]))
        .range([ 0, width ]);

    let _xAxis = _svg.append("g")
        .attr("id", "x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(_x)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("class", "tick-line")
            .attr("y2", -height)
            .attr("stroke-opacity", 0.2))

    let _y = scale_functions[scales.y]()
        .domain(d3.extent(data, d => d[y_axis_col]))
        .range([ height, 0]);

    let _yAxis = _svg.append("g")
        .attr("id", "y")
        .call(d3.axisLeft(_y)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.2));

    _yAxis.select(".tick:last-of-type text").clone()
        .attr("id", "y-label")
        .attr("x", 3)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(y_axis_col);

    _xAxis.select(".tick:last-of-type text").clone()
        .attr("id", "x-label")
        .attr("y", -11)
        .attr("x", 2)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(x_axis_col);

    return [_x, _y, _xAxis, _yAxis];
}

function updateChart(e) {

    console.log(e);

    let newX = e.transform.rescaleX(x);
    let newY = e.transform.rescaleY(y);

    xAxis.call(d3.axisBottom(newX));
    yAxis.call(d3.axisLeft(newY));

    svg.selectAll(".tick-line").remove();
    svg.selectAll("#y-label").remove();

    xAxis.selectAll(".tick line").clone()
        .attr("class", "tick-line")
        .attr("y2", -height)
        .attr("stroke-opacity", 0.2)

    yAxis.select(".tick:last-of-type text").clone()
        .attr("id", "y-label")
        .attr("x", 3)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        //.text(demo_graph_trans['y'].data.toUpperCase());

    xAxis.select(".tick:last-of-type text").clone()
        .attr("id", "y-label")
        .attr("y", -11)
        .attr("x", 2)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        //.text(demo_graph_trans['x'].data.toUpperCase());

    yAxis.selectAll(".tick line").clone()
        .attr("class", "tick-line")
        .attr("x2", width)
        .attr("stroke-opacity", 0.2)

    svg.selectAll("path").remove();

    let x_data;
    let y_data;

    if(settings_data) {
        console.log('settings data');
        x_data = settings_data['select-axis-x'].value;
        y_data = settings_data['select-axis-y'].value;
        console.log(x_data + ' ' + y_data);
    } else {
        x_data = 'TIME';
        y_data = 'RATE';
    }

    scatter
        .selectAll("circle")
        .data(dataset)
        .attr("cx", function (d) { return x(d[x_data]); } )
        .attr("cy", function (d) { return y(d[y_data]); } )

    let line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d[x_data]))
        .y(d => y(d[y_data]));

    line_container.append("path")
        .attr("id", "light-path")
        .attr("fill", "none").attr("stroke", "steelblue")
        .attr("d", line(dataset));

    /*
    let line_error_bar = d3.line()
        .x(d => newX(d.time))
        .y(d => newY(d.rate_bound));

    error_bars.forEach(function(error_bar) {
        error_bars_container.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line_error_bar(error_bar));
    })

    let line_error_bar_time = d3.line()
        .x(d => newX(d.time_bound))
        .y(d => newY(d.rate));

    error_bars_time.forEach(function(error_bar_time) {
        error_bars_container.append("path")
            .attr("fill", "none")
            .attr("id", "time-error-bar")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line_error_bar_time(error_bar_time));
    })
    */
}

function createGraph1(container, data) {

    const margin = {top: 50, right: 30, bottom: 30, left: 60},
        width = 460,
        height = 450;

    let svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.time))
        .range([ 0, width ]);

    let xAxis = svg.append("g")
        .attr("id", "x_demo")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("class", "tick-line")
            .attr("y2", -height)
            .attr("stroke-opacity", 0.2))

    let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.rate))
        .range([ height, 0]);

    let ylog = d3.scaleLog()
        .domain([1, d3.max(data, d => d.rate)])
        .range([ height, 0]);

    let yAxis = svg.append("g")
        .attr("id", "y_demo")
        .call(d3.axisLeft(y)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.2));

    yAxis.select(".tick:last-of-type text").clone()
        .attr("id", "y-label")
        .attr("x", 3)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Rate");

    xAxis.select(".tick:last-of-type text").clone()
        .attr("id", "y-label")
        .attr("y", -11)
        .attr("x", 2)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Time");

}