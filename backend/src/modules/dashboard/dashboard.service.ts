import prisma from "../../config/prisma.js";

type EmployeeGrowth = {
  month: Date;
  employees: bigint;
};

export const getDashboardData = async () => {
  const [
    totalEmployees,
    totalActiveEmployees,
    totalDepartments,
    salaryAggregation,
    departments,
    recentEmployees,
    employeeGrowth,
  ] = await Promise.all([
    prisma.employee.count(),

    prisma.employee.count({
      where: {
        status: "Active",
      },
    }),

    prisma.department.count(),

    prisma.employee.aggregate({
      _sum: {
        salary: true,
      },
    }),

    prisma.department.findMany({
      select: {
        id: true,
        name: true,

        _count: {
          select: {
            employees: true,
          },
        },
      },

      orderBy: {
        name: "asc",
      },
    }),

    prisma.employee.findMany({
      take: 5,

      orderBy: {
        joiningDate: "desc",
      },

      select: {
        id: true,
        employeeId: true,
        fullName: true,
        profileImageUrl: true,
        joiningDate: true,

        department: {
          select: {
            name: true,
          },
        },

        designation: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.$queryRaw<EmployeeGrowth[]>`
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
          date_trunc('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) AS month
      )

      SELECT
        months.month,
        COUNT(employees.id) AS employees

      FROM months

      LEFT JOIN "employees" AS employees
        ON employees."joiningDate" < months.month + INTERVAL '1 month'

      GROUP BY months.month

      ORDER BY months.month;
    `,
  ]);

  return {
    summary: {
      totalEmployees,
      totalActiveEmployees,
      totalDepartments,
      totalSalary: salaryAggregation._sum.salary ?? 0,
    },

    departmentDistribution: departments.map((department) => ({
      id: department.id,
      name: department.name,
      employeeCount: department._count.employees,
    })),

    employeeGrowth: employeeGrowth.map((item) => ({
      month: item.month,
      employees: Number(item.employees),
    })),

    recentEmployees,
  };
};
