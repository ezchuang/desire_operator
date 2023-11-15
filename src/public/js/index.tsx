import React from "react";
import ReactDOM from "react-dom";
import MainTable from "./MainTable";

ReactDOM.render(<MainTable />, document.querySelector("#mainTable"));

// document.addEventListener("DOMContentLoaded", () => {
//   const toggleShortcut: HTMLElement | null =
//     document.querySelector("#toggleShortcut");
//   const shortcutLinks: HTMLElement | null =
//     document.querySelector("#shortcutLinks");

//   // 切換快捷方式顯示/隱藏
//   toggleShortcut?.addEventListener("click", () => {
//     shortcutLinks?.classList.toggle("hidden");
//   });

//   document.addEventListener("click", (event) => {
//     const target = event.target as Node; // 类型断言，确保target是Node类型
//     if (!toggleShortcut?.contains(target) && !shortcutLinks?.contains(target)) {
//       shortcutLinks?.classList.add("hidden");
//     }
//   });
// });

document.getElementById("toggleShortcut")!.addEventListener("click", () => {
  const panel = document.getElementById("shortcutLinks") as HTMLElement;
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
});
