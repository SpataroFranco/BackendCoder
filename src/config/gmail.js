import nodemailer from "nodemailer";
import {config} from "./config.js";

const adminEmail = config.gmail.adminEmail;
const adminPass = config.gmail.adminPass;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: adminEmail,
    pass: adminPass,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;