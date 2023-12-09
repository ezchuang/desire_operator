import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";

import { AddColumnObj } from "../types/Interfaces";
import { useReadData } from "../types/ReadDataContext";
import { useMessage } from "../types/MessageContext";
import { useColumnData } from "../types/ColumnDataContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { MysqlDataTypes } from "../types/MysqlDataTypes";
import { addColumn } from "../models/updateData";
import NullSign from "../types/NullSign";
// import { ColumnData } from "../types/Interfaces";

// 因為不開放部分功能，所以不用 Interfaces 中的 ColumnData
interface Column {
  columnName: string;
  type: string;
  columnSizeLimit?: number;
  precisionLimit?: number;
  needsLimit?: boolean;
  needsPrecision?: boolean;
  defaultValue?: string;

  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
  isNotNull: boolean;
  isUniqueKey: boolean;
  isUnsigned: boolean;
  isZerofill: boolean;
  // isMultipleKey: boolean;
  // isBlob: boolean;
  // isBinary: boolean;
  // isEnum: boolean;
  // isTimestamp: boolean;
  // isSet: boolean;
}

const initialColumnState: Column = {
  columnName: "",
  type: "",
  columnSizeLimit: 0,
  precisionLimit: 0,
  needsLimit: false,
  needsPrecision: false,
  defaultValue: "",

  isPrimaryKey: false,
  isAutoIncrement: false,
  isNotNull: false,
  isUniqueKey: false,
  isUnsigned: false,
  isZerofill: false,
  // isMultipleKey: false,
  // isBlob: false,
  // isBinary: false,
  // isEnum: false,
  // isTimestamp: false,
  // isSet: false,
};

// Column Options keys 顯示格式化，ex: isPrimaryKey => Primary Key
function formatLabel(key: string): string {
  let formattedLabel = key.replace(/^is/, "");

  formattedLabel = formattedLabel.replace(/([A-Z])/g, " $1");

  // formattedLabel = formattedLabel
  //   .toLowerCase()
  //   .split(' ')
  //   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //   .join(' ');

  return formattedLabel;
}

const AddColumn: React.FC = () => {
  // const [columns, setColumns] = useState<Column[]>([]);
  const [newColumn, setNewColumn] = useState<Column>(initialColumnState);
  const { columnDataElement } = useColumnData();
  const [havePrimaryKey, setHavePrimaryKey] = useState<boolean>(false);
  const [edit, setEdit] = useState(false); // 此 component 中專屬於 defaultValue 修改

  const [displaySize, setDisplaySize] = useState<{
    min?: number | null;
    max?: number | null;
  }>({});
  const { readDataElement, setReadDataElement } = useReadData();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { setRefreshDataFlag } = useRefreshDataFlag();

  const checkboxProperties = [
    "isPrimaryKey",
    "isAutoIncrement",
    "isUniqueKey",
    "isUnsigned",
    "isNotNull",
    // "isBlob",
    // "isBinary",
  ];

  const handleColumnTypeChange = (event: SelectChangeEvent<string>) => {
    const selectedType = event.target.value as keyof typeof MysqlDataTypes;
    const typeDetails = MysqlDataTypes[selectedType];

    setNewColumn((prev) => ({
      ...prev,
      type: selectedType,
      needsLimit: typeDetails.needsLimit,
      needsPrecision: "precision" in typeDetails,
      columnSizeLimit: typeDetails.needsLimit ? prev.columnSizeLimit : 0,
      precisionLimit:
        typeDetails && "precision" in typeDetails ? prev.precisionLimit : 0,
    }));

    if (
      typeDetails.needsLimit &&
      typeDetails.displaySize.min !== undefined &&
      typeDetails.displaySize.max !== undefined
    ) {
      setDisplaySize({
        min: typeDetails.displaySize.min,
        max: typeDetails.displaySize.max,
      });
    } else {
      setDisplaySize({});
    }
  };

  useEffect(() => {
    // 處理相互依賴和排斥關係
    let updatedColumn = { ...newColumn };

    // 主鍵不能是多重鍵
    // if (updatedColumn.isPrimaryKey) {
    //   updatedColumn.isMultipleKey = false;
    // }

    // 自動增長僅適用於主鍵
    if (updatedColumn.isAutoIncrement && !updatedColumn.isPrimaryKey) {
      updatedColumn.isAutoIncrement = false;
    }

    // 如果是BLOB或TEXT類型，不能設為主鍵、唯一鍵、無符號或零填充
    // if (updatedColumn.isBlob) {
    //   updatedColumn.isPrimaryKey = false;
    //   updatedColumn.isUniqueKey = false;
    //   updatedColumn.isUnsigned = false;
    //   updatedColumn.isZerofill = false;
    // }

    // 如果設置為二進制，則不能無符號或零填充
    // if (updatedColumn.isBinary) {
    //   updatedColumn.isUnsigned = false;
    //   updatedColumn.isZerofill = false;
    // }

    // 比較 updatedColumn 和 newColumn 是否相同，若不同則更新狀態
    if (JSON.stringify(updatedColumn) !== JSON.stringify(newColumn)) {
      setNewColumn(updatedColumn);
    }
  }, [newColumn]);

  useEffect(() => {
    // 寫個區域變數(名稱一樣)來辨識功能
    const havePrimaryKey =
      columnDataElement.filter((column) => (column.options as any).isPrimaryKey)
        .length >= 1
        ? true
        : false;
    setHavePrimaryKey(havePrimaryKey);
  }, [columnDataElement]);

  const handleSubmit = async () => {
    try {
      if (!newColumn.columnName || !newColumn.type) {
        setSeverity("warning");
        setMessage("請填寫列名和列類型");
        setOpenSnackbar(true);
        return;
      }

      const columnOptions: string[] = [];
      if (newColumn.isPrimaryKey) columnOptions.push("PRIMARY KEY");
      if (newColumn.isAutoIncrement) columnOptions.push("AUTO_INCREMENT");
      // if (newColumn.isZerofill) columnOptions.push("ZEROFILL");
      if (newColumn.isUnsigned) columnOptions.push("UNSIGNED");
      if (newColumn.isNotNull) columnOptions.push("NOT NULL");
      if (newColumn.isUniqueKey) columnOptions.push("UNIQUE");

      const updateValue =
        newColumn.defaultValue === `""`
          ? ""
          : newColumn.defaultValue === "0"
          ? "0"
          : newColumn.defaultValue
          ? newColumn.defaultValue
          : null;

      const requestOptions: AddColumnObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        columnName: newColumn.columnName,
        columnType:
          newColumn.type +
          (newColumn.needsLimit && newColumn.columnSizeLimit
            ? `(${newColumn.columnSizeLimit}${
                newColumn.needsPrecision && newColumn.precisionLimit
                  ? "," + String(newColumn.precisionLimit)
                  : ""
              })`
            : ""),
        columnOption: columnOptions,
        defaultValue: updateValue,
      };

      const response = await addColumn(requestOptions);
      console.log(response);
      if (!response) {
        throw new Error(`Add Column Error!`);
      }
      // setColumns([...columns, newColumn]);

      setSeverity("success");
      setMessage("新增成功");
      setOpenSnackbar(true);

      setNewColumn(initialColumnState);
      setReadDataElement({ ...readDataElement });
      setRefreshDataFlag([]);
    } catch (error) {
      console.error("Error adding column: ", error);
      setSeverity("error");
      setMessage(`新增失敗: ${error}`);
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewColumn((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setNewColumn((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOthersInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    let numericValue = Number(value);

    // 檢查並應用大小限制
    if (
      name === "columnSizeLimit" &&
      newColumn.needsLimit &&
      newColumn.type !== ""
    ) {
      if (
        numericValue <
          MysqlDataTypes[newColumn.type as keyof typeof MysqlDataTypes]
            .displaySize.min! ||
        numericValue >
          MysqlDataTypes[newColumn.type as keyof typeof MysqlDataTypes]
            .displaySize.max!
      ) {
        setSeverity("error");
        setMessage(`輸入值不在允許的範圍內`);
        setOpenSnackbar(true);
        return;
      }
    }

    if (name === "precisionLimit" && newColumn.needsPrecision) {
      // 例如，如果小數精度的範圍是 0 到 30
      if (
        numericValue < 0 ||
        numericValue > 30 ||
        numericValue > newColumn.columnSizeLimit!
      ) {
        setSeverity("error");
        setMessage(`輸入值不在允許的範圍內`);
        setOpenSnackbar(true);
        return;
      }
    }

    setNewColumn((prev) => ({ ...prev, [name]: numericValue }));
  };

  // 根據規則決定是否禁用某個選項
  function shouldDisableCheckbox(key: string): boolean {
    switch (key) {
      // 從進來的條件，取得互鎖條件的 boolean 來決定是否禁用
      case "isMultipleKey":
        return newColumn.isPrimaryKey;
      case "isPrimaryKey":
        // return havePrimaryKey || newColumn.isBlob;
        return havePrimaryKey || newColumn.isUniqueKey;
      case "isAutoIncrement":
        return !newColumn.isPrimaryKey;
      case "isUniqueKey":
        // return newColumn.isBlob;
        return newColumn.isPrimaryKey;
      // case "isUnsigned":
      //   // case "isZerofill":
      //   // 禁用於 Blob 或 Binary 類型
      //   return newColumn.isBlob || newColumn.isBinary;
      case "isBlob":
        return newColumn.isUniqueKey || newColumn.isUnsigned;
      case "isBinary":
        return newColumn.isUnsigned;
      default:
        return false;
    }
  }

  return (
    <Box sx={{ padding: "2px" }}>
      <Box mt={1} sx={{ padding: "0px" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Column 名稱"
              name="columnName"
              value={newColumn.columnName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="column-type-label">Column 型別</InputLabel>
              <Select
                labelId="column-type-label"
                value={newColumn.type}
                onChange={handleColumnTypeChange}
                label="Column 型別"
              >
                {Object.keys(MysqlDataTypes).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {newColumn.needsLimit && (
            <Grid item xs={12}>
              <TextField
                size="small"
                label={`顯示上限 ${displaySize?.min ?? "無"} ~ ${
                  displaySize?.max ?? "無"
                }`}
                name="columnSizeLimit"
                type="number"
                value={newColumn.columnSizeLimit}
                onChange={handleOthersInputChange}
                fullWidth
              />
            </Grid>
          )}
          {newColumn.needsPrecision && (
            <Grid item xs={12}>
              <TextField
                size="small"
                // label={`小數位數上限 0 ~ ${maxPrecision}`} // 顯示最大精度值
                label={`小數位數上限 0 ~ 30`} // 顯示最大精度值
                name="precisionLimit"
                type="number"
                value={newColumn.precisionLimit}
                onChange={handleOthersInputChange}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              size="small"
              label={`預設值，空字串請輸入 "" `}
              name="defaultValue"
              value={newColumn.defaultValue || ""}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={
                      edit || newColumn.defaultValue ? "w-0" : "w-full"
                    }
                  >
                    {edit || newColumn.defaultValue ? null : <NullSign />}
                  </InputAdornment>
                ),
              }}
              onClick={() => {
                setEdit(true);
                if (!newColumn.defaultValue) {
                  setNewColumn((prev) => ({ ...prev, defaultValue: "" }));
                }
              }}
              onBlur={() => {
                setEdit(false);
              }}
            />
          </Grid>
          {checkboxProperties.map((prop) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={prop}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    name={prop}
                    sx={{ m: 0, padding: "2px" }}
                    checked={newColumn[prop as keyof Column] as boolean}
                    onChange={handleCheckboxChange}
                    disabled={shouldDisableCheckbox(prop)}
                  />
                }
                label={formatLabel(prop)}
              />
            </Grid>
          ))}
          {/* <Box mt={1}> */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              fullWidth
            >
              Add Column
            </Button>
          </Grid>
          {/* </Box> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default AddColumn;
