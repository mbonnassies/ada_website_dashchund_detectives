// set the dimensions and margins of the graph
var margin6 = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin6.left - margin6.right,
    height = 400 - margin6.top - margin6.bottom;

// append the svg object to the body of the page
var svg7 = d3.select("#movies_per_year")
  .append("svg")
    .attr("width", width + margin6.left + margin6.right)
    .attr("height", height + margin6.top + margin6.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin6.left + "," + margin6.top + ")");

//Read the data
d3.tsv("data/movies.imdbrating.tsv",

  // Now I can use this dataset:
  function(data) {
    // Create a frequency count object
    var frequencyCounts = {};
    data.forEach(function(d) {
      var year = d.Movie_year_released;
      if (frequencyCounts[year]) {
        frequencyCounts[year]++;
      } else {
        frequencyCounts[year] = 1;
      }
    });

    // Convert frequencyCounts to an array of objects and filter out years less than 1900
    var dataArray = Object.keys(frequencyCounts).map(function(key) {
      return {
        year: new Date(key, 0, 1),
        count: frequencyCounts[key]
      };
    }).filter(function(d) {
      return d.year.getFullYear() >= 1920;
    });

    // Sort dataArray by year
    dataArray.sort(function(a, b) {
      return a.year - b.year;
    });

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(dataArray, function(d) { return d.year; }))
      .range([ 0, width ]);
    svg7.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d) { return d.count; })])
      .range([ height, 0 ]);
    svg7.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg7.append("path")
      .datum(dataArray)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.count) })
        )
});