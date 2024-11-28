import { useEffect, useState } from "react";
import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconPackageImport,
  IconArchive,
  IconClipboardCopy,
  IconCalendarTime,
  IconCar,
  IconArtboard,
  IconMedicalCrossCircle,
  IconUserCog,
  IconSteeringWheel,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ตรวจสอบสถานะการล็อกอินเมื่อ component ถูกโหลด
  useEffect(() => {
    const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    console.log("Username:", username); // Debugging line
    console.log("Role:", role); // Debugging line

    if (username && role) {
      setIsLoggedIn(true);
      setIsAdmin(role === "admin");  // ถ้าผู้ใช้มีบทบาทเป็น admin
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []); // useEffect จะทำงานเพียงครั้งเดียวเมื่อโหลด component

  const menuItems = [
    {
      navlabel: true,
      subheader: "หน้าหลัก",
    },
    {
      id: uniqueId(),
      title: "รายการจองวันนี้",
      icon: IconArtboard,
      href: "/utilities/reportbooking",
    },
    {
      navlabel: true,
      subheader: "ข้อมูล | จองห้อง",
    },
    {
      id: uniqueId(),
      title: "จองห้องประชุม",
      icon: IconPackageImport,
      href: "/utilities/meeting_room",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลการจองห้องประชุม",
      icon: IconArchive,
      href: "/utilities/sample-page",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลห้องประชุม",
      icon: IconClipboardCopy,
      href: "/utilities/typography",
    },
    {
      id: uniqueId(),
      title: "ประวัติการจอง",
      icon: IconCalendarTime,
      href: "/utilities/userRerserved",
    },
    {
      navlabel: true,
      subheader: "ข้อมูล | จองรถยนต์",
    },
    {
      id: uniqueId(),
      title: "จองรถยนต์",
      icon: IconCar,
      href: "",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลการจองรถยนต์",
      icon: IconArchive,
      href: "",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลรถยนต์",
      icon: IconClipboardCopy,
      href: "",
    },
    {
      id: uniqueId(),
      title: "การจองห้องวันนี้",
      icon: IconCalendarTime,
      href: "",
    },

  // ตรวจสอบว่าเป็น admin หรือไม่

  {
    navlabel: true,
    subheader: <span style={{ color: "red" }}>Extra</span>,
  },
  {
    id: uniqueId(),
    title: "Admin",
    icon: IconMedicalCrossCircle,
    href: "/utilities/adminApprove",
  },
  {
    id: uniqueId(),
    title: "Management",
    icon: IconUserCog,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Edit Rooms",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
  {
    id: uniqueId(),
    title: "Edit Cars",
    icon: IconSteeringWheel,
    href: "/sample-page",
  },
  {
    id: uniqueId(),
    title: "Dashboard for Admin",
    icon: IconSteeringWheel,
    href: "/utilities/dashboardPage",
  }
  ];



  console.log("Menu Items:", menuItems); // Debugging line

  return menuItems;
};

export default Menuitems;
