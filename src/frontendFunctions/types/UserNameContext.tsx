import React, { createContext, useState, useContext, ReactNode } from "react";

interface UserNameContextType {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const UserNameContext = createContext<UserNameContextType | null>(null);

export const useUserName = () => {
  const context = useContext(UserNameContext);
  if (!context) {
    throw new Error("useUserName 必須在 UserNameProvider 內使用");
  }
  return context;
};

interface UserNameProviderProps {
  children: ReactNode;
}

export const UserNameProvider: React.FC<UserNameProviderProps> = ({
  children,
}) => {
  const [userName, setUserName] = useState("");

  return (
    <UserNameContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserNameContext.Provider>
  );
};
