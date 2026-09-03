import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/app.error.js";

type RegisterEmployeeInput = {
  role: "Admin" | "Employee";
  fullName: string;
  emailID: string;
  dateOfBirth: string;
  password: string;
};

export const registerEmployee = async (data: RegisterEmployeeInput) => {
  const existingEmployee = await prisma.employee.findUnique({
    where: { emailID: data.emailID },
  });

  if (existingEmployee) {
    throw new AppError("An employee with this email already exists", 409);
  }

  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { createdAt: "desc" },
    select: { employeeId: true },
  });

  const lastEmployeeNumber = lastEmployee
    ? Number(lastEmployee.employeeId.replace("E", ""))
    : 0;

  const nextEmployeeId = `E${String(lastEmployeeNumber + 1).padStart(4, "0")}`;

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const employee = await prisma.employee.create({
    data: {
      employeeId: nextEmployeeId,
      fullName: data.fullName,
      emailID: data.emailID,
      password: hashedPassword,
      role: data.role,
      dateOfBirth: new Date(data.dateOfBirth),
    },
  });

  return employee;
};
