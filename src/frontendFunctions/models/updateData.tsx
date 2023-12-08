import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../types/Interfaces";
import fetchPackager from "./fetchPackager";

export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/updateData",
      methodFetch: "POST",
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

export async function insertData(element: InsertObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/insertData",
      methodFetch: "POST",
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

export async function addColumn(element: AddColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/addColumn",
      methodFetch: "POST",
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

export async function delColumn(element: delColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/delColumn",
      methodFetch: "POST",
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
