import React, { createContext, useState, useContext, ReactNode } from "react";

export interface DbsAndTablesElement {
  database: string;
  tables: Array<{ [key: string]: string }>;
}

interface DbsAndTablesContextType {
  dbsAndTablesElement: DbsAndTablesElement[];
  setDbsAndTablesElement: React.Dispatch<
    React.SetStateAction<DbsAndTablesElement[]>
  >;
}

const defaultDbsAndTablesElement: DbsAndTablesElement[] = [];

const DataContext = createContext<DbsAndTablesContextType>({
  dbsAndTablesElement: defaultDbsAndTablesElement,
  setDbsAndTablesElement: () => {},
});

interface DbsAndTablesProviderProps {
  children: ReactNode;
}

export const DbsAndTablesProvider: React.FC<DbsAndTablesProviderProps> = ({
  children,
}) => {
  const [dbsAndTablesElement, setDbsAndTablesElement] = useState<
    DbsAndTablesElement[]
  >(defaultDbsAndTablesElement);

  return (
    <DataContext.Provider
      value={{ dbsAndTablesElement, setDbsAndTablesElement }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDbsAndTables = (): DbsAndTablesContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDbsAndTables must be used within a DataProvider");
  }
  return context;
};
