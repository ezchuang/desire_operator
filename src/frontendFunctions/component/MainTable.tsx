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
import { ColumnDataElement, useColumnData } from "../types/ColumnDataContext";
import {
  ColumnOnShowElement,
  useColumnOnShow,
} from "../types/ColumnOnShowContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { useSocket } from "../types/SocketContext";
import { readTableData } from "../models/readData";
import { updateData } from "../models/updateData";
import { deleteData } from "../models/deleteData";
import NullSign from "../types/NullSign";
import ColumnWithTooltip from "./ColumnWithTooltip";

interface WhereCluster {
  column: string;
  operator: string;
  value: any;
}

interface EditState {
  row: number;
  cell: string;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 60,
    lineHeight: "1rem",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: 60,
    padding: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },
}));

const MainTable: React.FC = () => {
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { readDataElement } = useReadData();
  const { columnDataElement } = useColumnData();
  const { columnOnShowElement } = useColumnOnShow();
  const { refreshDataFlag, setRefreshDataFlag } = useRefreshDataFlag();
  const { socket } = useSocket();

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
    // if (socket) {
    //   socket.emit('cell-updated', (updateInfo: IRowUpdate) => {
    //     // 根據接收到的數據更新 UI
    //     // ...更新邏輯...
    //   });
    // }
  };

  // 處理輸入變更
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  };

  // 送出 delete row 的需求
  const handleRemoveRow = async (row: any, index: number) => {
    const whereCluster: WhereCluster[] = columnDataElement
      .filter((column) => row[column.id] !== "")
      .map((column) => ({
        column: column.id,
        operator: "=",
        value: row[column.id],
      }));

    // console.log(whereCluster);

    const removeRow = {
      dbName: readDataElement.dbName,
      table: readDataElement.table,
      where: whereCluster,
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
      setMessage(`刪除失敗: ${error}`);
      setOpenSnackbar(true);
    }
  };

  // 按下 enter 送出需求
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditConfirm();
    }
  };

  // 處理編輯確認
  const handleEditConfirm = async () => {
    const editingRow = data[edit.row]; // 獲取正在編輯的行(第幾行/哪一行)
    const editingColumn = columnOnShowElement.find(
      (column) => column.id === edit.cell
    ); // 獲取正在編輯的列(列名稱)

    // 數值不變，直接結束
    if (editingColumn && editingRow[editingColumn.id] === editValue) {
      // 重置編輯狀態
      setEdit({ row: -1, cell: "" });
      return;
    }

    const updateValue =
      editValue === `""`
        ? ""
        : editValue === "0"
        ? "0"
        : editValue
        ? editValue
        : null;

    if (editingColumn) {
      const updateObj = {
        dbName: readDataElement.dbName!,
        table: readDataElement.table!,
        data: {
          [editingColumn.id]: updateValue,
        },
        where: columnDataElement.map((cell: ColumnDataElement) => ({
          column: cell.id,
          operator: "=",
          value: editingRow[cell.id],
        })),
      };

      try {
        await updateData(updateObj);

        const updatedData = [...data]; // 解開資料複製到 updatedData
        updatedData[edit.row] = {
          // 找到修改位置準備賦值
          ...editingRow, // 展開該列複製
          [editingColumn.id]: editValue, // 將該列該值更新
        };

        socket?.emit("refreshHistory");
        console.log("refreshHistory");

        setData(updatedData); // 刷新
        setRefreshDataFlag([]);
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
        // console.log(response);
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
            {/* 建立表格 Columns */}
            {columnOnShowElement.map((column: ColumnOnShowElement) => (
              <ColumnWithTooltip key={column.id} column={column} />
            ))}
            <StyledTableCell size="small">DELETE DATA</StyledTableCell>
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
                        value={editValue ?? ""}
                        onChange={handleInputChange}
                        onBlur={handleEditConfirm}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        fullWidth
                        label={`修改中，空字串請輸入 "" `}
                        size="small"
                      />
                    ) : (
                      value ?? <NullSign />
                    )}
                  </StyledTableCell>
                );
              })}
              <StyledTableCell>
                <div className="flex justify-center">
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
                </div>
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
