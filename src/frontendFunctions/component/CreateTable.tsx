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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useMessage } from "../types/MessageContext";
import { useDbsAndTables } from "../types/DbsAndTablesContext";
import useRenewDbsAndTables from "../types/RenewDbsAndTables";
import { mysqlDataTypes } from "../types/mysqlDataTypes";
import { createTable } from "../models/createData";
import { ColumnData } from "../types/Interfaces";
// import { TableData } from "../types/Interfaces";

const defaultColumn = {
  columnName: "",
  columnType: "",
  columnSizeLimit: 0,
  defaultValue: "",
  isUnsigned: false,
  isUniqueKey: false,
  isPrimaryKey: false,
  isAutoIncrement: false,
  isZerofill: false,
  // isForeignKey: false,
  isNotNull: false,
  // foreignKeyReference: { referencedTable: "", referencedColumnName: "" },
};

// 針對數值型 Column Type 驗證是否已開啟 Unsigned
// 若兩者皆滿足，才能啟用 Zerofill 選項
function shouldEnableZerofill(column: ColumnData): boolean {
  const numericTypes = [
    "INT",
    "SMALLINT",
    "TINYINT",
    "MEDIUMINT",
    "BIGINT",
    "DECIMAL",
    "FLOAT",
    "DOUBLE",
  ];
  return numericTypes.includes(column.columnType) && column.isUnsigned;
}

const CreateTable: React.FC = () => {
  const [dbName, setDbName] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [columns, setColumns] = useState<ColumnData[]>([]);
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
    if (
      (field === "columnType" || field === "isUnsigned") &&
      updatedColumn.isZerofill
    ) {
      updatedColumn.isZerofill = shouldEnableZerofill(updatedColumn);
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
      mysqlDataTypes[columnType as keyof typeof mysqlDataTypes];
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

      if (response) {
        setSeverity("success");
        setMessage(`新增 Table ${dbName} 成功`);
        setOpenSnackbar(true);

        renewDbsAndTables();
      }
    } catch (error) {
      console.error("資料庫創建失敗:", error);
      setSeverity("error");
      setMessage(`新增 Database ${dbName} 失敗`);
      setOpenSnackbar(true);
    }
  };

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
          mysqlDataTypes[column.columnType as keyof typeof mysqlDataTypes];
        const needsLimit = currentType?.needsLimit;
        const displaySize = currentType?.displaySize;

        return (
          <Grid container spacing={2} alignItems="center" key={index}>
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
                    {Object.keys(mysqlDataTypes).map((typeName) => (
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
                label="預設值"
                value={column.defaultValue}
                onChange={(event) =>
                  handleColumnChange(index, "defaultValue", event.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveColumn(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isPrimaryKey}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isPrimaryKey",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Primary Key"
                disabled={column.isUniqueKey}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isAutoIncrement}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isAutoIncrement",
                        event.target.checked
                      )
                    }
                    disabled={!column.isPrimaryKey || column.isZerofill} // 只有 isPrimaryKey === True 時才能勾選AI
                  />
                }
                label="Auto Increment"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isUnsigned}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isUnsigned",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Unsigned"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isNotNull}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isNotNull",
                        event.target.checked
                      )
                    }
                  />
                }
                label="Not Null"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isZerofill}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isZerofill",
                        event.target.checked
                      )
                    }
                    disabled={column.isAutoIncrement} // Auto Increment 跟 Zerofill 衝突
                  />
                }
                label="Zerofill"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                sx={{ m: 0, paddingLeft: "8px" }}
                control={
                  <Checkbox
                    sx={{ m: 0, padding: "2px" }}
                    checked={column.isUniqueKey}
                    onChange={(event) =>
                      handleColumnChange(
                        index,
                        "isUniqueKey",
                        event.target.checked
                      )
                    }
                    disabled={column.isPrimaryKey} // Unique 跟 PK 不同時存在
                  />
                }
                label="Unique Key"
              />
            </Grid>
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={column.isForeignKey}
                  onChange={(event) =>
                    handleColumnChange(
                      index,
                      "isForeignKey",
                      event.target.checked
                    )
                  }
                />
              }
              label="外鍵"
            />
            {column.isForeignKey && (
              <>
                <TextField
                  label="參考表"
                  value={column.foreignKeyReference?.referencedTable}
                  onChange={(event) =>
                    handleFkReferenceChange(
                      index,
                      "referencedTable",
                      event.target.value
                    )
                  }
                />
                <TextField
                  label="參考列"
                  value={column.foreignKeyReference?.referencedColumnName}
                  onChange={(event) =>
                    handleFkReferenceChange(
                      index,
                      "referencedColumnName",
                      event.target.value
                    )
                  }
                />
              </>
            )} */}
          </Grid>
        );
      })}
      <Box mt={1}>
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
