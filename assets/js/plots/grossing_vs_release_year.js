// set the dimensions and margins of the graph
var margin3 = {top: 30, right: 30, bottom: 50, left: 60},
    width3 = 800 - margin3.left - margin3.right,
    height = 500 - margin3.top - margin3.bottom;

var formatNumber2 = d3.format("d");

// append the svg object to the body of the page
var svg6 = d3.select("#grossing_vs_release_year")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

//Read the data
d3.tsv("data/movies.imdbrating.tsv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([1900,2020])
    .range([ 0, width3 ]);
  var xAxis = d3.axisBottom(x)
    .tickFormat(d3.format("d")); 
  svg6.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(xAxis);

  // Add Y axis
  var y = d3.scaleLog()
    .domain([10000,2000000000])
    .range([ height, 0]);
  svg6.append("g")
    .call(d3.axisLeft(y));

  var myColor = d3.scaleLog()
    .range(["#1f78b4", "#b2df8a"]) // Update the color range to a more visible combination
    .domain([y.domain()[0], y.domain()[1]]); // Use the domain of the y scale

  // Create a tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("color", "black") // Set the text color to black
    .html(function(d) {
      return "<div class='tooltip-content'>" +
              "<span>Movie Release Year:</span> " +
              "<span class='tooltip-value'>" + formatNumber2(d.Movie_year_released) + "</span>" + "<br>" +
              "<span>Movie Box Office Revenue:</span> " +
              "<span class='tooltip-value'>" + formatNumber(d.Movie_box_office_revenue) + "</span>" + 
            "</div>";
    });

  // Call the tooltip
  svg6.call(tip);

  // Add dots
  svg6.append('g')
    .selectAll("dot")
    .data(data.filter(function (d, i) {
      return d.Movie_year_released > 1920 && i < 2000; // Filter out points with a rating of 0 and limit to 1000 data points
    }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Movie_year_released); })
    .attr("cy", function (d) { return y(d.Movie_box_office_revenue); })
    .attr("r", 3)
    .style("fill", function(d){ return(myColor(d.Movie_box_office_revenue))})
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on('mouseover', tip.show)  // Show tooltip on mouseover
    .on('mouseout', tip.hide);  // Hide tooltip on mouseout

  // Chart title
  svg6.append("text")
    .attr("x", width3 / 2)
    .attr("y", 0 - (margin3.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Movie Box Office Revenue vs Release Year");

  svg6.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin3.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Movie Box Office Revenue");

  svg6.append("text")
    .attr("x", (width3 / 2))
    .attr("y", height + margin3.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Release Year");
 
})
