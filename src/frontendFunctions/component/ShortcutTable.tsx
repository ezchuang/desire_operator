import React, { useState, useEffect } from "react";
import {
  styled,
  // Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useReadData } from "../types/ReadDataContext";
import {
  DbsAndTablesElement,
  useDbsAndTables,
} from "../types/DbsAndTablesContext";
import useRenewDbsAndTables from "../types/RenewDbsAndTables";

interface Column {
  id: string;
  label: string;
}

interface RowProps {
  row: DbsAndTablesElement;
  col: Column[];
}

// const ShortcutStyledPaper = styled(Paper)({
//   width: "50vh",
//   maxHeight: "80vh",
//   overflow: "auto",
// });

const StyledTableCell = styled(TableCell)(() => ({
  width: "auto",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Row: React.FC<RowProps> = ({ row, col }) => {
  const [open, setOpen] = useState(false);
  const { setReadDataElement } = useReadData();

  const changeMainData = (db: string, table: string) => {
    setReadDataElement((prevElement) => {
      if (prevElement.dbName === db && prevElement.table === table) {
        return prevElement;
      }

      return {
        dbName: db,
        table: table,
      };
    });
  };

  return (
    <React.Fragment>
      {/* Database 資料 */}
      <TableRow>
        <StyledTableCell size="small">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ padding: 0 }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row[col[0].label as keyof typeof row]}
        </StyledTableCell>
      </TableRow>
      {open && (
        // Table 資料
        <TableRow>
          <StyledTableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {(
                  row[
                    col[1].label as keyof typeof row
                  ] as RowProps["row"]["tables"]
                ).map((table: any, index: number) => (
                  <Typography
                    key={index}
                    variant="body2"
                    gutterBottom
                    component="div"
                    onClick={() =>
                      changeMainData(
                        row[col[0].label as keyof typeof row] as string,
                        Object.values(table)[0] as string
                      )
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    {Object.values(table)[0]}
                  </Typography>
                ))}
              </Box>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

const ShortcutTable: React.FC = () => {
  const { dbsAndTablesElement } = useDbsAndTables();
  const renewDbsAndTables = useRenewDbsAndTables();

  useEffect(() => {
    renewDbsAndTables();
  }, [dbsAndTablesElement]);

  const columns: Column[] =
    dbsAndTablesElement.length > 0
      ? Object.keys(dbsAndTablesElement[0]).map((key) => ({
          id: key,
          label: key,
        }))
      : [];

  // console.log(columns);

  return (
    // <ShortcutStyledPaper>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={2}>
              {"Databases and Tables Structure Tree"}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 用 Row 展開資料 */}
          {dbsAndTablesElement.map((row, index) => (
            <Row key={index} row={row} col={columns} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // </ShortcutStyledPaper>
  );
};

export default ShortcutTable;
