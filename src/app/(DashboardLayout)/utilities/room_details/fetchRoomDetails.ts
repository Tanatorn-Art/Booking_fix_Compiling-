"use server"
export async function fetchRoomDetails() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/roomsDetails/`,
     { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch room details');
  }

  const result = await response.json();
  console.log('Fetched room details:', result); // เพิ่ม log เพื่อตรวจสอบข้อมูล
  return result.meetingRooms; // ตรวจสอบว่า roomsDetail เป็น array
}
