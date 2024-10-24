"use strict";

const Role = require("../src/models/Role.js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if roles already exist
    const existingRoles = await queryInterface.sequelize.query(
      `SELECT * FROM "${Role.tableName}";`
    );

    if (existingRoles[0].length > 0) {
      console.log("Roles already exist, skipping seed.");
      return;
    }

    const rolesToInsert = [
      {
        name: "admin",
        permissions: JSON.stringify({
          templates: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          users: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          forms: {
            fill: true,
            read: true,
            update: true,
            delete: true,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "user",
        permissions: JSON.stringify({
          templates: {
            create: true,
            read: true,
            update: false,
            delete: false,
          },
          users: {
            create: false,
            read: true,
            update: true,
            delete: false,
          },
          forms: {
            fill: true,
            read: true,
            update: true,
            delete: false,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "guest",
        permissions: JSON.stringify({
          templates: {
            create: false,
            read: true,
            update: false,
            delete: false,
          },
          users: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          forms: {
            fill: false,
            read: false,
            update: false,
            delete: false,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert roles into the database
    await queryInterface.bulkInsert(Role.tableName, rolesToInsert);
    console.log("Roles seeded successfully!");
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all roles
    await queryInterface.bulkDelete(Role.tableName, null, {});
    console.log("Roles deleted successfully!");
  },
};
