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
  Car_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
};
type BookingcarsProps = {
  data: EventData[];
};
const Bookingrooms = ({ data }: BookingcarsProps) => {
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
        <Column width={250} align="center" fixed>
          <HeaderCell>Event Name</HeaderCell>
          <Cell dataKey="Event_Name" />
        </Column>
        <Column width={150}>
          <HeaderCell>Car license plate</HeaderCell>
          <Cell dataKey="Car_Name" />
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
      <Modal open={isModalOpen} onClose={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p><strong>Event Name:</strong> {selectedEvent.Event_Name}</p>
              <p><strong>Car Name:</strong> {selectedEvent.Car_Name}</p>
              <p><strong>Start Date:</strong> {new Date(selectedEvent.Start_date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              <p><strong>End Date:</strong> {new Date(selectedEvent.End_date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              <p><strong>Start Time:</strong> {selectedEvent.Start_Time}</p>
              <p><strong>End Time:</strong> {selectedEvent.End_Time}</p>
              <p><strong>Department:</strong> {selectedEvent.Department_Name}</p>
              <p><strong>Participants:</strong> {selectedEvent.participant}</p>
              <p><strong>Status:</strong> {selectedEvent.Status_Name}</p>
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
