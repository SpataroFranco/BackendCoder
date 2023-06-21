import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DB;
const MONGO = process.env.MONGO_URL+DB;
const PORT = process.env.PORT || 8080;
const SECRET_SESSION = process.env.SECRET_SESSION;

export const config = {
    server: {
        port: PORT,
        clave_secreta: SECRET_SESSION
    },
    mongo: {
        url: MONGO
    }
} 
