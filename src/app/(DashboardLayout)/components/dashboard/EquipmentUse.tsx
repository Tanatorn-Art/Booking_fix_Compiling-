import React from "react";
import { Typography } from "@mui/material"; // Adjust imports based on your setup
import { CheckPicker } from 'rsuite';
import  FoodPick  from './FoodPick'

const data = [
  'เครื่องฉาย Projector',
  'Telephone conference',
  'VDO Conference',
  'เครื่องฉาย VCD/DVD',
  'Computer',
  'Visualizer(เครื่องฉายสไลด์)', ].map(
  item => ({ label: item, value: item })
);

const EquipmentUse = () => {
  return (
    <div style={{ display: "flex",
                  alignItems: "center" ,
                  marginLeft: "5px",
                  marginTop: "20px"}}>
      <div style={{ marginRight: "30px" }}>
        <Typography variant="subtitle1" style={{
                  marginRight: "8px",
                  fontSize: "16px" }}>
          อุปกรณ์ที่ใช้
        </Typography>

        <div style={{marginTop: "10px"}}>
          <CheckPicker data={data} appearance="default" placeholder="อุปกรณ์" style={{ width: 300 }} />
        </div>

      </div>
          <div>
            <FoodPick/>
          </div>
    </div>
  );
};

export default EquipmentUse;
