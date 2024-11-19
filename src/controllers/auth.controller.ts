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
   register = async (req: Request, res: Response, next: NextFunction): response_type => {
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
         return (next(Api_error.create_error("No token valid!", 400)))

      this.new_cookies(res, token)
      this.response_successfuly(res, 201, "New Account has been addeed!!", {
         ...result, token
      })
   }

   /* Login controller
         --> compare pasword with hashed one, --> set new token,
         --> set new cookies, --> then response */
   login = async (req: Request, res: Response, next: NextFunction): response_type => {
      if (!req.user || req.user === undefined)
         return (next(Api_error.server_error("server error while login")))

      const hashed_passowrd: string = req.user.password
      const {password} = req.body as {password: string}

      const compare_password: boolean = this.compare_password(password, hashed_passowrd)
      if (!compare_password)
         return (next(Api_error.create_error("Wrong password!", 400)))

      const token_assign: token_object = {
         id: req.user.id, is_admin: req.user.is_admin
      }

      const token: string | null = this.create_token(token_assign)
      if (!token)
         return (next(Api_error.create_error("No token valid!", 400)))

      this.new_cookies(res, token)
      this.response_successfuly(res, 200, "Login Successfuly!", {
         ...req.user, token
      })
   }

   /* verify_reseting_password controller
            -->  send mail to user, --> check whther mail send or not
            --> then response */
   send_reseting_page = async (req: Request, res: Response, next: NextFunction): response_type => {
      if (!req.user || req.user === undefined)
         return (next(Api_error.server_error("server error while login")))

      const user: User = req.user

      try {
         const send_mail: boolean = await this.send_mail(user.email, "Reseting passsword", `
            <div class="email-container"><div class="email-header">
                  <h2>Password Reset Request</h2>
               </div>
            <div class="email-content"> <p>Hi ${user.first_name},</p> <p>We received a request to reset the password for your account. If you requested this change, please click the button below to reset your password:</p>
            <a href="https://yourwebsite.com/reset-password" class="reset-button">Reset Your Password</a>
            <p>If you did not request this, you can safely ignore this email.</p>
            </div><div class="footer">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p></div></div>`)

         if (!send_mail)
            return (next(Api_error.create_error("Sending mail failed!", 500)))
      } catch (err) {
         return (next(Api_error.server_error("server error while sending verifing password page!")))
      }

      this.response_successfuly(res, 200, "We have sent a mail to your email!",{
         success: true
      })
   }
}

export default Auth_controller;
