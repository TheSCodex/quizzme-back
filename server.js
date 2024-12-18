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
const TemplateAccess = require('./src/models/TemplateAccess.js');
const TemplateTag = require('./src/models/TemplateTag.js');
const Tag = require('./src/models/Tag.js');
const runSeeder = require('./seeders/runSeeder.js');

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://quizme-tawny.vercel.app", "https://afa4-187-150-8-71.ngrok-free.app", "https://0e48-2806-2f0-8080-9b4b-9901-4da1-6122-5651.ngrok-free.app"];

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

app.post('/create-jira-ticket', async (req, res) => {
  const { authToken, ticketData } = req.body;

  console.log('Received request to create Jira ticket:', { authToken, ticketData });

  try {
    const response = await fetch('https://arvazq.atlassian.net/rest/api/3/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    console.log('Jira API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jira API error response:', errorText);
      throw new Error('Failed to create Jira ticket');
    }

    const result = await response.json();
    console.log('Jira API response:', result);
    res.json(result);
  } catch (error) {
    console.error('Error creating Jira ticket:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;

setupAssociations();

async function syncTables() {
  try {
    await Role.sync();
    await User.sync();
    await Template.sync();
    await Question.sync();
    await Tag.sync();
    await TemplateAccess.sync();
    await TemplateTag.sync();
    await Form.sync();
    await Answer.sync();

    console.log('All tables synced successfully.');
    await runSeeder();

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