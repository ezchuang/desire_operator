import * as React from "react";
import { Stack, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useMessage } from "../types/MessageContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars: React.FC = () => {
  const { openSnackbar, setOpenSnackbar, message, severity } = useMessage();

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        // sx={{ zIndex: 40 }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
};

export default CustomizedSnackbars;
