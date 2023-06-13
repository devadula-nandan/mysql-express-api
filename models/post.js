// models/post.js
module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    postImg: DataTypes.STRING,
  });
  return Post;
};