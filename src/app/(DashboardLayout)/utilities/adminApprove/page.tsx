import dynamic from 'next/dynamic';

// Dynamic import สำหรับคอมโพเนนต์ที่แตกต่างกัน
const BookingDetails = dynamic(() => import('./AdminApprove'), {
  loading: () => <p>Loading booking details...</p>,
  ssr: false,
});
const CarsDetails = dynamic(() => import('./AdminApproveCar'), {
  loading: () => <p>Loading car booking details...</p>,
  ssr: false,
});

export default function BookingPage({ params }: { params: { bookingId: string, bookingIdcar: string } }) {
  const { bookingId, bookingIdcar } = params;

  return (
    <div>
      {/* ส่ง bookingId ไปยัง AdminApprove */}
      <BookingDetails bookingId={bookingId} />

      {/* ส่ง bookingIdcar ไปยัง AdminApproveCar */}
      <CarsDetails bookingIdcar={bookingIdcar} />
    </div>
  );
}
