"use server"; // ระบุว่าเป็น Server Function

export async function fetchReserved() {
  // ดึงข้อมูลจาก API ที่ตั้งไว้ใน .env
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/userbooking/`, {
    cache: 'no-store', // ไม่ให้แคชผลลัพธ์
  });

  // เช็คว่าการตอบกลับเป็นไปตามที่คาดหวังหรือไม่
  if (!response.ok) {
    throw new Error('Failed to fetch User Reserved');
  }

  // แปลงข้อมูลจาก JSON และดึงข้อมูล meetingRooms
  const result = await response.json();

  console.log('Fetched User Reserved', result);

  // ส่งคืนข้อมูล meetingRooms
  return result.meetingRooms;
}
