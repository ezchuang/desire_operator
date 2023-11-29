import React, { useState } from "react";
import {
  styled,
  Box,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { InsertObj } from "../types/Interfaces";
import { useColumnData } from "../types/ColumnDataContext";
import { useReadData } from "../types/ReadDataContext";
import { useMessage } from "../types/MessageContext";
import { insertData } from "../models/updateData";

const StyledPaper = styled(Paper)({
  width: "100%",
  overflow: "hidden",
});

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 60,
    padding: 4,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: 60,
    padding: 6,
  },
}));

const AddRow: React.FC = () => {
  const [rows, setRows] = useState<Array<any>>([{}]);
  const [newRow, setNewRow] = useState<any>({});

  const { readDataElement, setReadDataElement } = useReadData();
  const { columnDataElement } = useColumnData();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();

  const handleRowChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowIndex: number
  ) => {
    const { name, value } = event.target;
    const updatedRows = rows.map((row, index) => {
      // 比較是否是修改中的那格，若是則展開該 row 並將 該 input name 的 value 更新
      if (index === rowIndex) {
        return { ...row, [name]: value };
      }
      return row;
    });
    console.log(updatedRows);
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, newRow]);
    setNewRow({});
  };

  const saveRows = async () => {
    try {
      const requestOptions: InsertObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        values: rows,
      };

      const response = await insertData(requestOptions);

      if (!response) {
        throw new Error(`Save Rows Error!`);
      }

      console.log("Rows saved:", response);

      setSeverity("success");
      setMessage("新增成功");
      setOpenSnackbar(true);

      setReadDataElement({ ...readDataElement });
      setRows([{}]);
    } catch (error) {
      console.error("Error saving rows:", error);
      setSeverity("error");
      setMessage("新增失敗");
      setOpenSnackbar(true);
    }
  };

  return (
    <StyledPaper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* 建立表格 Columns */}
              {columnDataElement.map((column) => (
                <StyledTableCell key={column.id}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 主要用於更新 修改的表格內容 */}
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columnDataElement.map((column) => (
                  <StyledTableCell key={column.id}>
                    <TextField
                      size="small"
                      name={column.id}
                      value={row[column.id] || ""}
                      onChange={(event) => handleRowChange(event, rowIndex)}
                    />
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={1}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={addRow}
              fullWidth
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Row
            </Button>
          </Grid>
        </Box>
        <Box mt={1}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={saveRows}
              // sx={{ ml: 2 }}
              fullWidth
            >
              Save Data
            </Button>
          </Grid>
        </Box>
      </TableContainer>
    </StyledPaper>
  );
};

export default AddRow;
