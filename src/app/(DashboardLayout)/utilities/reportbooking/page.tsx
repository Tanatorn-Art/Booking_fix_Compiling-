import dynamic from 'next/dynamic';

// ใช้ dynamic import สำหรับ Room_view
const Room_view = dynamic(() => import('./Room_view'), {
  loading: () => <p>Loading...</p>, // ข้อความที่แสดงระหว่างโหลด
  ssr: false, // ปิดการใช้งาน SSR ถ้า Room_view ไม่รองรับ SSR
});

const roombook_view = () => {
  return (

    <div >
        <Room_view />
    </div>
  );
};

export default roombook_view;
