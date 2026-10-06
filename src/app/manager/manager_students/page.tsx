import { ManagerStudentsClient } from './manager_students_components/ManagerStudentsClient';
import { ManagerStudentsErrorBoundary } from './manager_students_components/ManagerStudentsErrorBoundary';

// RESPONSIBILITY: Strict Server Component for Manager Students page.

export default function StudentsPage() {
  return (
    <ManagerStudentsErrorBoundary>
      <ManagerStudentsClient />
    </ManagerStudentsErrorBoundary>
  );
}
