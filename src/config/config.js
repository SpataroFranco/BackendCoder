import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DB;
const MONGO = process.env.MONGO_URL+DB;
const PORT = process.env.PORT || 8080;
const SECRET_SESSION = process.env.SECRET_SESSION;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const NODE_ENV = process.env.NODE_ENV;

export const config = {
    server: {
        port: PORT,
        clave_secreta: SECRET_SESSION
    },
    mongo: {
        url: MONGO
    },
    gmail: {
        adminAccount: ADMIN_EMAIL,
        adminPass: ADMIN_PASSWORD
    },
    nodeEnv: NODE_ENV
}; 
