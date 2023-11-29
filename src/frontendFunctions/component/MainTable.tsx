import React, { useState, useEffect } from "react";
import {
  styled,
  Box,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useMessage } from "../types/MessageContext";
import { useReadData } from "../types/ReadDataContext";
// import { useColumnData } from "../types/ColumnDataContext";
import { useColumnOnShow } from "../types/ColumnOnShowContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { readTableData } from "../models/readData";
import { updateData } from "../models/updateData";
import { deleteData } from "../models/deleteData";

// interface Column {
//   id: string;
//   label: string;
// }

interface EditState {
  row: number;
  cell: string;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 60,
    padding: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: 60,
    padding: 14,
  },
}));

const MainTable: React.FC = () => {
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { readDataElement } = useReadData();
  const { columnOnShowElement } = useColumnOnShow();
  const { refreshDataFlag } = useRefreshDataFlag();

  const [data, setData] = useState<any[]>([]);
  const [edit, setEdit] = useState<EditState>({ row: -1, cell: "" });
  const [editValue, setEditValue] = useState<string>(""); // 前端element中的文字貌似都是用字串儲存

  // 處理單元格點擊
  const handleCellClick = (
    cellId: string,
    rowId: number,
    currentValue: string
  ) => {
    setEdit({ row: rowId, cell: cellId });
    setEditValue(currentValue);
  };

  // 處理輸入變更
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  };

  //
  const handleRemoveRow = async (row: any, index: number) => {
    const removeRow = {
      dbName: readDataElement.dbName,
      table: readDataElement.table,
      where: [
        {
          column: "id",
          operator: "=",
          value: row.id,
        },
      ],
    };

    try {
      const response = await deleteData(removeRow);

      if (response) {
        setSeverity("success");
        setMessage(`刪除成功`);
        setOpenSnackbar(true);

        const rowData = data.filter((_, i) => i !== index);
        setData(rowData);
      }
    } catch (error) {
      console.error("資料刪除失敗:", error);
      setSeverity("error");
      setMessage(`刪除失敗`);
      setOpenSnackbar(true);
    }
  };

  // 處理編輯確認
  const handleEditConfirm = async () => {
    const editingRow = data[edit.row]; // 獲取正在編輯的行(第幾行)
    const editingColumn = columnOnShowElement.find(
      (column) => column.id === edit.cell
    ); // 獲取正在編輯的列(列名稱)

    if (editingColumn) {
      const updateObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        data: {
          [editingColumn.id]: editValue,
        },
        where: [
          {
            column: editingColumn.id,
            operator: "=",
            value: editingRow[editingColumn.id],
          },
        ],
      };

      try {
        await updateData(updateObj);

        const updatedData = [...data]; // 解開資料複製到 updatedData
        updatedData[edit.row] = {
          // 找到修改位置準備賦值
          ...editingRow, // 展開該列複製
          [editingColumn.id]: editValue, // 將該列該值更新
        };

        setData(updatedData); // 刷新
      } catch (error) {
        console.error("Error updating data: ", error);
      }
    }

    // 重置編輯狀態
    setEdit({ row: -1, cell: "" });
  };

  useEffect(() => {
    const readData = async () => {
      try {
        if (!readDataElement.dbName || !readDataElement.table) {
          return;
        }

        // read 修改數據的地方，return [列資料, 表頭資料 / 行分類 + CSS Style]
        const response = await readTableData(readDataElement);

        setData(response[0]);

        // const columnNames = columnData.map((column: any) => {
        //   return {
        //     id: column.name,
        //     label: column.name.toUpperCase(),
        //   };
        // });

        // setColumnOnShowElement(columnNames);
      } catch (error) {
        console.error("Error reading data: ", error);
      }
    };

    readData();
  }, [readDataElement, refreshDataFlag]);

  return (
    // <MainStyledPaper>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="main table">
        <TableHead>
          <TableRow>
            {columnOnShowElement.map((column) => (
              <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
            ))}
            <StyledTableCell>DELETE DATA</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 依據 column.id 取出的 column name 取得 data[i] 中對應 key 的 value */}
          {data.map((row, index) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              {columnOnShowElement.map((column) => {
                const value = row[column.id];
                const isEditing = edit.row === index && edit.cell === column.id;
                return (
                  <StyledTableCell
                    key={column.id}
                    onClick={() => handleCellClick(column.id, index, value)}
                  >
                    {isEditing ? (
                      <TextField
                        value={editValue}
                        onChange={handleInputChange}
                        onBlur={handleEditConfirm}
                        autoFocus
                        fullWidth
                      />
                    ) : (
                      value
                    )}
                  </StyledTableCell>
                );
              })}
              <StyledTableCell>
                <Box>
                  <Button
                    variant="contained"
                    sx={{ padding: "2px" }}
                    onClick={() => handleRemoveRow(row, index)}
                    color="secondary"
                  >
                    <RemoveCircleOutlineIcon />
                  </Button>
                </Box>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // </MainStyledPaper>
  );
};

export default MainTable;
