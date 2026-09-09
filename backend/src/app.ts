import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import departmentRoutes from "./modules/departments/department.routes.js";
import designationRoutes from "./modules/designations/designation.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { globalLimiter } from "./middleware/rate-limit.middleware.js";
import { env } from "./config/env.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorMiddleware);
export default app;
