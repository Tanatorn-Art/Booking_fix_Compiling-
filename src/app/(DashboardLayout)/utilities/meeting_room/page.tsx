'use client';
import React , { useEffect,useRef , forwardRef, useImperativeHandle } from "react";
import { useState } from 'react';
import {
  Typography,
  Grid,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { SelectPicker } from "rsuite";
import axios from "axios";
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Input } from "reactstrap";
import { Stack ,CheckPicker,IconButton, ButtonToolbar, Loader } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // ต้องการสไตล์ของ rsuite
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import { DateRangePicker } from 'rsuite'; // ไลบรารีที่ใช้ DateRangePicker
import { TimeRangePicker } from 'rsuite'; // ไลบรารีที่ใช้ TimeRangePicker
import dayjs from "dayjs";
import { useToaster, Notification } from 'rsuite';
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

const meeing_page: React.FC<BtnServesProps> = ({
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

  const [result, setResult] = useState<Record<string, string>>({});
  const toaster = useToaster();

  const [username, setUsername] = useState<string | null>("");

  // const sendEmail = async () => {
  //   try {
  //     setLoading(true);

  //     const emailData = {
  //       eventName: toppicInput,
  //       departmentName: selectedDepartment,
  //       Start_date: startDateFormatted,
  //       End_date: endDateFormatted,
  //       Start_time: startTimeFormatted,
  //       End_time: endTimeFormatted,
  //       participant: participantCount,
  //       roomName: selectedRoom,
  //       equipmentUse: trimmedEquipmentUseString,
  //       notes: textareaValue,
  //     };

  //     const response = await fetch("/api/emails", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(emailData), // ส่งข้อมูลในรูป JSON
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       alert("ส่งอีเมลสำเร็จ");
  //       console.log("Response data:", data);
  //     } else {
  //       alert("ไม่สามารถส่งอีเมลได้");
  //       console.error("Response status:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
      const startTimeFormatted = formatTime(startTime);
      const endTimeFormatted = formatTime(endTime);

      const postData = {
        eventName: toppicInput,
        departmentName: selectedDepartment,
        Start_date: startDateFormatted,
        End_date: endDateFormatted,
        Start_time: startTimeFormatted,
        End_time: endTimeFormatted,
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
                          กำลังส่งข้อมูล...
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
                          value={selectedRoom}
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
                          value={participantCount || ""} // ผูกค่ากับ state
                          onChange={(e) => handleParticipantCountChange(e.target.value)} // อัปเดตค่าจากการกรอก
                        />
                        </Stack>
                      </div>
                    </div>
                  {/* ======== จำนวนผู้เข้าประชุม  ======== */}
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
                        onChange={(value) => setSelectedEquipment(value)} // อัปเดตค่าที่เลือก
                        placeholder="เลือกอุปกรณ์"
                        style={{ width: 300 }}
                      />
                      </div>

                    </div>
                    {/* ======== Food Select  ======== */}
                        {/* <div>

                            <div style={{ display: "flex",
                                        alignItems: "center" ,
                                        marginLeft: "5px",
                                        }}>
                            <div style={{ marginRight: "30px" }}>
                              <Typography variant="subtitle1" style={{
                                        marginRight: "8px",
                                        fontSize: "16px" }}>
                              เตรียมอาหาร
                              </Typography>

                              <div style={{marginTop: "9.5px"}}>
                                <CheckPicker data={data} appearance="default" placeholder="อาหาร" style={{ width: 300 }} />
                              </div>

                            </div>
                          </div>

                        </div> */}
                      {/* ======== Food Select  ======== */}
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
                                fontSize: "16px" }}>
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
                      icon={loading ? <Loader size="sm" /> : <AddOutlineIcon />} // ใช้ไอคอนที่แตกต่างตามสถานะ
                      onClick={() => {
                        handlePost();
                        //sendEmail();
                      }} // เรียกฟังก์ชัน handlePost
                      disabled={loading} // ปิดการใช้งานปุ่มระหว่างการโหลด
                    >
                      {loading ? "กำลังส่งข้อมูล..." : "ส่งข้อมูล"} {/* ข้อความที่จะแสดงตามสถานะ */}
                    </IconButton>
                  </ButtonToolbar>
                  </div>
                  {/* ======== Btn Select  ======== */}

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

export default  meeing_page;
