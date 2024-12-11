'use client'; // Mark as Client Component
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Table } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const Loader = dynamic(() => import('rsuite').then(mod => mod.Loader), { ssr: false, loading: () => <p>Loading Loader...</p> });
// Dynamic import สำหรับ PageContainer
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'), { ssr: false, loading: () => <p>Loading Page Container...</p> });

type CarDetails = {
  Car_ID: number;
  Car_Name: string;
  Capacity: number;
  Location_cars: string;
};

type CarProps = {
  data: CarDetails[]; // ข้อมูลเริ่มต้น (ถ้ามี)
};

const RoomDetails = ({ data }: CarProps) => {
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // เริ่มการโหลดข้อมูล
    const fetchData = async () => {
      setTimeout(() => {
        setCars(data || []);  // จำลองการโหลดข้อมูล โดยใช้ข้อมูลจาก props
        setLoading(false);  // เมื่อโหลดเสร็จแล้ว เปลี่ยนสถานะเป็น false
      }, 1500);  // ตั้งเวลาหน่วง 1500ms (1.5 วินาที)
    };
    fetchData();
  }, [data]);

  return (
    <PageContainer title="Car Details" description="List of all available cars">
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
        <h4 style={{ marginBottom: '20px' }}>Cars Details</h4>
        {/* แสดง Loader ขณะกำลังโหลด */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader content="Loading car details..." />
          </div>
        ) : (
          // แสดงตารางเมื่อข้อมูลพร้อม
          <Table
            height={455}
            data={cars}
            style={{ border: '1px solid #e5e5e5', borderRadius: '8px' }}
          >
            <Table.Column width={100} align="center" fixed>
              <Table.HeaderCell>Car ID</Table.HeaderCell>
              <Table.Cell dataKey="Car_ID" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Car Name</Table.HeaderCell>
              <Table.Cell dataKey="Car_Name" />
            </Table.Column>

            <Table.Column width={120} align="center">
              <Table.HeaderCell>Capacity</Table.HeaderCell>
              <Table.Cell dataKey="Capacity" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.Cell dataKey="Location_cars" />
            </Table.Column>
          </Table>
        )}
        {/* แสดงข้อความเมื่อไม่มีข้อมูล */}
        {!loading && cars.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
            No car details available.
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoomDetails;
