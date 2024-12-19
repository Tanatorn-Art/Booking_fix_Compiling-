import React from 'react';
import { Modal, Button, Form, InputNumber, ButtonToolbar } from 'rsuite';
import { toast } from 'react-toastify';

type RoomDetails = {
  Room_ID: number;
  Room_Name: string;
  Capacity: number;
  Location: string;
  departserivce: string;
};

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newRoom: RoomDetails) => void;
}

const AddRoomModal = ({ open, onClose, onSuccess }: AddRoomModalProps) => {
  const [formValue, setFormValue] = React.useState<Partial<RoomDetails>>({});

  const handleSubmit = async () => {
    try {
      const roomData = {
        Room_Name: formValue.Room_Name,
        Capacity: parseInt(String(formValue.Capacity)),
        Location: formValue.Location,
        departserivce: formValue.departserivce
      };

      const response = await fetch('/api/postroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add room');
      }

      const result = await response.json();
      if (result.success) {
        const newRoom: RoomDetails = {
          Room_ID: result.insertId,
          Room_Name: formValue.Room_Name || '',
          Capacity: parseInt(String(formValue.Capacity)) || 0,
          Location: formValue.Location || '',
          departserivce: formValue.departserivce || ''
        };
        onSuccess(newRoom);
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleClose = () => {
    setFormValue({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>เพิ่มห้องใหม่</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fluid
          formValue={formValue}
          onChange={formValue => setFormValue(formValue)}
          onSubmit={handleSubmit}
        >
          <Form.Group>
            <Form.ControlLabel>ชื่อห้อง</Form.ControlLabel>
            <Form.Control name="Room_Name" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>ความจุ</Form.ControlLabel>
            <Form.Control name="Capacity" accepter={InputNumber} required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>สถานที่</Form.ControlLabel>
            <Form.Control name="Location" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>แผนก</Form.ControlLabel>
            <Form.Control name="departserivce" required />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" type="submit">
                เพิ่มห้อง
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

export default AddRoomModal;