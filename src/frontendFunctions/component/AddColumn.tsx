import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";

import { AddColumnObj } from "../types/Interfaces";
import { useReadData } from "../types/ReadDataContext";
import { useMessage } from "../types/MessageContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { addColumn } from "../models/updateData";

interface Column {
  name: string;
  type: string;
  isNotNull: boolean;
  // isPrimaryKey: boolean;
  isUniqueKey: boolean;
  // isMultipleKey: boolean;
  // isBlob: boolean;
  isUnsigned: boolean;
  // isZerofill: boolean;
  // isBinary: boolean;
  // isEnum: boolean;
  // isAutoIncrement: boolean;
  // isTimestamp: boolean;
  // isSet: boolean;
}

const initialColumnState: Column = {
  name: "",
  type: "",
  isNotNull: false,
  // isPrimaryKey: false,
  isUniqueKey: false,
  // isMultipleKey: false,
  // isBlob: false,
  isUnsigned: false,
  // isZerofill: false,
  // isBinary: false,
  // isEnum: false,
  // isAutoIncrement: false,
  // isTimestamp: false,
  // isSet: false,
};

const AddColumn: React.FC = () => {
  // const [columns, setColumns] = useState<Column[]>([]);
  const [newColumn, setNewColumn] = useState<Column>(initialColumnState);

  const { readDataElement, setReadDataElement } = useReadData();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { setRefreshDataFlag } = useRefreshDataFlag();

  useEffect(() => {
    // 處理相互依賴和排斥關係
    let updatedColumn = { ...newColumn };

    // 主鍵不能是多重鍵
    // if (updatedColumn.isPrimaryKey) {
    //   updatedColumn.isMultipleKey = false;
    // }

    // 自動增長僅適用於主鍵
    // if (updatedColumn.isAutoIncrement && !updatedColumn.isPrimaryKey) {
    //   updatedColumn.isAutoIncrement = false;
    // }

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

  const handleSubmit = async () => {
    try {
      if (!newColumn.name || !newColumn.type) {
        setSeverity("warning");
        setMessage("請填寫列名和列類型");
        setOpenSnackbar(true);
        return;
      }

      const columnOptions: string[] = [];
      if (newColumn.isNotNull) columnOptions.push("NOT NULL");
      if (newColumn.isUniqueKey) columnOptions.push("UNIQUE");
      if (newColumn.isUnsigned) columnOptions.push("UNSIGNED");

      const requestOptions: AddColumnObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        columnName: newColumn.name!,
        columnType: newColumn.type!,
        columnOption: columnOptions,
        // defaultValue: null,
      };

      const response = await addColumn(requestOptions);

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
      console.error("Error adding column:", error);
      setSeverity("error");
      setMessage("新增失敗");
      setOpenSnackbar(true);
    }
  };

  const handleNewColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewColumn((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <Box sx={{ padding: "2px" }}>
      <Box mt={1} sx={{ padding: "0px" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              label="Column Name"
              name="name"
              value={newColumn.name}
              onChange={(e) =>
                setNewColumn({ ...newColumn, name: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Column Type"
              name="type"
              value={newColumn.type}
              onChange={(e) =>
                setNewColumn({ ...newColumn, type: e.target.value })
              }
              fullWidth
            />
          </Grid>
          {Object.entries(newColumn)
            .slice(2)
            .map(([key]) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={key}>
                <FormControlLabel
                  sx={{ m: 0, paddingLeft: "8px" }}
                  control={
                    <Checkbox
                      name={key}
                      sx={{ m: 0, padding: "2px" }}
                      checked={newColumn[key as keyof Column] as boolean}
                      onChange={handleNewColumnChange}
                      disabled={shouldDisableCheckbox(key)}
                    />
                  }
                  label={key.replace(/([A-Z])/g, " $1").trim()}
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

  // 根據規則決定是否禁用某個選項
  function shouldDisableCheckbox(key: string): boolean {
    switch (key) {
      // case "isMultipleKey":
      //   return newColumn.isPrimaryKey;
      // case "isAutoIncrement":
      //   return !newColumn.isPrimaryKey;
      // case "isPrimaryKey":
      // case "isUniqueKey":
      // return newColumn.isBlob;
      // case "isUnsigned":
      // case "isZerofill":
      //   // 禁用於 Blob 或 Binary 類型
      // return newColumn.isBlob || newColumn.isBinary;
      default:
        return false;
    }
  }
};

export default AddColumn;
