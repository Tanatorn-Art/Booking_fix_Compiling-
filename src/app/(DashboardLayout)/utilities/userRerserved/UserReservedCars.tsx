import { useState, useEffect } from 'react';
import React from "react";
import { Typography,Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper,
  IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button , TablePagination ,
} from '@mui/material';
import dayjs from "dayjs";
import { useToaster, Notification } from 'rsuite';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css'; // ไม่จำเป็นต้อง dynamic เนื่องจากเป็นไฟล์ CSS
import 'rsuite/dist/rsuite.min.css'; // ไม่จำเป็นต้อง dynamic เนื่องจากเป็นไฟล์ CSS
// ไลบรารีที่ใช้ dynamic import
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'), { ssr: false });
const PieChartIcon = dynamic(() => import('@rsuite/icons/PieChart'), { ssr: false });
const EditIcon = dynamic(() => import('@mui/icons-material/Edit'), { ssr: false });
const DeleteIcon = dynamic(() => import('@mui/icons-material/Delete'), { ssr: false });
const HStack = dynamic(() => import('rsuite').then(mod => mod.HStack), { ssr: false });
const GearIcon = dynamic(() => import('@rsuite/icons/Gear'), { ssr: false });
//ใช้การ import แบบ Dynamic จะทำการโหลดอันที่พร้อมแล้วมาไว้ก่อน ส่วนอันที่ยังช้าอยู่จะตามมาทีหลัง
//จะได้ไม่ต้องรอโหลดพร้อมกัน
interface Car {
  Car_Name: string;
  Capacity?: number;
  Location?: string;
}
interface BookingCar {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Car_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: string;
  Status_Name: string;
  Booking_ID: number;
  User_ID: string;
}
const UserReservedCars = () => {
  //state
  const [data, setData] = useState<BookingCar[]>([]);
  const [loading, setLoading] = useState(false);
  const [isloading, setisLoading] = useState(false);


  const [userID, setUserID] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingCar | null>(null); // เก็บข้อมูลการจองที่เลือก
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

  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning" | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // สำหรับข้อความแจ้งเตือน
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null); // สำหรับสถานะความสำเร็จ

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // state สำหรับ Modal

  const [confirmationModalDel, setConfirmationModalDel] = useState(false); // state สำหรับ Modal

  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null); // เก็บ Booking_ID ที่เลือก
  const [username, setUsername] = useState<string | null>("");

  // เพิ่ม state สำหรับ pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const toaster = useToaster();
  const router = useRouter();

  const handleConfirm = () => {
    setLoading(true); // เริ่มโหลด
    if (currentBookingId !== null) {
      router.push(`/utilities/EditReservedCars?Booking_ID=${currentBookingId}`);
    }
  };

  const handleDelete = async (currentBookingId: any) => {
    setLoading(true);
    setNotificationMessage("กำลังลบข้อมูล...");
    setNotificationType(null); // ลบข้อความแจ้งเตือนเก่าออก
    setConfirmationModalDel(true); // เปิด Modal ยืนยันการลบ

    try {
      // ส่งคำขอลบข้อมูลไปยัง API
      const response = await fetch("/api/deletedataCars", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Booking_ID: currentBookingId }), // ส่ง Booking_ID ที่ต้องการลบ
      });

      if (response.ok) {
        setNotificationMessage("ลบข้อมูลสำเร็จ!");
        setNotificationType("success");
        // อัปเดต UI ตามความต้องการ (เช่น ลบข้อมูลออกจาก state)
        setData((prevData) => prevData.filter(item => item.Booking_ID !== currentBookingId));
      } else {
        const errorData = await response.json();
        setNotificationMessage(errorData.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
        setNotificationType("error");
      }
    } catch (error) {
      setNotificationMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setNotificationType("error");
    } finally {
      setLoading(false); // จบโหลด
    }
  };

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
          const response = await fetch(`/api/userbookingCars?User_ID=${userID}`);
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
      setisLoading(false); // ปิดการโหลดทุกกรณี
    }
  };
  const formatTime = (time: string) => time.slice(0, 5);
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  // const handleEdit = (bookingId: number) => {
  //   // นำทางไปที่หน้า EditReserved โดยแนบ bookingId
  //   router.push(`/utilities/EditReserved?Booking_ID=${bookingId}`);
  // };
  const handleEdit = (bookingId: number) => {
    setCurrentBookingId(bookingId); // เก็บ Booking_ID ที่เลือก
    setConfirmationModalOpen(true); // เปิด Modal ยืนยัน
  };
  const handleDel = (bookingId: number) => {
    setCurrentBookingId(bookingId); // เก็บ Booking_ID ที่เลือก
    setConfirmationModalDel(true); // เปิด Modal ยืนยัน
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
        <Table  >
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
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // เพิ่ม slice เพื่อแบ่งข้อมูลตามหน้า
                .map((booking, index) => {
                const isPast = isPastBooking(booking.Start_date);
                return (
                  <TableRow key={index} sx={{ backgroundColor: isPast ? '#f0f0f0' : 'transparent' }}>
                    <TableCell>{formatDate(booking.Start_date)} - {formatDate(booking.End_date)}</TableCell>
                    <TableCell>{formatTime(booking.Start_Time)} - {formatTime(booking.End_Time)}</TableCell>
                    <TableCell>{booking.Car_Name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {booking.Event_Name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {booking.Department_Name}
                    </TableCell>
                    <TableCell align="center">{booking.participant}</TableCell>
                    <TableCell align="center">
                      {['Pending', 'Edit'].includes(booking.Status_Name) ? (
                        <PieChartIcon style={{ color: '#f5a623', fontSize: '16px' }} />
                      ) : (
                        <PieChartIcon style={{ color: 'green', fontSize: '16px' }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(booking.Booking_ID)} color="primary" disabled={isPast} // Disable edit button for past bookings
                      >
                        <EditIcon />

                      </IconButton>
                      <IconButton
                        onClick={() => handleDel(booking.Booking_ID)} color="error" disabled={isPast}>
                        {/* Optionally disable delete button */ }
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PieChartIcon style={{ color: '#f5a623', fontSize: '16px' }} />
              <span style={{ marginLeft: '4px', color: '#f5a623' }}>รอดำเนินการ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PieChartIcon style={{ color: 'green', fontSize: '16px' }} />
              <span style={{ marginLeft: '4px', color: 'green' }}>อนุมัติแล้ว</span>
            </div>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
          />
        </div>

      {/* Modal */}
        <Dialog open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} fullWidth maxWidth="xs" >
          <DialogTitle sx={{ display: 'flex',alignItems: 'center',justifyContent: 'center', textAlign: 'center',marginTop: '5px',fontSize: '20px',}}>
            ยืนยันการแก้ไข </DialogTitle>
          <DialogContent sx={{display: 'flex',alignItems: 'center',justifyContent: 'center',textAlign: 'center',minHeight: '100px'}} >
            {loading ? (
              <HStack spacing={10} style={{ display: 'flex', alignItems: 'center',justifyContent: 'center',textAlign: 'center',}} >
                <GearIcon spin style={{ fontSize: '2em' }} />
              </HStack> ) : (
              <Typography
                sx={{display: 'flex',alignItems: 'center',justifyContent: 'center',textAlign: 'center',marginTop: '5px',fontSize: '18px',}}>
                คุณต้องการแก้ไขรายการจองนี้หรือไม่?
              </Typography>
            )}
          </DialogContent>
          <DialogActions
            sx={{display: 'flex',alignItems: 'center',justifyContent: 'center',textAlign: 'center',}}>
            <Button onClick={handleConfirm} color="primary" sx={{fontSize: '18px',}} disabled={loading}>
              ยืนยัน </Button>
            <Button onClick={() => setConfirmationModalOpen(false)} color="secondary" sx={{ fontSize: '18px', }} disabled={loading} >
              ยกเลิก</Button>
          </DialogActions>
        </Dialog>

      {/* Modal Delete Comfirm  */}
      <Dialog open={confirmationModalDel} onClose={() => {setNotificationMessage("");setNotificationType(null);setConfirmationModalDel(false); }}
        fullWidth
        maxWidth="xs">
        <DialogTitle
          sx={{display: "flex", alignItems: "center",justifyContent: "center",textAlign: "center", marginTop: "5px", fontSize: "20px", }}>
          ยืนยันการลบข้อมูล
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center",minHeight: "20px",}}>
          <HStack
            spacing={10}style={{display: "flex",alignItems: "center",justifyContent: "center",textAlign: "center",}}>
            {loading ? <GearIcon spin style={{ fontSize: "2em", marginRight: "5px" }} /> : null}
          </HStack>
          <Typography
            sx={{marginTop: "10px",fontSize: "16px",color: notificationType === "error" ? "red" : notificationType === "success" ? "green" : "orange",}}>
            {notificationMessage}
          </Typography>
        </DialogContent>

        <DialogActions
          style={{display: "flex",alignItems: "center",justifyContent: "center",textAlign: "center",}}>
          {notificationMessage === "ลบข้อมูลสำเร็จ!" ? (
            <Button
              onClick={() => { setNotificationMessage(""); setNotificationType(null); setConfirmationModalDel(false); router.push("/utilities/userRerserved");}}
              color="primary"> OK </Button>) : (<>
              <Button onClick={async () => {setLoading(true); await handleDelete(currentBookingId);}}color="primary"sx={{fontSize: "18px",}}disabled={loading}> ยืนยัน </Button>
              <Button onClick={() => {setNotificationMessage("");setNotificationType(null);setConfirmationModalDel(false);}}color="secondary" > ยกเลิก</Button> </>)}
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserReservedCars;
