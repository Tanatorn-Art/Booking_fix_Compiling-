"use client";
import React, { useState, useMemo } from "react";
import "rsuite/dist/rsuite.min.css";
import { Table, Button, Modal } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
type EventData = {
  id: string;
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
type BookingroomsProps = {
  data: EventData[];
};
const Bookingrooms = ({ data }: BookingroomsProps) => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleViewDetails = (event: EventData) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  // กรองข้อมูลที่มีวันที่ตรงกับวันที่ปัจจุบัน
  const today = new Date();
  const filteredData = useMemo(() => {
    return data.filter((event) => {
      const eventStartDate = new Date(event.Start_date);
      return (
        eventStartDate.getDate() === today.getDate() &&
        eventStartDate.getMonth() === today.getMonth() &&
        eventStartDate.getFullYear() === today.getFullYear()
      );
    });
  }, [data, today]);

  return (
    <div>
      <p style={{
        marginLeft: "20px",
        marginBottom: "10px",
        color: "#404040",
        fontSize: "25px"}}>
          Details
      </p>
      <Table data={filteredData} bordered cellBordered height={400}>
        <Column width={250} fixed>
          <HeaderCell >Event Name</HeaderCell>
          <Cell  dataKey="Event_Name" />
        </Column>
        <Column width={150}>
          <HeaderCell>Room</HeaderCell>
          <Cell dataKey="Room_Name" />
        </Column>
        <Column width={150}>
          <HeaderCell>Start Date</HeaderCell>
          <Cell>
            {(rowData) =>
              new Date(rowData.Start_date).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
          </Cell>
        </Column>
        <Column width={150}>
          <HeaderCell>Time</HeaderCell>
          <Cell>
            {(rowData) => {
              const formatTime = (time: string) => time.slice(0, 5); // ตัด :00 ออก
              return `${formatTime(rowData.Start_Time)} - ${formatTime(rowData.End_Time)}`;
            }}
          </Cell>
        </Column>
        <Column width={100}>
          <HeaderCell>Participants</HeaderCell>
          <Cell dataKey="participant" />
        </Column>
        <Column width={150}>
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="Status_Name" />
        </Column>
        <Column width={150} fixed="right">
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData: EventData) => (
              <Button appearance="link" onClick={() => handleViewDetails(rowData)}>
                View Details
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal} size="sm" backdrop="static">
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <div>
                {/* คำนวณความเร็วของ animation ตามความยาวของข้อความ */}
                {(() => {
                  const textLength = selectedEvent.Event_Name.length;
                  // กำหนดความเร็ว animation:
                  // - ข้อความสั้น (< 30 ตัวอักษร) ใช้เวลา 20 วินาที
                  // - ข้อความยาว คำนวณตามความยาว
                  const animationDuration = textLength < 30
                    ? 20  // ความเร็วปกติสำหรับข้อความสั้น
                    : Math.min(textLength * 0.8, 60);  // ปรับความเร็วตามความยาว แต่ไม่เกิน 60 วินาที

                  return (
                    <div style={{
                      width: '100%',
                      padding: '10px',
                      overflow: 'hidden',
                      background: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      <div
                        style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                          animation: `slideLeft ${animationDuration}s linear infinite`,
                          color: '#2196f3',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}
                      >
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                        [{selectedEvent.Room_Name}] {selectedEvent.Event_Name} &nbsp;&nbsp;&nbsp;
                      </div>
                    </div>
                  );
                })()}

                <style>
                  {`
                    @keyframes slideLeft {
                      0% {
                        transform: translateX(0%);
                      }
                      100% {
                        transform: translateX(-50%);
                      }
                    }
                  `}
                </style>

                <table style={{ width: '100%', marginTop: '20px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', width: '42%', textAlign: 'right' }}><strong>Room Name:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Room_Name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>หัวข้อการประชุม:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Event_Name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>ห้องที่ใช้ประชุม:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Room_Name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>วันที่จอง:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>
                        {new Date(selectedEvent.Start_date).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })} - {new Date(selectedEvent.End_date).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>เวลา:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Start_Time} - {selectedEvent.End_Time}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>Department:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Department_Name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>Participants:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.participant}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontSize: '16px', textAlign: 'right' }}><strong>Status:</strong></td>
                      <td style={{ padding: '8px', fontSize: '16px' }}>{selectedEvent.Status_Name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bookingrooms;
