-- CreateTable
CREATE TABLE "employee_id_counter" (
    "id" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "employee_id_counter_pkey" PRIMARY KEY ("id")
);
