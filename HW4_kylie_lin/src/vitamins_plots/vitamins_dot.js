import * as d3 from "d3";

//////////////////////////
// Chart specifications //
//////////////////////////
const margin = { top: 20, right: 30, bottom: 5, left: 60 };
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
let vitaminTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//////////////////////////////////////////
// Function to draw vitamins plot info //
////////////////////////////////////////
export function drawVitaminsplot(vitamin, group_filter, text_input, svg_id) {
  d3
    // path should be set from where the index.html is
    .csv("src/data/vitamins_dotplot_data.csv", d3.autoType)
    .then((data) => {
      if (!data) return;

      // text input
      if (text_input) {
        data = data.filter(function (d) {
          return d.Short_Desc.includes(text_input);
        });
      }

      // select group to filter (if not All)
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

      // select vitamin to make chart of
      data = data.filter(function (d) {
        return d.Vitamins == vitamin;
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
        .domain(data.map((d) => d.Vitamins))
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

      const vitDotGroup = svg;
      vitDotGroup.selectAll("*").remove(); // remove all elements to redraw the chart

      vitDotGroup.append("g").call(xAxis);

      vitDotGroup.append("g").call(yAxis);

      let vitaminDots = vitDotGroup
        .append("g")
        // .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "vitaminDots")
        .style("fill", function (d) {
          return groupColors(d.MajorGroup);
        })
        .style("opacity", originalOpacity)
        .attr("r", originalSize)
        .attr("cx", (d) => x(d.Value))
        .attr("cy", (d) => y(d.Vitamins))
        .attr("cursor", "pointer");

      //////////////////////
      // Add Interactions //
      //////////////////////

      vitaminDots
        .on("mouseover", mouseEnterDot)
        .on("mouseout", mouseLeaveDot)
        .on("mousemove", mouseMoveDot);

      function mouseEnterDot(event, d) {
        d3.selectAll(".vitaminDots").style("opacity", 0.05);
        d3.select(this)
          .style("opacity", hoveredOpacity)
          .style("stroke", "black")
          .style("stroke-width", 2)
          .attr("r", hoveredSize);

        vitaminTooltip.data(data).style("opacity", 0.9).html(`${d.Short_Desc}`);
      }

      function mouseLeaveDot(event, d) {
        d3.selectAll(".vitaminDots").style("opacity", originalOpacity);
        d3.select(this)
          .style("opacity", originalOpacity)
          .style("stroke", "none")
          .attr("r", originalSize);

        vitaminTooltip.style("opacity", 0);
      }

      function mouseMoveDot(event, d) {
        const leftPos = event.pageX;
        const topPos = event.pageY - 60;

        vitaminTooltip
          .style("left", leftPos + "px")
          .style("top", topPos + "px");
      }
    });
}
