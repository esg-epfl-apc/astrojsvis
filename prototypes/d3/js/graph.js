let x;
let y;

let x_light;
let y_light;

let data_temp;

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

    const svg_light = d3.select("#vis_light_curve")
        .append("svg")
        .attr("width", width_light + margin_light.left + margin_light.right)
        .attr("height", height_light + margin_light.top + margin_light.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin_light.left}, ${margin_light.top})`);

    d3.csv("../data_sample/light_curve_data.csv")
        .then(function(data) {

            console.log(data);

            let error_bars = processData(data);
            console.log(error_bars);

            let error_bars_time = processDataTime(data);
            console.log(error_bars_time)

            let scale = getScale(data);

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

            const bisect_light = d3.bisector(d => d.time).center;
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
                .attr("transform", `translate(0, ${height_light})`)
                .call(d3.axisBottom(x_light)
                .tickFormat(d3.format(".6f")))
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", -height_light)
                    .attr("stroke-opacity", 0.2));

            y_light = d3.scaleUtc()
                .domain([scale.y_min, scale.y_max])
                .range([height_light, 0]);

            svg_light.append("g")
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

            svg_light.append("path")
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
                    .attr("stroke", "red")
                    .attr("stroke-width", 1.5)
                    .attr("d", line_error_bar_time(error_bar_time));
            })

        });

}

function changeScaleX() {
    const gx = svg.append("g")
        .attr("transform", `translate(0,${200})`)
        .call(d3.axisBottom(x));


    gx.transition()
        .duration(750)
        .call(d3.axisBottom(x));
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

}