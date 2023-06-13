// models/friends.js
module.exports = function (sequelize, DataTypes) {
    const Friends = sequelize.define(
      "Friends",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        tableName: "friends",
      }
    );
    return Friends;
  };