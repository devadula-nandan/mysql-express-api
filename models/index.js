// models/index.js
const { Sequelize, DataTypes } = require("sequelize");

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false,
  }
);

// Initialize Sequelize DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("\x1b[32mDB connected successfully\x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31mError connecting to DB\x1b[0m", err);
  });

// Models
const User = require("./user")(sequelize, DataTypes);
const Post = require("./post")(sequelize, DataTypes);
const Likes = require("./likes")(sequelize, DataTypes);
const Friends = require("./friends")(sequelize, DataTypes);
const Comment = require("./comments")(sequelize, DataTypes);
const CommentLike = require("./commentLikes")(sequelize, DataTypes);
const Counter = require("./counter")(sequelize, DataTypes);

// Associations/Relations
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Likes, { foreignKey: "userId", onDelete: "CASCADE" });
Likes.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Likes, { foreignKey: "postId", onDelete: "CASCADE" });
Likes.belongsTo(Post, { foreignKey: "postId" });

User.hasMany(Friends);
Friends.belongsTo(User, { foreignKey: "UserId", as: "User" });
Friends.belongsTo(User, { foreignKey: "FriendId", as: "Friend" });

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies", onDelete: "CASCADE" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

User.hasMany(CommentLike, { foreignKey: "userId", onDelete: "CASCADE" });
CommentLike.belongsTo(User, { foreignKey: "userId" });

Comment.hasMany(CommentLike, { foreignKey: "commentId", onDelete: "CASCADE" });
CommentLike.belongsTo(Comment, { foreignKey: "commentId" });

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("\x1b[32mDB synced successfully\x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31mError syncing DB\x1b[0m", err);
  });

// Exports
module.exports = {
  User,
  Post,
  Likes,
  Friends,
  Comment,
  CommentLike,
  Counter,
  sequelize,
};