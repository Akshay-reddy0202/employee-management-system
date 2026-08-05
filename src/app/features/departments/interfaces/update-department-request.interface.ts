import { DepartmentStatus } from "./department-status.type";

export interface UpdateDepartmentRequest {
  code: string;
  name: string;
  description: string;
  status:DepartmentStatus;
}
