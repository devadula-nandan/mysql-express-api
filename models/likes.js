// models/likes.js
module.exports = function (sequelize, DataTypes) {
    const Likes = sequelize.define("Likes", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    });
    return Likes;
  };