const mongoose = require("mongoose");
const  {Schema} = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting server! asdf", process.env.MONGO_URI);
    const db = await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected Successfully df");

    return db;
  } catch (err) {
    console.log("DB Connection Error:", err.message);
    console.error("Error Stack:", err.stack);
    console.error("Error Reason:", err.reason);
  }
};

module.exports = {
    connectDB
};
