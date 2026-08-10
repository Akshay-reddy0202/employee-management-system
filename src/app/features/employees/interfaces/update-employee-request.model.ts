export interface UpdateEmployeeRequest {
  departmentId: number | null;
  designationId: number | null;
  managerId: number | null;
  status: string | null;
  joiningDate: string | null;
}