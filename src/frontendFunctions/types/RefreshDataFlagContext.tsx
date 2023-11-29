import React, { createContext, useState, useContext, ReactNode } from "react";

export type RefreshDataFlagElement = [];

interface RefreshDataFlagType {
  refreshDataFlag: RefreshDataFlagElement[];
  setRefreshDataFlag: React.Dispatch<
    React.SetStateAction<RefreshDataFlagElement[]>
  >;
}

const defaultRefreshDataFlagElement: RefreshDataFlagElement[] = [];

const DataContext = createContext<RefreshDataFlagType>({
  refreshDataFlag: defaultRefreshDataFlagElement,
  setRefreshDataFlag: () => {},
});

interface RefreshDataFlagProviderProps {
  children: ReactNode;
}

export const RefreshDataFlagProvider: React.FC<
  RefreshDataFlagProviderProps
> = ({ children }) => {
  const [refreshDataFlag, setRefreshDataFlag] = useState<
    RefreshDataFlagElement[]
  >(defaultRefreshDataFlagElement);

  return (
    <DataContext.Provider value={{ refreshDataFlag, setRefreshDataFlag }}>
      {children}
    </DataContext.Provider>
  );
};

export const useRefreshDataFlag = (): RefreshDataFlagType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useRefreshDataFlag must be used within a DataProvider");
  }
  return context;
};
