const { userCollection } = require("../constants/collection");
const connectToDatabase = require("../configs/connect");
const bcrypt = require("bcrypt");
const loginAccount = async (req) => {
  const { client, db } = await connectToDatabase();
  const { email, password } = req.body;
  try {
    const user = await db.collection(userCollection).findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      } else {
        return null;
      }
    }
    client.close();
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    client.close();
    return null;
  }
};
const checkExistingEmail = async (email) => {
  const { client, db } = await connectToDatabase();
  try {
    const existingUser = await db
      .collection(userCollection)
      .findOne({ email: email });
    return existingUser != null;
  } finally {
    await client.close();
  }
};
const signUpAccount = async (req) => {
  const data = req.body;
  const { client, db } = await connectToDatabase();
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword; // Thay thế mật khẩu gốc bằng mật khẩu đã hash
    const user = await checkExistingEmail(data.email);
    if (!user) {
      const result = await db.collection(userCollection).insertOne(data);
      return result;
    }
    return null;
  } catch (error) {
    console.error("Error creating user:", error);
    client.close();
    return null;
  } finally {
    client.close();
  }
};

module.exports = { loginAccount, signUpAccount };
