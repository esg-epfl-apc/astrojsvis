let x;
let y;

let x_light;
let y_light;

let data_temp;

let zoom_box = {
    width: 100,
    height: 100
}

let width_light_log = 950;
let height_light_log = 450;

let data_light;
let scale_light;

let scale_type = [
    "Linear",
    "Log"
];

let custom_graph_trans = {
    'x': {'data': 'rate', 'scale': 'linear'},
    'y': {'data': 'time', 'scale': 'linear'}
}

function setGraph() {

    const margin = {top: 50, right: 30, bottom: 30, left: 60},
        width = 460,
        height = 450;

    const svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


    d3.csv("../data_sample/data.csv")
        .then(function(data) {

            let data_error = [{x: 100, y: 100}, {x: 100, y: 10}]
            data_temp = data;

            console.log(data);
            console.log(data_error)

            x = d3.scaleLinear()
                .domain([0, 1500])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            y = d3.scaleLinear()
                .domain([0, 1000])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            const bisect = d3.bisector(d => d.y).center;

            const mouseover = function(event, d) {
                tooltip
                    .style("opacity", 1)
            }

            const mousemove = function(event, d) {

                //console.log(event);
                //console.log(d);

                tooltip
                    .html(`Value is: ${d.y}`)
                    .style("left", (event.layerX) + "px")
                    .style("top", (event.layerY) + "px")
            }

            const mouseleave = function(event,d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            const pointerenter = function(event, d) {
                console.log(event);
                console.log(d);
                console.log(d.x)
                console.log(d.y)
                let data_index = bisect(data, x.invert(d3.pointer(event)[0])) - 1
                console.log(data[data_index])
            }

            const pointerleft = function(event) {
                console.log("");
            }

            d3.select("svg")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr('r', 5).attr("fill", "red")
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y });


            svg.append('g').attr("id", "light-curve")
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); } )
                .attr("cy", function (d) { return y(d.y); } )
                .attr("r", 7)
                .style("fill", "#69b3a2")
                .style("opacity", 0.6)
                .style("stroke", "white")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("pointerenter", pointerenter)
                .on("pointerleave", pointerleft)

            svg.append('g').call(g => g.append("text")
                .attr("x", 50)
                .attr("y", 0)
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text("Rate"));

            svg.append('g').call(g => g.append("text")
                .attr("x", 450)
                .attr("y", 440)
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text("Time"));

            let line = d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y));

            let curve = d3.line()
                .curve(d3.curveCardinal)
                .x(d => x(d.x))
                .y(d => y(d.y));

            d3.select("light-curve")
                .append("path")
                .attr("fill", "none").attr("stroke", "black")
                .attr("d", line(data));

            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line(data));

            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line(data_error));

            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5)
                .attr("z-index", 10000)
                .attr("d", curve(data));

            const tooltip = d3.select("#vis")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")

            const tooltipEmbeded = svg.append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")

        });

    const margin_light = {top: 50, right: 30, bottom: 30, left: 60},
        width_light = 950,
        height_light = 450;

    function handleZoom(e) {
        console.log(e);

        d3.select('#light-curve-svg g')
            .attr("transform", e.transform)
    }

    let zoom = d3.zoom()
        .on('zoom', handleZoom)
        .scaleExtent([1, 2])
        .translateExtent([[1,1],[
            width_light + margin_light.left + margin_light.right,
            height_light + margin_light.top + margin_light.bottom]])

    function zoomed() {

    }

    const zoom_light = d3.zoom()
        .scaleExtent([1, 40])
        .on('zoom', zoomed)

    const svg_light = d3.select("#vis_light_curve")
        .append("svg")
        .attr("id", "light-curve-svg")
        .attr("width", width_light + margin_light.left + margin_light.right)
        .attr("height", height_light + margin_light.top + margin_light.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin_light.left}, ${margin_light.top})`);

    /*
    d3.select("#vis_light_curve").append("div")
        .attr("id", "data-div")
        .attr("width", "max-content")
        .attr("height", "max-content")
        .attr("border", "2px solid black")
    */

    d3.csv("../data_sample/data_fullset.csv")
        .then(function(data) {

            data_light = data;

            console.log(data);

            document.getElementById("data-div").innerText += "time_[MJD]\t half_width_[d]\t count_rate\t error\t fracexp \n"

            data.forEach(function(datapoint) {
                document.getElementById("data-div").innerText += datapoint.time;
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerText += datapoint.time_error + ' ';
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerText += datapoint.rate + ' ';
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerText += datapoint.rate_error + ' ';
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerHTML += "&nbsp";
                document.getElementById("data-div").innerText += datapoint.fracexp + '\n';
            })


            let error_bars = processData(data);
            console.log(error_bars);

            let error_bars_time = processDataTime(data);
            console.log(error_bars_time)

            let scale = getScale(data);

            scale_light = scale;

            console.log(scale);

            const tooltip_details = d3.select("#vis_light_curve")
                .append("div")
                .attr("class", "tooltip_details")
                .style("float", "right")
                .style("width", "max-content")
                .style("height", "max-content")
                .style("margin-top", "100px")
                .style("margin-right", "169px")
                .style("border", "1px solid black")
                .style("padding", "5px");

            d3.select("#vis_light_curve").append("canvas")
                .attr("id", "canvas-overview")
                .attr("width", 400)
                .attr("height", 200)

            d3.select("#vis_light_curve").append("img")
                .attr("id", "img-svg")
                .attr("width", 400)
                .attr("height", 200)
                .attr("display", "none")

            d3.select("#vis_light_curve").append("input")
                .attr("id", "checkbox-line")
                .attr("type", "checkbox")

            d3.select("#vis_light_curve").append("label")
                .attr("id", "label-line")
                .attr("htmlFor", "checkbox-line")

            document.getElementById("label-line").innerHTML = "Hide line";

            d3.select("#vis_light_curve").append("input")
                .attr("id", "checkbox-x")
                .attr("type", "checkbox")

            d3.select("#vis_light_curve").append("input")
                .attr("id", "checkbox-y")
                .attr("type", "checkbox")

            d3.select("#vis_light_curve").append("input")
                .attr("id", "checkbox-log")
                .attr("type", "checkbox")

            d3.select("#vis_light_curve").append("label")
                .attr("id", "label-x")
                .attr("htmlFor", "checkbox-x")

            document.getElementById("label-x").innerHTML = "Hide X bar";

            d3.select("#vis_light_curve").append("label")
                .attr("id", "label-y")
                .attr("htmlFor", "checkbox-y")

            document.getElementById("label-y").innerHTML = "Hide Y bars";

            d3.select("#vis_light_curve").append("label")
                .attr("id", "label-log")
                .attr("htmlFor", "checkbox-log")

            document.getElementById("label-log").innerHTML = "Log";

            const bisect_light = d3.bisector(d => d.time).center;
            const bisect_light_rate = d3.bisector(d => d.rate).center;
            function pointerEnter(event) {
                console.log(event);
                let object_data = event.originalTarget.__data__;

                const xPos = x_light(object_data.time);
                const yPos = y_light(object_data.rate);

                console.log(xPos + ' ' + yPos);

                //let data_index = bisect_light(data, x_light.invert(d3.pointer(event)[0])) - 1
                //console.log(data_index)
                //console.log(data[data_index])

                tooltip_details.style("display", null);
                //tooltip_details.attr("transform", `translate(${x(aapl[i].Date)},${y(aapl[i].Close)})`);

                const path = tooltip_details.selectAll("path")
                    .data([,])
                    .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black");

                const text = tooltip_details.selectAll("text")
                    .data([,])
                    .join("text")
                    .call(text => text
                        .selectAll("tspan")
                        .data([object_data.rate, object_data.time])
                        .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_, i) => `${i * 1.1}em`)
                        .attr("font-weight", "bold")
                        .text(d => d));

                tooltip_details
                    .style("display", "block")
                    .html('<span>Rate: '+object_data.rate+'</span>' +
                        '<br><span>Time: '+object_data.time+'</span><br>' +
                        '<br><span>Rate min: <br>'+(parseFloat(object_data.rate) - parseFloat(object_data.rate_error))+'</span>' +
                        '<br><span>Rate max: <br>'+(parseFloat(object_data.rate) + parseFloat(object_data.rate_error))+'</span>' +
                        '<br><span>Time min: <br>'+(parseFloat(object_data.time) - parseFloat(object_data.time_error))+'</span>' +
                        '<br><span>Time max: <br>'+(parseFloat(object_data.time) + parseFloat(object_data.time_error))+'</span>'
                    )

                //size(text, path);
            }

            function pointerLeave(event) {
                tooltip_details
                    .style("display", "none")
            }

            x_light = d3.scaleLinear()
                .domain([scale.x_min, scale.x_max])
                .range([0, width_light]);

            svg_light.append("g")
                .attr("id", "xaxis")
                .attr("transform", `translate(0, ${height_light})`)
                .call(d3.axisBottom(x_light)
                .tickFormat(d3.format(".6f")))
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -height_light)
                    .attr("stroke-opacity", 0.2));

            y_light = d3.scaleLinear()
                .domain([scale.y_min, scale.y_max])
                .range([height_light, 0]);

            console.log(y_light.ticks());

            svg_light.append("g")
                .attr("id", "yaxis")
                .call(d3.axisLeft(y_light)
                .tickFormat(d3.format(".1f")))
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width_light)
                    .attr("stroke-opacity", 0.2));

            svg_light.append('g').attr("id", "light")
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x_light(d.time); } )
                .attr("cy", function (d) { return y_light(d.rate); } )
                .attr("r", 5)
                .style("fill", "black")
                .style("opacity", 1)
                .style("stroke", "white")
                .on("pointerenter", pointerEnter)
                .on("pointerleave", pointerLeave)

            svg_light.append("text")
                .attr("class", "chart-title")
                .attr("x", width_light / 2 - margin_light.right)
                .attr("y", 0 - margin_light.bottom)
                .style("font-size", "24px")
                .style("font-weight", "bold")
                .style("fill", "black")
                .text("Light Curve");

            svg_light.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0 - margin_light.bottom)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("fill", "black")
                .text("Rate");

            svg_light.append('g').call(g => g.append("text")
                .attr("x", width_light - 5)
                .attr("y", height_light - 5)
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text("Time"));

            let line = d3.line()
                .curve(d3.curveCatmullRom)
                .x(d => x_light(d.time))
                .y(d => y_light(d.rate));

            d3.select("light")
                .append("path")
                .attr("fill", "none").attr("stroke", "black")
                .attr("d", line(data));

            const data_line = svg_light.append("path")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5)
                .attr("d", line(data));

            let line_error_bar = d3.line()
                .x(d => x_light(d.time))
                .y(d => y_light(d.rate_bound));

            error_bars.forEach(function(error_bar) {
                svg_light.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar(error_bar));
            })

            let line_error_bar_time = d3.line()
                .x(d => x_light(d.time_bound))
                .y(d => y_light(d.rate));

            error_bars_time.forEach(function(error_bar_time) {
                svg_light.append("path")
                    .attr("fill", "none")
                    .attr("id", "time-error-bar")
                    .attr("stroke", "red")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_time(error_bar_time));
            })

            document.getElementById("checkbox-line").addEventListener("change", function(e) {
                if(this.checked) {
                    data_line.attr("display", "none");
                    d3.select("path").attr("stroke", "none");
                } else {
                    data_line.attr("display", "block")
                }
            })

            //createOverview();
            createOverviewLine(data_line);

            d3.select("#light-curve-svg").on("click", function(e) {
                console.log(e);
                console.log(d3.pointer(e));
                console.log(bisect_light(data, x_light.invert(d3.pointer(e)[0])));

                let max_height = d3.pointer(e)[1] + zoom_box.height;
                if(max_height > margin_light.top + margin_light.bottom) {
                    max_height = margin_light.top + margin_light.bottom;
                }

                let min_height = d3.pointer(e)[1] - zoom_box.height;
                if(min_height < 0) {
                    max_height = 0;
                }

                let max_width = d3.pointer(e)[1] + zoom_box.width;
                if(max_width > margin_light.left + margin_light.right) {
                    max_width = margin_light.left + margin_light.right;
                }

                let min_width = d3.pointer(e)[1] - zoom_box.width;
                if(min_width < 0) {
                    max_width = 0;
                }

                let data_zoom = [];
                let idx;

                for(let i = min_height; i <= max_height; i++) {
                    idx = bisect_light(data, x_light.invert(i) - 1)
                    data_zoom.push(data[idx])
                }

                data_zoom.forEach(function(datapoint) {
                    if(bisect_light_rate(data, y_light.invert(datapoint.rate))) {

                    }
                })

                console.log(data_zoom);

            })

            d3.select("#light-curve-svg").dispatch("zoom", {
                bubbles: false,
                cancelable: true
            })

            d3.select('#light-curve-svg')
                .call(zoom)

            //d3.select('#light-curve-svg').call(zoom_light);

            //removeAxis(svg_light);

            //setScaleLog(null, data, svg_light);

            //changeScaleX(data, svg_light)

            graphLog();
            graphZoom();
            graphCustomAxis();
            graphMain();
            graphTest();
            graphDemo();

        });

}

function changeScaleX(data, svg) {

    let scale = getScale(data);

    let axis = d3.scaleLog()
        .domain([scale.x_min, scale.x_max])
        .range([0, width_light_log]);

    const gx = svg.append("g")
        .call(d3.axisBottom(axis));


    gx.transition()
        .duration(750)
        .call(d3.axisBottom(axis));
}

function getAxisByScaleType(axisType, scaleType, data) {

    let axis;
    let scale = getScale(data);

    if(scaleType == 'log') {
        if(axisType == 'x') {
            axis = d3.scaleLog()
                .domain([scale.x_min, scale.x_max])
                .range([0, width_light_log]);
        } else {
            axis = d3.scaleLog()
                .domain([scale.y_min, scale.y_max])
                .range([height_light_log, 0]);
        }
    } else {
        if(axisType == 'x') {
            axis = d3.scaleLinear()
                .domain([scale.x_min, scale.x_max])
                .range([0, width_light_log]);
        } else {
            axis = d3.scaleLinear()
                .domain([scale.y_min, scale.y_max])
                .range([height_light_log, 0]);
        }
    }

    return axis;
}

function setScaleLog(axis, data, svg) {

    let scale = getScale(data);

    let x_light_log = d3.scaleLog()
        //.base(10)
        .domain([scale.x_min, scale.x_max])
        .range([0, width_light_log]);


    let y_light_log = d3.scaleLog()
        //.base(10)
        .domain([scale.y_min, scale.y_max])
        .range([height_light_log, 0]);


    svg.append("g")
        .attr("id", "yaxis")
        .call(d3.axisLeft(y_light_log)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width_light_log)
            .attr("stroke-opacity", 0.2));


    svg.append("g")
        .attr("id", "xaxis")
        .attr("transform", `translate(0, ${height_light_log})`)
        .call(d3.axisBottom(x_light_log)
            .tickFormat(d3.format(".6f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height_light_log)
            .attr("stroke-opacity", 0.2));

}

function removeAxis(svg) {
    svg.remove("#xaxis");
    svg.remove("#yaxis");
}

function convertToLog(x) {
    return Math.log10(x);
}

function processData(data) {
    let error_bars = [];

    data.forEach(function(datapoint){
        //console.log(datapoint.rate + ' ' + datapoint.rate_error + ' '+ parseFloat(datapoint.rate - datapoint.rate_error) + ' ' + parseFloat(datapoint.rate + datapoint.rate_error))
        let error_bar = [
            {
                rate_bound: parseFloat(datapoint.rate) - parseFloat(datapoint.rate_error),
                time: parseFloat(datapoint.time)
            },
            {
                rate_bound: parseFloat(datapoint.rate) + parseFloat(datapoint.rate_error),
                time: parseFloat(datapoint.time)
            }
        ]

        error_bars.push(error_bar);
    })

    return error_bars;
}

function processDataTime(data) {
    let error_bars = [];

    data.forEach(function(datapoint){
        console.log(datapoint.rate + ' ' + datapoint.rate_error + ' '+ parseFloat(datapoint.rate - datapoint.rate_error) + ' ' + parseFloat(datapoint.rate + datapoint.rate_error))
        let error_bar = [
            {
                time_bound: parseFloat(datapoint.time) - parseFloat(datapoint.time_error),
                rate: parseFloat(datapoint.rate)
            },
            {
                time_bound: parseFloat(datapoint.time) + parseFloat(datapoint.time_error),
                rate: parseFloat(datapoint.rate)
            }
        ]

        error_bars.push(error_bar);
    })

    return error_bars;
}

function getScale(data) {

    //d3.extent(data) => [min, max]

    const min_time = data.reduce((prev, curr) => (prev && prev.time < curr.time) ? prev : curr)
    const max_time = data.reduce((prev, curr) => (prev && prev.time > curr.time) ? prev : curr)

    const min_rate = data.reduce((prev, curr) => (prev && parseFloat(prev.rate) - parseFloat(prev.rate_error) < curr.rate) ? prev : curr)
    const max_rate = data.reduce((prev, curr) => (prev && parseFloat(prev.rate) + parseFloat(prev.rate_error) > curr.rate) ? prev : curr)

    console.log(min_time.time + ' ' + max_time.time + ' ' + min_rate.rate + ' ' + max_rate.rate)

    let scale = {
        x_min : parseFloat(min_time.time) * 0.99999999999,
        x_max : parseFloat(max_time.time) * 1.00000000001,
        y_min : min_rate.rate * 0.97,
        y_max : max_rate.rate * 1.025
    }

    return scale;

}

function createOverview() {
    let svg = document.getElementById('light-curve-svg');
    let canvas = document.getElementById('canvas-overview');
    let img = document.getElementById('img-svg')

    let xml = new XMLSerializer().serializeToString(svg);

    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';

    let image64 = b64Start + svg64;

    img.src = image64;

    canvas.getContext('2d')
        .scale(2,2)
        .drawImage(img, 0, 0);

    let ctx = canvas.getContext("2d");

}

function createOverviewLine(svg_line) {
    let svg = document.getElementById('light-curve-svg');
    let canvas = document.getElementById('canvas-overview');
    let img = document.getElementById('img-svg')

    console.log(svg_line._groups[0][0]);

    let xml = new XMLSerializer().serializeToString(svg_line._groups[0][0]);

    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';

    let image64 = b64Start + svg64;

    img.src = image64;

    let ctx = canvas.getContext("2d");

    canvas.getContext('2d')
        .drawImage(img, 0, 0);

}

function  graphLog() {

    const margin_light_log = {top: 20, right: 20, bottom: 20, left: 50};

    let container = document.getElementById('graph_container_log');

    let width_log = container.offsetWidth * 0.5;
    let height_log = container.offsetHeight * 0.5;

    const svg_light_log = d3.select("#graph_container_log")
        .append("svg")
        .attr("id", "light-curve-svg-log")
        .attr("width", width_log + 70)
        .attr("height", height_log + 40)
        .append("g")
        .attr("transform",
            `translate(${margin_light_log.left}, ${margin_light_log.top})`);

    let x_log = d3.scaleLinear()
        .domain([scale_light.y_min, scale_light.y_max])
        .range([0, width_log]);

    svg_light_log.append("g")
        .attr("id", "x_log")
        .attr("transform", `translate(0, ${height_log})`)
        .call(d3.axisBottom(x_log)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height_log)
            .attr("stroke-opacity", 0.2));

    let y_log = d3.scaleLinear()
        .domain([scale_light.x_min, scale_light.x_max])
        .range([height_log, 0]);

    svg_light_log.append("g")
        .call(d3.axisLeft(y_log)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width_log)
            .attr("stroke-opacity", 0.2));

    svg_light_log.append('g').attr("id", "light_log")
        .selectAll("dot")
        .data(data_light)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_log(d.rate); } )
        .attr("cy", function (d) { return y_log(d.time); } )
        .attr("r", 5)
        .style("fill", "black")
        .style("opacity", 1)
        .style("stroke", "white")

    d3.select("#btn_switch_scale").on('click', function(e) {

        d3.select("#x_log").remove();

        let axis = d3.scaleLog()
            .domain([70000, 80000])
            .range([0, width_log]);

        const gx = svg_light_log.append("g")
            .attr("transform", `translate(0, ${height_log})`);

        gx.transition()
            .duration(750)
            .call(d3.axisBottom(axis));

        svg_light_log.selectAll("circle")
            .data(data_light)
            .transition()
            .duration(750)
            .attr("cx", function (d) { return axis(d.rate); } )
            .attr("cy", function (d) { return y_log(d.time); } )

    });

}

function graphZoom() {

    const margin_zoom = {top: 20, right: 20, bottom: 20, left: 50};

    let container = document.getElementById('graph_container_zoom');

    let width_zoom = container.offsetWidth * 0.5;
    let height_zoom = container.offsetHeight * 0.5;

    let x_zoom;

    let gx;
    let gy;

    //const extent = [[margin_zoom.left, margin_zoom.top], [width_zoom - margin_zoom.right, height_zoom - margin_zoom.top]];

    let zoom = d3.zoom()
        .on('zoom', function(e) {
            console.log(e.transform);
            d3.select('#light-curve-svg-zoom')
                .attr("transform", e.transform)
        })
        .scaleExtent([1,10])
        .translateExtent([[0,0],[
            width_zoom,
            height_zoom]])

    const svg_light_zoom = d3.select("#graph_container_zoom")
        .append("svg")
        .attr("id", "light-curve-svg-zoom")
        .attr("width", width_zoom)
        .attr("height", height_zoom)
        .append("g")
        .attr("transform",
            `translate(${margin_zoom.left}, ${margin_zoom.top})`);

    x_zoom = d3.scaleLinear()
        .domain([scale_light.x_min, scale_light.x_max])
        .range([0, width_zoom - margin_zoom.left - margin_zoom.right]);

    const xAxis = (g, x_zoom) => g
        .call(d3.axisBottom(x_zoom).tickFormat(d3.format(".1f")))

    gx = svg_light_zoom.append("g")
        .attr("id", "x_zoom")
        .attr("transform", `translate(0, ${height_zoom - margin_zoom.bottom - margin_zoom.top})`)
        //.call(xAxis, x_zoom)
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height_zoom)
            .attr("stroke-opacity", 0.2))
        .call(d3.axisBottom(x_zoom)
        .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", width_zoom)
            .attr("stroke-opacity", 0.2));

    let y_zoom = d3.scaleLinear()
        .domain([scale_light.y_min, scale_light.y_max])
        .range([height_zoom - margin_zoom.bottom - margin_zoom.top, 0]);

    gy = svg_light_zoom.append("g")
        .call(d3.axisLeft(y_zoom)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width_zoom)
            .attr("stroke-opacity", 0.2));

    svg_light_zoom.append('g').attr("id", "light_zoom")
        .selectAll("dot")
        .data(data_light)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_zoom(d.time); } )
        .attr("cy", function (d) { return y_zoom(d.rate); } )
        .attr("r", 5)
        .style("fill", "black")
        .style("opacity", 1)
        .style("stroke", "white")

    d3.select("#light-curve-svg-zoom").call(zoom);

}

let width_custom;
let height_custom;

let svg_light_custom;

let x_custom;
let y_custom;

function graphCustomAxis() {

    const margin_light_custom = {top: 20, right: 20, bottom: 20, left: 50};

    let container = document.getElementById('graph_container_custom');

    width_custom = container.offsetWidth * 0.5;
    height_custom = container.offsetHeight * 0.5;

    svg_light_custom = d3.select("#graph_container_custom")
        .append("svg")
        .attr("id", "light-curve-svg-custom")
        .attr("width", width_custom + 70)
        .attr("height", height_custom + 40)
        .append("g")
        .attr("transform",
            `translate(${margin_light_custom.left}, ${margin_light_custom.top})`);

    x_custom = d3.scaleLinear()
        .domain([scale_light.y_min, scale_light.y_max])
        .range([0, width_custom]);

    svg_light_custom.append("g")
        .attr("id", "x_custom")
        .attr("transform", `translate(0, ${height_custom})`)
        .call(d3.axisBottom(x_custom)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height_custom)
            .attr("stroke-opacity", 0.2));

    y_custom = d3.scaleLinear()
        .domain([scale_light.x_min, scale_light.x_max])
        .range([height_custom, 0]);

    svg_light_custom.append("g")
        .attr("id", "y_custom")
        .call(d3.axisLeft(y_custom)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width_custom)
            .attr("stroke-opacity", 0.2));

    svg_light_custom.append('g').attr("id", "light_log")
        .selectAll("dot")
        .data(data_light)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_custom(d.rate); } )
        .attr("cy", function (d) { return y_custom(d.time); } )
        .attr("r", 5)
        .style("fill", "black")
        .style("opacity", 1)
        .style("stroke", "white")

        setupDataControls(data_light);

}

function setupDataControls(data) {
    console.log(data.columns);

    let columns = data.columns;

    let options_x = getOptionsFromData(columns);
    let options_y = getOptionsFromData(columns);

    let select_data_x = document.getElementById("data_x");
    let select_data_y = document.getElementById("data_y");

    options_x.forEach(function(option) {
        select_data_x.add(option);
    });

    options_y.forEach(function(option) {
        select_data_y.add(option);
    });

    let select_scale_x = document.getElementById("scale_x");
    let select_scale_y = document.getElementById("scale_y");

    select_data_x.addEventListener("change", (e) => dataListener(e));
    select_data_y.addEventListener("change", (e) => dataListener(e));

    select_scale_x.addEventListener("change", (e) => scaleListener(e));
    select_scale_y.addEventListener("change", (e) => scaleListener(e));

}

function getOptionsFromData(columns) {
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

function dataListener(e) {
    console.log(e);

    let column = e.target.value;
    let axis = e.target.dataset.axis;

    custom_graph_trans[axis].data = column;

    updateData('data', axis);

    console.log(column);
    console.log(axis);
    console.log(custom_graph_trans);
}

function scaleListener(e) {
    let scale = e.target.value;
    let axis = e.target.dataset.axis;

    custom_graph_trans[axis].scale = scale;

    updateData('scale', axis);
}

function updateData(type, axis) {

    console.log(data_light);

    if(type === 'data') {

        if(axis === 'x') {

            d3.select("#x_custom").remove();

            if(custom_graph_trans['x'].scale === 'linear') {
                x_custom = d3.scaleLinear()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['x'].data]))
                    .range([0, width_custom]);
            } else {
                x_custom = d3.scaleLog()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['x'].data]))
                    .range([0, width_custom]);
            }

            let gx = svg_light_custom.append("g")
                .attr("id", "x_custom")
                .attr("transform", `translate(0, ${height_custom})`);

            gx.transition()
                .duration(750)
                .call(d3.axisBottom(x_custom));

        } else {

            d3.select("#y_custom").remove();

            if(custom_graph_trans['y'].scale === 'linear') {
                y_custom = d3.scaleLinear()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['y'].data]))
                    .range([0, height_custom]);
            } else {
                y_custom = d3.scaleLog()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['y'].data]))
                    .range([0, height_custom]);
            }

            let gx = svg_light_custom.append("g")
                .attr("id", "y_custom");

            gx.transition()
                .duration(750)
                .call(d3.axisLeft(y_custom));

        }

    } else {

        if(axis === 'x') {

            d3.select("#x_custom").remove();

            if(custom_graph_trans['x'].scale === 'linear') {
                x_custom = d3.scaleLinear()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['x'].data]))
                    .range([0, width_custom]);
            } else {
                x_custom = d3.scaleLog()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['x'].data]))
                    .range([0, width_custom]);
            }

            let gx = svg_light_custom.append("g")
                .attr("id", "x_custom")
                .attr("transform", `translate(0, ${height_custom})`);

            gx.transition()
                .duration(750)
                .call(d3.axisBottom(x_custom));

        } else {

            d3.select("#y_custom").remove();

            if(custom_graph_trans['y'].scale === 'linear') {
                y_custom = d3.scaleLinear()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['y'].data]))
                    .range([0, height_custom]);
            } else {
                y_custom = d3.scaleLog()
                    .domain(d3.extent(data_light, d => d[custom_graph_trans['y'].data]))
                    .range([0, height_custom]);
            }

            let gx = svg_light_custom.append("g")
                .attr("id", "y_custom");

            gx.transition()
                .duration(750)
                .call(d3.axisLeft(y_custom));

        }
    }

    svg_light_custom.selectAll("circle")
        .data(data_light)
        .transition()
        .duration(750)
        .attr("cx", function (d) { return x_custom(d[custom_graph_trans['x'].data]); } )
        .attr("cy", function (d) { return y_custom(d[custom_graph_trans['y'].data]); } )

}

/*
const height_main = 600;
const width_main = 800;

let k = height_main / width_main;

const zoom_main = d3.zoom()
    .scaleExtent([0.5, 32])
    .on("zoom", zoomed_main);

const svg_main = d3.create("svg")
    .attr("viewBox", [0, 0, width_main, height_main]);

const gGrid = svg_main.append("g");

const gDot = svg_main.append("g")
    .attr("fill", "none")
    .attr("stroke-linecap", "round");

const gx = svg_main.append("g");

const gy = svg_main.append("g");

let x_main = d3.scaleLinear()
    .domain([70000, 90000])
    .range([0, width_main])

let y_main = d3.scaleLinear()
    .domain([52777.1 * k, 52777.2])
    .range([height_main, 0])

let z_main = d3.scaleOrdinal()
    .domain(data_light.map(d => d[2]))
    .range(d3.schemeCategory10)

let xAxis_main = (g, x_main) => g
    .attr("transform", `translate(0,${height_main})`)
    .call(d3.axisTop(x_main).ticks(12))
    .call(g => g.select(".domain").attr("display", "none"))

let yAxis_main = (g, y_main) => g
    .call(d3.axisRight(y_main).ticks(12 * k))
    .call(g => g.select(".domain").attr("display", "none"))

let grid = (g, x_main, y_main) => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g
        .selectAll(".x")
        .data(x.ticks(12))
        .join(
            enter => enter.append("line").attr("class", "x").attr("y2", height_main),
            update => update,
            exit => exit.remove()
        )
        .attr("x1", d => 0.5 + x_main(d))
        .attr("x2", d => 0.5 + x_main(d)))
    .call(g => g
        .selectAll(".y")
        .data(y_main.ticks(12 * k))
        .join(
            enter => enter.append("line").attr("class", "y").attr("x2", width_main),
            update => update,
            exit => exit.remove()
        )
        .attr("y1", d => 0.5 + y_main(d))
        .attr("y2", d => 0.5 + y_main(d)));

function zoomed_main({transform}) {
    const zx = transform.rescaleX(x_main).interpolate(d3.interpolateRound);
    const zy = transform.rescaleY(y_main).interpolate(d3.interpolateRound);
    gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gx.call(xAxis_main, zx);
    gy.call(yAxis_main, zy);
    gGrid.call(grid, zx, zy);
}

function graphMain() {

    gDot.selectAll("path")
        .data(data_light)
        .join("path")
        .attr("d", d => `M${x_main(d[2])},${y_main(d[0])}h0`)

    let svg_light_main = d3.select("#vis_light_curve_zoom")
        .append(svg_main)

    svg_main.call(zoom_main).call(zoom_main.transform, d3.zoomIdentity);


    return Object.assign(svg.node(), {
        reset() {
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        }
    });

}
*/

function graphMain() {

}

function graphTest() {

    let data = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100
    }));

    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    let container = document.getElementById('graph_container_test');

    let width_custom = container.offsetWidth;
    let height_custom = container.offsetHeight;

    let svg = d3.select("#graph_container_test")
        .append("svg")
        .attr("id", "light-curve-svg-test")
        .attr("width", width_custom)
        .attr("height", height_custom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


    /*
    const svg = d3.select("#scatter-plot")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    */

    let currentScaleType = 'linear';


    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .range([height, 0]);


    /*
    let xScale = d3.scaleLinear()
        .domain(d3.extent(data))
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain(d3.extent(data))
        .range([height, 0]);

    */

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Add axes to SVG
    const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    const yAxisGroup = svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add data points
    let dots = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5);

    const zoom_test = d3.zoom()
        .on('zoom', function(e) {
            console.log(e.transform);

            const { transform } = e;
            //svg.attr("transform", transform);

            d3.select("#light-curve-svg-test g").attr("transform", transform);
            xAxisGroup.call(xAxis.scale(transform.rescaleX(xScale)));
            yAxisGroup.call(yAxis.scale(transform.rescaleY(yScale)));

            svg.selectAll("circle")
                .data(data)
                .transition()
                .duration(750)
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
        })
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])


    const zoom_test_1 = d3.zoom()
        .on('zoom', zoomed)
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])

    d3.select("#light-curve-svg-test").call(zoom_test_1);

    //svg.call(zoom_test);


    function zoomed(event) {

        console.log('aaaaa');

        const { transform } = event;
        svg.attr("transform", transform);
        //xAxisGroup.call(xAxis.scale(transform.rescaleX(xScale)));
        //yAxisGroup.call(yAxis.scale(transform.rescaleY(yScale)));

        const new_xScale = transform.rescaleX(xScale);
        const new_yScale = transform.rescaleY(yScale);

        // Update axes with the new scales
        svg.select(".x-axis").call(xAxis.scale(new_xScale));
        svg.select(".y-axis").call(yAxis.scale(new_yScale));

        svg.selectAll("circle")
            .data(data)
            .transition()
            .duration(750)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))

        /*
        dots.transition().duration(750)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
        */
    }


    function switchScaleType() {

        currentScaleType = currentScaleType === 'linear' ? 'log' : 'linear';

        xScale = currentScaleType === 'linear' ? d3.scaleLinear() : d3.scaleLog();
        yScale = currentScaleType === 'linear' ? d3.scaleLinear() : d3.scaleLog();

        xScale.domain([0, d3.max(data, d => d.x)]).range([0, width]);
        yScale.domain([0, d3.max(data, d => d.y)]).range([height, 0]);

        xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);

        xAxisGroup.transition().call(xAxis);
        yAxisGroup.transition().call(yAxis);

        dots.transition().duration(750)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
    }
}


function graphDemo() {

    const margin = {top: 50, right: 30, bottom: 30, left: 60},
        width = 1000,
        height = 450;

    const svg_demo = d3.select("#graph_container_demo")
        .append("svg")
        .attr("id", "svg-demo")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    const zoom_test = d3.zoom()
        .on('zoom', function(e) {
            console.log(e.transform);

            const { transform } = e;
            //svg_demo.attr("transform", transform);

            d3.select("svg-demo g").attr("transform", transform);

            //xAxisGroup.call(xAxis.scale(transform.rescaleX(xScale)));
            //yAxisGroup.call(yAxis.scale(transform.rescaleY(yScale)));

            svg_demo.selectAll("circle")
                .data(data_demo)
                .transition()
                .duration(750)
                .attr("cx", function (d) { return x_demo(d.time); } )
                .attr("cy", function (d) { return y_demo(d.rate); } )
        })
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])

    let data_demo = data_light;

    let error_bars = processData(data_demo);

    let error_bars_time = processDataTime(data_demo);

    let scale = getScale(data_demo);

    scale_light = scale;

    console.log(scale);

    let x_demo = d3.scaleLinear()
        .domain([scale.x_min, scale.x_max])
        .range([0, width]);

    svg_demo.append("g")
        .attr("id", "xaxis_demo")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x_demo)
            .tickFormat(d3.format(".6f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.2));

    let y_demo = d3.scaleLinear()
        .domain([scale.y_min, scale.y_max])
        .range([height, 0]);

    console.log(y_demo.ticks());

    svg_demo.append("g")
        .attr("id", "yaxis_demo")
        .call(d3.axisLeft(y_demo)
            .tickFormat(d3.format(".1f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.2));

    svg_demo.append('g').attr("id", "light_demo")
        .selectAll("dot")
        .data(data_demo)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_demo(d.time); } )
        .attr("cy", function (d) { return y_demo(d.rate); } )
        .attr("r", 5)
        .style("fill", "black")
        .style("opacity", 1)
        .style("stroke", "white")

    svg_demo.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2 - margin.right)
        .attr("y", 0 - margin.bottom)
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text("Light Curve");

    svg_demo.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - margin.bottom)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text("Rate");

    svg_demo.append('g').call(g => g.append("text")
        .attr("x", width - 5)
        .attr("y", height - 5)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Time"));

    svg_demo.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom_test);

    let line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x_demo(d.time))
        .y(d => y_demo(d.rate));

    d3.select("light_demo")
        .append("path")
        .attr("fill", "none").attr("stroke", "black")
        .attr("d", line(data_demo));

    const data_line = svg_demo.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line(data_demo));

    let line_error_bar = d3.line()
        .x(d => x_demo(d.time))
        .y(d => y_demo(d.rate_bound));

    error_bars.forEach(function(error_bar) {
        svg_demo.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line_error_bar(error_bar));
    })

    let line_error_bar_time = d3.line()
        .x(d => x_demo(d.time_bound))
        .y(d => y_demo(d.rate));

    error_bars_time.forEach(function(error_bar_time) {
        svg_demo.append("path")
            .attr("fill", "none")
            .attr("id", "time-error-bar-demo")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line_error_bar_time(error_bar_time));
    })

    //createOverview();

    //d3.select("svg-demo g").call(zoom_test);

}
