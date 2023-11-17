import React from "react";
import ReactDOM from "react-dom";
import { MainTable } from "./MainTable";
import { ShortCutTable } from "./ShortCutTable";
import { QueryCombineTool } from "./QueryCombineTool";
import { DataProvider, useData } from "./DataContext";

const Test = () => {
  const { setDataElement } = useData();

  const toggleShortcut = () => {
    const panel = document.getElementById("shortcutLinks") as HTMLElement;
    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "block";
    } else {
      panel.style.display = "none";
    }

    setDataElement((prevElement) => ({
      dbName:
        prevElement.dbName === "website_taipei"
          ? "website_taipei"
          : "website_taipei",
      table: "cats",
    }));
  };

  return (
    <>
      <div className="flex flex-col">
        {/* NAV */}
        <nav className="bg-blue-500 p-4 text-white fixed w-full z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Content for NAV */}
            <div className="font-bold text-2xl">MySQL Speaker</div>
            <div className="w-auto">
              <div
                id="userInfo"
                className="bg-purple-600 w-8 h-8 rounded-full cursor-pointer"
                title="用户名全名"
              ></div>
            </div>
            <div>Navigation Items</div>
          </div>
        </nav>

        {/* PATH */}
        <div className="bg-blue-200 p-2 text-blue-900 text-sm sticky top-16 z-20">
          <div className="max-w-7xl mx-auto">
            {/* Content for PATH */}
            <div>Breadcrumb / Path</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 pt-20 w-full">
          {/* MAIN TABLE */}
          <div className="flex flex-row lg:space-x-4 relative">
            <div className="flex-grow bg-white shadow-lg p-4 mb-4 overflow-auto max-h-screen h-[440px] rounded-md">
              {/* Placeholder for React Table Component */}
              <MainTable />
            </div>
          </div>

          {/* QUERY COMBINE */}
          <div className="bg-white shadow-lg p-4 mb-4 overflow-auto h-[150px] rounded-md">
            {/* Content for QUERY COMBINE */}
            <QueryCombineTool />
          </div>

          {/* HISTORY */}
          <div className="bg-white shadow-lg p-4 mb-4 overflow-auto h-[150px] rounded-md">
            {/* Content for HISTORY */}
            {/* <HistoryTable/> */}
          </div>
        </div>
      </div>
      <div className="floating-container">
        <button
          id="toggleShortcut"
          className="floating-btn text-white"
          onClick={toggleShortcut}
        >
          Shortcut
        </button>
        <div
          className="bg-white shadow-lg p-4 mb-4 overflow-auto hidden floating-panel"
          id="shortcutLinks"
        >
          <ShortCutTable />
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <DataProvider>
      <Test />
    </DataProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
