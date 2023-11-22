import React, { createContext, useState, useContext, ReactNode } from "react";

export interface ReadDataElement {
  dbName?: string | null;
  table?: string | null;
  select?: string | null;
  where?: string | null;
  groupBy?: string | null;
  orderBy?: string | null;
  orderDirection?: string | null;
  limit?: number | 100;
}

interface WhereCondition {
  column: string;
  operator: string;
  value: any;
}

export interface UpdateObj {
  dbName: string;
  table: string;
  data: { [key: string]: any };
  where?: WhereCondition[];
}

interface DataContextType {
  readDataElement: ReadDataElement;
  setReadDataElement: React.Dispatch<React.SetStateAction<ReadDataElement>>;
}

const defaultReadDataElement: ReadDataElement = {
  dbName: "website_taipei",
  table: "attractions",
};

const DataContext = createContext<DataContextType>({
  readDataElement: defaultReadDataElement,
  setReadDataElement: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [readDataElement, setReadDataElement] = useState<ReadDataElement>(
    defaultReadDataElement
  );

  return (
    <DataContext.Provider value={{ readDataElement, setReadDataElement }}>
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
