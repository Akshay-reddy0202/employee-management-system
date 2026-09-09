export interface DesignationInterface {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
