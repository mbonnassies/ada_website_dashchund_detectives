// set the dimensions and margins of the graph
var margin5 = { top: 30, right: 30, bottom: 130, left: 80 },
    width4 = 600 - margin5.left - margin5.right,
    height4 = 600 - margin5.top - margin5.bottom;

// append the svg object to the body of the page
var svg8 = d3
    .select("#ethnicities_occurence")
    .append("svg")
    .attr("width", width4 + margin5.left + margin5.right)
    .attr("height", height4 + margin5.top + margin5.bottom)
    .append("g")
    .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

// Parse the Data
d3.csv("data/ethnicities_analysis.csv", function (data) {
    // Precomputed label counts
    var labelCounts = {
        "African": 4761,
        "Asian": 1301,
        "Caucausian": 21236,
        "Indigineous people, tribes": 429,
        "Latin-American": 940,
        "Middle-Eastern": 207,
        "Multi-ethnic": 80
    };

    // X axis
    var x = d3
        .scaleBand()
        .range([0, width4])
        .domain(Object.keys(labelCounts).sort(function(a, b) { return labelCounts[b] - labelCounts[a]; })) // Sort labels by count in descending order
        .padding(0.2);
    svg8
        .append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, d3.max(Object.values(labelCounts))]).range([height4, 0]);
    svg8.append("g").call(d3.axisLeft(y));
        

    // Create a tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style("color", "black") // Set the text color to black
        .html(function(d) {
            return "<div class='tooltip-content'>" +
                    "<span>Number of occurences:</span> " +
                    "<span class='tooltip-value'>" + labelCounts[d] + "</span>" +
                "</div>";
        });

    // Call the tooltip
    svg3.call(tip);

    // Define the gradient
    var gradient = svg8.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#b2df8a") // color at the top
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#1f78b4") // color at the bottom
        .attr("stop-opacity", 1);

    // Bars
    var bars = svg8
        .selectAll("mybar")
        .data(Object.keys(labelCounts)) // Use unique labels as data
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d);
            })
        .attr("width", x.bandwidth())
        .style("fill", "url(#gradient)") // apply the gradient
        .attr("height", function (d) {
            return 0; // start from zero
            })
        .attr("y", function (d) {
            return height4; // start from the bottom
            })
        .on('mouseover', tip.show)  // Show tooltip on mouseover
        .on('mouseout', tip.hide);  // Hide tooltip on mouseout

    // Animation
    bars
        .transition()
        .duration(2000)
        .attr("y", function (d) {
            return y(labelCounts[d]);
        })
        .attr("height", function (d) {
            return height4 - y(labelCounts[d]);
        })
        .delay(function (_, i) {
            return i * 100;
        });

        // Add labels
    svg8.append("text")
    .attr("x", (width4 / 2))
    .attr("y", 0 - (margin5.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Number of Actors for each Ethnic Group");

    svg8.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin5.left)
    .attr("x", 0 - (height4 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Number of Occurences");

});
