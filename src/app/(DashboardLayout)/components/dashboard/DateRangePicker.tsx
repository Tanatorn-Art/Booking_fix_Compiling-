// components/DateRangePicker.tsx
import React from "react";
import { Typography, Grid, CardContent, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,Chip } from '@mui/material';
import { DateRangePicker, Stack } from "rsuite";
import TimePickerComponent from "./TimePickerComponent";
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite


const DateRangePickerComponent: React.FC = () => (

  <div style={{ display: "flex", alignItems: "center", marginTop: "15px" , marginLeft: "5px"}}>
    <div style={{ marginRight: "30px" }}>
      <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
       วันที่ใช้ห้อง
      </Typography>

      <div style={{ marginTop: "5px" }}>
        <Stack spacing={10} direction="column" alignItems="flex-start">
          <DateRangePicker format="dd.MM.yyyy" />
        </Stack>
      </div>
    </div>
    <TimePickerComponent />
  </div>
);

export default DateRangePickerComponent;
