import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import { readTableData } from "./readData";
import { updateData } from "./updateData";
import { useData } from "./DataContext";

interface Column {
  id: string;
  label: string;
  backgroundColor?: string;
  minWidth?: number;
  padding?: number;
  align?: "right";
  // format?: (value: number) => string;
}

interface EditState {
  row: number;
  cell: string;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 408,
  },
});

export const MainTable: React.FC = () => {
  const classes = useStyles();
  const [columns, setColumns] = useState<Column[]>([]);
  const [data, setData] = useState<any[]>([]);
  const { readDataElement } = useData();
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

  // 處理編輯確認
  const handleEditConfirm = async () => {
    const editingRow = data[edit.row]; // 獲取正在編輯的行(第幾行)
    const editingColumn = columns.find((column) => column.id === edit.cell); // 獲取正在編輯的列(列名稱)

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
        // read 修改數據的地方，return [列資料, 表頭資料 / 行分類 + CSS Style]
        const [rowData, columnData] = await readTableData(readDataElement);

        setData(rowData);

        const dynamicColumns = columnData.map((column: any) => {
          return {
            id: column.name,
            label: column.name.toUpperCase(),
            minWidth: 60,
            padding: 6,
            backgroundColor: "#d0d0d0",
          };
        });
        setColumns(dynamicColumns);
      } catch (error) {
        console.error("Error reading data: ", error);
      }
    };

    readData();
  }, [readDataElement]);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    padding: column.padding,
                    backgroundColor: column.backgroundColor,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  const isEditing =
                    edit.row === index && edit.cell === column.id;
                  return (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        padding: column.padding,
                      }}
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
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
