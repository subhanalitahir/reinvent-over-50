import { Suspense } from 'react';
import { MembershipPage } from '../pages/MembershipPage';

export default function Membership() {
  return (
    <Suspense>
      <MembershipPage />
    </Suspense>
  );
}
