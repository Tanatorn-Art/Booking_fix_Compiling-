"use client"; // ระบุให้ส่วนนี้เป็น Client Component
import React, { useState } from "react";
type EventProps = {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
};

const Test = ({
  Start_date,
  End_date,
  Start_Time,
  End_Time,
  Room_Name,
  Event_Name,
  Department_Name,
  participant,
  Status_Name,
}: EventProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // สถานะสำหรับขยาย/ย่อข้อมูล

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{Event_Name}</h3>
      <p>
        <strong>Room:</strong> {Room_Name}
      </p>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Hide Details" : "Show Details"}
      </button>
      {/* (Dynamic Content) */}
      {isExpanded && (
        <div>
          <p><strong>Start Date:</strong> {Start_date}</p>
          <p><strong>End Date:</strong> {End_date}</p>
          <p><strong>Start Time:</strong> {Start_Time}</p>
          <p><strong>End Time:</strong> {End_Time}</p>
          <p><strong>Department:</strong> {Department_Name}</p>
          <p><strong>Participants:</strong> {participant}</p>
          <p><strong>Status:</strong> {Status_Name}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
