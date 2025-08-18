const { Sequelize } = require("sequelize");
const { Store, User, Rating } = require("../tables");

const getUsersWhoRated = async (req, res) => {
  const ownerId = req.session.user.id;

  try {
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: ["id"],
    });
    const storeIds = stores.map((store) => store.id);

    if (storeIds.length === 0) {
      return res.json({ users: [], message: "No stores found for this owner" });
    }

    // Find distinct users who rated these stores
    const users = await User.findAll({
      include: [
        {
          model: Rating,
          as: "ratings",
          where: { store_id: storeIds },
          attributes: [],
        },
      ],
      attributes: ["id", "name", "email", "address"],
      group: ["User.id"],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.log("store error:", error);
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

const getAverageRatingOfUserStores = async (req, res) => {
  const ownerId = req.session.user.id;

  try {
    // Find all stores owned by this user
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: ["id", "name"],
    });

    if (stores.length === 0) {
      return res.json({
        averageRatings: [],
        message: "No stores found for this owner",
      });
    }

    const storeIds = stores.map((store) => store.id);

    // Calculate average rating per store
    const averageRatings = await Rating.findAll({
      where: { store_id: storeIds },
      attributes: [
        "store_id",
        [Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"],
      ],
      group: ["store_id"],
      raw: true,
    });

    // Map store names with averages
    const result = stores.map((store) => {
      const avgObj = averageRatings.find((ar) => ar.store_id === store.id);
      return {
        storeId: store.id,
        storeName: store.name,
        averageRating: avgObj ? parseFloat(avgObj.avgRating).toFixed(2) : null,
      };
    });

    res.json({ averageRatings: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStoreOwnerStores = async (req, res) => {
  const ownerId = req.session.user.id; // assuming session stores logged-in user info

  try {
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: [
        "id",
        "name",
        "address",
        [
          Store.sequelize.literal(`(
            SELECT COALESCE(AVG(rating), 0)
            FROM ratings AS r
            WHERE r.store_id = Store.id
          )`),
          "averageRating",
        ],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: ["rating", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching store owner stores:", error);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

const getStoreDashboardData = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get all stores owned by the current user with their ratings
    const stores = await Store.findAll({
      where: { owner_id: userId },
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [
          Store.sequelize.literal("COALESCE(AVG(ratings.rating), 0)"),
          "averageRating",
        ],
        [Store.sequelize.literal("COUNT(DISTINCT ratings.id)"), "totalRatings"],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: [],
        },
      ],
      group: ["Store.id", "Store.name", "Store.email", "Store.address"],
      raw: false,
      nest: true,
    });

    // Format store data
    const formattedStores = stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: parseFloat(store.dataValues.averageRating || 0).toFixed(1),
      totalRatings: parseInt(store.dataValues.totalRatings || 0),
    }));

    return res.status(200).json({
      success: true,
      data: {
        stores: formattedStores,
        totalStores: formattedStores.length,
        overallStats: {
          totalRatingsReceived: formattedStores.reduce(
            (sum, store) => sum + store.totalRatings,
            0
          ),
          averageRatingAcrossAllStores:
            formattedStores.length > 0
              ? (
                  formattedStores.reduce(
                    (sum, store) => sum + parseFloat(store.averageRating),
                    0
                  ) / formattedStores.length
                ).toFixed(1)
              : "0.0",
        },
      },
      message: "Dashboard data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get users who have rated a specific store
const getStoreRaters = async (req, res) => {
  try {
    const { storeId } = req.params;

    const userId = req.session.user.id;

    // Verify that the store belongs to the current user
    const store = await Store.findOne({
      where: {
        id: storeId,
        owner_id: userId,
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message:
          "Store not found or you don't have permission to view its ratings",
      });
    }

    // Get all ratings for this store with user details
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: ["id", "rating", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    // Format the response
    const formattedRatings = ratings.map((rating) => ({
      id: rating.id,
      rating: parseFloat(rating.rating),
      submittedAt: rating.createdAt,
      updatedAt: rating.updatedAt,
      user: {
        id: rating.user.id,
        name: rating.user.name,
        email: rating.user.email,
      },
    }));

    // Calculate store statistics
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? (
            ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
            totalRatings
          ).toFixed(1)
        : "0.0";

    return res.status(200).json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
        },
        ratings: formattedRatings,
        statistics: {
          totalRatings,
          averageRating,
          ratingDistribution: {
            5: ratings.filter((r) => parseFloat(r.rating) === 5).length,
            4: ratings.filter((r) => parseFloat(r.rating) === 4).length,
            3: ratings.filter((r) => parseFloat(r.rating) === 3).length,
            2: ratings.filter((r) => parseFloat(r.rating) === 2).length,
            1: ratings.filter((r) => parseFloat(r.rating) === 1).length,
          },
        },
      },
      message: `Retrieved ${totalRatings} ratings for store: ${store.name}`,
    });
  } catch (error) {
    console.error("Error fetching store raters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStoreDetails = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.session.user ? req.session.user.id : null;

    // Find the store with all its ratings
    const store = await Store.findOne({
      where: { id: storeId },
      attributes: ["id", "name", "address"],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: ["rating", "user_id"],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Calculate average rating
    const allRatings = store.ratings.map((r) => parseFloat(r.rating));
    const averageRating =
      allRatings.length > 0
        ? (
            allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
          ).toFixed(1)
        : "0.0";

    // Only find the rating of the logged-in user
    let myRating = null;
    if (userId) {
      const myRatingObj = store.ratings.find((r) => r.user_id === userId);
      myRating = myRatingObj ? parseFloat(myRatingObj.rating) : null;
    }
    const totalRatings = store.ratings.length;

    return res.status(200).json({
      success: true,
      data: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating, // overall average
        myRating, // null if not logged in
        totalRatings,
      },
    });
  } catch (error) {
    console.error("Error fetching store details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStoreRatingDetails = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      attributes: ["rating"],
      raw: true,
    });

    const total = ratings.length;

    // Count ratings per star
    const distribution = [1, 2, 3, 4, 5]
      .map((star) => {
        const count = ratings.filter((r) => parseInt(r.rating) === star).length;
        const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        return { star, count, percent };
      })
      .reverse(); // 5 stars first

    return res.status(200).json({
      success: true,
      data: {
        totalRatings: total,
        distribution,
      },
    });
  } catch (error) {
    console.error("Error fetching store rating details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getUsersWhoRated,
  getAverageRatingOfUserStores,
  getStoreOwnerStores,
  getStoreDashboardData,
  getStoreRaters,
  getStoreDetails,
  getStoreRatingDetails,
};
