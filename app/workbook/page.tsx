import { Suspense } from 'react';
import { WorkbookPage } from '../pages/WorkbookPage';

export default function Workbook() {
  return (
    <Suspense>
      <WorkbookPage />
    </Suspense>
  );
}
