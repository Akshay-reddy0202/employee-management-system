-- CreateEnum
CREATE TYPE "DepartmentStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "status" "DepartmentStatus" NOT NULL DEFAULT 'Active';
