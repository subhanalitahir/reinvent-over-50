import { Suspense } from 'react';
import { EventsPage } from '../pages/EventsPage';

export default function Events() {
  return (
    <Suspense>
      <EventsPage />
    </Suspense>
  );
}
