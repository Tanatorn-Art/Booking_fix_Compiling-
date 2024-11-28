import React from "react";
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material"; // Import necessary MUI components
import MeetingForm from "./DropListRoom"; // Import the new component
import { CheckPicker } from 'rsuite';
import { SelectPicker } from 'rsuite';


const data = [
  'Meeting Room',
  'Reserves Car',
].map(
  item => ({ label: item, value: item })
);

const ReserveList= () => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "5px" , marginLeft: "20px"}}>
      <div style={{ marginRight: "30px" }}>
        {/* <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
        รายการจอง
        </Typography> */}

        <div style={{marginTop: "8px"}}>
          <SelectPicker data={data} appearance="default" placeholder="รายการจอง" style={{ width: 300}} />
        </div>
        </div>
      </div>
  );
};

export default ReserveList;
