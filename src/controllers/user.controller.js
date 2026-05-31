const User = require('../models/user.model');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('name email');
  res.json({ users });
};
