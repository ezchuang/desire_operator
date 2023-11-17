import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { fetchTableData } from "./fetchDataButton";
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

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 408,
  },
});

const dataElementOrigin: HTMLElement = document.createElement("div");
dataElementOrigin.setAttribute("dbName", "website_taipei");
dataElementOrigin.setAttribute("table", "attractions");
// dataElementOrigin.setAttribute("table", "cats");

export const MainTable = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const { dataElement } = useData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rowData, columnData] = await fetchTableData(dataElement); // fetch 數據修改的地方
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
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [dataElement.dbName, dataElement.table]);

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
                  return (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        padding: column.padding,
                      }}
                    >
                      {value}
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
