import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material"; // ปรับให้เหมาะกับการใช้งาน
import ParticipantInput from "./ParticipantInput"; // คอมโพเนนต์ที่เพิ่มเข้ามา
import { SelectPicker } from 'rsuite';
import axios from 'axios';

// กำหนด interface สำหรับข้อมูลที่ดึงมา
interface MeetingRoom {
  Room_Name: string;
  Capacity: number;
  Location: string;
}

const MeetingForm = () => {
  const [data, setData] = useState<MeetingRoom[]>([]);

  useEffect(() => {
    // ดึงข้อมูลจาก API
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rooms');  // ใช้ path /api/rooms
        console.log('Received Data:', response.data); // ตรวจสอบข้อมูลที่ได้รับ
        setData(response.data.meetingRooms);  // ใช้ data ที่ส่งกลับจาก API
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "5px", marginBottom: "43px" }}>
      <div style={{ marginRight: "30px" }}>
        <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
          ห้องที่ใช้ประชุม
        </Typography>

        <div style={{ marginTop: "5px" }}>
          <SelectPicker
            data={data.map(meetingroom => ({
              label: meetingroom.Room_Name,  // ใช้ Room_Name จากข้อมูลที่ดึงมา
              value: meetingroom.Room_Name   // ใช้ Room_Name เป็นค่า
            }))}
            appearance="default"
            placeholder="เลือกห้อง"
            style={{ width: 224 }}
          />
        </div>
      </div>
      <ParticipantInput />
    </div>
  );
};

export default MeetingForm;
