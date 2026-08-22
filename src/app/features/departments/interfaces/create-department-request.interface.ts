import { DepartmentStatus } from "./department-status.type";

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description: string;
  status: DepartmentStatus;
}
