import React, { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";

import { useMessage } from "../types/MessageContext";
import { createDb } from "../models/createData";
import useRenewDbsAndTables from "../types/RenewDbsAndTables";

const CreateDatabase: React.FC = () => {
  const { setMessage, setOpenSnackbar, setSeverity } = useMessage();
  const [dbName, setDbName] = useState("");
  const renewDbsAndTables = useRenewDbsAndTables();

  const handleSubmit = async () => {
    try {
      const response = await createDb(dbName);

      if (response) {
        setSeverity("success");
        setMessage(`新增 Database ${dbName} 成功`);
        setOpenSnackbar(true);

        renewDbsAndTables();
      }
    } catch (error) {
      console.error("資料庫創建失敗:", error);
      setSeverity("error");
      setMessage(`新增 Database ${dbName} 失敗`);
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <TextField
        label="資料庫名稱"
        value={dbName}
        onChange={(e) => setDbName(e.target.value)}
        fullWidth
      />
      <Box mt={1}>
        <Grid item xs={12}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            fullWidth
          >
            Create Database
          </Button>
        </Grid>
      </Box>
    </div>
  );
};

export default CreateDatabase;
