import * as d3 from "d3";
import { drawTable } from "./drawTable.js";

// CODE FOR CREATING A SCROLLABLE TABLE, REFERENCED FROM:
// http://forrestcoward.github.io/examples/scrollable-table/index.html

//////////////////////////
// Table specifications //
//////////////////////////
export function updateTable(text_input, group_filter) {
  d3
    // path should be set from where the index.html is
    .json("src/data/nutrition.json", d3.autoType)
    .then((data) => {
      // filter by text input
      // Check if strValue was empty string, false, 0, null, undefined, ...
      if (text_input) {
        data = data.filter(function (d) {
          return d.Short_Desc.includes(text_input);
        });
      }

      // filter by dropdown
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

      // Create variables for the table
      let table = document.getElementById("table");
      var width = table.offsetWidth + 22;
      var height = table.offsetHeight;
      var valueFunc = function (data) {
        return data.MajorGroup;
      };
      var textFunc = function (data) {
        return data.Short_Desc;
      };
      var columns = ["Food", "Group"];
      drawTable(
        data,
        "#table",
        { width: width, height: height },
        valueFunc,
        textFunc,
        columns
      );
    });
}
