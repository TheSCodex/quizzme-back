const Sequelize = require("sequelize");
const connection = require("../src/db.js");
const roleSeeder = require("./20241019214127-seed-roles.js");

const runSeeder = async () => {
  let queryInterface;
  try {
    await connection.authenticate();
    console.log("Database connected successfully.");
    queryInterface = connection.getQueryInterface();

    await connection.sync();

    await roleSeeder.up(queryInterface, Sequelize);
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

runSeeder();
