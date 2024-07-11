const { userCollection } = require("../constants/collection");
const connectToDatabase = require("../configs/connect");
const { decodeToken, getHeaderToken } = require("../utils");

const findAccount = async (req) => {
  const { client, db } = await connectToDatabase();
  const { email } = decodeToken(getHeaderToken(req));
  try {
    const existingUser = await db.collection(userCollection).findOne({ email });
    return existingUser;
  } finally {
    await client.close();
  }
};
module.exports = { findAccount };
