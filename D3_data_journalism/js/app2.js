// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append a group area, then set its margins
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.csv("data/data.csv").then(function(fullData) {
    // Print the data
    console.log("full data", fullData);
    //cast data to integers
    fullData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(fullData, d => d.healthcare)])
        .range([chartHeight, 0]);
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(fullData, d => d.poverty) * 0.8,
          d3.max(fullData, d => d.poverty) * 1.2])
        .range([0, chartWidth]);
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);


  // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fullData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("stroke", "black")
        .classed('stateCircle', true)
    
    var states = chartGroup.selectAll('text')
            .data(fullData)
            .enter()
            .append('text')
            .text(d => d.abbr)
            .classed('stateText', true)
            .attr("font-family", "sans-serif")
            .attr('fill', "white")
            .attr('text-anchor', 'middle')
            .attr('font-size', 8)

   // Create group for three x-axis labels
   var labelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Healthcare (%)");

        var states = chartGroup.selectAll('text')
            .data(fullData)
            .enter()
            .append('text')
            .text(d => d.abbr)
            .classed('stateText', true)
            .attr("font-family", "sans-serif")
            .attr('fill', "white")
            .attr('text-anchor', 'middle')
            .attr('font-size', 8)
        });