'use client'; // Mark as Client Component
import React, { useState, useEffect, FormEvent } from 'react';
import 'rsuite/dist/rsuite.min.css';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import { Table, Button, Modal, Form, Input, InputNumber, ButtonToolbar,Loader } from 'rsuite';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCarModal from './addCarModal';


type CarDetails = {
  Car_ID: number;
  Car_Name: string;
  Capacity: number;
  Location_cars: string;
  Carservice: string;
};
type CarProps = {
  data: CarDetails[]; // ข้อมูลเริ่มต้น (ถ้ามี)
};

const CarTable = ({ data = [] }: CarProps) => {
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<CarDetails | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setCars(data || []);
        setLoading(false);
      }, 1500);
    };
    fetchData();
  }, [data]);

  const handleAdd = () => {
    setOpenAddModal(true); // เปลี่ยนจาก setOpenModal เป็น setOpenAddModal
  };

    const handleEdit = (room: CarDetails) => {
    setEditingRoom(room);
    setOpenModal(true);
  };
  const handleDelete = (room: CarDetails) => {
    setRoomToDelete(room);
    setOpenDeleteModal(true);
  };

  // เพิ่มฟังก์ชันสำหรับการลบจริง
// ... existing code ...

  const confirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      const response = await fetch('/api/deleteCarTable', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Car_ID: roomToDelete.Car_ID }),
      });

      const result = await response.json();

      if (result.success) {
        setCars(prevCars => prevCars.filter(car => car.Car_ID !== roomToDelete.Car_ID));
        toast.success('ลบรถสำเร็จ');
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

// ... existing code ...

  const handleSubmit = async (formValue: Record<string, any> | null, event?: FormEvent<HTMLFormElement>) => {
    if (!formValue) return;

    try {
      const carData = {
        Car_ID: editingRoom?.Car_ID,
        Car_Name: formValue.Car_Name,
        Capacity: parseInt(formValue.Capacity),
        Location_cars: formValue.Location_cars,
        Carservice: formValue.Carservice
      };
      if (editingRoom) {
        const response = await fetch('/api/putcaradmin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...carData,
            Car_ID: editingRoom.Car_ID
          }),
        });

      if (!response.ok) {
        throw new Error('Failed to updatecar');
      }

      const result = await response.json();

      if (result.success && editingRoom?.Car_ID) {
        const updatedCar: CarDetails = {
          Car_ID: editingRoom.Car_ID,
          Car_Name: formValue.Car_Name || '',
          Capacity: parseInt(formValue.Capacity) || 0,
          Location_cars: formValue.Location_cars || '',
          Carservice: formValue.Carservice || ''
        };
        setCars(prevCars => prevCars.map(car =>
          car.Car_ID === editingRoom.Car_ID ? updatedCar : car
        ));
        toast.success('แก้ไขข้อมูลสำเร็จ');
        setOpenModal(false);
      }
    }  else {
      // กรณีเพิ่มใหม่ (คงเดิม)
      const response = await fetch('/api/postcaradmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      const result = await response.json();

      if (result.success && result.insertId) {
        const newCar: CarDetails = {
          Car_ID: result.insertId,
          Car_Name: formValue.Car_Name || '',
          Capacity: parseInt(formValue.Capacity) || 0,
          Location_cars: formValue.Location_cars || '',
          Carservice: formValue.Carservice || ''
        };
        setCars([...cars, newCar]);
        toast.success('เพิ่มรถสำเร็จ');
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

  const handleAddSuccess = async (newCar: CarDetails) => {
    // เพิ่มข้อมูลใหม่เข้าไปใน state ทันที
    setCars(prevCars => [...prevCars, newCar]);
    setOpenAddModal(false);
    toast.success('เพิ่มรถสำเร็จ');

    // รีเฟรชข้อมูลทั้งหมดหลังจากเพิ่มสำเร็จ
};

  return (
    <PageContainer title="Car Details" description="List of all available cars">
    <ToastContainer position="top-right" autoClose={3000} />
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h4 style={{color:'#4CAF50'}}>Cars Details</h4>
        <Button appearance="primary" onClick={handleAdd} style={{backgroundColor:'#4CAF50'}}>เพิ่มรถใหม่</Button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Loader content="Loading car details..." />
        </div>
      ) : (
        <Table height={650} data={cars}>
          {/* ... existing columns ... */}

            <Table.Column width={250}>
              <Table.HeaderCell>ชื่อรถ</Table.HeaderCell>
              <Table.Cell dataKey="Car_Name" style={{color:'#4CAF50 '}} />
            </Table.Column>

            <Table.Column width={150}>
              <Table.HeaderCell>ความจุ</Table.HeaderCell>
              <Table.Cell dataKey="Capacity" />
            </Table.Column>

            <Table.Column width={200}>
              <Table.HeaderCell>สถานที่</Table.HeaderCell>
              <Table.Cell dataKey="Location_cars" />
            </Table.Column>

            <Table.Column width={300}>
              <Table.HeaderCell>แผนก</Table.HeaderCell>
              <Table.Cell dataKey="Carservice" />
            </Table.Column>

          <Table.Column width={200} fixed="right">
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.Cell>
              {rowData => (
                <ButtonToolbar>
                  <Button appearance="link" onClick={() => handleEdit(rowData as CarDetails)} style={{color:'#4CAF50'}}>แก้ไข</Button>
                  <Button
                    appearance="link"
                    onClick={() => handleDelete(rowData as CarDetails)}
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
        {/* แยก Modal สำหรับเพิ่มรถ */}
      <AddCarModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess} // ไม่ต้องส่ง newCar parameter
        />

      <Modal open={openModal} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{editingRoom ? 'แก้ไขข้อมูลรถ' : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            formValue={editingRoom || {}}
            onChange={formValue => setEditingRoom(formValue as CarDetails)}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <Form.ControlLabel>ชื่อรถ</Form.ControlLabel>
              <Form.Control
               name="Car_Name" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>ความจุ</Form.ControlLabel>
              <Form.Control name="Capacity" accepter={InputNumber} />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>สถานที่</Form.ControlLabel>
              <Form.Control name="Location_cars" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>แผนก</Form.ControlLabel>
              <Form.Control name="Carservice" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  {editingRoom ? 'บันทึกการแก้ไข': ''}
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
            คุณแน่ใจหรือไม่ที่จะลบหถ "{roomToDelete?.Car_Name}"?
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
export default CarTable;
