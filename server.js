const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connection = require('./src/db.js');
const userRoutes = require('./src/routes/user.js');
const templateRoutes = require('./src/routes/template.js');
const formRoutes = require('./src/routes/form.js');
const setupAssociations = require('./src/models/associations.js');
const Role = require('./src/models/Role.js');
const User = require('./src/models/User.js');
const Template = require('./src/models/Template.js');
const Form = require('./src/models/Form.js');
const Answer = require('./src/models/Answer.js');
const Question = require('./src/models/Question.js');

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];

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

app.use("/quizme", userRoutes, templateRoutes, formRoutes);

const PORT = process.env.PORT || 8080;

// Setup associations
setupAssociations();

// Sync tables
async function syncTables() {
  try {
    await connection.sync();
    console.log('All tables synced successfully.');
  } catch (error) {
    console.error('Error syncing tables:', error);
  }
}

syncTables().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Unable to connect to the database", err);
});