"use client";

import { useState } from "react";
import { Grid, Box, Card, Typography, Button, TextField,Stack } from "@mui/material";
import { useToaster, Notification } from "rsuite";
import { signIn } from "next-auth/react"; // ใช้ signIn จาก next-auth/react
import { useRouter } from "next/navigation"; // ใช้ useRouter เพื่อเปลี่ยนหน้า
import PageContainer from "@/app/(DashboardLayout)/components/dashboard/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import Link from "next/link";

const Login2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // เก็บข้อความข้อผิดพลาด
  const toaster = useToaster();
  const router = useRouter();  // ใช้ useRouter เพื่อเข้าถึง router

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");  // รีเซ็ตข้อความข้อผิดพลาดก่อนทำการล็อกอิน
    try {
      const response = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (response?.error) {
        setErrorMessage("Invalid credentials. Please check your username and password.");
        toaster.push(
          <Notification type="warning" header="Login Failed" duration={5000}>
            Please check your credentials and try again.
          </Notification>,
          { placement: "topCenter" }
        );
      } else if (response?.ok) {
        // ล็อกอินสำเร็จ
        router.push("/utilities/sample-page"); // เปลี่ยนเส้นทางไปที่หน้าอื่น
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again later.");
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
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/authentication/register"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Register
                  </Typography>
                </Stack>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;
