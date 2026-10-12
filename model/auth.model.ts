import { model,Schema } from "mongoose";
import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

interface iUser {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp: string;
}

interface iuserData extends iUser, Document {}

const authModel = new Schema({
name:{
    type:String,
    required:true,
    minlength:5,
    maxlength:20
},
email:{
    type:String,
    unoque:true,
    required:true,
},
password:{
    type:String,
    require:true
},
isVerified:{
    type:Boolean,
    default:false
},
otp:{
    type:String,
    default:""
}
},{timestamps:true})

export default model<iuserData>("users", authModel);

export type IUser = InferSchemaType<typeof authModel>
export const user = model("user", authModel)