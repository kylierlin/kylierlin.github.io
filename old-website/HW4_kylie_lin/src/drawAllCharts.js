import * as d3 from "d3";
import { drawMineralsplot } from "./minerals_plots/minerals_dot.js";
import { drawVitaminsplot } from "./vitamins_plots/vitamins_dot.js";
import { updateTable } from "./table.js";
import { drawfatsBar } from "./fats_bar.js";
import { drawCarbHistogram } from "./totalcarbs_hist.js";
import { drawFatHistogram } from "./totalfat_hist.js";
import { drawProteinHistogram } from "./protein_hist.js";
import { drawCaloriesHistogram } from "./calories_hist.js";
import { drawWaterHistogram } from "./water_hist.js";
import { drawWeightHistogram } from "./weight_hist.js";

/////////////////////////////
// Variables for Controls //
///////////////////////////

const majorGroup = [
  "All",
  "Dairy and Egg",
  "Fruit, Nut and Vegetable",
  "Processed Foods",
  "Fats and Oils",
  "Meat and Fish",
  "Starches",
  "Soups, Sauces, and Gravies",
  "Beverages",
];

// Dropdown input
let groupSelect = d3.select("#group-select");

majorGroup.forEach((grp) => {
  // Append a new option to the dropdown with the current selected attribute as both its visible text and value
  groupSelect.append("option").text(grp).attr("value", grp);
});

// Initial plot configuration
let selectedGroup = "All";
let content = "";
// Set initial values for dropdowns
groupSelect.property("value", selectedGroup);
console.log(selectedGroup);

///////////////////
// Draw Table ////
/////////////////

updateTable(content, selectedGroup);

///////////////////
// Draw Fats Bar ////
/////////////////

drawfatsBar(selectedGroup, content);

///////////////////////
// Draw histograms ////
//////////////////////

drawCarbHistogram(selectedGroup, "#totalcarbs-hist");
drawFatHistogram(selectedGroup, "#totalfat-hist");
drawProteinHistogram(selectedGroup, "#protein-hist");
drawCaloriesHistogram(selectedGroup, "#calories-hist");
drawWaterHistogram(selectedGroup, "#water-hist");
drawWeightHistogram(selectedGroup, "#weight-hist");

//////////////////////////
// Draw Mineral Plots ////
//////////////////////////

drawMineralsplot("Ash", selectedGroup, content, "#Ash-dot");
drawMineralsplot("Calcium", selectedGroup, content, "#Calcium-dot");
drawMineralsplot("Phosphorus", selectedGroup, content, "#Phosphorus-dot");
drawMineralsplot("Iron", selectedGroup, content, "#Iron-dot");
drawMineralsplot("Sodium", selectedGroup, content, "#Sodium-dot");
drawMineralsplot("Potassium", selectedGroup, content, "#Potassium-dot");
drawMineralsplot("Magnesium", selectedGroup, content, "#Magnesium-dot");
drawMineralsplot("Zinc", selectedGroup, content, "#Zinc-dot");
drawMineralsplot("Copper", selectedGroup, content, "#Copper-dot");

//////////////////////////
// Draw Vitamin Plots ////
//////////////////////////

drawVitaminsplot("Vit_A", selectedGroup, content, "#vitA-dot");
drawVitaminsplot("Vit_C", selectedGroup, content, "#vitC-dot");
drawVitaminsplot("Vit_E", selectedGroup, content, "#vitE-dot");
drawVitaminsplot("Thiamin", selectedGroup, content, "#Thiamin-dot");
drawVitaminsplot("Riboflavin", selectedGroup, content, "#Riboflavin-dot");
drawVitaminsplot("Niacin", selectedGroup, content, "#Niacin-dot");

/////////////////////////////////
// Deal with Control Updates ////
////////////////////////////////

// text input
d3.select("#food-search").on("input", function () {
  content = d3.select(this).property("value");
  content = content.toUpperCase();

  // table
  updateTable(content, selectedGroup);

  // fats bar
  drawfatsBar(selectedGroup, content);

  // mineral plots
  drawMineralsplot("Ash", selectedGroup, content, "#Ash-dot");
  drawMineralsplot("Calcium", selectedGroup, content, "#Calcium-dot");
  drawMineralsplot("Phosphorus", selectedGroup, content, "#Phosphorus-dot");
  drawMineralsplot("Iron", selectedGroup, content, "#Iron-dot");
  drawMineralsplot("Sodium", selectedGroup, content, "#Sodium-dot");
  drawMineralsplot("Potassium", selectedGroup, content, "#Potassium-dot");
  drawMineralsplot("Magnesium", selectedGroup, content, "#Magnesium-dot");
  drawMineralsplot("Zinc", selectedGroup, content, "#Zinc-dot");
  drawMineralsplot("Copper", selectedGroup, content, "#Copper-dot");

  // vitamin plots
  drawVitaminsplot("Vit_A", selectedGroup, content, "#vitA-dot");
  drawVitaminsplot("Vit_C", selectedGroup, content, "#vitC-dot");
  drawVitaminsplot("Vit_E", selectedGroup, content, "#vitE-dot");
  drawVitaminsplot("Thiamin", selectedGroup, content, "#Thiamin-dot");
  drawVitaminsplot("Riboflavin", selectedGroup, content, "#Riboflavin-dot");
  drawVitaminsplot("Niacin", selectedGroup, content, "#Niacin-dot");
});

// dropdown
groupSelect.on("change", function (event) {
  selectedGroup = this.value;

  // mineral plots
  drawMineralsplot("Ash", selectedGroup, content, "#Ash-dot");
  drawMineralsplot("Calcium", selectedGroup, content, "#Calcium-dot");
  drawMineralsplot("Phosphorus", selectedGroup, content, "#Phosphorus-dot");
  drawMineralsplot("Iron", selectedGroup, content, "#Iron-dot");
  drawMineralsplot("Sodium", selectedGroup, content, "#Sodium-dot");
  drawMineralsplot("Potassium", selectedGroup, content, "#Potassium-dot");
  drawMineralsplot("Magnesium", selectedGroup, content, "#Magnesium-dot");
  drawMineralsplot("Zinc", selectedGroup, content, "#Zinc-dot");
  drawMineralsplot("Copper", selectedGroup, content, "#Copper-dot");

  // vitamin plots
  drawVitaminsplot("Vit_A", selectedGroup, content, "#vitA-dot");
  drawVitaminsplot("Vit_C", selectedGroup, content, "#vitC-dot");
  drawVitaminsplot("Vit_E", selectedGroup, content, "#vitE-dot");
  drawVitaminsplot("Thiamin", selectedGroup, content, "#Thiamin-dot");
  drawVitaminsplot("Riboflavin", selectedGroup, content, "#Riboflavin-dot");
  drawVitaminsplot("Niacin", selectedGroup, content, "#Niacin-dot");

  // table
  updateTable(content, selectedGroup);

  // fats bar
  drawfatsBar(selectedGroup, content);

  // histograms
  drawCarbHistogram(selectedGroup, "#totalcarbs-hist");
  drawFatHistogram(selectedGroup, "#totalfat-hist");
  drawProteinHistogram(selectedGroup, "#protein-hist");
  drawCaloriesHistogram(selectedGroup, "#calories-hist");
  drawWaterHistogram(selectedGroup, "#water-hist");
  drawWeightHistogram(selectedGroup, "#weight-hist");
});
