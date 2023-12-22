// set the dimensions and margins of the graph
var margin2 = {top: 30, right: 30, bottom: 50, left: 60},
    width2 = 1000 - margin2.left - margin2.right,
    height = 600 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#rating_vs_ethnicity")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("data/ethnicities_analysis.csv", function(data) {

  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Ethnicity_group;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.averageRating;}).sort(d3.ascending), .25);
      median = d3.quantile(d.map(function(g) { return g.averageRating;}).sort(d3.ascending), .5);
      q3 = d3.quantile(d.map(function(g) { return g.averageRating;}).sort(d3.ascending), .75);
      interQuantileRange = q3 - q1;
      min = q1 - 1.5 * interQuantileRange;
      max = q3 + 1.5 * interQuantileRange;
      return { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max };
   })   
    .entries(data)

  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width2 ])
    .domain(["African", "Indigineous people, tribes", "Caucausian", "Asian", "Latin-American", "Middle-Eastern", "Multi-ethnic"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([0,10])
    .range([height, 0])
  svg2.append("g").call(d3.axisLeft(y))

  // Create a tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("color", "black") // Set the text color to black
    .html(function(d) {
      return "<div class='tooltip-content'>" +
              "<span>Median Rating:</span> " +
              "<span class='tooltip-value'>" + d.value.median + "</span>" +
            "</div>";
    });

  // Call the tooltip
  svg2.call(tip);

  // Define the gradient
  var gradient = svg3.append("defs")
    .append("linearGradient")
    .attr("id", "boxGradient")
    .attr("gradientTransform", "rotate(90)");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ff41ba"); // Hot pink color for Barbie

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#3d2900"); // Dark grey color for Oppenheimer


  // Show the main vertical line
  svg2
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 100
  svg2.selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.key) - boxWidth / 2; })
    .attr("y", function(d) { return y(d.value.q3); })
    .attr("height", function(d) { return y(d.value.q1) - y(d.value.q3); })
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", "url(#boxGradient)") // Apply the gradient
    .on('mouseover', tip.show) // Show tooltip on mouseover
    .on('mouseout', tip.hide); // Hide tooltip on mouseout


  // Show the median
  svg2
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)

  // Add labels
  svg2.append("text")
    .attr("x", (width2 / 2))
    .attr("y", 0 - (margin2.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Average Movie Rating vs Ethnicities");

  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin2.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Movie Rating");

  svg2.append("text")
    .attr("x", (width2 / 2))
    .attr("y", height + margin2.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Ethnicities");

})