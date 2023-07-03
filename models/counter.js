module.exports = function (sequelize, DataTypes) {
    const Counter = sequelize.define("Counter", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
    return Counter;
  };
  