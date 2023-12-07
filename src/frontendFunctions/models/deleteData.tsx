import fetchPackager from "./fetchPackager";

// 刪除單列資料
export async function deleteData(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error(`There was an error in the delete operation: `, err);
    throw err;
  }
}

// 刪除 Table
export async function deleteTable(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteTable",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error dropping the table: ", err);
    throw err;
  }
}

// 刪除 Database
export async function deleteDb(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteDatabase",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (response.data) {
      return response.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error dropping the database: ", err);
    throw err;
  }
}
