import React, { useState, useEffect } from "react";
import {
  styled,
  Paper,
  Table,
  TableBody,
  TableCell,
  Checkbox,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// import { useMessage } from "../types/MessageContext";
import { useColumnData } from "../types/ColumnDataContext";
import { useColumnOnShow } from "../types/ColumnOnShowContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { useReadData } from "../types/ReadDataContext";
import { readTableData } from "../models/readData";
import { useMessage } from "../types/MessageContext";

interface Column {
  id: string;
  label: string;
  type: string;
  selected?: boolean;
  options: object;
}

interface FormState {
  orderBy: string;
  orderDirection: "ASC" | "DESC";
  limit: number;
  offset: number;
}

const StyledPaper = styled(Paper)({
  width: "100%",
  padding: "4px",
});

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 60,
    lineHeight: "1rem",
    textAlign: "center",
    whiteSpace: "nowrap",
    padding: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: 60,
    padding: "2px",
    paddingTop: "2px",
    paddingBottom: "2px",
  },
});

const StyledInnerTableCell = styled(TableCell)<{ selected?: boolean }>(
  ({ selected }) => ({
    backgroundColor: selected ? "#f0f0a0" : "#d0d0d0", // 選取後變色
    minWidth: 60,
    lineHeight: "1rem",
    // width: "100%",
    textAlign: "center",
    whiteSpace: "nowrap",
    // borderRadius: "10px",
  })
);

const QueryCombineTool: React.FC = () => {
  // const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const { columnDataElement, setColumnDataElement } = useColumnData();
  const { setColumnOnShowElement } = useColumnOnShow();
  const { readDataElement, setReadDataElement } = useReadData();
  const { refreshDataFlag } = useRefreshDataFlag();
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();

  const [rowCondition, setRowCondition] = useState<any>({});
  const [row, setRow] = useState<any>({});
  const [tableParams, setTableParams] = useState<any>({ db: "", table: "" });
  const [formState, setFormState] = useState<FormState>({
    orderBy: "",
    orderDirection: "ASC",
    limit: 100,
    offset: 0,
  });
  const conditionArr = [">", "<", "=", ">=", "<="];

  // 選取 Column
  const handleColumnSelect = (columnId: string) => {
    setColumnDataElement((previous) =>
      previous.map((column: Column) => {
        if (column.id === columnId) {
          return { ...column, selected: !column.selected };
        }
        return column;
      })
    );
  };

  // Input 變更處理
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    // console.log("Row: ", event.target.name, event.target.value);
    setRow({ ...row, [name]: value });
  };

  // Options 選擇
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  // Options 輸入
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  // 送出需求
  const handleSubmit = () => {
    const selectedColumns = columnDataElement.filter(
      (column: Column) => column.selected
    );
    setColumnOnShowElement(selectedColumns);

    const whereConditions = columnDataElement
      .filter((column: Column) => rowCondition[column.id] && row[column.id]) // 篩選出設定了條件和值的欄位
      .map((column: Column) => ({
        column: column.id,
        operator: rowCondition[column.id] as ">" | "<" | "=" | ">=" | "<=",
        value: row[column.id],
      }));

    try {
      formState.limit = Number(formState.limit);
      formState.offset = Number(formState.offset);
    } catch (err) {
      setSeverity("error");
      setMessage("輸入異常");
      setOpenSnackbar(true);
      return;
    }

    // 更新 readDataElement
    setReadDataElement({
      ...readDataElement,
      orderBy: formState.orderBy,
      orderDirection: formState.orderBy ? formState.orderDirection : null,
      offset: formState.offset,
      limit: formState.limit,
      where: whereConditions.length > 0 ? whereConditions : null,
    });
  };

  useEffect(() => {
    const renewColumnsData = async () => {
      if (
        readDataElement.dbName === tableParams.db &&
        readDataElement.table === tableParams.table
      ) {
        return;
      }

      if (!readDataElement.dbName || !readDataElement.table) {
        setColumnDataElement([]);
        setColumnOnShowElement([]);
        setTableParams({
          db: readDataElement.dbName,
          table: readDataElement.table,
        });
        return;
      }

      const response = await readTableData(readDataElement);

      const columnNames = response[1].map((column: any) => {
        return {
          id: column.name,
          label: column.name.toUpperCase(),
          type: column.type,
          options: column.flags,
        };
      });
      const columnNamesWithSelected = columnNames.map((column: any) => ({
        ...column,
        selected: true,
      }));

      // console.log(response[1]);
      // console.log(columnNamesWithSelected);

      setColumnDataElement(columnNamesWithSelected);
      setColumnOnShowElement(columnNames);

      setTableParams({
        db: readDataElement.dbName,
        table: readDataElement.table,
      });

      const initialCondition: any = {};
      const initialRow: any = {};

      columnNames.forEach((column: any) => {
        initialCondition[column.id] = "";
        initialRow[column.id] = "";
      });

      setRowCondition(initialCondition);
      setRow(initialRow);
    };

    renewColumnsData();
  }, [readDataElement]);

  useEffect(() => {
    const renewColumnsData = async () => {
      if (readDataElement.dbName === "" && readDataElement.table === "") {
        return;
      }

      if (!readDataElement.dbName || !readDataElement.table) {
        return;
      }

      const response = await readTableData(readDataElement);

      const columnNames: Column[] = response[1].map((column: any) => {
        return {
          id: column.name,
          label: column.name.toUpperCase(),
          type: column.type,
          options: column.flags,
        };
      });
      const columnNamesWithSelected = columnNames.map((column: any) => ({
        ...column,
        selected: true,
      }));

      setColumnDataElement(columnNamesWithSelected);
      setColumnOnShowElement(columnNames);

      setTableParams({
        db: readDataElement.dbName,
        table: readDataElement.table,
      });

      const initialCondition: any = {};
      const initialRow: any = {};

      columnNames.forEach((column: any) => {
        initialCondition[column.id] = "";
        initialRow[column.id] = "";
      });

      setRowCondition(initialCondition);
      setRow(initialRow);
    };

    renewColumnsData();
  }, [refreshDataFlag]);

  return readDataElement.table ? (
    <StyledPaper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell size="small"></StyledTableCell>
              {columnDataElement.map((column: Column) => (
                <StyledInnerTableCell
                  key={column.id}
                  selected={column.selected}
                  size="small"
                >
                  <div className="flex justify-center items-center w-full">
                    <div>
                      <Checkbox
                        size="small"
                        checked={column.selected || false}
                        onChange={() => handleColumnSelect(column.id)}
                      />
                    </div>
                    <div className="px-1">
                      {`${column.label}`}
                      <br />
                      {`(${column.type})`}
                    </div>
                  </div>
                </StyledInnerTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell sx={{ backgroundColor: "#d0d0d0" }}>
                <div className="flex items-center justify-center px-2 font-medium">
                  WHERE
                </div>
              </StyledTableCell>
              {columnDataElement.map((column: Column) => {
                return (
                  <StyledTableCell key={column.id}>
                    <div className="flex">
                      <Select
                        size="small"
                        variant="outlined"
                        labelId="database-select-label"
                        value={rowCondition[column.id] || ""}
                        onChange={(event) =>
                          setRowCondition({
                            ...rowCondition,
                            [column.id]: event.target.value,
                          })
                        }
                      >
                        {conditionArr.map((condition) => (
                          <MenuItem key={condition} value={condition}>
                            {condition}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        size="small"
                        name={column.id}
                        value={row[column.id] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer sx={{ px: 1 }}>
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ mt: 1, mb: 1 }}
          size="small"
        >
          <InputLabel id="orderBy">{"Order By"}</InputLabel>
          <Select
            size="small"
            variant="outlined"
            labelId="orderBy"
            label="Order By"
            value={formState.orderBy}
            name="orderBy"
            onChange={handleSelectChange}
          >
            {columnDataElement.map((column: Column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
          size="small"
          sx={{ mt: 0, mb: 1 }}
        >
          <InputLabel id="orderDirection">{"Order Direction"}</InputLabel>
          <Select
            // sx={{ my: 1, mx: 1 }}
            labelId="orderDirection"
            value={formState.orderDirection}
            name="orderDirection"
            label="Order Direction"
            onChange={handleSelectChange}
          >
            <MenuItem value="ASC">{`ASC`}</MenuItem>
            <MenuItem value="DESC">{`DESC`}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Offset"
          name="offset"
          type="number"
          sx={{ mt: 0, mb: 1 }}
          value={formState.offset}
          onChange={handleFormChange}
          fullWidth
        />
        <TextField
          size="small"
          label="Limit"
          name="limit"
          type="number"
          sx={{ mt: 0, mb: 1 }}
          value={formState.limit}
          onChange={handleFormChange}
          fullWidth
        />
      </TableContainer>
      {/* </> */}
      <Box mt={1}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            fullWidth
          >
            SEARCH
          </Button>
        </Grid>
      </Box>
    </StyledPaper>
  ) : (
    <></>
  );
};

export default QueryCombineTool;
