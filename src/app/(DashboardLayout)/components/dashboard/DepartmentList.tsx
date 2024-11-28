// DepartmentList.tsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { SelectPicker } from "rsuite";
import axios from "axios";
import MeetingForm from "./DropListRoom";

interface Department {
  Department_Name: string;
}

export interface DepartmentListRef {
  handlePost: () => Promise<void>;
}

const DepartmentList = forwardRef<DepartmentListRef>((_, ref) => {
  const [data, setData] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("ภายใน");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/department"); // ดึงข้อมูลหน่วยงาน
        setData(response.data.departments || []);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePost = async () => {
    if (!selectedDepartment) {
      alert("กรุณาเลือกหน่วยงาน!");
      return;
    }

    try {
      const response = await fetch("/api/postdata", {
        method: "POST",  // กำหนด HTTP method เป็น POST
        headers: {
          "Content-Type": "application/json",  // ระบุประเภทของข้อมูลเป็น JSON
        },
        body: JSON.stringify({
          departmentName: selectedDepartment,
          departmentType: selectedType,
        }),
      });

      // ตรวจสอบการตอบกลับจาก server
      const data = await response.json();

      if (data.success) {
        alert("ข้อมูลถูกส่งเรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์!");
    }
  };

  useImperativeHandle(ref, () => ({
    handlePost,
  }));

  return (
    <div style={{ marginTop: "15px", marginLeft: "5px" }}>
      <div style={{ marginBottom: "15px" }}>
        <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
          หน่วยงานที่จัดประชุม
        </Typography>

        <div style={{ marginTop: "5px" }}>
          <SelectPicker
            data={
              data.length > 0
                ? data.map((department) => ({
                    label: department.Department_Name,
                    value: department.Department_Name,
                  }))
                : []
            }
            appearance="default"
            placeholder="เลือกหน่วยงาน"
            style={{ width: 300 }}
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value as string)}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="department-type"
              name="department-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <FormControlLabel value="ภายใน" control={<Radio />} label="ภายใน" />
              <FormControlLabel value="ภายนอก" control={<Radio />} label="ภายนอก" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <MeetingForm />
    </div>
  );
});

export default DepartmentList;
