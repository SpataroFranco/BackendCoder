import nodemailer from "nodemailer";
import {config} from "./config.js";

const adminEmail = config.gmail.adminEmail;
const adminPass = config.gmail.adminPass;

const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 587,
  auth: {
    user: adminEmail,
    pass: adminPass,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  }
});

export default transporter;
export const sendRecoveryPass = async(userEmail,token)=>{
  const link = `http://localhost:8080/reset-password?token=${token}`;
  await transporter.sendMail({
      from:adminEmail,
      to:userEmail,
      subject:"Restablecer contraseña",
      html: `
      <div>
      <h2>Has solicitado un cambio de contraseña.</h2>
      <p>Da clic en el siguiente enlace para restableces la contraseña</p>
      <a href="${link}">
      <button> Restablecer contraseña </button>
      </a>        
      </div>
      `
  })
};