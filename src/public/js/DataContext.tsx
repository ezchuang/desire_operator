import React, { createContext, useState, useContext, ReactNode } from "react";

export interface DataElement {
  dbName?: string;
  table?: string;
}

interface DataContextType {
  dataElement: DataElement;
  setDataElement: React.Dispatch<React.SetStateAction<DataElement>>;
}

const defaultDataElement: DataElement = {
  dbName: "website_taipei",
  table: "attractions",
};

const DataContext = createContext<DataContextType>({
  dataElement: defaultDataElement,
  setDataElement: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [dataElement, setDataElement] =
    useState<DataElement>(defaultDataElement);

  return (
    <DataContext.Provider value={{ dataElement, setDataElement }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
