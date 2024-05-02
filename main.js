// d3 code to create stars in background of site
import * as d3 from "/node_modules/d3";

// chart specs
let svg_width = d3.select(".test-stars").node().getBoundingClientRect().width;
let svg_height = d3.select(".test-stars").node().getBoundingClientRect().height;

// // define SVG
const svg = d3.select(".test-stars");

let data = createData();
createScatterplot();

function createData() {
  /////////////////////////////////////////////////////
  // Create random-ish data for stars — ending positions //
  ///////////////////////////////////////////////////

  // Array of x-starting positions
  let xstartpos_arr = Array.from({ length: 50 }, () => randomNumber(-10, 50));
  console.log(xstartpos_arr);
  let ystartpos_arr = [];

  for (var i = 0; i < xstartpos_arr.length; i++) {
    if (i >= 0) {
      // Array of y-starting positions
      ystartpos_arr.push(-10);
    } else {
      ystartpos_arr.push(randomNumber(50, 100));
      console.log("code gets here");
    }
  }

  // Array of x-positions
  let xpos_arr = Array.from({ length: 50 }, () => randomNumber(0.5, 14));
  console.log(xpos_arr);
  // Array of y-positions
  let ypos_arr = Array.from({ length: 50 }, () => randomNumber(680, 780));
  console.log(ypos_arr);

  // Array of x-velocities
  let xvel_arr = Array.from(
    { length: 100 },
    () => Math.floor(Math.random() * 5) / 10
  );
  console.log(xvel_arr);
  // Array of y-velocities
  let yvel_arr = Array.from(
    { length: 100 },
    () => Math.floor(Math.random() * 5) / 10
  );
  console.log(yvel_arr);

  // create json
  let data = [];
  for (var i = 0; i < xpos_arr.length; i++) {
    data.push({
      x: xpos_arr[i],
      y: ypos_arr[i],
      xstart: xstartpos_arr[i],
      ystart: ystartpos_arr[i],
      xv: xvel_arr[i],
      yv: yvel_arr[i],
    });
  }

  // output
  return data;
}

function createScatterplot() {
  // Add X axis
  let xScale = d3.scaleLinear().domain([0, 100]).range([0, svg_width]);
  //   svg
  //     .append("g")
  //     .attr("transform", "translate(0," + svg_height + ")")
  //     .call(d3.axisBottom(xScale));

  // Add Y axis
  let yScale = d3.scaleLinear().domain([0, 1000]).range([svg_height, 0]);
  //   svg.append("g").call(d3.axisLeft(yScale));

  // Add dots
  let dots = svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "star-point")
    .attr("d", d3.symbol().type(d3.symbolStar).size("75"))
    .style("fill", "#EDBF4A")
    .attr("transform", function (d) {
      return "translate(" + d.xstart + "," + d.ystart + ")";
    });

  // Add animation
  dots
    .transition(d3.easeCubic)
    .delay(function (d, i) {
      return i * 50;
    })
    .duration(8000)
    .attr("transform", function (d) {
      return "translate(" + Math.abs(d.x * 100) + "," + d.y + ")";
    });

  /////////////////////////
  // Add hover functionality //
  /////////////////////////
  dots.on("mouseover", mouseOnStar).on("mouseout", mouseOutStar);

  function mouseOnStar(event, d) {
    let randomjitter = randomNumber(6, 10);
    let randomjitter2 = randomNumber(6, 10);
    d3.select(this)
      .transition(d3.easeCubic)
      .attr("transform", function (d) {
        return `translate(${
          Math.abs(d.x * 100) + randomjitter
        }, ${d.y + randomjitter2})`;
      });
  }

  function mouseOutStar(event, d) {
    d3.select(this).attr("transform", function (d) {
      return "translate(" + Math.abs(d.x * 100) + "," + d.y + ")";
    });
    //   .style("opacity", originalOpacity)
    //   .style("fill", originalFill)
    //   .style("stroke", "");
  }

  ///////////////////////////////////////
  // attempt 1: Define force simulation //
  /////////////////////////////////////
  //   let dots = svg
  //     .append("g")
  //     .selectAll("dot")
  //     .data(data)
  //     .enter()
  //     .append("path")
  //     .attr("class", "star-point")
  //     .attr("d", d3.symbol().type(d3.symbolStar).size("75"))
  //     .style("fill", "#EDBF4A");
  //   const simulation = d3
  //     .forceSimulation(data)
  //     .force("x", d3.forceX((d) => xScale(d.x * 0.3)).strength(0.3))
  //     .force("y", d3.forceY(svg_height * 0.9).strength(0.05))
  //     .force("collide", d3.forceCollide(4)); // Use a radius just a bit larger than the circles to avoid overlap

  //   simulation.on("tick", () => {
  //     dots.attr("transform", function (d) {
  //       return "translate(" + d.x * 100 + "," + d.y + ")";
  //     });
  //   });
}

///////////////////////////////////////////////

function randomNumber(min, max) {
  let num = Math.random() * (max - min) + min;
  num *= Math.round(Math.random()) ? 1 : -1;
  return num;
}

///////////////////////////////////////////////
