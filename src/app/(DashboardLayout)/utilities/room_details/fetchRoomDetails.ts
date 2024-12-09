// "use server" ใช้สำหรับระบุว่าเป็นฟังก์ชันในฝั่งเซิร์ฟเวอร์
"use server"
export async function fetchRoomDetails() {
  try {
    // ใช้ fetch เพื่อดึงข้อมูลจาก API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/roomsDetails/`, {
      cache: 'no-store', // ตั้งค่าการไม่ใช้ cache
    });
    if (!response.ok) {
      throw new Error('Failed to fetch room details');
    }
    // แปลงข้อมูลที่ได้รับเป็น JSON
    const result = await response.json();
    //console.log('Fetched room details:', result); // Log ข้อมูลที่ได้รับจาก API เพื่อช่วยในการดีบัก
    // ตรวจสอบว่า `result.meetingRooms` เป็นอาร์เรย์ แล้วคืนค่าข้อมูลที่ต้องการ
    return Array.isArray(result.meetingRooms) ? result.meetingRooms : [];
  } catch (error) {
    console.error('Error fetching room details:', error); // Log ข้อผิดพลาด
    return []; // คืนค่าเป็นอาร์เรย์ว่างหากเกิดข้อผิดพลาด
  }
}
