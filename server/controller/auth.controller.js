const { User } = require("../tables");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(404).json({
      message: "User not found.",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      message: "Invalid credentials",
    });

  req.session.user = {
    id: user.id,
    role: user.role,
    name: user.name,
  };
  res.json({ message: "Login successful", user: req.session.user });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

const isLoggedIn = (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  // Send user info from session
  res.json({
    id: user.id,
    role: user.role,
    name: user.name,
  });
};

module.exports = { login, logout, isLoggedIn };
