import React, { createContext, useState, useContext } from "react";

export interface MessageContextType {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: boolean;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  severity: "success" | "error" | "warning" | "info";
  setSeverity: React.Dispatch<
    React.SetStateAction<"success" | "error" | "warning" | "info">
  >;
}

const MessageContext = createContext<MessageContextType>({
  message: "",
  setMessage: () => {},
  openSnackbar: false,
  setOpenSnackbar: () => {},
  severity: "success",
  setSeverity: () => {},
});

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
        openSnackbar,
        setOpenSnackbar,
        severity,
        setSeverity,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
