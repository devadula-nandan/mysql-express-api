// imports
const { Sequelize } = require("sequelize");

// db connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: require('mysql2'),
    // logging: (msg) => {
    //   console.log(`\x1b[90m[Sequelize] ${msg}\x1b[0m`);
    // },
    logging: false,
  }
);

// initialize sequelize db connection
sequelize
  .authenticate()
  .then(() => {
    console.log("\x1b[32mdb connected successfully \x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31merror connecting db \x1b[0m", err);
  });

// multiple models
const User = require("./user")(sequelize, Sequelize.DataTypes);
const Post = require("./post")(sequelize, Sequelize.DataTypes);
const Likes = require("./likes")(sequelize, Sequelize.DataTypes);

// associations / relations
Post.belongsTo(User);
User.hasMany(Post);
Post.hasMany(Likes);
Likes.belongsTo(Post);
Likes.belongsTo(User);
User.hasMany(Likes);

// sync database
sequelize
  .sync()
  .then(() => {
    console.log("\x1b[32mdb synced successfully \x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31merror syncing db \x1b[0m", err);
  });

// exports
module.exports = { User, Post,Likes, sequelize };