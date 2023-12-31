import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../types/Interfaces";
import fetchPackager from "./fetchPackager";

// 更新個別資料
export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/updateData",
      methodFetch: "PUT",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("Error in updateData: ", err);
    throw err;
  }
}

// 插入新的 Row
export async function insertData(element: InsertObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/insertData",
      methodFetch: "PUT",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("Error in insertData: ", err);
    throw err;
  }
}

// 修改表格加入新的 Column
export async function addColumn(element: AddColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/addColumn",
      methodFetch: "PUT",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err: any) {
    console.error("Error in addColumn:", err.message);
    throw err;
  }
}

// 修改表格刪除指定 Column
export async function delColumn(element: delColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/delColumn",
      methodFetch: "PUT",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("Error in delColumn:", err);
    throw err;
  }
}
