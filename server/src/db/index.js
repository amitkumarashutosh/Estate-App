import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const instance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MONGO_DB CONNECTED SUCCESSFULLY!! DB_HOST: ${instance.connection.host}`
    );
  } catch (error) {
    console.log(`FAILED TO CONNECT DATABASE !! ${error}`);
  }
};

export default connectDB;
