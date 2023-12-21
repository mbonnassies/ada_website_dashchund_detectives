// set the dimensions and margins of the graph
var margin3 = {top: 30, right: 30, bottom: 50, left: 60},
    width3 = 800 - margin3.left - margin3.right,
    height = 500 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#grossing_vs_rating")
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
    .domain([-0.5, 10])
    .range([ 0, width3 ]);
  svg4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLog()
    .domain([10,4000000000])
    .range([ height, 0]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  var myColor = d3.scaleLog()
    .range(["#1f78b4", "#b2df8a"]) // Update the color range to a more visible combination
    .domain([y.domain()[0], y.domain()[1]]); // Use the domain of the y scale

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#grossing_vs_rating")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")


  // Create a tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("color", "black") // Set the text color to black
    .html(function(d) {
      return "<div class='tooltip-content'>" +
              "<span>Average Rating:</span> " +
              "<span class='tooltip-value'>" + d.averageRating + "</span>" + "<br>" +
              "<span>Movie Box Office Revenue:</span> " +
              "<span class='tooltip-value'>" + formatNumber1(d.Movie_box_office_revenue) + "$</span>" +
            "</div>";
    });

  // Call the tooltip
  svg4.call(tip);

  // Add dots
  svg4.append('g')
    .selectAll("dot")
    .data(data.filter(function (d, i) {
      return d.averageRating > 0 && i < 1000; // Filter out points with a rating of 0 and limit to 1000 data points
    }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.averageRating); })
    .attr("cy", function (d) { return y(d.Movie_box_office_revenue); })
    .attr("r", 3)
    .style("fill", function(d){ return(myColor(d.Movie_box_office_revenue))})
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on('mouseover', tip.show)  // Show tooltip on mouseover
    .on('mouseout', tip.hide);  // Hide tooltip on mouseout

  // Chart title
  svg4.append("text")
    .attr("x", width3 / 2)
    .attr("y", 0 - (margin3.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Scatter Plot: Movie Box Office Revenue vs Average Rating");

  svg4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin3.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Movie Box Office Revenue");

  svg4.append("text")
    .attr("x", (width3 / 2))
    .attr("y", height + margin3.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Movie Rating");
 
})
