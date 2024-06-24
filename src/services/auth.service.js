const User = require("../models/user.model");
const loginAccount = async (req) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};
const signUpAccount = async (req) => {
  const { email, password, fullName } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return null;
    } else {
      return await User.create({ fullName, email, password });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};
module.exports = { loginAccount, signUpAccount };
