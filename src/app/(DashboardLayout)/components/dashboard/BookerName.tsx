import React from "react";
import { Typography } from "@mui/material"; // Adjust imports based on your setup
import ParticipantInput from "./ParticipantInput"; // Import the new component
import { Input } from "reactstrap";

const BookerName = () => {
  return (
    <div style={{ display: "flex", alignItems: "center" , marginTop: "15px"}}>
      <div style={{ marginRight: "30px" }}>

      <Typography variant="subtitle1" style={{ marginLeft: "5px", fontSize: "16px" }}>
        ชื่อผู้จอง :
      </Typography>

      </div>
    </div>
  );
};

export default BookerName;
