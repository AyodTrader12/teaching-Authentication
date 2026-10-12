import nodemailer from "nodemailer";
import env from "dotenv"
env.config()

const transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
    type:"oAuth2",
    user:process.env.EMAIL_FROM,
    clientId:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
 
   } 
})

export default transporter  