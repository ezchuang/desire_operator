import React, { createContext, useState, useContext, ReactNode } from "react";

interface VerificationContextType {
  isVerified: boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerificationContext = createContext<VerificationContextType | null>(null);

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification 必須在 VerificationProvider 內使用");
  }
  return context;
};

interface VerificationProviderProps {
  children: ReactNode;
}

export const VerificationProvider: React.FC<VerificationProviderProps> = ({
  children,
}) => {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <VerificationContext.Provider value={{ isVerified, setIsVerified }}>
      {children}
    </VerificationContext.Provider>
  );
};
