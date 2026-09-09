-- CreateEnum
CREATE TYPE "DesignationStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "designations" ADD COLUMN     "status" "DesignationStatus" NOT NULL DEFAULT 'Active';
