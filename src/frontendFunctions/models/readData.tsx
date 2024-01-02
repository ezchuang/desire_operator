import { ReadDataElement } from "../types/ReadDataContext";
import fetchPackager from "./fetchPackager";

// 取得全部的 DBs 跟 Tables
export async function readDbsAndTables(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/databases",
      methodFetch: "GET",
    });

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching DBs and tables: ", err);
    throw err;
  }
}

// 讀取 Table 內部資料
// 有帶 body 仍需用 POST
export async function readTableData(element: ReadDataElement): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/data/query",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching data: ", err);
    throw err;
  }
}

// 讀取歷史資料
export async function readHistoryData(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/history",
      methodFetch: "GET",
    });

    // console.log(result.data);
    // console.log(result.structure);

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching history: ", err);
    throw err;
  }
}
