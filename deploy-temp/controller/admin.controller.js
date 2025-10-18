const { User, Store, Rating } = require("../tables");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Op, where, Sequelize } = require("sequelize");
const { passwordValidation } = require("../middlewares/passwordValidation");
require("dotenv").config();

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, address, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
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
      role,
    });

    res.status(201).json({
      message: "User created",
      userId: user.id,
    });
  } catch (error) {
    console.log("user creation error:", error);
    res.status(500).json({ message: "Internal server errors", error });
  }
};

const createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  console.log("owner id", req.body.owner_id);

  try {
    const owner = await User.findOne({
      where: { id: owner_id, role: "store_owner" },
    });

    if (!owner) {
      return res.status(400).json({ message: "Invalid store owner ID." });
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner_id,
    });

    res.status(201).json({ message: "Store created", storeId: store.id });
  } catch (error) {
    console.log("create store error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// const listUsers = async (req, res) => {
//   const { search = "", role, sortBy = "name", order = "ASC" } = req.query;

//   const whereClause = {};

//   // Flexible search across name, email, address (if search provided)
//   if (search) {
//     whereClause[Op.or] = [
//       { name: { [Op.like]: `%${search}%` } },
//       { email: { [Op.like]: `%${search}%` } },
//       { address: { [Op.like]: `%${search}%` } },
//     ];
//   }

//   // Filter by role(s) if provided (comma separated)
//   if (role) {
//     const rolesArray = role.split(",").map((r) => r.trim());
//     whereClause.role = { [Op.in]: rolesArray };
//   }

//   try {
//     const users = await User.findAll({
//       where: whereClause,
//       order: [[sortBy, order]],
//       attributes: {
//         include: [
//           [
//             Sequelize.literal(`(
//               CASE
//                 WHEN role = 'store_owner' THEN
//                   COALESCE((
//                     SELECT AVG(r.rating)
//                     FROM ratings AS r
//                     JOIN stores AS s ON r.store_id = s.id
//                     WHERE s.owner_id = User.id
//                   ), 0)
//                 ELSE NULL
//               END
//             )`),
//             "averageStoreRating",
//           ],
//         ],
//         exclude: ["password"],
//       },
//     });

//     // Remove averageStoreRating for users without store_owner role
//     const filteredUsers = users.map((user) => {
//       const userData = user.toJSON();
//       if (userData.role !== "store_owner") {
//         delete userData.averageStoreRating;
//       }
//       return userData;
//     });

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error listing users:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

const listUsers = async (req, res) => {
  const {
    search = "",
    role,
    sortBy = "name",
    order = "ASC",
    page = 1,
    limit = 5,
  } = req.query;

  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
    ];
  }

  if (role) {
    const rolesArray = role.split(",").map((r) => r.trim());
    whereClause.role = { [Op.in]: rolesArray };
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const { rows: users, count } = await User.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              CASE
                WHEN role = 'store_owner' THEN 
                  COALESCE((
                    SELECT AVG(r.rating)
                    FROM ratings AS r
                    JOIN stores AS s ON r.store_id = s.id
                    WHERE s.owner_id = User.id
                  ), 0)
                ELSE NULL
              END
            )`),
            "averageStoreRating",
          ],
        ],
        exclude: ["password"],
      },
    });

    const filteredUsers = users.map((user) => {
      const userData = user.toJSON();
      if (userData.role !== "store_owner") {
        delete userData.averageStoreRating;
      }
      return userData;
    });

    res.status(200).json({
      users: filteredUsers,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error listing users:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// const listStores = async (req, res) => {
//   const {
//     search,
//     email,
//     sortBy = "name",
//     order = "ASC",
//     page = 1,
//     limit = 2,
//   } = req.query;
//   console.log("query:", req.query);
//   const user = req.session.user;

//   const whereClause = {};

//   // Single search input for both name and address
//   if (search) {
//     if (user.role === "admin") {
//       // Admin can search by name, email, or address
//       whereClause[Op.or] = [
//         { name: { [Op.like]: `%${search}%` } },
//         { email: { [Op.like]: `%${search}%` } },
//         { address: { [Op.like]: `%${search}%` } },
//       ];
//     } else if (user.role === "normal_user") {
//       // Normal user can search only by name or address
//       whereClause[Op.or] = [
//         { name: { [Op.like]: `%${search}%` } },
//         { address: { [Op.like]: `%${search}%` } },
//       ];
//     }
//   }

//   // Keep email search separate if needed
//   if (email) {
//     whereClause.email = { [Op.like]: `%${email}%` };
//   }

//   try {
//     const stores = await Store.findAll({
//       where: whereClause,
//       order: [[sortBy, order]],
//       attributes: [
//         "id",
//         "name",
//         "email",
//         "address",
//         [
//           Store.sequelize.literal("COALESCE(AVG(ratings.rating), 0)"),
//           "averageRating",
//         ],
//       ],
//       include: [
//         {
//           model: Rating,
//           as: "ratings",
//           attributes: [], // Don't select rating attributes to avoid duplication
//         },
//       ],
//       group: ["Store.id", "Store.name", "Store.email", "Store.address"],
//       raw: false,
//       nest: true,
//     });

//     res.status(200).json(stores);
//   } catch (error) {
//     console.error("Error fetching stores:", error);
//     res.status(500).json({ error: "Failed to fetch stores" });
//   }
// };

const listStores = async (req, res) => {
  const {
    search,
    email,
    sortBy = "name",
    order = "ASC",
    page = 1,
    limit = 2,
  } = req.query;

  console.log("query:", req.query);

  const user = req.session.user;
  const whereClause = {};

  // Convert page and limit to integers and ensure they're valid
  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.max(1, parseInt(limit));
  const offset = (pageNumber - 1) * limitNumber;

  // Single search input for both name and address
  if (search) {
    if (user.role === "admin") {
      // Admin can search by name, email, or address
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    } else if (user.role === "normal_user") {
      // Normal user can search only by name or address
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }
  }

  // Keep email search separate if needed
  if (email) {
    whereClause.email = { [Op.like]: `%${email}%` };
  }

  try {
    // Get all stores with all ratings
    const allStores = await Store.findAll({
      where: whereClause,
      order: [[Sequelize.fn("LOWER", Sequelize.col(sortBy)), order]],
      attributes: ["id", "name", "email", "address"],
      include: [
        {
          model: Rating,
          as: "ratings", // Use the defined association alias
          attributes: ["rating"],
          required: false,
        },
      ],
      raw: false,
      nest: true,
    });

    // Get current user's ratings for all stores
    const storeIds = allStores.map((store) => store.id);
    const userRatings = await Rating.findAll({
      where: {
        store_id: { [Op.in]: storeIds },
        user_id: user.id,
      },
      attributes: ["store_id", "rating"],
      raw: true,
    });

    // Create a map for quick lookup of user ratings
    const userRatingMap = userRatings.reduce((map, rating) => {
      map[rating.store_id] = rating.rating;
      return map;
    }, {});

    console.log("all stores:", allStores);

    // Calculate average rating and include user's rating for each store
    const storesWithAverage = allStores.map((store) => {
      const storeData = store.toJSON ? store.toJSON() : store;
      const ratings = storeData.ratings || [];

      let averageRating = 0;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        averageRating = sum / ratings.length;
      }

      return {
        id: storeData.id,
        name: storeData.name,
        email: storeData.email,
        address: storeData.address,
        averageRating: parseFloat(averageRating.toFixed(2)),
        userRating: userRatingMap[storeData.id] || null, // Current user's rating
      };
    });

    console.log("storesWithAverage", storesWithAverage);

    // Apply pagination manually
    const totalCount = storesWithAverage.length;
    const stores = storesWithAverage.slice(offset, offset + limitNumber);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasMore = pageNumber < totalPages;
    console.log("hasmore:", hasMore);

    res.status(200).json({
      stores,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

const getOwners = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Search query:", q);

    // Base condition
    const whereCondition = {
      role: "store_owner",
    };

    if (q && q.trim() !== "") {
      const search = `%${q.trim()}%`;

      // Search by name OR email
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: search } },
        { email: { [Op.iLike]: search } },
      ];
    }

    const owners = await User.findAll({
      where: whereCondition,
      attributes: ["id", "name", "email"],
      order: [["name", "ASC"]],
    });

    console.log(`Found ${owners.length} owners for query: "${q}"`);
    res.json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ message: "Failed to fetch owners" });
  }
};

module.exports = {
  createUser,
  createStore,
  getDashboardStats,
  listUsers,
  listStores,
  getOwners,
};
