import { DataTypes } from "sequelize";
import connection from "../db.js";
import User from "./User.js";

const Role = connection.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
    },
}, {
    timestamps: true,
});

Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

Role.sync();

export default Role;
