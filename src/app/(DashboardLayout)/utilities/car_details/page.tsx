import { fetchCarDetails } from './fetchCarDetails';
import dynamic from 'next/dynamic';
// Dynamic import สำหรับ Component RoomDetails
const CarDetails = dynamic(() => import('./CarDetails'), {
  loading: () => <p>Loading Room Details...</p>, // แสดงข้อความระหว่างโหลด
  ssr: false // ปิดการทำงาน SSR
});
export default async function RoomDetailsPage() {
  const carsDetails = await fetchCarDetails();
  //console.log('Rooms Details fetched:', roomsDetails); // เพิ่ม log เพื่อตรวจสอบข้อมูล
  return (
    <div>
      <CarDetails data={carsDetails} />
    </div>
  );
}
