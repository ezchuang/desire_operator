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
import { createTable } from "../models/createData";

interface ForeignKeyReference {
  referencedTable?: string;
  referencedColumnName?: string;
}

export interface ColumnData {
  columnName: string;
  columnType: string;
  isUnsigned: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNotNull: boolean;
  foreignKeyReference?: ForeignKeyReference;
}
const defaultColumn = {
  columnName: "",
  columnType: "",
  isUnsigned: false,
  isPrimaryKey: false,
  isForeignKey: false,
  isNotNull: false,
  foreignKeyReference: { referencedTable: "", referencedColumnName: "" },
};

const CreateTable: React.FC = () => {
  const [dbName, setDbName] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [columns, setColumns] = useState<ColumnData[]>([defaultColumn]);
  const { dbsAndTablesElement } = useDbsAndTables();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const renewDbsAndTables = useRenewDbsAndTables();

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        columnName: "",
        columnType: "",
        isUnsigned: false,
        isPrimaryKey: false,
        isForeignKey: false,
        isNotNull: false,
        foreignKeyReference: { referencedTable: "", referencedColumnName: "" },
      },
    ]);
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
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
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

  const handleSubmit = async () => {
    try {
      const tableData = {
        dbName: dbName,
        table: tableName,
        columns: columns,
      };
      const response = await createTable(tableData);

      if (response) {
        setSeverity("success");
        setMessage(`新增 Database ${dbName} 成功`);
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
      <FormControl fullWidth margin="normal" sx={{ mt: 0, mb: 1 }} size="small">
        <InputLabel id="database-select-label">選擇資料庫</InputLabel>
        <Select
          labelId="database-select-label"
          value={dbName}
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

      {columns.map((column, index) => (
        <Grid container spacing={2} alignItems="center" key={index}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="列名稱"
              value={column.columnName}
              onChange={(event) =>
                handleColumnChange(index, "columnName", event.target.value)
              }
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="數據類型"
              value={column.columnType}
              onChange={(event) =>
                handleColumnChange(index, "columnType", event.target.value)
              }
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
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
              label="主鍵"
            />
            <FormControlLabel
              control={
                <Checkbox
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
              label="無符號"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={column.isNotNull}
                  onChange={(event) =>
                    handleColumnChange(index, "isNotNull", event.target.checked)
                  }
                />
              }
              label="不為空"
            />
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
            <IconButton onClick={() => handleRemoveColumn(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
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
