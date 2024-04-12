import * as d3 from "d3";

//////////////////////////
// Chart specifications //
//////////////////////////
const margin = { top: 20, right: 10, bottom: 5, left: 65 };
const width = 450 - margin.left - margin.right;
const height = 100 - margin.top - margin.bottom;

// const originalFill = "steelblue",
//   hoveredFill = "#33d4ff";
const originalOpacity = 0.5,
  hoveredOpacity = 1;
const originalSize = 3.5,
  hoveredSize = 6;

//////////////////
// Tooltip info //
//////////////////
let mineralTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//////////////////////////////////////////
// Function to draw mineral plot info //
////////////////////////////////////////
export function drawMineralsplot(mineral, group_filter, text_input, svg_id) {
  d3
    // path should be set from where the index.html is
    .csv("src/data/minerals_dotplot_data.csv", d3.autoType)
    .then((data) => {
      if (!data) return;

      // text input
      if (text_input) {
        data = data.filter(function (d) {
          return d.Short_Desc.includes(text_input);
        });
      }

      // filter data based on dropdown input
      if (group_filter != "All") {
        if (group_filter === "Fats and Oils") {
          data = data.filter(function (d) {
            return d.MajorGroup == "Fats and Olis";
          });
        } else {
          data = data.filter(function (d) {
            return d.MajorGroup == group_filter;
          });
        }
      }

      // select mineral to make chart of
      data = data.filter(function (d) {
        return d.Minerals == mineral;
      });

      // Declare the x (horizontal position) scale
      let x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.Value))
        .rangeRound([margin.left + 10, width - margin.right]);
      // Function to draw the x-axis
      let xAxis = (g) =>
        g
          .attr("transform", `translate(0,${margin.top})`)
          .call(d3.axisTop(x).ticks(7))
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("stroke-opacity", 0.1)
              .attr("y2", height - margin.bottom - margin.top)
          )
          .call((g) => g.selectAll(".domain").remove());

      // Declare the y (vertical position) scale
      let y = d3
        .scalePoint()
        .domain(data.map((d) => d.Minerals))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(1);
      // Function to draw the y-axis
      let yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("stroke-opacity", 0.1)
              .attr("x2", width - margin.right - margin.left)
          )
          .call((g) => g.selectAll(".domain").remove());

      // Declare color scale
      var groupColors = d3
        .scaleOrdinal()
        .domain([
          "Dairy and Egg",
          "Fruit, Nut and Vegetable",
          "Processed Foods",
          "Fats and Olis",
          "Meat and Fish",
          "Starches",
          "Soups, Sauces, and Gravies",
          "Beverages",
        ])
        .range([
          "#C8C8C8", // Dairy and Eggs
          "#4E9F3A", // Fruits and Veggies
          "#766331", // Processed Foods
          "#B5A272", // Fats and Oils
          "#C94D63", // Meat and Fish
          "#E0C94F", // Starches
          "#69B8BD", // Soup,Sauce,Gravies
          "#C07DDF", // Beverages
        ]);
      // console.log(groupColors);

      //////////////////////////
      //// Draw the chart //////
      //////////////////////////

      const svg = d3.select(svg_id).attr("viewBox", [0, 0, width, height]);

      const minDotGroup = svg;
      minDotGroup.selectAll("*").remove(); // remove all elements to redraw the chart

      minDotGroup.append("g").call(xAxis);

      minDotGroup.append("g").call(yAxis);

      let mineralDots = minDotGroup
        .append("g")
        .attr("pointer-events", "all")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", `mineralDots`)
        .style("fill", function (d) {
          return groupColors(d.MajorGroup);
        })
        .style("opacity", originalOpacity)
        .attr("r", originalSize)
        .attr("cx", (d) => x(d.Value))
        .attr("cy", (d) => y(d.Minerals))
        .attr("cursor", "pointer");

      //////////////////////////
      // Failure of adding Force Direction //
      ////////////////////////
      // It's pretty but wrong.

      // Define the force simulation
      // const simulation = d3
      //   .forceSimulation(data)
      //   .force("x", d3.forceX((d) => x(d.Value)).strength(0.05))
      //   .force("y", d3.forceY((d) => y(d.Minerals)).strength(0.05))
      //   .force("collide", d3.forceCollide(1)); // Use a radius just a bit larger than the circles to avoid overlap
      // // .alphaDecay(0)
      // // .alpha(0.3);
      // // .on("tick", tick);

      // simulation.on("tick", () => {
      //   mineralDots.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      // });

      //////////////////////
      // Add Interactions //
      //////////////////////

      mineralDots
        .on("mouseover", mouseEnterDot)
        .on("mouseout", mouseLeaveDot)
        .on("mousemove", mouseMoveDot);

      function mouseEnterDot(event, d) {
        d3.selectAll(".mineralDots").style("opacity", 0.05);
        d3.select(this)
          .style("opacity", hoveredOpacity)
          .style("stroke", "black")
          .style("stroke-width", 2)
          .attr("r", hoveredSize);

        mineralTooltip
          .data(data)
          .style("opacity", 0.9)
          .html(`${d.Short_Desc} <br> ${d.GmWt_1}g`);
      }

      function mouseLeaveDot(event, d) {
        d3.selectAll(".mineralDots").style("opacity", originalOpacity);
        d3.select(this)
          .style("opacity", originalOpacity)
          .style("stroke", "none")
          .attr("r", originalSize);

        mineralTooltip.style("opacity", 0);
      }

      function mouseMoveDot(event, d) {
        const leftPos = event.pageX;
        const topPos = event.pageY - 60;

        mineralTooltip
          .style("left", leftPos + "px")
          .style("top", topPos + "px");
      }
    });
}
