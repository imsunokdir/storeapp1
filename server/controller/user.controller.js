const { where, Sequelize } = require("sequelize");
const { User, Store, Rating } = require("../tables");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      roles: "normal_user",
    });
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.log("user creation error:", error);
    res.status(500).json({ message: "Internal Server error", error });
  }
};

const listStores = async (req, res) => {
  const { name, address, sortBy = "name", order = "ASC" } = req.query;
  const userId = req.session.user.id;

  const whereClause = {};
  if (name) whereClause.name = { [Op.like]: `%${name}%` };
  if (address) whereClause.address = { [Op.like]: `%${address}%` };

  try {
    // Fetch stores without raw query
    const stores = await Store.findAll({
      where: whereClause,
      order: [[sortBy, order]],
      attributes: [
        "id",
        "name",
        "address",
        "email",
        [
          Store.sequelize.fn(
            "COALESCE",
            Store.sequelize.fn("AVG", Store.sequelize.col("ratings.rating")),
            0
          ),
          "averageRating",
        ],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: [],
        },
      ],
      group: ["Store.id", "Store.name", "Store.address", "Store.email"],
    });

    // Fetch user ratings
    const userRatings = await Rating.findAll({
      where: { user_id: userId },
      attributes: ["store_id", "rating"],
      raw: true,
    });

    const userRatingsMap = {};
    userRatings.forEach((r) => (userRatingsMap[r.store_id] = r.rating));

    // Convert to JSON and attach user's rating
    const result = stores.map((store) => {
      const storeData = store.toJSON();
      storeData.userRating = userRatingsMap[storeData.id] || null;
      return storeData;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const submitRating = async (req, res) => {
//   const { storeId } = req.params;
//   const { rating } = req.body;
//   const userId = req.session.user.id;

//   console.log("store id:", storeId);
//   console.log("rating:", rating);

//   if (!rating || rating < 1 || rating > 5) {
//     return res.status(400).json({ message: "Rating must be between 1 and 5" });
//   }

//   try {
//     const store = await Store.findByPk(storeId);
//     if (!store) return res.status(404).json({ message: "Store not found" });

//     let existingRating = await Rating.findOne({
//       where: { store_id: storeId, user_id: userId },
//     });
//     if (existingRating) {
//       existingRating.rating = rating;
//       await existingRating.save();
//       return res.json({ message: "Rating updated" });
//     }
//     await Rating.create({
//       store_id: storeId,
//       user_id: userId,
//       rating,
//     });

//     // Get the updated average rating
//     const avgData = await Rating.findOne({
//       where: { store_id: storeId },
//       attributes: [[Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"]],
//       raw: true,
//     });

//     const avgRating = parseFloat(avgData.avgRating).toFixed(1); // one decimal place

//     return res.status(200).json({
//       message: existingRating ? "Rating updated" : "Rating submitted",
//       avgRating,
//     });
//   } catch (error) {}
// };

const submitRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.session.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    let existingRating = await Rating.findOne({
      where: { store_id: storeId, user_id: userId },
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({
        store_id: storeId,
        user_id: userId,
        rating,
      });
    }

    // Calculate new average rating
    const allRatings = await Rating.findAll({
      where: { store_id: storeId },
      attributes: ["rating"],
    });

    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    res.json({
      message: existingRating ? "Rating updated" : "Rating submitted",
      avgRating: Number(avgRating.toFixed(1)), // rounded to 1 decimal place
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.session.user.id;
  const { oldPassword, newPassword } = req.body;
  console.log(req.body);

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, Number(process.env.SALT));
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("password update errir:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserRating = async (req, res) => {
  try {
    console.log("session:", req.session.user);
    const userId = req.session.user.id;
    const ratings = await Rating.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Store,
          as: "store", // must match the alias in association
          attributes: ["id", "name", "address"],
        },
      ],
      attributes: ["id", "rating"], // only return rating info
    });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user ratings" });
  }
};

module.exports = {
  signup,
  listStores,
  submitRating,
  updatePassword,
  getUserRating,
};
