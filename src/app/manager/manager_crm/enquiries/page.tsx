import { EnquiriesClient } from '../manager_crm_components/EnquiriesClient';
import { ManagerCrmErrorBoundary } from '../manager_crm_components/ManagerCrmErrorBoundary';

// RESPONSIBILITY: Strict Server Component for Manager CRM Enquiries.

export default function EnquiriesPage() {
  return (
    <ManagerCrmErrorBoundary>
      <EnquiriesClient />
    </ManagerCrmErrorBoundary>
  );
}
