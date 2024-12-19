'use client';
import dynamic from 'next/dynamic';
import React , { useEffect} from "react";
import { useState } from 'react';
import {FormControl,} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite
import dayjs from "dayjs";
// Loading Component
const Loading = ({ moduleName }: { moduleName: string }) => (<p>Loading {moduleName}...</p>);
// Dynamic Imports พร้อมระบุชื่อโมดูลใน Loading
const Typography = dynamic(() => import('@mui/material').then(mod => mod.Typography), {ssr: false,loading: () => <Loading moduleName="Typography" />});
const Grid = dynamic(() => import('@mui/material').then(mod => mod.Grid), {ssr: false,loading: () => <Loading moduleName="Grid" />});
const CardContent = dynamic(() => import('@mui/material').then(mod => mod.CardContent), {ssr: false,loading: () => <Loading moduleName="CardContent" />});
const Radio = dynamic(() => import('@mui/material').then(mod => mod.Radio), {ssr: false,loading: () => <Loading moduleName="Radio" />});
const RadioGroup = dynamic(() => import('@mui/material').then(mod => mod.RadioGroup), {ssr: false,loading: () => <Loading moduleName="RadioGroup" />});
const FormControlLabel = dynamic(() => import('@mui/material').then(mod => mod.FormControlLabel), {ssr: false,loading: () => <Loading moduleName="FormControlLabel" />});
const SelectPicker = dynamic(() => import('rsuite').then(mod => mod.SelectPicker), {ssr: false,loading: () => <Loading moduleName="SelectPicker" />});
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'), {ssr: false,loading: () => <Loading moduleName="PageContainer" />});
const DashboardCard = dynamic(() => import('@/app/(DashboardLayout)/components/shared/DashboardCard'), {ssr: false,loading: () => <Loading moduleName="DashboardCard" />});
const BlankCard = dynamic(() => import('@/app/(DashboardLayout)/components/shared/BlankCard'), {ssr: false,loading: () => <Loading moduleName="BlankCard" />});
const Input = dynamic(() => import('reactstrap').then(mod => mod.Input), {ssr: false,loading: () => <Loading moduleName="Input" />});
const Stack = dynamic(() => import('rsuite').then(mod => mod.Stack), {ssr: false,loading: () => <Loading moduleName="Stack" />});
const CheckPicker = dynamic(() => import('rsuite').then(mod => mod.CheckPicker), {ssr: false,loading: () => <Loading moduleName="CheckPicker" />});
const IconButton = dynamic(() => import('rsuite').then(mod => mod.IconButton), {ssr: false,loading: () => <Loading moduleName="IconButton" />});
const ButtonToolbar = dynamic(() => import('rsuite').then(mod => mod.ButtonToolbar), {ssr: false,loading: () => <Loading moduleName="ButtonToolbar" />});
const Loader = dynamic(() => import('rsuite').then(mod => mod.Loader), {ssr: false,loading: () => <Loading moduleName="Loader" />});
const AddOutlineIcon = dynamic(() => import('@rsuite/icons/AddOutline'), {ssr: false,loading: () => <Loading moduleName="AddOutlineIcon" />});
const DateRangePicker = dynamic(() => import('rsuite').then(mod => mod.DateRangePicker), {ssr: false,loading: () => <Loading moduleName="DateRangePicker" />});
const TimeRangePicker = dynamic(() => import('rsuite').then(mod => mod.TimeRangePicker), {ssr: false, loading: () => <Loading moduleName="TimeRangePicker" />});
const HStack = dynamic(() => import('rsuite').then(mod => mod.HStack), {ssr: false,loading: () => <Loading moduleName="HStack" />});
const SpinnerIcon = dynamic(() => import('@rsuite/icons/Spinner'), {ssr: false,loading: () => <Loading moduleName="SpinnerIcon" />});
const Dialog = dynamic(() => import('@mui/material').then(mod => mod.Dialog), {ssr: false,loading: () => <Loading moduleName="Dialog" />});
const DialogActions = dynamic(() => import('@mui/material').then(mod => mod.DialogActions), {ssr: false,loading: () => <Loading moduleName="DialogActions" />});
const DialogContent = dynamic(() => import('@mui/material').then(mod => mod.DialogContent), {ssr: false,loading: () => <Loading moduleName="DialogContent" />});
const DialogTitle = dynamic(() => import('@mui/material').then(mod => mod.DialogTitle), {ssr: false,loading: () => <Loading moduleName="DialogTitle" />});
const Button = dynamic(() => import('@mui/material').then(mod => mod.Button), {ssr: false,loading: () => <Loading moduleName="Button" />});
//ใช้การ import แบบ Dynamic จะทำการโหลดอันที่พร้อมแล้วมาไว้ก่อน ส่วนอันที่ยังช้าอยู่จะตามมาทีหลัง
//จะได้ไม่ต้องรอโหลดพร้อมกัน
interface Room {
  Room_Name: string;
  Capacity?: number;
  Location?: string;
}
interface Department {
  Department_Name: string;
}
interface BtnServesProps {
  label?: string; // ข้อความในปุ่ม
  onClick?: () => void; // ฟังก์ชันที่จะถูกเรียกเมื่อคลิกปุ่ม
  isLoading?: boolean; // สถานะเริ่มต้นของการโหลด
}
const Meeting: React.FC<BtnServesProps> = ({
  label = "Create",
  onClick = () => {},
  isLoading = false,
}) => {
  const equipmentOptions = [
    { label: 'เครื่องฉาย Projector', value: 'Projector' },
    { label: 'Telephone conference', value: 'Telephone conference' },
    { label: 'VDO Conference', value: 'VDO Conference' },
    { label: 'เครื่องฉาย VCD/DVD', value: 'VCD/DVD' },
    { label: 'Computer', value: 'Computer' },
    { label: 'Visualizer (เครื่องฉายสไลด์)', value: 'Visualizer' },
  ];
  const [data, setData] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(""); // ต้องเป็น string
  const [selectedDepartmentType, setSelectedDepartmentType] = useState<string>("ภายใน");
  const [toppicInput, setToppicInput] = useState("");
  const [participantCount, setParticipantCount] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null); // Room ที่เลือก
  const [rooms, setRooms] = useState<{ label: string; value: string }[]>([]); // ข้อมูลห้อง

  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState(''); // สร้าง State สำหรับ Input

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // ควบคุมสถานะการเปิด/ปิด Dialog

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning" | null>(null);

  const [username, setUsername] = useState<string | null>("");
  const handleTimeChange = (value: [Date | null, Date | null] | null) => {
    if (value && value[0] && value[1]) {
      console.log('Selected Time Range:', value);
      setSelectedTime({ start: value[0], end: value[1] });
    } else {
      setSelectedTime({ start: null, end: null });
    }
  };
  const router = useRouter(); // ใช้ useRouter

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
  // ฟังก์ชันที่ใช้รับค่า participantCount จาก InputNumber
  const handleParticipantCountChange = (value: string) => {
    if (!isNaN(Number(value)) || value === "") { // ตรวจสอบว่าเป็นเลขหรือไม่
      setParticipantCount(value); // เก็บค่าที่รับมาเป็น string
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToppicInput(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUsername = localStorage.getItem("username");
          setUsername(storedUsername);
        }
        const response = await axios.get("/api/rooms");
        console.log("API Response:", response.data);
        const [departmentResponse, roomResponse] = await Promise.all([
          axios.get("/api/department"),
          axios.get("/api/rooms"),
        ]);
        console.log('Rooms:', roomResponse.data.rooms); // ตรวจสอบข้อมูลห้อง
        setData(departmentResponse.data.departments || []);
        setRooms(roomResponse.data.rooms || []);
        setRooms(
          response.data.meetingRooms.map((room: any) => ({
            label: room.Room_Name, // ใช้ Room_Name เป็น label
            value: room.Room_Name, // ใช้ Room_Name เป็น value
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handlePost = async () => {
    const equipmentUseString = JSON.stringify(selectedEquipment);
    const trimmedEquipmentUseString = equipmentUseString.replace(/[\[\]"]/g, "");
    setLoading(true);
    setConfirmationModalOpen(true);
    try {
          // ตรวจสอบความครบถ้วนของข้อมูลก่อนส่ง
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
        setNotificationMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
        setNotificationType("error");
        setLoading(false); // รีเซ็ตการโหลดหากข้อมูลไม่ครบ
        return;
      }
        setLoading(true);
        setNotificationMessage("กำลังทำการจอง...");
        setNotificationType(null); // ลบข้อความแจ้งเตือนเก่าออก

        const startDate = new Date(selectedDate[0]);
        const endDate = new Date(selectedDate[1]);
        const startTime = new Date(selectedTime.start);
        const endTime = new Date(selectedTime.end);

        const startDateFormatted = startDate.toISOString().split("T")[0];
        const endDateFormatted = endDate.toISOString().split("T")[0];
        const startTimeFormatted = formatTime(startTime);
        const endTimeFormatted = formatTime(endTime);

        const postData = {
          eventName: toppicInput,
          departmentName: selectedDepartment,
          Start_date: startDateFormatted,
          End_date: endDateFormatted,
          Start_time: startTimeFormatted,
          End_time: endTimeFormatted,
          participant: Number(participantCount),
          equipmentUse: trimmedEquipmentUseString,
          agency: selectedDepartmentType,
          notes: textareaValue,
          statusName: "Pending",
          userId: username,
          roomName: selectedRoom,
          approvedByAdminId: "",
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
          body: JSON.stringify(postData),
        });
        if (emailResponse.ok) {
          setNotificationMessage("จองห้องประชุมสำเร็จ!");
          setNotificationType("success");
        } else {
          setNotificationMessage("ข้อมูลถูกส่งเรียบร้อย แต่ไม่สามารถส่งอีเมลได้");
          setNotificationType("warning");
        }
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error === "มีการจองซ้ำในช่วงเวลานี้") {
          setNotificationMessage("ห้องนี้ถูกจองไว้แล้วในเวลานี้ กรุณาจองใหม่");
          setNotificationType("warning");
        } else {
          setNotificationMessage(errorData.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          setNotificationType("error");
        }
      }
    } catch (error) {
      setNotificationMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setNotificationType("error");
    } finally {
      setLoading(false); // ปิดการโหลดทุกกรณี
    }
  };
  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const [loading, setLoading] = useState(isLoading);
  const handleClick = () => {
    onClick();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };
   // ฟังก์ชั่นยืนยันการส่งข้อมูล
   const handleConfirm = () => {
    setLoading(true); // เปิดสถานะการโหลด
    // จำลองการส่งข้อมูล (อาจใช้ axios หรือฟังก์ชั่นที่เกี่ยวข้องกับ API)
    setTimeout(() => {
      setLoading(false); // ปิดสถานะการโหลดหลังจากส่งข้อมูลเสร็จ
      setConfirmationModalOpen(false); // ปิด Dialog
    }, 3000); // จำลองเวลาการส่งข้อมูล 3 วินาที
  };

  return (
    <PageContainer title="Typography" description="this is Typography">
      <Grid container spacing={3}>
        <Grid item sm={12} >
          <DashboardCard title="บันทึกการจองห้องประชุม" >
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    {/* ======== Topic ======== */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                      <div style={{ marginRight: "30px" }}>
                        <Typography variant="subtitle1" style={{ marginLeft: "5px", fontSize: "16px" }}>
                          หัวข้อการประชุม
                        </Typography>
                        <Input
                          className="form-control-alternative"
                          style={{ marginLeft: "5px", marginTop: "10px", width: "710px" }}
                          placeholder="กรุณากรอกหัวข้อ"
                          type="text"
                          value={toppicInput} // ผูกค่ากับ state
                          onChange={handleInputChange} // อัปเดตค่าจากการกรอก
                        />
                        {loading && (
                          <div style={{ marginTop: "10px" }}>
                            กำลังทำการจอง...
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ======== Topic ======== */}
                    {/* ======== Department  ======== */}
                    <div style={{ marginTop: "15px", marginLeft: "5px" }}>
                      <div style={{ marginBottom: "15px" }}>
                        <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                          หน่วยงานที่จัดประชุม
                        </Typography>
                        <div style={{ marginTop: "5px" }}>
                        <SelectPicker
                            data={data.length > 0
                              ? data.map((department) => ({
                                  label: department.Department_Name,
                                  value: department.Department_Name,
                                }))
                              : []}
                            appearance="default"
                            placeholder="เลือกหน่วยงาน"
                            style={{ width: 300 }}
                            onChange={(value, event) => {
                              if (value) {
                                console.log("Selected Department:", value);
                                setSelectedDepartment(value as string);
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
                            value={selectedRoom}
                            onChange={(value, event) => setSelectedRoom(value as string | null)}
                            labelKey="label"
                            valueKey="value"
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
                            value={participantCount || ""} // ผูกค่ากับ state
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
                    {/* ======== Equipment Use Select  ======== */}
                    <div style={{ display: "flex",
                    alignItems: "center" ,
                    marginLeft: "5px",
                    marginTop: "20px"}}>
                      <div style={{ marginRight: "30px" }}>
                        <Typography variant="subtitle1" style={{
                                  marginRight: "8px",
                                  fontSize: "16px" }}>
                          อุปกรณ์ที่ใช้
                        </Typography>
                        <div style={{marginTop: "10px"}}>
                        <CheckPicker
                          data={equipmentOptions}
                          value={selectedEquipment}
                          onChange={(value, event) => setSelectedEquipment(value as string[])}
                          placeholder="เลือกอุปกรณ์"
                          style={{ width: 300 }}
                        />
                        </div>
                      </div>
                    </div>
                    {/* ======== Equipment Use Select  ======== */}
                    {/* ======== Note Use Select  ======== */}
                    <div style={{ display: "flex", alignItems: "center" , marginTop: "15px"}}>
                      <div style={{ marginRight: "30px" }}>
                      <Typography variant="subtitle1" style={{ marginLeft: "5px", fontSize: "16px" }}>
                        หมายเหตุ
                      </Typography>
                        <Input
                            className="form-control-alternative"
                            style={{ marginLeft: "5px",marginTop: "10px", width: "300px"}}
                            placeholder=""
                            type="textarea"
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                          />
                      </div>
                    </div>
                    {/* ======== Note Use Select  ======== */}
                    {/* ======== User  ======== */}
                    <div style= {{display: "flex", marginTop: "10px", marginLeft: "10px"}}>
                        <Typography variant="subtitle1" style={{
                                  marginRight: "8px",
                                  fontSize: "16px" }}>``
                          ผู้จอง : {username}
                        </Typography>
                    </div>
                    {/* ======== User  ======== */}
                    {/* ======== Btn Select  ======== */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0px", marginLeft: "5px" }}>
                      <ButtonToolbar style={{ marginTop: "20px" }}>
                        <IconButton
                          appearance="primary"
                          color="blue"
                          icon={loading ? <Loader size="sm" /> : <AddOutlineIcon />}
                          onClick={() => setConfirmationModalOpen(true)} // เปิด Dialog เมื่อคลิกปุ่ม
                          disabled={loading}
                        >
                          {loading ? "กำลังทำการจอง..." : "ยืนยันข้อมูล"}
                        </IconButton>
                      </ButtonToolbar>
                    </div>
                    {/* ======== Btn Select  ======== */}
                    {/* ======== Confirmation Dialog  ======== */}
                    <Dialog
                      open={confirmationModalOpen}
                      onClose={() => {
                        // รีเซ็ตค่าข้อความและประเภทเมื่อ Dialog ปิด
                        setNotificationMessage("");
                        setNotificationType(null);
                        setConfirmationModalOpen(false); // ปิด Dialog
                      }}
                      fullWidth
                      maxWidth="xs"
                    >
                      <DialogTitle
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          marginTop: '5px',
                          fontSize: '20px',
                        }}
                      >
                        ยืนยันข้อมูลการจองห้องประชุม
                      </DialogTitle>
                      <DialogContent
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          minHeight: '20px', // เพิ่มพื้นที่ให้ดูสบายตา
                        }}
                      >
                        <HStack
                          spacing={10}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                          }}
                        >
                          {loading ? <SpinnerIcon spin style={{ fontSize: '2em', marginRight: '5px' }} /> : null}
                        </HStack>
                        <Typography
                          sx={{
                            marginTop: '10px',
                            fontSize: '16px',
                            color: notificationType === 'error' ? 'red' : notificationType === 'success' ? 'green' : 'orange',
                          }}
                        >
                          {notificationMessage}
                        </Typography>
                      </DialogContent>
                      <DialogActions
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}
                      >
                        {notificationMessage === "จองห้องประชุมสำเร็จ!" ? (
                          <Button
                          onClick={() => {
                            setConfirmationModalOpen(false); // ปิด Dialog
                            router.push('/utilities/sample-page'); // ใช้ router.push จาก Next.js เพื่อนำทางไปยังหน้าใหม่
                          }}
                          color="primary"
                        >
                          OK
                        </Button>
                        ) : (
                          <>
                            <Button
                              onClick={handlePost}
                              color="primary"
                              disabled={loading}
                            >
                              ยืนยัน
                            </Button>
                            <Button
                              onClick={() => {
                                // รีเซ็ตค���าข้อความและประเภทเมื่อ Dialog ถูกปิด
                                setNotificationMessage("");
                                setNotificationType(null);
                                setConfirmationModalOpen(false); // ปิด Dialog
                              }}
                              color="secondary"
                            >
                              ยกเลิก
                            </Button>
                          </>
                        )}
                      </DialogActions>
                    </Dialog>
                    {/* ======== Confirmation Dialog  ======== */}
                    <Typography variant="body1" color="textSecondary">
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid >
   </PageContainer>
  );
};

export default  Meeting;
