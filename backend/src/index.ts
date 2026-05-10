import express from "express";
import SubjectRouter from "./routes/subject";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use("/api/subjects", SubjectRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
