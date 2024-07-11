const { userCollection } = require("../constants/collection");
const connectToDatabase = require("../configs/connect");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { generateRefreshToken, decodeToken } = require("../utils");
const signInService = async (req) => {
  const { client, db } = await connectToDatabase();
  const { email, password } = req.body;
  try {
    const user = await db.collection(userCollection).findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const refreshToken = generateRefreshToken(
          user["_id"],
          user.email,
          user.fullName,
          user.role
        );
        const res = await db
          .collection(userCollection)
          .updateOne(
            { email: email },
            { $set: { refreshToken: refreshToken } }
          );
        if (res.modifiedCount) {
          const userProfile = await db
            .collection(userCollection)
            .findOne({ email: email });
          return userProfile;
        }
      }
      return null;
    }
    client.close();
    return null;
  } catch (error) {
    console.error("Error finding user:", error);
    client.close();
    return null;
  }
};
const signUpService = async (req) => {
  const data = req.body;
  data["role"] = "user";
  data["verified"] = false;
  const currentTime = new Date();
  data["create_at"] = currentTime;
  data["updated_at"] = currentTime;
  const { client, db } = await connectToDatabase();
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword; // Thay thế mật khẩu gốc bằng mật khẩu đã hash
    const user = await checkExistingEmail(data.email);
    if (!user) {
      const result = await db.collection(userCollection).insertOne(data);
      return result.insertedId;
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
const signOutService = async (refreshToken) => {
  const { client, db } = await connectToDatabase();
  try {
    const res = await db
      .collection(userCollection)
      .updateOne(
        { refreshToken: refreshToken },
        { $set: { refreshToken: "" } }
      );
    return res.modifiedCount;
  } finally {
    await client.close();
  }
};
const findAccount = async (token) => {
  const { client, db } = await connectToDatabase();
  const { email } = decodeToken(token);
  try {
    const existingUser = await db.collection(userCollection).findOne({ email });
    return existingUser;
  } finally {
    await client.close();
  }
};
module.exports = { findAccount, signInService, signUpService, signOutService };
