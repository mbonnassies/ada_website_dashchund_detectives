// set the dimensions and margins of the graph
var margin_ = {top: 30, right: 30, bottom: 30, left: 80},
    width_ = 800 - margin_.left - margin_.right,
    height = 500 - margin_.top - margin_.bottom;

var formatNumber1 = d3.format(".2s");


// append the svg object to the body of the page
var svg = d3.select("#grossing_vs_diversity")
  .append("svg")
    .attr("width", width_ + margin_.left + margin_.right)
    .attr("height", height + margin_.top + margin_.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_.left + "," + margin_.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("data/ethnicities_analysis.csv", function(data) {

  // Build and Show the Y scale
  var y = d3.scaleLog()
    .domain([10000, 2500000000])
    .range([height, 0]);
  svg.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width_ ])
    .domain(["1", "2", "3", "4", "5", "6"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(6))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.diversity_count;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.Movie_box_office_revenue;})    // Keep the variable called Sepal_Length
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longest = d3.max(lengths)
    if (longest > maxNum) { maxNum = longest }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Color scale for dots
  var myColor = d3.scaleLog()
    .range(["#1f78b4", "#b2df8a"]) // Update the color range to a more visible combination
    .domain([y.domain()[0], y.domain()[1]]); // Use the domain of the y scale


  // Add the shape to this svg!
  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","grey")
        .attr("d", d3.area()
            .x0( xNum(0) )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )

// Create a tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .style("color", "black") // Set the text color to black
  .html(function(d) {
    return "<div class='tooltip-content'>" +
             "<span>Movie Box Office Revenue:</span> " +
             "<span class='tooltip-value'>" + formatNumber1(d.Movie_box_office_revenue) + "</span>" +
           "</div>";
  });

// Call the tooltip
svg.call(tip);

  // Add individual points with jitter
  var jitterWidth = 10;
  var filteredData = data.filter(function(d, i) {
    // Filter logic to reduce the number of points
    return i % 60 === 0; // Keep every other point
  });

  svg
    .selectAll("indPoints")
    .data(filteredData)
    .enter()
    .append("circle")
      .attr("cx", function(d){return(x(d.diversity_count) + x.bandwidth()/2 - Math.random()*jitterWidth )})
      .attr("cy", function(d){return(y(d.Movie_box_office_revenue))})
      .attr("r", 3)
      .style("fill", function(d){ return(myColor(d.Movie_box_office_revenue))})
      .attr("stroke", "white")
      .on('mouseover', tip.show)  // Show tooltip on mouseover
      .on('mouseout', tip.hide);  // Hide tooltip on mouseout
  
  var dataPoints = [
    {Movie_box_office_revenue: 1442000000, averageRating: 7, diversity_count: "4", color: "#b22178", name:'Barbie'},
    {Movie_box_office_revenue: 953200000, averageRating: 8.4, diversity_count: "2", color: "#1b1b1b", name: 'Oppenheimer'}
  ];

  dataPoints.forEach(function(d) {
    svg.append("circle")
      .datum(d)  // Bind the data to the circle element
      .attr("cx", x(d.diversity_count) + x.bandwidth()/2)
      .attr("cy", y(d.Movie_box_office_revenue))
      .attr("r", 3)
      .style("fill", d.color)
      .style("opacity", 1)
      .style("stroke", "white")
      .on('mouseover', tip.show)  // Show tooltip on mouseover
      .on('mouseout', tip.hide);  // Hide tooltip on mouseout
    svg.append("text")
      .attr("x", x(d.diversity_count) + x.bandwidth()/2)
      .attr("y", y(d.Movie_box_office_revenue) - 12)
      .text(d.name)  // Set the text to the averageRating value
      .attr("font-size", "10px")
      .attr("dx", "-.8em")
      .attr("dy", ".35em")
      .style("fill", "black");
  });

  // Add labels
  svg.append("text")
    .attr("x", (width_ / 2))
    .attr("y", 0 - (margin_.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Movie Box Office Revenue vs Cast Diversity");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Movie Box Office Revenue");

  svg.append("text")
    .attr("x", (width_ / 2))
    .attr("y", height + margin_.bottom)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Number of Different Ethnicities");

})