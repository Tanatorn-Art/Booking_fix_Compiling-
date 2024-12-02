import { fetchRoomDetails } from './fetchRoomDetails';
import RoomDetails from './RoomDetails';

export default async function RoomDetailsPage() {
  const roomsDetails = await fetchRoomDetails();

  console.log('Rooms Details fetched:', roomsDetails); // เพิ่ม log เพื่อตรวจสอบข้อมูล

  return (
    <div>
      <RoomDetails data={roomsDetails} />
    </div>
  );
}
