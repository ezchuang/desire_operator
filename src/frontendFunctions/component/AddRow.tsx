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
  Tooltip,
  InputAdornment,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { InsertObj } from "../types/Interfaces";
import { ColumnDataElement, useColumnData } from "../types/ColumnDataContext";
import { useReadData } from "../types/ReadDataContext";
import { useMessage } from "../types/MessageContext";
import { insertData } from "../models/updateData";
import ColumnWithTooltip from "./ColumnWithTooltip";
import NullSign from "../types/NullSign";

interface EditState {
  row: number;
  cell: string;
}

const StyledPaper = styled(Paper)({
  width: "100%",
  overflow: "auto",
});

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: "100px",
    lineHeight: "1rem",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: "100px",
    padding: 6,
    // paddingTop: 6,
    // paddingBottom: 6,
  },
}));

const AddRow: React.FC = () => {
  const [rows, setRows] = useState<Array<any>>([{}]);
  const [newRow, setNewRow] = useState<any>({});
  const [edit, setEdit] = useState<EditState>({ row: -1, cell: "" });

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
    // console.log(updatedRows);
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, newRow]);
    setNewRow({});
  };

  const handleRemoveRow = (rowIndex: number) => {
    const updatedRows = rows.filter((row, index) => index !== rowIndex);
    setRows(updatedRows);
  };

  const saveRows = async () => {
    const newRowValues = rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value === `""` ? "" : value ?? null,
        ])
      )
    );

    try {
      const requestOptions: InsertObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        values: newRowValues,
      };

      const response = await insertData(requestOptions);

      if (!response) {
        throw new Error(`Save Rows Error!`);
      }

      // console.log("Rows saved:", response);

      setSeverity("success");
      setMessage("新增成功");
      setOpenSnackbar(true);

      setReadDataElement({ ...readDataElement });
      setRows([{}]);
    } catch (error) {
      console.error("Error saving rows:", error);
      setSeverity("error");
      setMessage(`新增失敗: ${error}`);
      setOpenSnackbar(true);
    }
  };

  return (
    <StyledPaper>
      <TableContainer sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* 建立表格 Columns */}
              {columnDataElement.map((column: ColumnDataElement) => (
                <ColumnWithTooltip key={column.id} column={column} />
              ))}
              <StyledTableCell>{`DELETE ROW`}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 主要用於更新 修改的表格內容 */}
            {columnDataElement.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columnDataElement.map((column) => {
                    row[column.id] = row[column.id] ?? column.default;
                    const isEditing =
                      edit.row === rowIndex && edit.cell === column.id;
                    return (
                      <StyledTableCell key={column.id}>
                        <Tooltip
                          // 非空驗證提示
                          title={
                            (column.options.isNotNull ||
                              column.options.isPrimaryKey) &&
                            !row[column.id]
                              ? "This field cannot be empty"
                              : ""
                          }
                          placement="bottom"
                          disableHoverListener={
                            !(
                              column.options.isNotNull ||
                              column.options.isPrimaryKey
                            ) || !!row[column.id]
                          }
                        >
                          <TextField
                            label={isEditing ? `空字串請輸入 "" ` : null}
                            size="small"
                            name={column.id}
                            fullWidth
                            // 判斷有無值，判斷有無預設值，皆無呈現空字串
                            value={row[column.id] ?? ""}
                            onChange={(event) =>
                              handleRowChange(event, rowIndex)
                            }
                            error={
                              (column.options.isNotNull ||
                                column.options.isPrimaryKey) &&
                              !row[column.id]
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={
                                    isEditing || row[column.id]
                                      ? "w-0"
                                      : "w-full"
                                  }
                                >
                                  {isEditing || row[column.id] ? null : (
                                    <NullSign />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            onClick={() => {
                              setEdit({ row: rowIndex, cell: column.id });
                              if (
                                row[column.id] === null ||
                                row[column.id] === undefined
                              ) {
                                setRows(
                                  rows.map((r, idx) =>
                                    idx === rowIndex
                                      ? { ...r, [column.id]: "" }
                                      : r
                                  )
                                );
                              }
                            }}
                            onBlur={() => {
                              setEdit({ row: -1, cell: "" });
                            }}
                          />
                        </Tooltip>
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell key={rowIndex}>
                    <div className="flex justify-center">
                      <Box>
                        <Button
                          variant="contained"
                          sx={{ padding: "2px" }}
                          onClick={() => handleRemoveRow(rowIndex)}
                          color="secondary"
                        >
                          <RemoveCircleOutlineIcon />
                        </Button>
                      </Box>
                    </div>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
    </StyledPaper>
  );
};

export default AddRow;
