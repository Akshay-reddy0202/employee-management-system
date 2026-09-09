-- This is an empty migration.
CREATE SEQUENCE IF NOT EXISTS employee_seq START WITH 1;

SELECT setval(
  'employee_seq',
  COALESCE(
    (
      SELECT MAX(
        CAST(SUBSTRING("employeeId" FROM 2) AS INTEGER)
      )
      FROM "employees"
      WHERE "employeeId" ~ '^E[0-9]+$'
    ),
    1
  ),
  EXISTS (
    SELECT 1
    FROM "employees"
    WHERE "employeeId" ~ '^E[0-9]+$'
  )
);