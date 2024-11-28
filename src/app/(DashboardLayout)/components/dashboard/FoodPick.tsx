import React from "react";
import { Typography } from "@mui/material"; // Adjust imports based on your setup
import { CheckPicker } from 'rsuite';


const data = ['อาหารเช้า','อาหารเที่ยง','อาหารบ่าย'].map(
  item => ({ label: item, value: item })
);

const FoodPick = () => {
  return (
    <div style={{ display: "flex",
                  alignItems: "center" ,
                  marginLeft: "5px",
                  }}>
      <div style={{ marginRight: "30px" }}>
        <Typography variant="subtitle1" style={{
                  marginRight: "8px",
                  fontSize: "16px" }}>
        เตรียมอาหาร
        </Typography>

        <div style={{marginTop: "9.5px"}}>
          <CheckPicker data={data} appearance="default" placeholder="อาหาร" style={{ width: 300 }} />
        </div>

      </div>
    </div>
  );
};

export default FoodPick;
