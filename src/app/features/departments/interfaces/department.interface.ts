export interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}
