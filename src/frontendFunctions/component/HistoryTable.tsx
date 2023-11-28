import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { HistoryRecord } from "../types/Interfaces";
import { readHistoryData } from "../models/readData";

const HistoryTable: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await readHistoryData();
        setRecords(historyData[0]);
      } catch (error) {
        console.error("錯誤獲取歷史記錄:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="歷史記錄表格">
        <TableHead>
          <TableRow>
            <TableCell>操作人員</TableCell>
            <TableCell>操作類型</TableCell>
            <TableCell>操作指令</TableCell>
            <TableCell align="right">時間</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {record.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {record.action}
              </TableCell>
              <TableCell component="th" scope="row">
                {record.query}
              </TableCell>
              <TableCell align="right">{record.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
