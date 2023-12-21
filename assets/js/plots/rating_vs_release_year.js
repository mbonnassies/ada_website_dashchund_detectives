// set the dimensions and margins of the graph
var margin3 = {top: 30, right: 30, bottom: 50, left: 60},
    width3 = 800 - margin3.left - margin3.right,
    height = 500 - margin3.top - margin3.bottom;

var formatNumber2 = d3.format("d");

// append the svg object to the body of the page
var svg5 = d3.select("#rating_vs_release_year")
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
  svg5.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(xAxis);

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0,10])
    .range([ height, 0]);
  svg5.append("g")
    .call(d3.axisLeft(y));

  var myColor = d3.scaleLinear()
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
              "<span>Average Rating:</span> " +
              "<span class='tooltip-value'>" + d.averageRating + "</span>" + 
            "</div>";
    });

  // Call the tooltip
  svg5.call(tip);

  // Add dots
  svg5.append('g')
    .selectAll("dot")
    .data(data.filter(function (d, i) {
      return d.Movie_year_released > 1920 && d.averageRating > 0 && i < 2000; // Filter out points with a rating of 0 and limit to 1000 data points
    }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Movie_year_released); })
    .attr("cy", function (d) { return y(d.averageRating); })
    .attr("r", 3)
    .style("fill", function(d){ return(myColor(d.averageRating))})
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on('mouseover', tip.show)  // Show tooltip on mouseover
    .on('mouseout', tip.hide);  // Hide tooltip on mouseout

  // Chart title
  svg5.append("text")
    .attr("x", width3 / 2)
    .attr("y", 0 - (margin3.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Average Rating vs Release Year");

  svg5.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin3.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Movie Rating");

  svg5.append("text")
    .attr("x", (width3 / 2))
    .attr("y", height + margin3.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Release Year");
 
})
