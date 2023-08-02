import mongoose from "mongoose";
import {config} from "./config.js";

export const connectDB = async()=>{
  try {
    await mongoose.connect(config.mongo.url);
    console.log("conexión a la base de datos de manera exitosa");
  } catch (error) {
      console.log(`Hubo un error conectandose a la base ${error}`);
  }
};