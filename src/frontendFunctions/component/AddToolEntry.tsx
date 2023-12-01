import React, { useState } from "react";
import {
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AddRow from "./AddRow";
import AddColumn from "./AddColumn";
import DelColumn from "./DelColumn";

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

const AddToolEntry: React.FC = () => {
  const [addRowExpanded, setAddRowExpanded] = useState(false);
  const [addColumnExpanded, setAddColumnExpanded] = useState(false);
  const [delColumnExpanded, setDelColumnExpanded] = useState(false);
  return (
    <>
      {/* ADD ROW */}
      <Accordion
        expanded={addRowExpanded}
        onChange={() => setAddRowExpanded(!addRowExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>新增 Row</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <AddRow />
        </StyledAccordionDetails>
      </Accordion>
      {/* ADD COLUMN */}
      <Accordion
        expanded={addColumnExpanded}
        onChange={() => setAddColumnExpanded(!addColumnExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>新增 Column</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <AddColumn />
        </StyledAccordionDetails>
      </Accordion>
      {/* DELETE COLUMN */}
      <Accordion
        expanded={delColumnExpanded}
        onChange={() => setDelColumnExpanded(!delColumnExpanded)}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>刪除 Column</div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <DelColumn />
        </StyledAccordionDetails>
      </Accordion>
    </>
  );
};

export default AddToolEntry;
