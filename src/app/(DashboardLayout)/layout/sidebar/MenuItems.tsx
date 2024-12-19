import { useEffect, useState } from "react";
import {
  IconArtboard,
  IconCalendarTime,
  IconPackageImport,
  IconArchive,
  IconClipboardCopy,
  IconCar,
  IconMedicalCrossCircle,
  IconUserCog,
  IconCopy,
  IconSteeringWheel,
  IconTruck,
  IconChartDots,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const isClient = typeof window !== "undefined";
    const username = isClient ? localStorage.getItem("username") || "" : "";
    let role = isClient ? localStorage.getItem("role") || "" : "";

    console.log("Username:", username); // ตรวจสอบค่าของ username
    console.log("Role:", role); // ตรวจสอบค่าของ role

    // ตั้งค่า role ให้เป็นค่าเดียวกับ username
    if (username) {
      localStorage.setItem("role", username);
      role = username; // กำหนด role ให้เหมือน username
    }

    if (role === "admin") {
      setIsAdmin(true); // ถ้า role เป็น "admin" ให้ set isAdmin เป็น true
    }

    if (username && role) {
      setIsLoggedIn(true); // ถ้ามี username และ role ให้ set isLoggedIn เป็น true
    } else {
      setIsLoggedIn(false); // ถ้าไม่มีข้อมูล login หรือ role ให้ set เป็น false
      setIsAdmin(false); // ถ้าไม่มี role เป็น admin ให้ set isAdmin เป็น false
    }
  }, []);
  const adminMenuItems = isAdmin
  ? [
      {
        navlabel: true,
        subheader: <span style={{ color: "red" }}>Extra</span>,
      },
      {
        id: uniqueId(),
        title: "Management",
        icon: IconUserCog,
        href: "/utilities/MenuAdmin",
      },
      {
        id: uniqueId(),
        title: "Dashboard",
        icon: IconChartDots,
        href: "/utilities/dashboardPage",
      },
      {
        id: uniqueId(),
        title: "Request approval",
        icon: IconMedicalCrossCircle,
        href: "/utilities/AdminApprove",
      },
      // {
      //   id: uniqueId(),
      //   title: "Edit Rooms",
      //   icon: IconCopy,
      //   href: "/utilities/EventMap",
      // },
      // {
      //   id: uniqueId(),
      //   title: "Edit Cars",
      //   icon: IconSteeringWheel,
      //   href: "/icons",
      // },
    ]
  : [];


  const defaultMenuItems = [
    {
      navlabel: true,
      subheader: "หน้าหลัก",
    },
    {
      id: uniqueId(),
      title: "รายการจองห้องประชุม",
      icon: IconArtboard,
      href: "/utilities/reportbooking",
    },
    {
      id: uniqueId(),
      title: "รายการจองยานพาหนะ",
      icon: IconTruck,
      href: "/utilities/MapGps",
    },
    {
      navlabel: true,
      subheader: "รายการจองของคุณ",
    },
    {
      id: uniqueId(),
      title: "ประวัติการจอง",
      icon: IconCalendarTime,
      href: "/utilities/userRerserved",
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
      href: "/utilities/room_details",
    },
    {
      navlabel: true,
      subheader: "ข้อมูล | จองรถยนต์",
    },
    {
      id: uniqueId(),
      title: "จองรถยนต์",
      icon: IconCar,
      href: "/utilities/reserve_car",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลการจองรถยนต์",
      icon: IconArchive,
      href: "/utilities/sample-car",
    },
    {
      id: uniqueId(),
      title: "ข้อมูลรถยนต์",
      icon: IconClipboardCopy,
      href: "/utilities/car_details",
    },
  ];


  return [...adminMenuItems, ...defaultMenuItems ];
};

export default Menuitems;
