import { useState, useEffect } from 'react';
import React , { useRef , forwardRef, useImperativeHandle } from "react";
import { Typography,Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper,
  IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button ,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import { HStack } from 'rsuite';
import PieChartIcon from '@rsuite/icons/PieChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Input } from "reactstrap";
import dayjs from "dayjs";
import { useToaster, Notification } from 'rsuite';
import { SelectPicker } from "rsuite";
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite
import { Stack ,CheckPicker, ButtonToolbar, Loader } from 'rsuite';
import { DateRangePicker } from 'rsuite'; // ไลบรารีที่ใช้ DateRangePicker
import { TimeRangePicker } from 'rsuite'; // ไลบรารีที่ใช้ TimeRangePicker


interface Room {
  Room_Name: string;
  Capacity?: number;
  Location?: string;
}

interface BookingRoom {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: string;
  Status_Name: string;
  Booking_ID: number;
  User_ID: string;
}

const UserReserved = () => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingRoom | null>(null); // เก็บข้อมูลการจองที่เลือก
  const [open, setOpen] = useState(false); // ควบคุมการเปิด/ปิด modal
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const [selectedDepartment, setSelectedDepartment] = useState<string>(""); // ต้องเป็น string
  const [selectedDepartmentType, setSelectedDepartmentType] = useState<string>("ภายใน");


  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState(''); // สร้าง State สำหรับ Input

  const [toppicInput, setToppicInput] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null); // Room ที่เลือก
  const [rooms, setRooms] = useState<{ label: string; value: string }[]>([]); // ข้อมูลห้อง

  const [participantCount, setParticipantCount] = useState<string | null>(null);

  const [username, setUsername] = useState<string | null>("");
  const toaster = useToaster();


  const handleTimeChange = (value: [Date | null, Date | null] | null) => {
    if (value && value[0] && value[1]) {
      console.log('Selected Time Range:', value);
      setSelectedTime({ start: value[0], end: value[1] });
    } else {
      setSelectedTime({ start: null, end: null });
    }
  };
  const handleDateChange = (value: any) => {
    if (value) {
      // เพิ่มวันที่ 1 วันทั้ง Start และ End Date
      const updatedDates = value.map((date: any) => dayjs(date).add(1, "day"));

      // อัปเดต State
      setSelectedDate(updatedDates);

      // ส่งค่าที่แก้ไขแล้วไปยัง API
      const apiPayload = {
        startDate: updatedDates[0].format("YYYY-MM-DD"),
        endDate: updatedDates[1].format("YYYY-MM-DD"),
      };
      console.log("API Payload:", apiPayload);

      // TODO: ส่งค่าไปยัง API (ใช้ fetch/axios เป็นต้น)
    } else {
      setSelectedDate(null);
    }
  };

  useEffect(() => {
    const storedUserID = localStorage.getItem('username');
    setUserID(storedUserID);
  }, []);

  // ฟังก์ชันสำหรับการอัพเดตเวลา
  useEffect(() => {
    const updateCurrentTime = () => {
      const time = new Date().toLocaleTimeString();
      setCurrentTime(time);
    };

    const updateCurrentDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0'); // เติมศูนย์หน้าหากวันเป็นตัวเลข 1 หลัก
      const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // เดือนแบบย่อ (เช่น 'nov')
      const year = date.getFullYear();

      setCurrentDate(`${day} ${month} ${year}`);
    };


    // เรียก updateCurrentTime ทุกๆ 1 วินาที
    const intervalId = setInterval(updateCurrentTime, 1000);
    updateCurrentDate(); // เรียกทันทีเพื่ออัพเดตวันที่ทันที

    // ทำความสะอาดเมื่อคอมโพเนนต์ถูกทำลาย
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userID) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/userbooking?User_ID=${userID}`);
          const result = await response.json();
          if (result.success && Array.isArray(result.meetingRooms)) {
            setData(result.meetingRooms);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userID]);

  // ฟังก์ชันที่ใช้รับค่า participantCount จาก InputNumber
  const handleParticipantCountChange = (value: string) => {
    if (!isNaN(Number(value)) || value === "") { // ตรวจสอบว่าเป็นเลขหรือไม่
      setParticipantCount(value); // เก็บค่าที่รับมาเป็น string
    }
  };

  const handlePost = async () => {
    const equipmentUseString = JSON.stringify(selectedEquipment);
    const trimmedEquipmentUseString = equipmentUseString.replace(/[\[\]"]/g, "");
    setLoading(true);

    // ตรวจสอบข้อมูลว่าครบถ้วนหรือไม่
    if (
      !toppicInput ||
      !selectedDepartment ||
      !selectedRoom ||
      participantCount === undefined || // ตรวจสอบว่ามีค่า
      participantCount === "" || // ตรวจสอบว่าค่าไม่ว่าง
      isNaN(Number(participantCount)) || // ตรวจสอบว่าค่าเป็นตัวเลข
      !selectedDate ||
      !selectedDate[0] || // ตรวจสอบว่ามีวันที่เริ่มต้น
      !selectedDate[1] || // ตรวจสอบว่ามีวันที่สิ้นสุด
      !selectedTime.start ||
      !selectedTime.end ||
      !username
    ) {
      toaster.push(
        <Notification type="error" header="Error" duration={5000}>
          กรุณากรอกข้อมูลให้ครบถ้วน
        </Notification>,
        { placement: 'topCenter' }
      );
      setLoading(false); // รีเซ็ตการโหลดหากข้อมูลไม่ครบ
      return;
    }

    try {
      setLoading(true);

      const startDate = new Date(selectedDate[0]);
      const endDate = new Date(selectedDate[1]);
      const startTime = new Date(selectedTime.start);
      const endTime = new Date(selectedTime.end);

      const startDateFormatted = startDate.toISOString().split("T")[0];
      const endDateFormatted = endDate.toISOString().split("T")[0];
      // const startTimeFormatted = formatTime(startTime);
      // const endTimeFormatted = formatTime(endTime);

      const postData = {
        eventName: toppicInput,
        departmentName: selectedDepartment,
        Start_date: startDateFormatted,
        End_date: endDateFormatted,
        // Start_time: startTimeFormatted,
        // End_time: endTimeFormatted,
        participant: Number(participantCount), // แปลงค่าให้เป็น number
        equipmentUse: trimmedEquipmentUseString,
        agency: selectedDepartmentType,
        notes: textareaValue,
        statusName: "Pending",
        userId: username, // เปลี่ยนเป็น id ที่แท้จริง
        roomName: selectedRoom,
        approvedByAdminId: "", // เปลี่ยนเป็น id ของ admin ที่อนุมัติ
      };

      // ส่งข้อมูลไปยัง API
      const response = await fetch("/api/postdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // ส่งอีเมลหลังจากข้อมูลถูกบันทึก
        const emailResponse = await fetch("/api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData), // ใช้ข้อมูลเดียวกันในการส่งอีเมล
        });

        if (emailResponse.ok) {
          toaster.push(
            <Notification type="success" header="Success" duration={5000}>
              ข้อมูลและอีเมลถูกส่งเรียบร้อยแล้ว!
            </Notification>,
            { placement: 'topCenter' }
          );
          const data = await emailResponse.json();
          console.log("Email Response:", data);
        } else {
          toaster.push(
            <Notification type="warning" header="Warning" duration={5000}>
              ข้อมูลถูกส่งเรียบร้อย แต่ไม่สามารถส่งอีเมลได้
            </Notification>,
            { placement: 'topCenter' }
          );
          console.error("Email Response Status:", emailResponse.status);
        }
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error === "มีการจองซ้ำในช่วงเวลานี้") {
          toaster.push(
            <Notification type="warning" header="Warning" duration={5000}>
              ห้องนี้ถูกจองไว้แล้วในเวลานี้ กรุณาจองใหม่
            </Notification>,
            { placement: 'topCenter' }
          );
        } else {
          toaster.push(
            <Notification type="error" header="Error" duration={5000}>
              {errorData.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"}
            </Notification>,
            { placement: 'topCenter' }
          );
        }
        console.error("Response Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      toaster.push(
        <Notification type="error" header="Error" duration={5000}>
          เกิดข้อผิดพลาดในการเชื่อมต่อ
        </Notification>,
        { placement: 'topCenter' }
      );
    } finally {
      setLoading(false); // ปิดการโหลดทุกกรณี
    }
  };

  const formatTime = (time: string) => time.slice(0, 5);
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const handleEdit = (id: number) => {
    const booking = data.find((b) => b.Booking_ID === id); // หาข้อมูลการจองที่ตรงกับ ID
    if (booking) {
      setSelectedBooking(booking);
      setOpen(true); // เปิด modal
    }
  };

  const handleClose = () => {
    setOpen(false); // ปิด modal
    setSelectedBooking(null); // ล้างข้อมูลที่เลือก
  };

  // Sorting data based on Start_date
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.Start_date);
    const dateB = new Date(b.Start_date);
    return dateA > dateB ? -1 : 1; // Future dates first
  });

  // Function to check if a booking is in the past
  const isPastBooking = (startDate: string) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 ของวันที่ปัจจุบัน

    const bookingDate = new Date(startDate);
    bookingDate.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 สำหรับวันที่การจอง

    return bookingDate < currentDate; // ตรวจสอบว่าการจองนั้นอยู่ในอดีตหรือไม่
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title="User Reservations" description="This is the page displaying user reservations">
      <div style={{ marginBottom: '10px', fontSize: '18px' }}>
        <strong>{currentDate} | {currentTime} </strong><br />
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '600px', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>วันที่</strong></TableCell>
              <TableCell><strong>เวลา</strong></TableCell>
              <TableCell><strong>รายการที่จอง</strong></TableCell>
              <TableCell><strong>เรื่อง / สถานที่ติดต่อ</strong></TableCell>
              <TableCell><strong>หน่วยงานที่จอง</strong></TableCell>
              <TableCell><strong>จำนวนคน</strong></TableCell>
              <TableCell align="center"><strong>สถานะ</strong></TableCell>
              <TableCell align="center"><strong>จัดการ</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((booking, index) => {
                const isPast = isPastBooking(booking.Start_date);
                return (
                  <TableRow key={index} sx={{ backgroundColor: isPast ? '#f0f0f0' : 'transparent' }}>
                    <TableCell>{formatDate(booking.Start_date)} - {formatDate(booking.End_date)}</TableCell>
                    <TableCell>{formatTime(booking.Start_Time)} - {formatTime(booking.End_Time)}</TableCell>
                    <TableCell>{booking.Room_Name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {booking.Event_Name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {booking.Department_Name}
                    </TableCell>
                    <TableCell align="center">{booking.participant}</TableCell>
                    <TableCell align="center">
                      {booking.Status_Name === 'Pending' ? (
                        <PieChartIcon style={{ color: '#f5a623', fontSize: '16px' }} />
                      ) : (
                        <PieChartIcon style={{ color: 'green', fontSize: '16px' }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(booking.Booking_ID)}
                        color="primary"
                        disabled={isPast} // Disable edit button for past bookings
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" disabled={isPast}> {/* Optionally disable delete button */ }
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">ไม่พบข้อมูลการจอง</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal สำหรับแสดงข้อมูลการจอง */}
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle>แก้ไขข้อมูลการจอง</DialogTitle>
        <DialogContent>
          {selectedBooking && (
              <div><Typography variant="subtitle1" style={{ marginLeft: "5px", fontSize: "16px" }}>
                หัวข้อการประชุม
              </Typography>
              <Input
                className="form-control-alternative"
                style={{ marginLeft: "5px", marginTop: "10px", width: "550px" }}
                placeholder=""
                type="text"
                value={selectedBooking.Event_Name} // ผูกค่ากับ state
                // onChange={handleInputChange} // อัปเดตค่าจากการกรอก
              />

              {/* ======== Department  ======== */}
              <div style={{ marginTop: "15px", marginLeft: "5px" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                        หน่วยงานที่จัดประชุม
                      </Typography>
                      <div style={{ marginTop: "5px" }}>

                      <SelectPicker
                          data={
                            data.length > 0
                              ? data.map((department) => ({
                                  label: department.Department_Name,
                                  value: department.Department_Name,
                                }))
                              : []
                          }
                          appearance="default"
                          placeholder="เลือกหน่วยงาน"
                          style={{ width: 300 }}
                          onChange={(value: string | null) => {
                            if (value) {
                              console.log("Selected Department:", value); // Debugging
                              setSelectedDepartment(value);
                            }
                          }}
                        />

                      </div>

                      <div style={{ marginTop: "10px" }}>
                        <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="department-type"
                          name="department-type"
                          value={selectedDepartmentType} // ผูกกับ state
                          onChange={(e) => setSelectedDepartmentType(e.target.value)} // อัปเดต state
                        >
                          <FormControlLabel value="ภายใน" control={<Radio />} label="ภายใน" />
                          <FormControlLabel value="ภายนอก" control={<Radio />} label="ภายนอก" />
                        </RadioGroup>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  {/* ======== Department  ======== */}
                                    {/* ======== Rooms  ======== */}
                                    <div style={{ display: "flex", alignItems: "center", marginLeft: "5px", marginBottom: "25px" }}>
                    {/* ======== ห้องที่ใช้ประชุม ======== */}
                    <div style={{ marginRight: "30px" }}>
                      <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
                        ห้องที่ใช้ประชุม
                      </Typography>
                      <div style={{ marginTop: "5px" }}>
                        <SelectPicker
                          data={rooms}
                          appearance="default"
                          placeholder="เลือกห้อง"
                          style={{ width: '300px'}}
                          // value={selectedRoom}
                          value={selectedBooking.Room_Name}
                          onChange={(value: string | null) => setSelectedRoom(value)}
                          labelKey="label" // กำหนดให้ใช้ "label" เป็นชื่อห้อง
                          valueKey="value" // กำหนดให้ใช้ "value" เป็นค่าที่ส่งเมื่อเลือก
                        />
                      </div>
                    </div>

                    {/* ======== จำนวนผู้เข้าประชุม ======== */}
                    <div>
                      <Typography variant="subtitle1" style={{ marginLeft: "21px", fontSize: "16px" }}>
                        จำนวนผู้เข้าประชุม
                      </Typography>
                      <div style={{ marginTop: "4px", marginLeft: "20px" }}>
                        <Stack style={{ width: "100px" }}>
                        <Input
                          className="form-control-alternative"
                          style={{ marginLeft: "5px", marginTop: "0px", width: "110px" }}
                          placeholder="กรอกจำนวน"
                          type="text"
                          // value={participantCount || ""} // ผูกค่ากับ state
                          value={selectedBooking.participant} // ผูกค่ากับ state
                          onChange={(e) => handleParticipantCountChange(e.target.value)} // อัปเดตค่าจากการกรอก
                        />
                        </Stack>
                      </div>
                    </div>
                  </div>
                  {/* ======== Rooms  ======== */}

                                    {/* ======== Date Select  ======== */}
                                    <div style={{ display: "flex", alignItems: "center", marginTop: "15px", marginLeft: "5px" }}>
                  {/* วันที่ใช้ห้อง */}
                    <div style={{ marginRight: "30px" }}>
                      <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
                        วันที่ใช้ห้อง
                      </Typography>
                      <div style={{ marginTop: "5px" }}>
                        <Stack spacing={10} direction="column" alignItems="flex-start">
                        <DateRangePicker
                              style={{ width: 300 }}
                              placeholder="เลือกวันที่"
                              onChange={handleDateChange}
                              format="dd-MM-yyyy"
                            />
                        </Stack>
                      </div>
                    </div>
                      {/* ช่วงเวลาที่ใช้ */}
                      <div style={{ display: "flex", alignItems: "center", marginTop: "1px", marginLeft: "25px" }}>
                        <div style={{ marginRight: "30px" }}>
                          <Typography variant="subtitle1" style={{ marginRight: "8px", fontSize: "16px" }}>
                            ช่วงเวลาที่ใช้
                          </Typography>
                          <div style={{ marginTop: "4px" }}>
                          <TimeRangePicker
                            hideMinutes={(minute) => minute % 15 !== 0} // ซ่อนนาทีที่ไม่ใช่ 15 นาที
                            editable={false} // ไม่ให้ผู้ใช้แก้ไขเวลาโดยตรง
                            value={selectedTime.start && selectedTime.end ? [selectedTime.start, selectedTime.end] : null} // ใช้ selectedTime ที่ถูกประกาศใน state
                            onChange={handleTimeChange} // ฟังก์ชันที่เรียกเมื่อเปลี่ยนช่วงเวลา
                          />
                          </div>
                        </div>
                      </div>
                  </div>
                  {/* ======== Date Select  ======== */}
                  {/* ======== User  ======== */}
                  <div style= {{display: "flex", marginTop: "10px", marginLeft: "10px"}}>
                    <Typography variant="subtitle1" style={{
                              marginRight: "8px",
                              fontSize: "16px" }}>
                      ผู้จอง : {selectedBooking.User_ID}
                    </Typography>
                </div>
                  {/* ======== User  ======== */}
            </div>

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">ปิด</Button>
          <Button onClick={() => console.log('Save Changes')} color="secondary">บันทึก</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserReserved;
