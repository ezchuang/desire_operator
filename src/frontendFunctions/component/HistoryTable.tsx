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
import * as moment from "moment-timezone";

import { HistoryRecord } from "../types/Interfaces";
import { useReadData } from "../types/ReadDataContext";
import { useDbsAndTables } from "../types/DbsAndTablesContext";
import { useRefreshDataFlag } from "../types/RefreshDataFlagContext";
import { readHistoryData } from "../models/readData";
import { useSocket } from "../types/SocketContext";
// import { useReadData } from "../types/ReadDataContext";

const HistoryTable: React.FC = () => {
  const { dbsAndTablesElement } = useDbsAndTables();
  const { readDataElement } = useReadData();
  const { refreshDataFlag } = useRefreshDataFlag();
  const { socket } = useSocket();

  const [records, setRecords] = useState<HistoryRecord[]>([]);
  // const { readDataElement } = useReadData();

  const fetchHistory = async () => {
    try {
      const historyData = await readHistoryData();

      setRecords(historyData[0]);
    } catch (error) {
      console.error("錯誤獲取歷史記錄:", error);
    }
  };

  socket?.on("newHistoryAvailable", () => {
    fetchHistory();
  });

  useEffect(() => {
    fetchHistory();
  }, [dbsAndTablesElement, readDataElement, refreshDataFlag]);

  const convertDatetimeToTaipeiTime = (datetime: number) => {
    return moment
      .default(datetime)
      .tz("Asia/Taipei")
      .format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table aria-label="歷史記錄表格">
        <TableHead>
          <TableRow>
            <TableCell>操作人員</TableCell>
            <TableCell>操作類型</TableCell>
            <TableCell>操作指令</TableCell>
            <TableCell>時間</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" size="small">
                {record.name}
              </TableCell>
              <TableCell component="th" scope="row" size="small">
                {record.action}
              </TableCell>
              <TableCell component="th" scope="row" size="small">
                {record.query}
              </TableCell>
              <TableCell size="small">
                {`${convertDatetimeToTaipeiTime(record.datetime)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
