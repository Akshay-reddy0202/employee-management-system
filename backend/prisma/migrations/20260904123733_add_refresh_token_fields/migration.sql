-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "refreshTokenExpires" TIMESTAMP(3),
ADD COLUMN     "refreshTokenHash" TEXT;
