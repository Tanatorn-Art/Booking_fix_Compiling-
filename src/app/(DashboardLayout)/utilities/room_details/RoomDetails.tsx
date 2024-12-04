'use client'; // Mark as Client Component
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Table} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
const Loader = dynamic(() => import('rsuite').then(mod => mod.Loader), {ssr: false,loading: () => <p>Loading Loader...</p>,});
// Dynamic import สำหรับ PageContainer
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'),{ssr: false,loading: () => <p>Loading Page Container...</p>,});
type RoomDetails = {
  Room_ID: number;
  Room_Name: string;
  Capacity: number;
  Location: string;
};
type RoomProps = {
  data: RoomDetails[]; // ข้อมูลเริ่มต้น (ถ้ามี)
};

const RoomDetails = ({ data }: RoomProps) => {
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      setTimeout(() => {
        setRooms(data || []);
        setLoading(false);
      }, 1500);
    };
    fetchData();
  }, [data]);

  return (
    <PageContainer title="Room Details" description="List of all available rooms">
      <div
        style={{
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
          position: 'relative',
        }}
      >
        <h4 style={{ marginBottom: '20px' }}>Rooms Details</h4>
        {/* แสดง Loader ขณะกำลังโหลด */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader content="Loading room details..." />
          </div>
        ) : (
          // แสดงตารางเมื่อข้อมูลพร้อม
          <Table
            height={400}
            data={rooms}
            style={{ border: '1px solid #e5e5e5', borderRadius: '8px' }}
          >
            <Table.Column width={100} align="center" fixed>
              <Table.HeaderCell>Room ID</Table.HeaderCell>
              <Table.Cell dataKey="Room_ID" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Room Name</Table.HeaderCell>
              <Table.Cell dataKey="Room_Name" />
            </Table.Column>

            <Table.Column width={120} align="center">
              <Table.HeaderCell>Capacity</Table.HeaderCell>
              <Table.Cell dataKey="Capacity" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.Cell dataKey="Location" />
            </Table.Column>
          </Table>
        )}
        {/* แสดงข้อความเมื่อไม่มีข้อมูล */}
        {!loading && rooms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
            No room details available.
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoomDetails;
