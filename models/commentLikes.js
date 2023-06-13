// models/commentLikes.js
module.exports = function (sequelize, DataTypes) {
    const CommentLike = sequelize.define("CommentLike", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    });
    return CommentLike;
  };