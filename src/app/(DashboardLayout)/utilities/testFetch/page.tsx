import 'rsuite/dist/rsuite.min.css';
import Test from "./Test";
async function fetchEventDetails() {
  'use server';                  // ใช้ URL แบบสมบูรณ์จาก environment variable
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/bookingrooms/`, {
    cache: "no-store", // ป้องกันการแคชเพื่อให้ได้ข้อมูลล่าสุดเสมอ
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result.meetingRooms;
}

export default async function TestPage() {
  const eventDetails = await fetchEventDetails();

  return (
    <div>
       {/* (Static Content) */}
      <h1>Event Details</h1>
      {eventDetails.map((event: any, index: number) => (
        <Test key={index} {...event} />
      ))}
    </div>
  );
}
