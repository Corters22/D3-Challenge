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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = 'healthcare'

// function used for updating x-scale var upon click on axis label
function xScale(fullData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(fullData, d => d[chosenXAxis]) * 0.8,
      d3.max(fullData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(fullData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(fullData, d => d[chosenYAxis]) * 0.8, 
        d3.max(fullData, d => d[chosenYAxis]) * 1.2])
        .range([0, chartHeight]);
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(500)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(500)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(500)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr('cy', d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Median Age:";
    }
    else {
        xlabel = "Median Household Income:";
    }

    var ylabel;

    if (chosenYAxis === 'healthcare') {
        ylabel = "Lacks healthcare:";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes:";
    }
    else {
        ylabel = "Obese:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


// Load data
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
        console.log("ages", data.age)
    })
    
    //create x scale for age
    var xAgeScale = d3.scaleLinear()
        .domain([30, d3.max(fullData, d => d.age)])
        .range([0, chartWidth]);
        
    // create y scale for smokers
    var ySmokeScale = d3.scaleLinear()
        .domain([0, d3.max(fullData, d => d.smokes)])
        .range([chartHeight, 0])
    

      // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xAgeScale);
    var leftAxis = d3.axisLeft(ySmokeScale);

      // Append an SVG group element to the SVG area, create the left axis inside of it, and give it a class of "axis"
    chartGroup.append('g')
      .classed('axis', true)
      .call(leftAxis);
   // Append an SVG grou p element to the SVG area, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    // Give it a class of "axis"
    chartGroup.append('g')
        .classed('axis', true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    
    // create function to draw circles at coordinates
    // Configure a line function which will plot the x and y coordinates using our scales
    // var drawLine = d3.line()
    //     .x(d => xAgeScale(d.age))
    //     .y(d => ySmokeScale(d.smokes));

    // chartGroup.append('path')
    //     .data([fullData])
    //     .attr('d', drawLine)
    //     .attr("fill", "none")
    //     .classed('line', true)
    //     .attr("stroke", "red");
 
    var circles = chartGroup.selectAll('circle');

    circles.data(fullData)
        .enter()
        .append('circle')
        .attr('cx', d => xAgeScale(d.age))
        .attr('cy', d => ySmokeScale(d.smokes))
        .attr('r', 10)
        .attr('stroke', 'black')
        .attr('fill', 'lightblue')
    
    // console.log(bottomAxis);
})

//  if (!svgArea.empty()) {
//     svgArea.remove();
//   }