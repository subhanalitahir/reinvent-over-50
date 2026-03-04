import { Suspense } from 'react';
import { BookingPage } from '../pages/BookingPage';

export default function Booking() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
