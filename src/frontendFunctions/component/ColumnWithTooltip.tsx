import React from "react";
import { styled, TableCell, tableCellClasses, Typography } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import { ColumnDataElement } from "../types/ColumnDataContext";
import formatColumnOption from "../models/formatColumnOption";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    textAlign: "center",
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d0d0d0",
    minWidth: 60,
    lineHeight: "1rem",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
}));

const ColumnWithTooltip: React.FC<{ column: ColumnDataElement }> = ({
  column,
}) => {
  {
    // 取得 options 中 value === true 的 key:value
    // 並將其轉換成 顯示用字串 的 ARR
    const columnOptionsDetail = Object.entries(column.options)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => value !== false)
      .map(([key, value]) => formatColumnOption(key, value));

    // 將 columnOptionsDetail 元素和 column 的 type, length(顯示上限), default 合併成一個元素陣列
    // 於下方 return 中 展開
    const columnDetailElements = [
      ["type", "length", "default"]
        .filter(
          (element: string) => !!column[element as keyof ColumnDataElement]
        )
        .map((element: string) => (
          <Typography
            key={element}
            variant="body2"
            style={{ textAlign: "center" }}
          >
            {`${element !== "length" ? element : `${element}(顯示上限)`}: ${
              column[element as keyof ColumnDataElement]
            }`}
          </Typography>
        )),
      [...columnOptionsDetail].map((line, index) => (
        <Typography key={index} variant="body2" style={{ textAlign: "center" }}>
          {line}
        </Typography>
      )),
    ];

    return (
      <BootstrapTooltip
        key={column.id}
        // 展開上方寫在 ARR 中的 Column 參數
        title={<div>{columnDetailElements.flat()}</div>}
        placement="bottom"
        arrow
      >
        <StyledTableCell key={column.id} size="small">
          {`${column.label}`}
          <br />
          {`(${column.type})`}
        </StyledTableCell>
      </BootstrapTooltip>
    );
  }
};

export default ColumnWithTooltip;
