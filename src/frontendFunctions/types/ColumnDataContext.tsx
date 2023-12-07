import React, { createContext, useState, useContext, ReactNode } from "react";
interface typeOptions {
  isNotNull: boolean;
  isPrimaryKey: boolean;
  isUniqueKey: boolean;
  isAutoIncrement: boolean;
  isUnsigned: boolean;
  isZerofill: boolean;
  isMultipleKey: boolean;
  isBlob: boolean;
  isBinary: boolean;
  isEnum: boolean;
  isTimestamp: boolean;
  isSet: boolean;
}

export interface ColumnDataElement {
  id: string;
  label: string;
  type: string;
  length: number | null;
  default: string | number | null;
  selected?: boolean;
  options: typeOptions;
}

interface ColumnDataContextType {
  columnDataElement: ColumnDataElement[];
  setColumnDataElement: React.Dispatch<
    React.SetStateAction<ColumnDataElement[]>
  >;
}

const defaultColumnDataElement: ColumnDataElement[] = [];

const DataContext = createContext<ColumnDataContextType>({
  columnDataElement: defaultColumnDataElement,
  setColumnDataElement: () => {},
});

interface ColumnDataProviderProps {
  children: ReactNode;
}

export const ColumnDataProvider: React.FC<ColumnDataProviderProps> = ({
  children,
}) => {
  const [columnDataElement, setColumnDataElement] = useState<
    ColumnDataElement[]
  >(defaultColumnDataElement);

  return (
    <DataContext.Provider value={{ columnDataElement, setColumnDataElement }}>
      {children}
    </DataContext.Provider>
  );
};

export const useColumnData = (): ColumnDataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useColumnData must be used within a DataProvider");
  }
  return context;
};
