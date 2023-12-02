import React, { useState } from "react";
import {
  Box,
  Button,
  InputLabel,
  Select,
  Grid,
  MenuItem,
  FormControl,
} from "@mui/material";

import { delColumnObj } from "../types/Interfaces";
import { useColumnData } from "../types/ColumnDataContext";
import { useReadData } from "../types/ReadDataContext";
import { useMessage } from "../types/MessageContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { delColumn } from "../models/updateData";

interface Column {
  // dbName: string;
  // table: string;
  columnName: string;
}

const initialColumnState: Column = {
  // dbName:"",
  // table: "",
  columnName: "",
};

const DelColumn: React.FC = () => {
  // const [columns, setColumns] = useState<Column[]>([]);
  const [delColumnName, setDelColumnName] = useState<Column>({
    columnName: "",
  });

  const { columnDataElement } = useColumnData();
  const { readDataElement, setReadDataElement } = useReadData();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { setRefreshDataFlag } = useRefreshDataFlag();

  // useEffect(() => {
  //   let updatedColumn = { ...delColumnName };

  //   // 比較 updatedColumn 和 newColumn 是否相同，若不同則更新狀態
  //   if (JSON.stringify(updatedColumn) !== JSON.stringify(delColumnName)) {
  //     setDelColumnName(updatedColumn);
  //   }
  // }, [delColumnName]);

  const handleSubmit = async () => {
    try {
      if (!readDataElement.dbName || !readDataElement.table) {
        setSeverity("warning");
        setMessage("請填寫資料庫和表格名稱");
        setOpenSnackbar(true);
        return;
      }

      const requestOptions: delColumnObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        columnName: delColumnName.columnName!,
      };

      const response = await delColumn(requestOptions);

      if (!response) {
        throw new Error(`Delete Column Error!`);
      }
      // setColumns([...columns, newColumn]);

      setSeverity("success");
      setMessage("刪除成功");
      setOpenSnackbar(true);

      setDelColumnName(initialColumnState);
      setReadDataElement({ ...readDataElement });
      setRefreshDataFlag([]);
    } catch (error) {
      console.error("Error deleting column:", error);
      setSeverity("error");
      setMessage("刪除失敗");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: "2px" }}>
      <Box mt={1} sx={{ padding: "0px" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              margin="normal"
              sx={{ mt: 0, mb: 1 }}
              size="small"
            >
              <InputLabel id="column-select-label">選擇 Column</InputLabel>
              <Select
                labelId="column-select-label"
                label="選擇 Column"
                value={delColumnName.columnName}
                onChange={(event) =>
                  setDelColumnName({ columnName: event.target.value })
                }
              >
                {columnDataElement.map((column) => (
                  <MenuItem key={column.id} value={column.label}>
                    {column.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <TextField
              size="small"
              label="Column 名稱"
              name="name"
              value={delColumnName.name}
              onChange={(e) =>
                setDelColumnName({ ...delColumnName, name: e.target.value })
              }
              fullWidth
            /> */}
          </Grid>
          {/* <Box mt={1}> */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              fullWidth
            >
              Delete Column
            </Button>
          </Grid>
          {/* </Box> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default DelColumn;
