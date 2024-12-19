import React from 'react';
import { Modal, Button, Form, InputNumber, ButtonToolbar } from 'rsuite';
import { toast } from 'react-toastify';

type CarDetails = {
  Car_ID: number;
  Car_Name: string;
  Capacity: number;
  Location_cars: string;
  Carservice: string;
};

interface AddCarModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newCar: CarDetails) => void;
}

const AddCarModal = ({ open, onClose, onSuccess }: AddCarModalProps) => {
  const [formValue, setFormValue] = React.useState<Partial<CarDetails>>({});

  const handleSubmit = async () => {
    try {
      const carData = {
        Car_Name: formValue.Car_Name,
        Capacity: parseInt(String(formValue.Capacity)),
        Location_cars: formValue.Location_cars,
        Carservice: formValue.Carservice
      };

      const response = await fetch('/api/postcaradmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add car');
      }

      const result = await response.json();
      if (result.success) {
        const newCar: CarDetails = {
          Car_ID: result.insertId,
          Car_Name: formValue.Car_Name || '',
          Capacity: parseInt(String(formValue.Capacity)) || 0,
          Location_cars: formValue.Location_cars || '',
          Carservice: formValue.Carservice || ''
        };
        onSuccess(newCar); // เรียกใช้ callback function เพื่ออัพเดทข้อมูลในตาราง
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มรถ');
    }
  };

  const handleClose = () => {
    setFormValue({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>เพิ่มรถใหม่</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fluid
          formValue={formValue}
          onChange={formValue => setFormValue(formValue)}
          onSubmit={handleSubmit}
        >
          <Form.Group>
            <Form.ControlLabel>ชื่อรถ</Form.ControlLabel>
            <Form.Control name="Car_Name" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>ความจุ</Form.ControlLabel>
            <Form.Control name="Capacity" accepter={InputNumber} required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>สถานที่</Form.ControlLabel>
            <Form.Control name="Location_cars" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>แผนก</Form.ControlLabel>
            <Form.Control name="Carservice" required />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" type="submit">
                เพิ่มรถ
              </Button>
              <Button appearance="subtle" onClick={handleClose}>
                ยกเลิก
              </Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCarModal;