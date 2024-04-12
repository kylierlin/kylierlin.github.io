import * as d3 from "d3";

// CODE FOR CREATING A ZOOMABLE BUBBLE CHART, REFERENCED FROM:
// (modified for the assignment)
// https://observablehq.com/@d3/zoomable-circle-packing

//////////////////////////
// Chart specifications //
//////////////////////////
const width = 400;
const height = width;

///////////////////////////////
// Variables for Interaction //
///////////////////////////////
const originalOpacity = 0.7,
  hoveredOpacity = 1;
const originalFill = "#4a5a20",
  hoveredFill = "#5a6a83";

/////////////////////////////////
// Hierarchical Data for Chart //
////////////////////////////////
let data = {
  name: "Major Food Group",
  children: [
    {
      name: "Dairy and Egg",
      fill: "#C8C8C8",
      children: [
        { name: "Dairy and Egg Products", fill: "#C8C8C8", value: 160 },
      ],
    },
    {
      name: "Fruit, Nut and Vegetable",
      fill: "#4E9F3A",
      children: [
        { name: "Spices and Herbs", fill: "#4E9F3A", value: 56 },
        { name: "Fruits and Fruit Juices", fill: "#4E9F3A", value: 244 },
        {
          name: "Vegetables and Vegetable Products",
          fill: "#4E9F3A",
          value: 748,
        },
        { name: "Nut and Seed Products", fill: "#4E9F3A", value: 139 },
        { name: "Legumes and Legume Products", fill: "#4E9F3A", value: 199 },
      ],
    },
    {
      name: "Processed Foods",
      fill: "#766331",
      children: [
        { name: "Baby Foods", fill: "#766331", value: 256 },
        { name: "Baked Products", fill: "#766331", value: 432 },
        { name: "Snacks and Sweets", fill: "#766331", value: 330 },
        { name: "Fast Foods", fill: "#766331", value: 135 },
        { name: "Meals, Entrees, and Sidedishes", fill: "#766331", value: 187 },
      ],
    },
    {
      name: "Fats and Oils",
      fill: "#B5A272",
      children: [{ name: "Fats and Oils", fill: "#B5A272", value: 145 }],
    },
    {
      name: "Meat and Fish",
      fill: "#C94D63",
      children: [
        { name: "Poultry Products", fill: "#C94D63", value: 328 },
        { name: "Sausages and Luncheon Meats", fill: "#C94D63", value: 168 },
        { name: "Pork Products", fill: "#C94D63", value: 226 },
        { name: "Beef Products", fill: "#C94D63", value: 717 },
        { name: "Finfish and Shellfish Products", fill: "#C94D63", value: 245 },
        { name: "Lamb, Veal, and Game Products", fill: "#C94D63", value: 271 },
      ],
    },
    {
      name: "Starches",
      fill: "#E0C94F",
      children: [
        { name: "Breakfast Cereals", fill: "#E0C94F", value: 262 },
        { name: "Cereal Grains and Pasta", fill: "#E0C94F", value: 154 },
      ],
    },
    {
      name: "Soups, Sauces, and Gravies",
      fill: "#69B8BD",
      children: [
        { name: "Soups, Sauces, and Gravies", fill: "#69B8BD", value: 354 },
      ],
    },
    {
      name: "Beverages",
      fill: "#C07DDF",
      children: [
        { name: "Fruits and Fruit Juices", fill: "#C07DDF", value: 39 },
        { name: "Beverages", fill: "#C07DDF", value: 181 },
      ],
    },
  ],
};

// console.log(data);

//////////////////
// Create chart //
//////////////////

// Compute the layout.
const pack = (data) =>
  d3.pack().size([width, height]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );
const root = pack(data);

// console.log(root);

// Create the SVG container.
const svg = d3
  .select("#bubble")
  .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
  .attr("width", width)
  .attr("height", height)
  .attr(
    "style",
    `max-width: 100%; height: 400px; display: block; margin: 0 0px; background: #373737;`
  );

// Append the nodes.
const node = svg
  .append("g")
  .selectAll("circle")
  .data(root.descendants().slice(1))
  .join("circle")
  .attr("class", function (d) {
    return "linkedBubbles";
    // d.data.name
  })
  .attr("fill", (d) => (d.children ? d.data.fill : d.data.fill))
  .attr("fill-opacity", (d) => (d.children ? 0.3 : 1))
  .attr("pointer-events", (d) => (!d.children ? "none" : null))
  .style("cursor", "pointer")
  .on("mouseover", function () {
    d3.select(this)
      .attr("stroke", (d) => (d.children ? d.data.fill : d.data.fill))
      .attr("stroke-width", "3");
  })
  .on("mouseout", function () {
    d3.select(this).attr("stroke", null);
  })
  .on(
    "click",
    (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
  );

// Append the text labels.
const label = svg
  .append("g")
  .style("font", "10px sans-serif")
  .style("fill", "#FFF")
  .style("font-weight", 700)
  .attr("pointer-events", "none")
  .attr("text-anchor", "middle")
  .selectAll("text")
  .data(root.descendants())
  .join("text")
  .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
  .style("display", (d) => (d.parent === root ? "inline" : "none"))
  .text((d) => d.data.name);

// Create the zoom behavior and zoom immediately in to the initial focus node.
svg.on("click", (event) => zoom(event, root));
let focus = root;
let view;
zoomTo([focus.x, focus.y, focus.r * 2]);

function zoomTo(v) {
  const k = width / v[2];

  view = v;

  label.attr(
    "transform",
    (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
  );
  node.attr(
    "transform",
    (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
  );
  node.attr("r", (d) => d.r * k);
}

function zoom(event, d) {
  const focus0 = focus;

  focus = d;

  const transition = svg
    .transition()
    .duration(event.altKey ? 7500 : 750)
    .tween("zoom", (d) => {
      const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
      return (t) => zoomTo(i(t));
    });

  label
    .filter(function (d) {
      return d.parent === focus || this.style.display === "inline";
    })
    .transition(transition)
    .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
    .on("start", function (d) {
      if (d.parent === focus) this.style.display = "inline";
    })
    .on("end", function (d) {
      if (d.parent !== focus) this.style.display = "none";
    });
}
