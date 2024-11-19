import { NextFunction, Request, Response } from "express";
import Auth_validator from "../validators/auth.validator.ts";
import Api_error from "../middlewares/error.middleware.ts";
import prisma_db from "../prisma.db.ts";
import { User } from "@prisma/client";
import { response_type, token_object } from "../types/app.types.ts";



class Auth_controller extends Auth_validator {


   /* Register controller
         --> creating new user, --> set new token,
         --> set new cookies, --> then response */
   register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const {first_name, last_name, email, password} = req.body

      const hashed_password: string = this.hashed_password(password)
      let result: User;
      try {
         const user: User = await prisma_db.user.create({
            data: {
               first_name, last_name, email, password: hashed_password
            }
         })

         result = user
      } catch (err) {
         return (next(Api_error.server_error("Server error during register process")))
      }

      const token_assign: token_object = {
         id: result.id, is_admin: result.is_admin
      }

      const token: string | null = this.create_token(token_assign)
      if (!token)
         return (next(Api_error.create_error("No token valid!")))

      this.new_cookies(res, token)
      this.response_successfuly(res, 201, "New Account has been addeed!!", {
         ...result, token
      })
   }
}

export default Auth_controller;
