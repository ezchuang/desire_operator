import React, { createContext, useState, useContext, ReactNode } from "react";

interface Condition {
  column: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: any;
}

export interface ReadDataElement {
  dbName?: string | null;
  table?: string | null;
  select?: string | null;
  where?: Condition[] | null;
  groupBy?: string | null;
  orderBy?: string | null;
  orderDirection?: string | null;
  offset?: number | null;
  limit?: number | 100;
}

interface ReadDataContextType {
  readDataElement: ReadDataElement;
  setReadDataElement: React.Dispatch<React.SetStateAction<ReadDataElement>>;
}

const defaultReadDataElement: ReadDataElement = {
  dbName: "",
  table: "",
};

const DataContext = createContext<ReadDataContextType>({
  readDataElement: defaultReadDataElement,
  setReadDataElement: () => {},
});

interface ReadDataProviderProps {
  children: ReactNode;
}

export const ReadDataProvider: React.FC<ReadDataProviderProps> = ({
  children,
}) => {
  const [readDataElement, setReadDataElement] = useState<ReadDataElement>(
    defaultReadDataElement
  );

  return (
    <DataContext.Provider value={{ readDataElement, setReadDataElement }}>
      {children}
    </DataContext.Provider>
  );
};

export const useReadData = (): ReadDataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useReadData must be used within a DataProvider");
  }
  return context;
};
