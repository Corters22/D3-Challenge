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
        return (`${d.state}<br>${xlabel} ${d[chosenYAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
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
    })

     // xLinearScale function above csv import
    var xLinearScale = xScale(fullData, chosenXAxis);

     // xLinearScale function above csv import
    var yLinearScale = yScale(fullData, chosenYAxis);

      // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fullData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("stroke", "black");

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    
    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    var ylabelsGroup = chartGroup.append('g')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))

    var healthcareLabel = ylabelsGroup.append('text')
        .attr("y", 0)
        .attr("x", 20)
        .attr("value", "healthcare")
        .attr("active", true)
        .text("Lacks Healthcare (%)");

    var smokeLabel = ylabelsGroup.append('text')
        .attr("y", 0)
        .attr("x", 40)
        .attr("value", "smoke")
        .attr("inactive", true)
        .text("Smokes (%)");
    
    var obeseLabel = ylabelsGroup.append('text')
        .attr("y", 0)
        .attr("x", 60)
        .attr("value", "obesity")
        .attr("inactive", true)
        .text("Obese (%)");
    
      // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(fullData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      //current y-axis
      yLinearScale = yScale(fullData, chosenYAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
                .classed('active', false)
                .classed('inactive', true)
          }
          else if(chosenXAxis === 'age') {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel 
                .classed('active', false)
                .classed('inactive', true)
          }
          else {
              povertyLabel
                .classed('active', false)
                .classed('inactive', true)
            ageLabel    
                .classed('active', false)
                .classed('inactive', true)
            incomeLabel 
                .classed('active', true)
                .classed('inactive', false)
          }
        }
      });

        // x axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

    // replaces chosenYAxis with value
    chosenYAxis = value;

    // console.log(chosenYAxis)

  // functions here found above csv import
  // updates y scale for new data
  yLinearScale = yScale(fullData, chosenYAxis);

  // updates x axis with transition
  yAxis = renderYAxes(yLinearScale, yAxis);

  // updates circles with new x values
  circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
            .classed('active', false)
            .classed('inactive', true)
      }
      else if(chosenYAxis === 'smoke') {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel 
            .classed('active', false)
            .classed('inactive', true)
      }
      else {
          healthcareLabel
            .classed('active', false)
            .classed('inactive', true)
        smokeLabel    
            .classed('active', false)
            .classed('inactive', true)
        obeseLabel 
            .classed('active', true)
            .classed('inactive', false)
      }
    }
  });
    
//         // Create initial axis functions
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);
    
//     //create x scale for age
//     var xAgeScale = d3.scaleLinear()
//         .domain([30, d3.max(fullData, d => d.age)])
//         .range([0, chartWidth]);
        
//     // create y scale for smokers
//     var ySmokeScale = d3.scaleLinear()
//         .domain([0, d3.max(fullData, d => d.smokes)])
//         .range([chartHeight, 0])
    

//       // Create two new functions passing the scales in as arguments
//     // These will be used to create the chart's axes
//     var bottomAxis = d3.axisBottom(xAgeScale);
//     var leftAxis = d3.axisLeft(ySmokeScale);

//       // Append an SVG group element to the SVG area, create the left axis inside of it, and give it a class of "axis"
//     chartGroup.append('g')
//       .classed('axis', true)
//       .call(leftAxis);
//    // Append an SVG grou p element to the SVG area, create the bottom axis inside of it
//     // Translate the bottom axis to the bottom of the page
//     // Give it a class of "axis"
//     chartGroup.append('g')
//         .classed('axis', true)
//         .attr("transform", `translate(0, ${chartHeight})`)
//         .call(bottomAxis);

    
//     // create function to draw circles at coordinates
//     // Configure a line function which will plot the x and y coordinates using our scales
//     // var drawLine = d3.line()
//     //     .x(d => xAgeScale(d.age))
//     //     .y(d => ySmokeScale(d.smokes));

//     // chartGroup.append('path')
//     //     .data([fullData])
//     //     .attr('d', drawLine)
//     //     .attr("fill", "none")
//     //     .classed('line', true)
//     //     .attr("stroke", "red");
 
//     var circles = chartGroup.selectAll('circle');

//     circles.data(fullData)
//         .enter()
//         .append('circle')
//         .attr('cx', d => xAgeScale(d.age))
//         .attr('cy', d => ySmokeScale(d.smokes))
//         .attr('r', 10)
//         .attr('stroke', 'black')
//         .attr('fill', 'lightblue')
    
    // console.log(bottomAxis);
})

//  if (!svgArea.empty()) {
//     svgArea.remove();
//   }