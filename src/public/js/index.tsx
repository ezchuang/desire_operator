import React from "react";
import ReactDOM from "react-dom";
import MainTable from "./MainTable";
import ShortCutTable from "./ShortCutTable";
import QueryCombineTool from "./QueryCombineTool";

ReactDOM.render(<MainTable />, document.querySelector("#mainTable"));
ReactDOM.render(<ShortCutTable />, document.querySelector("#shortCutTable"));
ReactDOM.render(
  <QueryCombineTool />,
  document.querySelector("#queryCombineTool")
);

document.getElementById("toggleShortcut")!.addEventListener("click", () => {
  const panel = document.getElementById("shortcutLinks") as HTMLElement;
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
});
