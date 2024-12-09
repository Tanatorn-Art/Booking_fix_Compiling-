import dynamic from 'next/dynamic';

const BookingDetails = dynamic(() => import('./AdminApprove'), {
  loading: () => <p>Loading booking details...</p>,
  ssr: false,
});

export default function BookingPage({ params }: { params: { bookingId: string } }) {
  const { bookingId } = params;

  return (
    <div>
      <BookingDetails bookingId={bookingId} />
    </div>
  );
}
