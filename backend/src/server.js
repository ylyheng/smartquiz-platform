import express from "express";
import prisma from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartQuiz API running");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});