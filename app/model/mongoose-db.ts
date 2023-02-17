import mongoose from "mongoose";
import { DB_NOTIFICATION, DB_URL } from "../utils/constants";

mongoose.Promise = global.Promise;
let isAuthConnected;

export const notificationInstance = new mongoose.Mongoose();
const notificationProperties = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: DB_NOTIFICATION,
  // ssl: !!DB_SSL_CA,
  // sslCA: DB_SSL_CA || null,
  sslValidate: false,
  retryWrites: false,
  maxPoolSize: 100,
  socketTimeoutMS: 35000, // Close sockets after 35 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
};

export const connectToNotificationDatabase = () => {
  if (isAuthConnected) {
    console.log("=> using existing auth database connection");
    return Promise.resolve();
  }

  console.log("=> using new auth database connection", DB_URL);
  return notificationInstance
    .connect(DB_URL, notificationProperties)
    .then((db) => {
      console.log("=> notification database connection successful");
      isAuthConnected = db.connections[0].readyState;
    })
    .catch((err) => {
      console.log("=> error notification database connection");
      console.error(err);
      throw err;
    });
};
