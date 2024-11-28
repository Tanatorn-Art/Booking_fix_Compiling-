// components/DateRangePicker.tsx
import React from "react";
import { Typography, Stack } from "@mui/material";
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite
import { TimeRangePicker } from "rsuite";  // ใช้ TimePicker จาก rsuite

const TimePickerComponent: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", marginTop: "1px", marginLeft: "53px" }}>
    <div style={{ marginRight: "30px" }}>
      <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
        ช่วงเวลาที่ใช้
      </Typography>

      <div style={{ marginTop: "5px" }}>
        <TimeRangePicker hideMinutes={minute => minute % 15 !== 0} editable={false} />
      </div>
    </div>
  </div>
);

export default TimePickerComponent;
