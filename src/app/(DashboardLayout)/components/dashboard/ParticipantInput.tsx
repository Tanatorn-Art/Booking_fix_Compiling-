import React from "react";
import { Typography, Input } from "@mui/material"; // Adjust imports based on your setup
import { InputNumber, Stack } from 'rsuite';

const ParticipantInput = () => {
  return (
    <div>
      <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
        จำนวนผู้เข้าประชุม
      </Typography>

      <div style={{marginTop: "4px", marginLeft: "20px"}}>
        <Stack style={{width: "100px"}}>
          <InputNumber />
        </Stack>
      </div>
    </div>
  );
};

export default ParticipantInput;
