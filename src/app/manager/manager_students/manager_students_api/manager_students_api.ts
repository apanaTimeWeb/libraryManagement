import { fetchApi } from '@/lib/api';
import type { Student } from '../manager_students_types';

export async function fetchStudents(): Promise<Student[]> {
  try {
    return await fetchApi('/students');
  } catch (error) {
    console.warn("Backend not reachable, returning mock students");
    return [
      { id: '1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '9876543210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main', plan: 'Monthly', due: 0, joined: '01/01/2024' },
      { id: '2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '9876543211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main', plan: 'Quarterly', due: 1500, joined: '15/02/2024' },
      { id: '3', smartId: 'LIB-003', name: 'Rohan Mehta', phone: '9876543212', status: 'Suspended', shift: 'Morning', seat: 'S-22', branch: 'Main', plan: 'Half-Yearly', due: 500, joined: '10/03/2024' }
    ];
  }
}

export async function fetchStudentById(id: string): Promise<any> {
  try {
    return await fetchApi(`/students/${id}`);
  } catch (error) {
    console.warn("Backend not reachable, returning mock student for id:", id);
    return {
      id: id,
      smartId: id,
      name: 'Mock Student ' + id,
      phone: '9876543210',
      status: 'Active',
      shift: 'Morning',
      seat: 'S-01',
      branch: 'Main Branch',
      plan: 'Monthly ₹1000',
      due: 0,
      joined: '01/01/2024'
    };
  }
}

export async function createStudent(payload: any): Promise<any> {
  try {
    return await fetchApi('/students', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn("Backend not reachable, returning mock success for createStudent");
    return {
      success: true,
      smartId: 'LIB-MOCK-' + Math.floor(Math.random() * 1000)
    };
  }
}
