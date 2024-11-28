"use client";  // เพิ่มคำสั่งนี้ที่จุดเริ่มต้นของไฟล์

import { useState, useEffect } from "react";  // เพิ่ม useEffect
import { Grid, Box, Card, Typography, Button, TextField } from "@mui/material";
import { useToaster, Notification } from "rsuite";  // ใช้ useToaster และ Notification จาก rsuite
import { useRouter } from "next/navigation";  // ใช้ useRouter จาก next/navigation แทน next/router
import PageContainer from "@/app/(DashboardLayout)/components/dashboard/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

const Login2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);  // สร้าง state เพื่อตรวจสอบว่าอยู่ในฝั่งไคลเอนต์
  const toaster = useToaster();  // ใช้ useToaster
  const router = useRouter();  // ใช้ useRouter จาก next/navigation

  // ใช้ useEffect เพื่อให้แน่ใจว่า localStorage จะทำงานในฝั่งไคลเอนต์
  useEffect(() => {
    setIsClient(true);  // ตั้งค่าเป็น true เมื่อคอมโพเนนต์โหลดที่ฝั่งไคลเอนต์
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log("Sending login request..."); // เพิ่มการ log
      const response = await fetch("/api/authLogin", {  // Assuming route.ts handles "/api/authLogin"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log("Received response:", data); // เพิ่มการ log ผลลัพธ์จาก API

      if (data.success) {
        // ถ้าล็อกอินสำเร็จ ให้เปลี่ยนเส้นทางไปที่ /utilities/sample-page
        console.log("Login successful:", data);
        if (isClient) {
          localStorage.setItem("username", username);  // เก็บ username ใน localStorage
        }
        router.push("/utilities/sample-page");  // เปลี่ยนเส้นทางไปที่ /utilities/sample-page
      } else {
        // ถ้าข้อมูลไม่ถูกต้อง แสดง notification แจ้งเตือน
        toaster.push(
          <Notification type="warning" header="Login Failed" duration={5000}>
            Please check your credentials and try again.
          </Notification>,
          { placement: "topCenter" }
        );
      }
    } catch (error) {
      console.error("Error logging in:", error); // เพิ่มการ log ในกรณีเกิดข้อผิดพลาด
      toaster.push(
        <Notification type="warning" header="Error" duration={5000}>
          An error occurred. Please try again.
        </Notification>,
        { placement: "topCenter" }
      );
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
          <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                context
              </Typography>

              <form onSubmit={handleLogin}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                />
                {errorMessage && (
                  <Typography color="error" variant="body2" align="center" mt={2}>
                    {errorMessage}
                  </Typography>
                )}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                  Login
                </Button>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;


// 'use client'
// import { useState, useEffect } from 'react';
// import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip } from '@mui/material';
// import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
// import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
// import CalendarDatePic from '@/app/(DashboardLayout)/components/dashboard/CalendarDate';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Bookingrooms from '@/app/(DashboardLayout)/components/dashboard/Room_view';


// interface BookingRoom {
//   Start_date: string;
//   End_date: string;
//   Start_Time: string;
//   End_Time: string;
//   Room_Name: string;
//   Event_Name: string;
//   Department_Name: string;
//   participant: number;
//   Status_Name: string;
// }

// const Dashboard = () => {
//   const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/bookingrooms/'); // ดึงข้อมูลจาก API
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         setData(result.meetingRooms); // ใช้ข้อมูลจาก API
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // ฟังก์ชันจัดรูปแบบวันที่ในรูปแบบ dd/MM/yyyy
//   const formatDate = (isoDate: string) => {
//     const date = new Date(isoDate); // แปลงเป็น Date object
//     const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 หน้าเมื่อวันที่น้อยกว่า 10
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0 (มกราคมคือ 0)
//     const year = date.getFullYear(); // ปีเต็ม
//     return `${day}/${month}/${year}`; // คืนค่าตามรูปแบบ dd/MM/yyyy
//   };

//   // ฟังก์ชันจัดรูปแบบเวลา
//   const formatTime = (time: string) => time.slice(0, 5); // ตัดวินาที .00 ออก

//   // ฟังก์ชันจัดการวันที่เริ่มต้นและวันที่สิ้นสุด
//   const formatDateRange = (startDate: string, endDate: string) => {
//     const startFormatted = formatDate(startDate);
//     const endFormatted = formatDate(endDate);
//     return `${startFormatted} - ${endFormatted}`; // แสดงช่วงวันที่
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   const getCurrentDate = () => {
//     const currentDate = new Date();
//     return formatDate(currentDate.toISOString());
//   };
//   return (
//     <PageContainer title="Sample Page" description="This is a sample page">
//       <DashboardCard title="">
//         <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 3 }}>
//           Meeting Rooms : {getCurrentDate()}
//         </Typography>
//         <div>
//           <CalendarDatePic />
//         </div>
//         <br></br>
//         {/* ตารางแสดงข้อมูล */}
//         <Bookingrooms/>

//         <br />
//         <br />
//       </DashboardCard>
//     </PageContainer>
//   )
// }

// export default Dashboard;
