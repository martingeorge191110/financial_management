import { NextFunction, Request, Response } from "express";
import Auth_validator from "../validators/auth.validator.ts";
import Api_error from "../middlewares/error.middleware.ts";
import prisma_db from "../prisma.db.ts";
import { User } from "@prisma/client";
import { response_type, token_object, validator_chain } from "../types/app.types.ts";
import path from "path";




class Auth_controller extends Auth_validator {


   /* Register controller
         --> creating new user, --> set new token,
         --> set new cookies, --> then response */
   public register = async (req: Request, res: Response, next: NextFunction): response_type => {
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
   public login = async (req: Request, res: Response, next: NextFunction): response_type => {
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
   public send_reseting_page = async (req: Request, res: Response, next: NextFunction): response_type => {
      if (!req.user || req.user === undefined)
         return (next(Api_error.server_error("server error while login")))

      const user: User = req.user
      console.log(req.get("host"))

      const code: string = String(Math.random()).slice(2,8)
      try {
         await prisma_db.user.update({
            where: {
               email: user.email, id: user.id
            }, data: {
               pass_code: code, exp_date: new Date(Date.now() + 5 * 60 * 1000)
            }
         })
      } catch (err) {
         return (next(Api_error.server_error("Server error during creating generated code!")))
      }

      try {
         const send_mail: boolean = await this.send_mail(user.email, "Reseting passsword", `
            <div class="email-container"><div class="email-header">
                  <h2>Password Reset Request</h2>
               </div>
            <div class="email-content"> <p>Hi ${user.first_name},</p> <p>We received a request to reset the password for your account. If you requested this change, please click the button below to reset your password:</p>
            <p>${code}</p>
            <a href="${req.protocol}://${req.get('host')}/api/auth/reset_password_page/${user.id}" class="reset-button">Reset Your Password</a>
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

   /* Controller to validate sending html file, to reset password
      --> send the validation html file after validation*/
   public verify_reseting_page = async (req: Request, res: Response, next: NextFunction): response_type => {
      return (res.status(200).sendFile(
         path.join(process.cwd(), "src", "static", "reset_password", "verify_reseting.html")
      ))
   }

   /* Controller to just check the code and email
      --> check whether the pass code is not true
      --> update the pass code info to be null
      --> redirect user to the resetting password page*/
   public check_code_controller = async (req: Request, res: Response, next: NextFunction): response_type => {
      const user: (User | null) = req.user || null
      const {code} = req.body

      if (user?.pass_code !== code)
         return (next(Api_error.create_error("Wrong Pass Code!", 400)))

      try {
         await prisma_db.user.update({
            where: {
               email: user?.email, id: user?.id
            }, data: {
               pass_code: null, exp_date: null
            }
         })
      } catch (err) {
         return (next(Api_error.server_error("Server error during checking the code!")))
      }

      this.response_successfuly(res, 200, "Now you can reset your password!", {
         ...user, url: `${req.protocol}://${req.get("host")}/api/auth/reset-password/${user?.id}?success=true`
      })
   }

   /* Controller that eredirect user to the reseting page
      --> send resetting paassword html file*/
   public resetting_page_controller = async (req: Request, res: Response, next: NextFunction): response_type => {
      return (res.status(200).sendFile(
         path.join(process.cwd(), "src", "static", "reset_password", "reset_password.html")
      ))
   }

   /* Controller to reset the password
      --> */
   public reset_password_controller = async (req: Request, res: Response, next: NextFunction): response_type => {
      const user: (User | null) = req.user || null
      const {password} = req.body

      const hashed_passowrd: string = this.hashed_password(password)
      try {
         await prisma_db.user.update({
            where: {
               id: user?.id, email: user?.email
            }, data: {
               password: hashed_passowrd
            }
         })
      } catch (err) {
         return (next(Api_error.server_error("Server error during reseting the password!")))
      }

      this.response_successfuly(res, 200, "Password has been updated Successfuly!", {
         id: user?.id, email: user?.email
      })
   }
}

export default Auth_controller;
