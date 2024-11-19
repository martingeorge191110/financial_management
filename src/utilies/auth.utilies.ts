import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { token_object } from "../types/app.types.ts"
import { Response } from "express"
import Global_utilies from "./global.utilies.ts"
dotenv.config()

/**
 * Auth utilies class
 */
class Auth_utilies extends Global_utilies{

   /* Function to hashing the password */
   public hashed_password = (password: string): string => {
      return (bcrypt.hashSync(password, 10))
   }

   /* Functin to create new token */
   public create_token = (fields: token_object): string | null => {
      const jwtKey = process.env.JWT_KEY;

      if (!jwtKey)
         return (null)

      const token: string = jwt.sign(fields, jwtKey, {
         expiresIn: process.env.JWT_EXP || '1h'
      });

      return (token)
   }

   /* Function that set token as a cookies */
   new_cookies = (res: Response, token: string): void => {
      res.cookie("token", token, {
         secure: process.env.NODE_ENV === "development" ? false : true as boolean,
         httpOnly: false as boolean,
         maxAge: 1000 * 60 * 60 * 24 * 3 as number
      })
   }
}

export default Auth_utilies
