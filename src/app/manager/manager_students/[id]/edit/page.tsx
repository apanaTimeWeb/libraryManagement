import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-on-surface">Edit Student</h1>
      <p className="text-on-surface-variant mt-2">Route: /students/{id}/edit</p>
    </div>
  );
}
