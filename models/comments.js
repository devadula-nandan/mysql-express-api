// models/comments.js
module.exports = function (sequelize, DataTypes) {
    const Comment = sequelize.define(
      "Comment",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        content: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        tableName: "comments",
        timestamps: true,
        updatedAt: "updatedAt",
        createdAt: "createdAt",
      }
    );
    return Comment;
  };