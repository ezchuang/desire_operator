import { useDbsAndTables } from "./DbsAndTablesContext";
import { useMessage } from "./MessageContext";
import { readDbsAndTables } from "../models/readData";

const useRenewDbsAndTables = () => {
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { dbsAndTablesElement, setDbsAndTablesElement } = useDbsAndTables();

  const renewDbsAndTables = async () => {
    try {
      const response = await readDbsAndTables();

      const dbsAndTablesData = response[0]; // 返回的資料結構是 DbsAndTablesElement[...]

      if (deepCompareArrays(dbsAndTablesData, dbsAndTablesElement)) {
        return;
      }
      console.log(dbsAndTablesData);
      setDbsAndTablesElement(dbsAndTablesData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setSeverity("error");
        setMessage(`讀取 Database 失敗，錯誤訊息: ${error.message}`);
        setOpenSnackbar(true);
      }
    }
  };

  return renewDbsAndTables;
};

export default useRenewDbsAndTables;

function isObject(obj: any): boolean {
  return obj != null && typeof obj === "object";
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

// 深比較
function deepCompareArrays(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!deepEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
}
