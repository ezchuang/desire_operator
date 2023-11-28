import React, { useState } from "react";
import {
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CreateDb from "./CreateDb";
import CreateTable from "./CreateTable";
import DeleteDatabase from "./DeleteDb";
import DeleteTable from "./DeleteTable";

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "scale(0.7)",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "scale(0.7)",
  },
});

const StyledAccordionDetails = styled(AccordionDetails)({
  width: "100%",
  padding: "4px",
});

const ModifyToolEntry: React.FC = () => {
  const [createDbExpanded, setCreateDbExpanded] = useState(false);
  const [createTableExpanded, setCreateTableExpanded] = useState(false);
  const [deleteDbExpanded, setDeleteDbExpanded] = useState(false);
  const [deleteTableExpanded, setDeleteTableExpanded] = useState(false);

  return (
    <>
      {/* CREATE DATABASE */}
      <Accordion
        expanded={createDbExpanded}
        onChange={() => setCreateDbExpanded(!createDbExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>新增 Database</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <CreateDb />
        </StyledAccordionDetails>
      </Accordion>
      {/* CREATE TABLE */}
      <Accordion
        expanded={createTableExpanded}
        onChange={() => setCreateTableExpanded(!createTableExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>新增 Table</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <CreateTable />
        </StyledAccordionDetails>
      </Accordion>
      {/* DELETE DATABASE */}
      <Accordion
        expanded={deleteDbExpanded}
        onChange={() => setDeleteDbExpanded(!deleteDbExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>刪除 Database</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <DeleteDatabase />
        </StyledAccordionDetails>
      </Accordion>
      {/* DELETE TABLE */}
      <Accordion
        expanded={deleteTableExpanded}
        onChange={() => setDeleteTableExpanded(!deleteTableExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>刪除 Table</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <DeleteTable />
        </StyledAccordionDetails>
      </Accordion>
    </>
  );
};

export default ModifyToolEntry;
