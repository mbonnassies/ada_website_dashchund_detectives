// set the dimensions and margins of the graph
console.log("Box plot!");

// Add the import statement for d3 library
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#boxplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("data/ethnicities_analysis.csv", function(data) {

    // Show the X scale
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.diversity_count; })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Show the Y scale
    var y = d3.scaleLog()
        .domain([1, d3.max(data, function(d) { return +d.Movie_box_office_revenue; })])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Show the boxplot
    svg.selectAll("boxes")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.diversity_count) - 10; })
            .attr("y", function(d) { return y(d.Movie_box_office_revenue); })
            .attr("height", 10)
            .attr("width", 20)
            .attr("stroke", "black")
            .style("fill", "#69b3a2");

    // Add title, x-axis label, y-axis label
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Grossing vs Diversity score");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Grossing");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Diversity score");
});
