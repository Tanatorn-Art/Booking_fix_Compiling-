'use client'; // Mark as Client Component
import React, { useState, useEffect, FormEvent } from 'react';
import 'rsuite/dist/rsuite.min.css';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import { Table, Button, Modal, Form, Input, InputNumber, ButtonToolbar,Loader } from 'rsuite';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddRoomModal from './addRoomModal';
import { fetchData } from 'next-auth/client/_utils';


type RoomDetails = {
  Room_ID: number;
  Room_Name: string;
  Capacity: number;
  Location: string;
  departserivce: string;
};
type RoomProps = {
  data: RoomDetails[]; // ข้อมูลเริ่มต้น (ถ้ามี)
};

const RoomTable = ({ data = [] }: RoomProps) => {
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomDetails | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setRooms(data || []);
        setLoading(false);
      }, 1500);
    };
    fetchData();
  }, [data]);

  const handleAdd = () => {
    setOpenAddModal(true); // เปลี่ยนจาก setOpenModal เป็น setOpenAddModal
  };

  const handleEdit = (room: RoomDetails) => {
    setEditingRoom(room);
    setOpenModal(true);
  };
  const handleDelete = (room: RoomDetails) => {
    setRoomToDelete(room);
    setOpenDeleteModal(true);
  };

  // เพิ่มฟังก์ชันสำหรับการลบจริง
  const confirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      const response = await fetch('/api/deleteRoomTable', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Booking_ID: roomToDelete.Room_ID }),
      });

      const result = await response.json();

      if (result.success) {
        setRooms(rooms.filter(room => room.Room_ID !== roomToDelete.Room_ID));
        toast.success('ลบห้องสำเร็จ');
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setOpenDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  // ... rest of the code ...

// ... existing code ...

  const handleSubmit = async (formValue: Record<string, any> | null, event?: FormEvent<HTMLFormElement>) => {
    if (!formValue) return;

    try {
      const roomData = {
        Room_Name: formValue.Room_Name,
        Capacity: parseInt(formValue.Capacity),
        Location: formValue.Location,
        departserivce: formValue.departserivce
      };

      if (editingRoom) {
        // กรณีแก้ไข
        const response = await fetch('/api/putroom', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...roomData,
            Room_ID: editingRoom.Room_ID
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update room');
        }

        const result = await response.json();

        if (result.success) {
          // อัพเดทข้อมูลในตาราง
          setRooms(rooms.map(room =>
            room.Room_ID === editingRoom.Room_ID ? { ...room, ...roomData } : room
          ));
          toast.success('แก้ไขข้อมูลสำเร็จ');
          setOpenModal(false);
        }
      } else {
        // กรณีเพิ่มใหม่ (คงเดิม)
        const response = await fetch('/api/postroom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(roomData),
        });

        if (!response.ok) {
          throw new Error('Failed to add room');
        }

        const result = await response.json();

        if (result.success) {
          const newRoom = {
            ...roomData,
            Room_ID: result.insertId
          };
          setRooms([...rooms, newRoom]);
          toast.success('เพิ่มห้องสำเร็จ');
          setOpenModal(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleClose = () => {
    setEditingRoom(null); // เคลียร์ข้อมูลเมื่อปิด Modal
    setOpenModal(false);
  };

  const handleAddSuccess = async (newRoom: RoomDetails) => {
    try {
      // Fetch ข้อมูลใหม่จาก API
      const response = await fetch('/api/roomsDetails');
      if (!response.ok) {
        throw new Error('Failed to fetch updated data');
      }
      const result = await response.json();

      // ตรวจสอบและจัดรูปแบบข้อมูล
      if (Array.isArray(result.meetingRooms)) {
        setRooms(result.meetingRooms);
      } else {
        setRooms(result || []);
      }

      setOpenAddModal(false);
      toast.success('เพิ่มห้องสำเร็จ');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลล่าสุดได้');
    }
  };

  return (
    <PageContainer title="Room Details" description="List of all available rooms">
    <ToastContainer position="top-right" autoClose={3000} />
    <div style={{ /* ... existing styles ... */ }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h4
        style={{color:'#0080FF'}}>Rooms Details</h4>
        <Button appearance="primary" onClick={handleAdd}>เพิ่มห้องใหม่</Button>
      </div>
    {loading ? (
      <div style={{ textAlign: 'center', padding: '20px'  }}>
        <Loader content="Loading room details..." />
      </div>
    ) : (
      <Table height={650} data={rooms}>
        {/* ... existing columns ... */}
          <Table.Column width={250}>
            <Table.HeaderCell>ชื่อห้อง</Table.HeaderCell>
            <Table.Cell dataKey="Room_Name" style={{color:'#0080FF'}} />
          </Table.Column>

          <Table.Column width={150}>
            <Table.HeaderCell>ความจุ</Table.HeaderCell>
            <Table.Cell dataKey="Capacity" />
          </Table.Column>

          <Table.Column width={200}>
            <Table.HeaderCell>สถานที่</Table.HeaderCell>
            <Table.Cell dataKey="Location" />
          </Table.Column>

          <Table.Column width={300}>
            <Table.HeaderCell>แผนก</Table.HeaderCell>
            <Table.Cell dataKey="departserivce" />
          </Table.Column>

        <Table.Column width={200} fixed="right">
          <Table.HeaderCell>Actions</Table.HeaderCell>
          <Table.Cell>
            {rowData => (
              <ButtonToolbar>
                <Button appearance="link" onClick={() => handleEdit(rowData as RoomDetails)}>แก้ไข</Button>
                <Button
                  appearance="link"
                  onClick={() => handleDelete(rowData as RoomDetails)}
                  style={{ color: '#FF4D4F' }}
                >
                  ลบ
                </Button>
              </ButtonToolbar>
            )}
          </Table.Cell>
        </Table.Column>
      </Table>
    )}
        {/* แยก Modal สำหรับเพิ่มห้อง */}
      <AddRoomModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      <Modal open={openModal} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{editingRoom ? 'แก้ไขข้อมูลห้อง' : 'เพิ่มห้องใหม่'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            formValue={editingRoom || {}}
            onChange={formValue => setEditingRoom(formValue as RoomDetails)}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <Form.ControlLabel>ชื่อห้อง</Form.ControlLabel>
              <Form.Control
               name="Room_Name" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>ความจุ</Form.ControlLabel>
              <Form.Control name="Capacity" accepter={InputNumber} />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>สถานที่</Form.ControlLabel>
              <Form.Control name="Location" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>แผนก</Form.ControlLabel>
              <Form.Control name="departserivce" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  {editingRoom ? 'บันทึกการแก้ไข' : 'เพิ่มห้อง'}
                </Button>
                <Button appearance="subtle" onClick={handleClose}>
                  ยกเลิก
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
       {/* Modal ยืนยันการลบ */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>ยืนยันการลบห้อง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: '20px' }}>
            คุณแน่ใจหรือไม่ที่จะลบห้อง "{roomToDelete?.Room_Name}"?
          </div>
          <div style={{ color: '#FF4D4F', marginBottom: '20px' }}>
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              appearance="subtle"
              onClick={() => setOpenDeleteModal(false)}
              style={{ marginRight: '10px' }}
            >
              ยกเลิก
            </Button>
            <Button
              appearance="primary"
              color="red"
              onClick={confirmDelete}
            >
              ยืนยันการลบ
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    </div>
  </PageContainer>
);
};
export default RoomTable;
