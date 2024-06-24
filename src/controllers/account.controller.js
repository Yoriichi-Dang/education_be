const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
module.exports = {
  signIn: async (req, res) => {
    const user = await authService.loginAccount(req);
    if (user) {
      const { password } = req.body;
      if (user.password !== password) {
        return res.status(401).send({ message: "Incorrect password" });
      }
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: { email: user.email, name: user.fullName },
        },
        "secret"
      );
      return res.send(JSON.stringify({ token }));
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  },
  signUp: async (req, res) => {
    const user = await authService.signUpAccount(req);
    if (!user) {
      return res.status(400).send({ message: "User exists" });
    }
    res.status(201).send({ message: "create account successfully!" });
  },
};
