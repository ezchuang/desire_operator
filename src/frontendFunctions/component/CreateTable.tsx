import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useMessage } from "../types/MessageContext";
import { useDbsAndTables } from "../types/DbsAndTablesContext";
import useRenewDbsAndTables from "../types/RenewDbsAndTables";
import { MysqlDataTypes } from "../types/MysqlDataTypes";
import { createTable } from "../models/createData";
import { ColumnData } from "../types/Interfaces";
import NullSign from "../types/NullSign";
// import { TableData } from "../types/Interfaces";

interface EditState {
  idx: number;
}

const defaultColumn: ColumnData = {
  columnName: "",
  columnType: "",
  columnSizeLimit: 0,
  defaultValue: "",

  isPrimaryKey: false,
  isNotNull: false,
  isAutoIncrement: false,
  isUniqueKey: false,
  isUnsigned: false,
  isZerofill: false,
};

// 針對數值型 Column Type 驗證是否已開啟 Unsigned
// 若兩者皆滿足，才能啟用 Zerofill 選項
// function shouldEnableZerofill(column: ColumnData): boolean {
//   const numericTypes = [
//     "INT",
//     "SMALLINT",
//     "TINYINT",
//     "MEDIUMINT",
//     "BIGINT",
//     "DECIMAL",
//     "FLOAT",
//     "DOUBLE",
//   ];
//   return numericTypes.includes(column.columnType) && column.isUnsigned;
// }

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

const CreateTable: React.FC = () => {
  const [dbName, setDbName] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [columns, setColumns] = useState<ColumnData[]>([defaultColumn]);

  const [edit, setEdit] = useState<EditState>({ idx: -1 });
  const { dbsAndTablesElement } = useDbsAndTables();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const renewDbsAndTables = useRenewDbsAndTables();

  const handleAddColumn = () => {
    setColumns([...columns, defaultColumn]);
  };

  const handleRemoveColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
  };

  const handleColumnChange = (
    index: number,
    field: keyof ColumnData,
    value: any
  ) => {
    const updatedColumns = [...columns];
    const updatedColumn = { ...updatedColumns[index], [field]: value };

    if (field === "isPrimaryKey") {
      updatedColumn.isAutoIncrement = value
        ? updatedColumn.isAutoIncrement
        : false;
    }

    // 針對 型別 與 Unsigned 屬性 檢查是否適用 ZeroFill
    // if (
    //   (field === "columnType" || field === "isUnsigned") &&
    //   updatedColumn.isZerofill
    // ) {
    //   updatedColumn.isZerofill = shouldEnableZerofill(updatedColumn);
    // }

    if (field === "defaultValue") {
      updatedColumn.defaultValue = value;
    }

    updatedColumns[index] = updatedColumn;

    setColumns(updatedColumns);
  };

  // const handleFkReferenceChange = (
  //   index: number,
  //   field: keyof ForeignKeyReference,
  //   value: string
  // ) => {
  //   const updatedColumns = [...columns];
  //   updatedColumns[index].foreignKeyReference = {
  //     ...updatedColumns[index].foreignKeyReference,
  //     [field]: value,
  //   };
  //   setColumns(updatedColumns);
  // };

  // 檢查是否會超過極限
  const handleLimitChange = (
    index: number,
    field: keyof ColumnData,
    value: any
  ) => {
    let numericValue = Number(value);
    const columnType = columns[index].columnType;
    const typeDetails =
      MysqlDataTypes[columnType as keyof typeof MysqlDataTypes];
    const minLimit = typeDetails?.displaySize?.min ?? 0;
    const maxLimit = typeDetails?.displaySize?.max ?? Number.MAX_SAFE_INTEGER;

    if (numericValue >= minLimit && numericValue <= maxLimit) {
      handleColumnChange(index, field, numericValue);
    } else {
      setSeverity("error");
      setMessage(`輸入值不在允許的範圍內`);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("原始 Columns: ", columns);

      const response = await createTable({
        dbName: dbName,
        table: tableName,
        columns: columns,
      });

      if (!response) {
        throw new Error("創建異常");
      }

      setSeverity("success");
      setMessage(`新增 Table ${dbName} 成功`);
      setOpenSnackbar(true);

      renewDbsAndTables();
      setColumns([defaultColumn]);
      setTableName("");
      setDbName("");
    } catch (error) {
      console.error("資料庫創建失敗:", error);
      setSeverity("error");
      setMessage(`新增失敗: ${error}`);
      setOpenSnackbar(true);
    }
  };

  // 根據規則決定是否禁用某個選項
  function shouldDisableCheckbox(column: ColumnData, key: string): boolean {
    switch (key) {
      // 從進來的條件，取得互鎖條件的 boolean 來決定是否禁用
      case "isMultipleKey":
        return column.isPrimaryKey;
      case "isPrimaryKey":
        // return havePrimaryKey || newColumn.isBlob;
        return column.isUniqueKey;
      case "isAutoIncrement":
        return !column.isPrimaryKey;
      case "isUniqueKey":
        // return newColumn.isBlob;
        return column.isPrimaryKey;
      // case "isUnsigned":
      //   // case "isZerofill":
      //   // 禁用於 Blob 或 Binary 類型
      //   return newColumn.isBlob || newColumn.isBinary;
      case "isBlob":
        return column.isUniqueKey || column.isUnsigned;
      case "isBinary":
        return column.isUnsigned;
      default:
        return false;
    }
  }

  return (
    <Box width="100%" margin="auto" padding={"2px"}>
      <FormControl
        fullWidth
        margin="normal"
        sx={{ mt: 0, mb: 1 }}
        // margin={"1"}
        size="small"
        variant="outlined"
      >
        <InputLabel id="database-select-label">選擇資料庫</InputLabel>
        <Select
          style={{ width: "100%" }}
          labelId="database-select-label"
          value={dbName}
          variant="outlined"
          label="選擇資料庫"
          onChange={(event) => setDbName(event.target.value)}
        >
          {dbsAndTablesElement
            .map((element) => element.database)
            .map((db) => (
              <MenuItem key={db} value={db}>
                {db}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        sx={{ mt: 0, mb: 1 }}
        label="表名稱"
        value={tableName}
        onChange={(event) => setTableName(event.target.value)}
        size="small"
      />

      {columns.map((column, index) => {
        // Columns 參數輸入位置
        // currentType 上下限渲染前置
        const currentType =
          MysqlDataTypes[column.columnType as keyof typeof MysqlDataTypes];
        const needsLimit = currentType?.needsLimit;
        const displaySize = currentType?.displaySize;
        const isEditing = edit.idx === index;

        return (
          <Grid container spacing={1} alignItems="center" mb={1} key={index}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Column 名稱"
                value={column.columnName}
                onChange={(event) =>
                  handleColumnChange(index, "columnName", event.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <div className="flex justify-center items-center gap-[1px]">
                <FormControl fullWidth size="small">
                  <InputLabel id="columnType-select-label">
                    Column 型別
                  </InputLabel>
                  <Select
                    value={column.columnType}
                    labelId="columnType-select-label"
                    label="Column 型別"
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "columnType",
                        event.target.value
                      )
                    }
                  >
                    {Object.keys(MysqlDataTypes).map((typeName) => (
                      <MenuItem key={typeName} value={typeName}>
                        {typeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {needsLimit && (
                  <TextField
                    fullWidth
                    type="number"
                    label={`顯示上限 ${displaySize?.min ?? "無"} ~ ${
                      displaySize?.max ?? "無"
                    }`}
                    value={column.columnSizeLimit || ""}
                    onChange={(event) =>
                      handleLimitChange(
                        index,
                        "columnSizeLimit",
                        event.target.value
                        // displaySize
                      )
                    }
                    size="small"
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label={`預設值，空字串請輸入 "" `}
                value={column.defaultValue || ""}
                onChange={(event) =>
                  handleColumnChange(index, "defaultValue", event.target.value)
                }
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={
                        isEditing || column.defaultValue ? "w-0" : "w-full"
                      }
                    >
                      {isEditing || column.defaultValue === "" ? (
                        <NullSign />
                      ) : null}
                    </InputAdornment>
                  ),
                }}
                onClick={() => {
                  setEdit({ idx: index });
                  if (
                    column.defaultValue === null ||
                    column.defaultValue === undefined
                  ) {
                    setColumns(
                      columns.map((c, idx) =>
                        idx === index ? { ...c, defaultValue: "" } : c
                      )
                    );
                  }
                }}
                onBlur={() => {
                  setEdit({ idx: -1 });
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveColumn(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>

            {/* <Grid container spacing={1} key={index}> */}
            {Object.keys(column)
              .filter(
                (key) =>
                  key !== "columnName" &&
                  key !== "columnType" &&
                  key !== "columnSizeLimit" &&
                  key !== "defaultValue" &&
                  key !== "isZerofill" // 因為 MySQL 準備要移除此特性了，直接禁用
              )
              .map((key) => (
                <Grid key={key} item xs={6} sm={4} md={3} lg={2}>
                  <FormControlLabel
                    sx={{ m: 0, paddingLeft: "8px" }}
                    control={
                      <Checkbox
                        sx={{ m: 0, padding: "2px" }}
                        checked={column[key as keyof ColumnData] as boolean}
                        onChange={(event) =>
                          handleColumnChange(
                            index,
                            key as keyof ColumnData,
                            event.target.checked
                          )
                        }
                        disabled={shouldDisableCheckbox(column, key)}
                      />
                    }
                    label={formatLabel(key)}
                  />
                </Grid>
              ))}
          </Grid>
          // </Grid>
        );
      })}
      <Box>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          color="primary"
          onClick={handleAddColumn}
          fullWidth
        >
          Add Column
        </Button>
      </Box>
      <Box mt={1}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          fullWidth
        >
          Create Table
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTable;
