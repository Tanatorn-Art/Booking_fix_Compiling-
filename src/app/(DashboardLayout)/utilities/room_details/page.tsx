import { fetchRoomDetails } from './fetchRoomDetails';
import dynamic from 'next/dynamic';
// Dynamic import สำหรับ Component RoomDetails
const RoomDetails = dynamic(() => import('./RoomDetails'), {
  loading: () => <p>Loading Room Details...</p>, // แสดงข้อความระหว่างโหลด
  ssr: false // ปิดการทำงาน SSR
});
export default async function RoomDetailsPage() {
  const roomsDetails = await fetchRoomDetails();
  //console.log('Rooms Details fetched:', roomsDetails); // เพิ่ม log เพื่อตรวจสอบข้อมูล
  return (
    <div>
      <RoomDetails data={roomsDetails} />
    </div>
  );
}
