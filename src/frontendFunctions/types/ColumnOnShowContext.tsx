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

export interface ColumnOnShowElement {
  id: string;
  label: string;
  type: string;
  length: number | null;
  default: string | number | null;
  options: typeOptions;
}

interface ColumnOnShowContextType {
  columnOnShowElement: ColumnOnShowElement[];
  setColumnOnShowElement: React.Dispatch<
    React.SetStateAction<ColumnOnShowElement[]>
  >;
}

const defaultColumnOnShowElement: ColumnOnShowElement[] = [];

const DataContext = createContext<ColumnOnShowContextType>({
  columnOnShowElement: defaultColumnOnShowElement,
  setColumnOnShowElement: () => {},
});

interface ColumnOnShowProviderProps {
  children: ReactNode;
}

export const ColumnOnShowProvider: React.FC<ColumnOnShowProviderProps> = ({
  children,
}) => {
  const [columnOnShowElement, setColumnOnShowElement] = useState<
    ColumnOnShowElement[]
  >(defaultColumnOnShowElement);

  return (
    <DataContext.Provider
      value={{ columnOnShowElement, setColumnOnShowElement }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useColumnOnShow = (): ColumnOnShowContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useColumnOnShow must be used within a DataProvider");
  }
  return context;
};
