const Sequelize = require('sequelize');
const connection = require('../src/db.js');
const roleSeeder = require('./20241019214127-seed-roles.js');   

const runSeeder = async () => {
  try {
    await connection.authenticate();
    console.log('Database connected successfully.');

    // Ensure to pass the Sequelize reference to the up method
    await roleSeeder.up({ queryInterface: connection.getQueryInterface(), Sequelize });
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await connection.close();
  }
};

runSeeder();
