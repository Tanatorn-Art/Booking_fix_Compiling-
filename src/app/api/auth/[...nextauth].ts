import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { username, password } = credentials;

        try {
          const response = await fetch("/api/authLogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          const user = await response.json();

          if (user.success) {
            return { id: user.id, username: user.username };
          } else {
            console.error("Login failed: ", user);
            return null;
          }
        } catch (error) {
          console.error("Error during login: ", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/authentication/login",  // หน้าที่ใช้ในการล็อกอิน
    error: "/auth/error",    // กำหนดหน้าที่จะแสดงข้อผิดพลาด
  },
  session: {
    strategy: "jwt",  // ใช้ JWT สำหรับการจัดการ session
  },
};

export default NextAuth(authOptions);
