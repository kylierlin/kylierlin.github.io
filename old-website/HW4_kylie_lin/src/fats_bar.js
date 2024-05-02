import * as d3 from "d3";

//////////////////////////
// Chart specifications //
//////////////////////////
const margin = { top: 40, right: 30, bottom: 40, left: 40 };
const width = 345 - margin.left - margin.right;
const height = 215 - margin.top - margin.bottom;

const originalFill = "#B5A272",
  hoveredFill = "#95804A";
const originalOpacity = 1,
  hoveredOpacity = 0.5;

/////////////////
// svg details //
/////////////////
var svg = d3
  .select("#fats-bars")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////////
// Tooltip info //
//////////////////
let fatsBarTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "bartooltip")
  .style("opacity", 0);

export function drawfatsBar(group_filter, text_input) {
  d3.csv("src/data/nutrition.csv", d3.autoType).then((data) => {
    // create new dataset for the types of fat
    const categories = data.columns.reduce(
      (a, c) => (c.includes("FA_") ? a.add(c.split("_")[1]) : null, a),
      new Set()
    );

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

    const fatsData = data.reduce((a, c) => {
      categories.forEach((cat) =>
        a.push({
          fat_type: cat,
          value: c[`FA_${cat}`],
        })
      );
      return a;
    }, []);
    //   console.log(fatsData);

    // aggregate: mean the values by fat type
    const aggFatsData = d3.rollups(
      fatsData,
      (v) => d3.mean(v, (d) => d.value),
      (d) => d.fat_type
    );
    //   console.log(aggFatsData);

    //////////////////////
    // Create bar chart //
    //////////////////////

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(aggFatsData, (d) => d[1])])
      .range([0, width]);
    // Declare the y (vertical position) scale.
    const y = d3
      .scaleBand()
      .domain(aggFatsData.map((d) => `${d[0]}`))
      .range([0, height])
      .padding(0.1); // adds space between bars

    const fatsBarGroup = svg;
    fatsBarGroup.selectAll("*").remove(); // remove all elements to redraw the chart
    // create rectangles for each bar
    //   console.log(aggFatsData[0]);
    let myBars = fatsBarGroup
      .append("g")
      .selectAll("#fats-bar")
      .data(aggFatsData)
      .join("rect")
      .attr("class", "fatsBar")
      .attr("x", (d) => x(0))
      .attr("y", (d) => y(d[0]))
      .attr("width", function (d, i) {
        return x(d[1]);
      })
      .attr("height", y.bandwidth())
      .attr("fill", originalFill)
      .attr("opacity", originalOpacity);

    // Add the x-axis and label.
    fatsBarGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).ticks(4))
      .call((g) =>
        g
          .append("text") // axis title
          .attr("x", width - 20)
          .attr("y", 40)
          .attr("fill", "currentColor")
          .attr("font-weight", 900)
          .attr("text-anchor", "start")
          .text("Mean")
      );

    // Add the y-axis and label.
    fatsBarGroup
      .append("g")
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text") // axis title
          .attr("x", -40)
          .attr("y", -10)
          .attr("fill", "currentColor")
          .attr("font-weight", 900)
          .attr("text-anchor", "start")
          .text("Amount of Fat (g)")
      );

    //////////////////////
    // Add Interactions //
    //////////////////////

    myBars
      .on("mouseover", mouseEnterBar)
      .on("mouseout", mouseLeaveBar)
      .on("mousemove", mouseMoveBar);

    function mouseEnterBar(event, d) {
      d3.select(this)
        .style("opacity", hoveredOpacity)
        .style("fill", hoveredFill)
        .style("stroke-width", 3);

      fatsBarTooltip
        .data(aggFatsData)
        .style("opacity", 0.9)
        .html(`${d[0]}: ${d[1].toFixed(3)}`);
    }

    function mouseLeaveBar(event, d) {
      d3.select(this)
        .style("opacity", originalOpacity)
        .style("fill", originalFill)
        .style("stroke", "");

      fatsBarTooltip.style("opacity", 0);
    }

    function mouseMoveBar(event, d) {
      const leftPos = event.pageX - y.bandwidth();
      const topPos = event.pageY - 40;

      fatsBarTooltip.style("left", leftPos + "px").style("top", topPos + "px");
    }
  });
}
