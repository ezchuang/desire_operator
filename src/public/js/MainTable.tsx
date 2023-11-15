import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { fetchDbsAndTables, fetchTableData } from "./fetchDataButton";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  // format?: (value: number) => string;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function MainTable() {
  const classes = useStyles();
  const [data, setData] = useState([]); // 新增狀態來存儲API數據
  const [columns, setColumns] = useState<Column[]>([]); // 存儲動態生成的列

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: HTMLElement = document.createElement("div");
        data.setAttribute("dbName", "website_taipei");
        data.setAttribute("table", "attractions");

        const [rowData, columnData] = await fetchTableData(data); // 分解數據和列結構
        console.log("rowData3: ", rowData);
        console.log("columnData3: ", columnData);

        setData(rowData); // 設置行數據

        // 處理並設置列數據
        const dynamicColumns = columnData.map((column: any) => {
          // 假設column是像 `id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT` 這樣的字符串
          // const columnParts = column.split(" "); // 根據空格分割字符串
          return {
            id: column.name,
            label: column.name.toUpperCase(),
            minWidth: 170,
          };
        });
        setColumns(dynamicColumns);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); // 空數組表示這個effect只在組件掛載時運行一次

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return <TableCell key={column.id}>{value}</TableCell>;
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
