import { Request,Response } from "express"
import authModel from "../model/auth.model";
import bcrypt from "bcrypt"
import crypto from "crypto"
import { user } from "../model/auth.model";
import jwt from "jsonwebtoken"
import env from "dotenv"
import { createAccountEmail,verifyAccountEmail } from "../services/mail.service";

env.config()
export const createAccount = async(req:Request,res:Response): Promise<void> => {
  try{
  const{name,email,password} = req.body
//       const existing = await authModel.findOne({ email });
//   if (existing) {
//     const message =
//       existing.email === email ? "Email already in use" : "Username already taken";
//     throw new Error( message);
//   }
    
  
   const salt = await bcrypt.genSalt(9);
    const passwordHash = await bcrypt.hash(password, salt);
    const GenerateOtp = crypto.randomInt(100000, 999999).toString();
  const newUser = await authModel.create({
  name,
  email,
  password:passwordHash,
  otp:GenerateOtp
  })
  res.status(201).json({
    message:"account created successfully",
    data:newUser,
    status:201
  })
  await createAccountEmail(newUser)
  } catch(error:any){
    res.status(404).json({
        message:error.message,
        status:404
    })
  }
 }

 export const loginAccount = async(req:Request,res:Response) => {
try{
const {email,password} = req.body
const user = await authModel.findOne({
      email,
    });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.password && user.otp === "") {
          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: process.env.JWT_EXPIRESIN as string,
            }
          );
          return res.status(201).json({
            message: "account logged in succesful",
            data: token,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "please verify your account",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "error with email",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "error with password",
        status: 404,
      });
    }
}catch(error){
    return res.status(404).json({
        message:"error loggging in Account",
        status:404
    })
}
 }

 export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(404).json({ message: "OTP is required" });
    }

    const user = await authModel.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    await verifyAccountEmail(user);
    user.isVerified = true;
    user.otp = "";

    await user.save();
    return res.status(201).json({
      message: "account verified",
      status: 201,
    });
  } catch (error) {
    return error;
  }
};
