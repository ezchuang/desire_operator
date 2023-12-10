import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserListElement {
  userName: string;
  userColor: string;
}

interface UserInfoElement {
  userName: string;
  groupName: string;
  invitationCode: string;
  userList?: UserListElement[]; // 裝所有 User 的簡易資訊(包含自己)
}

interface UserInfoContextType {
  userInfo: UserInfoElement;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoElement>>;
}

const defaultUserInfoElement: UserInfoElement = {
  userName: "",
  groupName: "",
  invitationCode: "",
  userList: [],
};

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
  const [userInfo, setUserInfo] = useState<UserInfoElement>(
    defaultUserInfoElement
  );

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};
