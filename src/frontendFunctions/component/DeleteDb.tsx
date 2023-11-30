import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";

import { useMessage } from "../types/MessageContext";
import { deleteDb } from "../models/deleteData";
import { useDbsAndTables } from "../types/DbsAndTablesContext";
import useRenewDbsAndTables from "../types/RenewDbsAndTables";
import { useReadData } from "../types/ReadDataContext";

const DeleteDatabase: React.FC = () => {
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const [dbName, setDbName] = useState("");
  const renewDbsAndTables = useRenewDbsAndTables();
  const { dbsAndTablesElement } = useDbsAndTables();
  const { readDataElement, setReadDataElement } = useReadData();

  const handleSubmit = async () => {
    try {
      const delData = {
        dbName: dbName,
      };
      const response = await deleteDb(delData);

      if (!response) {
        throw new Error(`Delete Database Error!`);
      }

      if (delData.dbName === readDataElement.dbName) {
        setReadDataElement({ dbName: "" });
      }

      setSeverity("success");
      setMessage(`刪除 Database ${dbName} 成功`);
      setOpenSnackbar(true);

      renewDbsAndTables();
      setDbName("");
    } catch (error) {
      console.error("Database 刪除失敗:", error);
      setSeverity("error");
      setMessage(`刪除 Database ${dbName} 失敗`);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box width="100%" margin="auto" padding={"2px"}>
        <FormControl
          fullWidth
          margin="normal"
          sx={{ mt: 0, mb: 1 }}
          size="small"
        >
          <InputLabel id="database-select-label">選擇資料庫</InputLabel>
          <Select
            labelId="database-select-label"
            value={dbName}
            onChange={(event) => setDbName(event.target.value)}
          >
            {dbsAndTablesElement
              .map((element) => element.database)
              .map((db) => (
                <MenuItem key={db} value={db}>
                  {db}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt={1}>
        <Grid item xs={12}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            fullWidth
          >
            Delete Database
          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default DeleteDatabase;
