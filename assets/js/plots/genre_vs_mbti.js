// set the dimensions and margins of the graph
var margin6 = {top: 30, right: 70, bottom: 100, left: 50},
  width6 = 500 - margin6.left - margin6.right,
  height6 = 500 - margin6.top - margin6.bottom;

var formatNumber3 = d3.format(".3f")

// append the svg object to the body of the page
var svg9 = d3.select("#genre_vs_mbti")
.append("svg")
  .attr("width", width6 + margin6.left + margin6.right)
  .attr("height", height6 + margin6.top + margin6.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin6.left + "," + margin6.top + ")");

// Labels of row and columns
var myGroups = ["Action", "Adventure","Animation","Biography","Comedy","Documentary","Drama","Fantasy","History","Mystery","Romantic Comedy","Thriller"]
var myVars = ["ESTP","ESTJ","ISTJ","ISFP","ESFP","ISFJ","ISTP","ESFJ","ENTP","INFP","ENFP","INFJ","ENTJ","INTJ","ENFJ","INTP"]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width6 ])
  .domain(myGroups)
  .padding(0.01);
svg9.append("g")
  .attr("transform", "translate(0," + height6 + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")  
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-45)");

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height6, 0 ])
  .domain(myVars)
  .padding(0.01);
svg9.append("g")
  .call(d3.axisLeft(y));

// Chart title
svg9.append("text")
.attr("x", width6 / 2)
.attr("y", 0 - (margin6.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "16px")
.text("MBTI Type Occurences in Normalized Genres");

//Read the data
d3.csv("data/genres_mbti.csv", function(data) {

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0,12])

  // create a tooltip
  var tooltip = d3.select("#genre_vs_mbti")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Create a tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("color", "black") // Set the text color to black
    .html(function(d) {
      return "<div class='tooltip-content'>" +
              "<span>" + d.group + " movies with " + d.variable + " type:</span> " +
              "<span class='tooltip-value'>" + formatNumber3(d.value) + "%</span>" +
            "</div>";
    });

  // Call the tooltip
  svg3.call(tip);

  // add the squares
  svg9.selectAll()
  .data(data, function(d) {return d.group+':'+d.variable;})
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.group) })
    .attr("y", function(d) { return y(d.variable) })
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.value)} )
    .on('mouseover', tip.show) // Show tooltip on mouseover
    .on('mouseout', tip.hide); // Hide tooltip on mouseout

  // Add color legend
  var defs = svg9.append("defs");

  var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");

  linearGradient
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

  linearGradient.selectAll("stop") 
    .data(myColor.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: myColor(t) })))                  
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  svg9.append('g')
    .attr("transform", `translate(${width6},0)`)
    .append("rect")
    .attr('transform', `translate(${margin6.right/4}, 0)`)
    .attr("width", margin6.right/3)
    .attr("height", height6)
    .style("fill", "url(#linear-gradient)")
    .attr("stroke", "black");

  var yColorScale = d3.scaleLinear()
    .range([height6, 0])
    .domain(myColor.domain());

  svg9.append('g')
    .attr("transform", `translate(${width6 + margin6.right/1.5},0)`)
    .call(d3.axisRight(yColorScale).ticks(height6/50));
})