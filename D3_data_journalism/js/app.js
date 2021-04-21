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

// Load data
d3.csv("data/data.csv").then(function(fullData) {
    // Print the data
    console.log("full data", fullData);
    //cast data to integers
    fullData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcare;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    })
    console.log('cast data', fullData);
    console.log('smokes:', fullData[0].smokes);
    console.log('age', fullData[0].age);

    //create x scale for smokers
    var ySmokeScale = d3.scaleLinear()
        .domain([0, d3.max(fullData, (data, i) => fullData[i].smokes)])
        .range([chartHeight, 0])
    
    // create y scale for age
    var xAgeScale = d3.scaleLinear()
        .domain([d3.extent(fullData, (d, i) => fullData[i].age)])
        .range([0, chartWidth]);

      // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xAgeScale);
    var leftAxis = d3.axisLeft(ySmokeScale);
    
    // create function to draw circles at coordinates
    // Configure a line function which will plot the x and y coordinates using our scales
    var drawLine = d3.line()
        .x(data => xAgeScale(data.age))
        .y(data => ySmokeScale(data.smokes));

    chartGroup.append('path')
        .attr('d', drawLine(fullData))
        .classed('line', true);
    // Append an SVG group element to the SVG area, create the left axis inside of it, and give it a class of "axis"
    chartGroup.append('g')
        .classed('axis', true)
        .call(leftAxis);
     // Append an SVG group element to the SVG area, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    // Give it a class of "axis"
    chartGroup.append('g')
        .classed('axis', true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var circles = chartGroup.selectAll('circle');

    circles.data(fullData)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => fullData[i].age)
        .attr('cy', (d, i) => fullData[i].smokes)
        .attr('r', 8)
        .attr('stroke', 'black')
        .attr('fill', 'lightblue')
    
    console.log(bottomAxis);
})
