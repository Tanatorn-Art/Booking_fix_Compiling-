// Toppic.tsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Typography } from "@mui/material";
import { Input } from "reactstrap";

export interface ToppicRef {
  handlePost: () => Promise<void>;
}

const Toppic = forwardRef<ToppicRef>((_, ref) => {
  const [toppicInput, setToppicInput] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ loading

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToppicInput(e.target.value); // อัปเดตค่าจาก Input
  };

  // ฟังก์ชัน POST ไปยัง API
  const handlePost = async () => {
    if (toppicInput.trim() === "") {
      alert("กรุณากรอกหัวข้อการประชุมก่อนส่ง!");
      return;
    }
    try {
      const response = await fetch("/api/postdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventName: toppicInput }),  // ส่ง eventName ไปยัง backend
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);  // ส่งข้อมูลสำเร็จ
        setToppicInput("");  // ล้างค่าหลังจากส่งข้อมูล
      } else {
        alert(result.error);  // แสดงข้อผิดพลาดจาก backend
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์!");
    }
  };

  // ให้หน้าหลักสามารถเรียก handlePost ได้
  useImperativeHandle(ref, () => ({
    handlePost,
  }));

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      <div style={{ marginRight: "30px" }}>
        <Typography variant="subtitle1" style={{ marginLeft: "5px", fontSize: "16px" }}>
          หัวข้อการประชุม
        </Typography>
        <Input
          className="form-control-alternative"
          style={{ marginLeft: "5px", marginTop: "10px", width: "710px" }}
          placeholder="กรุณากรอกหัวข้อ"
          type="text"
          value={toppicInput} // ผูกค่ากับ state
          onChange={handleInputChange} // อัปเดตค่าจากการกรอก
        />
        {loading && (
          <div style={{ marginTop: "10px" }}>
            กำลังส่งข้อมูล...
          </div>
        )}
      </div>
    </div>
  );
});

export default Toppic;
