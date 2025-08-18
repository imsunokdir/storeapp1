const sequelize = require("../configs/db");
const Rating = require("./rating.table");
const Store = require("./store.table");
const User = require("./user.table");

// Store Owner → Stores
User.hasMany(Store, { foreignKey: "owner_id", as: "stores" });
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// User -> Ratings
User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Store->Rating
Store.hasMany(Rating, { foreignKey: "store_id", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "store_id", as: "store" });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
