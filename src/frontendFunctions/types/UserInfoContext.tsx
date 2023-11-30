import React, { createContext, useState, useContext, ReactNode } from "react";

interface UserInfoElement {
  userName: string;
  groupName: string;
  invitationCode: string;
}

interface UserInfoContextType {
  userInfo: UserInfoElement;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoElement>>;
}

const UserInfoContext = createContext<UserInfoContextType | null>(null);

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo 必須在 UserInfoProvider 內使用");
  }
  return context;
};

interface UserInfoProviderProps {
  children: ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    groupName: "",
    invitationCode: "",
  });

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};
