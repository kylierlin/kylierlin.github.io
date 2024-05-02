import * as d3 from "d3";

//////////////////////////
// Chart specifications //
//////////////////////////
const margin = { top: 20, right: 10, bottom: 30, left: 40 };
const width = 195 - margin.left - margin.right;
const height = 195 - margin.top - margin.bottom;

let originalFill = "steelblue",
  hoveredFill = "#33d4ff";
const originalOpacity = 1,
  hoveredOpacity = 0.5;

//  color scale as dictionary
let groupColors = {
  "Dairy and Egg": "#C8C8C8",
  "Fruit, Nut and Vegetable": "#4E9F3A",
  "Processed Foods": "#766331",
  "Fats and Olis": "#B5A272",
  "Meat and Fish": "#C94D63",
  Starches: "#E0C94F",
  "Soups, Sauces, and Gravies": "#69B8BD",
  Beverages: "#C07DDF",
};

export function drawCaloriesHistogram(group_filter, svg_id) {
  d3.csv("src/data/nutrition.csv", d3.autoType).then((data) => {
    ///////////////////
    // create chart //
    /////////////////

    // filter data based on dropdown input
    if (group_filter != "All") {
      if (group_filter === "Fats and Oils") {
        data = data.filter(function (d) {
          originalFill = "#B5A272";
          hoveredFill = "#B5A272";
          return d.MajorGroup == "Fats and Olis";
        });
      } else {
        data = data.filter(function (d) {
          // loop through dictionary to change original fill value
          for (const [key, value] of Object.entries(groupColors)) {
            if (group_filter === key) {
              originalFill = value;
              hoveredFill = value;
            }
          }
          return d.MajorGroup == group_filter;
        });
      }
    } else {
      originalFill = "steelblue";
      hoveredFill = "#33d4ff";
    }

    // Bin the data.
    let bins = d3
      .bin()
      .thresholds(15) // # of bins
      .value((d) => d.Energ_Kcal)(data);

    // Declare the x (horizontal position) scale.
    let x = d3
      .scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, width]);

    // Declare the y (vertical position) scale.
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .range([height, 0]);

    //////////////////////
    // Draw the Chart ////
    //////////////////////

    // svg details
    const svg = d3
      .select(svg_id)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", ".todelete");

    // const histBarGroup = svg;
    // svg.selectAll("*").remove(); // remove all elements to redraw the chart
    svg
      .append("rect")
      .attr("transform", `translate(${-40},${-10})`)
      .attr("width", 195)
      .attr("height", 195)
      .attr("fill", "white");

    // Add a rect for each bin.
    let myBars = svg
      .append("g")
      .attr("fill", originalFill)
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("class", "histBars")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", width - 58)
          .attr("y", 28)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .attr("font-weight", 900)
          .attr("text-anchor", "start")
          .text("Calories")
      );

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${0},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -30)
          .attr("y", -10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", 900)
          .attr("text-anchor", "start")
          .text("Count")
      );

    //////////////////////
    // Add Interactions //
    //////////////////////

    myBars.on("mouseover", mouseEnterBar).on("mouseout", mouseLeaveBar);
    // .on("mousemove", mouseMoveBar);

    function mouseEnterBar(event, d) {
      d3.select(this)
        .style("opacity", hoveredOpacity)
        .style("fill", hoveredFill)
        .style("stroke-width", 3);
    }

    function mouseLeaveBar(event, d) {
      d3.select(this)
        .style("opacity", originalOpacity)
        .style("fill", originalFill)
        .style("stroke", "");
    }
  });
}
