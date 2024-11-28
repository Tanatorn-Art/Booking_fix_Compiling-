import React, { useState } from "react";
import { IconButton, ButtonToolbar, Loader } from "rsuite";
import AddOutlineIcon from "@rsuite/icons/AddOutline";

interface BtnServesProps {
  label?: string; // ข้อความในปุ่ม
  onClick?: () => void; // ฟังก์ชันที่จะถูกเรียกเมื่อคลิกปุ่ม
  isLoading?: boolean; // สถานะเริ่มต้นของการโหลด
}

const BtnServes: React.FC<BtnServesProps> = ({
  label = "Create",
  onClick = () => {},
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(isLoading);

  const handleClick = () => {
    onClick(); // เรียกฟังก์ชันที่ส่งเข้ามา
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // จำลองการโหลด
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "25px", marginLeft: "5px" }}>
      <ButtonToolbar>
        <IconButton
          appearance="primary"
          color="blue"
          icon={loading ? <Loader size="sm" /> : <AddOutlineIcon />}
          disabled={loading}
          onClick={handleClick}
        >
          {loading ? "Loading..." : label}
        </IconButton>
      </ButtonToolbar>
    </div>
  );
};

export default BtnServes;
