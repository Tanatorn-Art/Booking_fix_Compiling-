import React , { Suspense } from "react";
import dynamic from 'next/dynamic';

// ใช้ dynamic imports เพื่อลดการโหลดคอมโพเนนต์ทันที
const LazyComponent = dynamic(() => import('./Edit'), {
  loading: () => <div>Loading...</div>, // UI ที่จะโชว์ในขณะที่คอมโพเนนต์กำลังโหลด
}); //ช่วยลดเวลาได้คร่าวๆ ~ 2.6 ms

// const Meeting = React.lazy(() => import('./Meeting'));
const meeing_page = () => {
  return (
    <div>
      {/* ใช้ Suspense เพื่อแสดง UI ในขณะที่คอมโพเนนต์กำลังโหลด */}
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent  />
      </Suspense>
    </div>
  );
};
export default  meeing_page;
