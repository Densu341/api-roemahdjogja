import { Sequelize } from "sequelize";
import db from "../config/database.js";
// import Users from "../models/UserModel.js";

const { DataTypes } = Sequelize;

const RoomTypes = db.define(
  "room_types",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
  },
  {
    freezeTableName: true,
  }
);

// Users.hasMany(RoomTypes);
// RoomTypes.belongsTo(Users, { foreignKey: "userId" });

export default RoomTypes;
