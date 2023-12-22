// set the dimensions and margins of the graph
var margin8 = {top: 30, right: 30, bottom: 50, left: 60},
    width3 = 800 - margin8.left - margin8.right,
    height = 500 - margin8.top - margin8.bottom;

var formatNumber4 = d3.format(".2f");

// append the svg object to the body of the page
var svg10 = d3.select("#ratings_vs_extro")
  .append("svg")
    .attr("width", width3 + margin8.left + margin8.right)
    .attr("height", height + margin8.top + margin8.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin8.left + "," + margin8.top + ")");

//Read the data
d3.csv("data/extro.csv", function(data) {

  var dataPoints = [
    {extro_proportion: 8/16, averageRating: 7, color: "#b22178", name:'Barbie'},
    {extro_proportion: 7/19, averageRating: 8.4, color: "#1b1b1b", name: 'Oppenheimer'}
  ];

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0,1])
    .range([ 0, width3 ]);
  var xAxis = d3.axisBottom(x)
    .tickFormat(d3.format(".1f")); 
  svg10.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(xAxis);

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0,10])
    .range([ height, 0]);
  svg10.append("g")
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
              "<span>Extroverted proportion:</span> " +
              "<span class='tooltip-value'>" + formatNumber4(d.extro_proportion) + "</span>" + "<br>" +
              "<span>Average Rating:</span> " +
              "<span class='tooltip-value'>" + d.averageRating + "</span>" + 
            "</div>";
    });

  // Call the tooltip
  svg10.call(tip);

  // Add dots
  svg10.append('g')
    .selectAll("dot")
    .data(data.filter(function (d, i) {
      return d.averageRating > 0 && i < 2000; // Filter out points with a rating of 0 and limit to 1000 data points
    }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.extro_proportion); })
    .attr("cy", function (d) { return y(d.averageRating); })
    .attr("r", 3)
    .style("fill", function(d){ return(myColor(d.averageRating))})
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on('mouseover', tip.show)  // Show tooltip on mouseover
    .on('mouseout', tip.hide);  // Hide tooltip on mouseout

  dataPoints.forEach(function(d) {
    svg10.append("circle")
      .attr("cx", x(d.extro_proportion))
      .attr("cy", y(d.averageRating))
      .attr("r", 3)
      .style("fill", d.color)
      .style("opacity", 1)
      .style("stroke", "white")
      .on('mouseover', tip.show)  // Show tooltip on mouseover
      .on('mouseout', tip.hide);  // Hide tooltip on mouseout
    svg10.append("text")
      .attr("x", x(d.extro_proportion))
      .attr("y", y(d.averageRating) - 12)
      .text(d.name)  // Set the text to the averageRating value
      .attr("font-size", "10px")
      .attr("dx", "-.8em")
      .attr("dy", ".35em")
      .style("fill", "black");
  });

  // Chart title
  svg10.append("text")
    .attr("x", width3 / 2)
    .attr("y", 0 - (margin8.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Average Rating vs Extroverted Proportion");

  svg10.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin8.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Movie Rating");

  svg10.append("text")
    .attr("x", (width3 / 2))
    .attr("y", height + margin8.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Extroverted Proportion");
 
})
