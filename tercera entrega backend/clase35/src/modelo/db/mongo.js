const { default: mongoose } = require("mongoose");
const CONFIG = require("../../config");
const { MONGO_URL } = CONFIG;

class MongoDB {
  async connect() {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Mongoose connected");
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MongoDB();
