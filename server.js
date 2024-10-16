import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./src/db.js";
import userRoutes from "./src/routes/user.js";
import templateRoutes from "./src/routes/template.js";
dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type",
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.use("/quizzme", userRoutes, templateRoutes);

const PORT = process.env.PORT || 8080;

connection
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database", err);
  });