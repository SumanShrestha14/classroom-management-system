import express from "express";
import SubjectRouter from "./routes/subject";
import cors from "cors";
import securityMiddleware from "./middleware/security";
import {toNodeHandler} from "better-auth/node"
import { auth } from "./lib/auth";

const app = express();

if(!process.env.FRONTEND_URL){
    throw new Error("FRONTEND_URL is not defined in environment variables");
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(securityMiddleware)
app.all('/api/auth/{*splat}', toNodeHandler(auth));

app.use("/api/subjects", SubjectRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(process.env.PORT || 5500, () => {
  console.log(`Server is running on port ${process.env.PORT || 5500}`);
});
