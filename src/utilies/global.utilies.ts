import { NextFunction, Request, Response } from "express";
import { promise_bool, response_object } from "../types/app.types";
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer'
import Api_error from "../middlewares/error.middleware";



/**
 * class for gloabl utilies
 */
class Global_utilies {

   /* Function that response with the result */
   public response_successfuly = (res: Response, status_code: number, message: string, result: object): Response => {
      const response: response_object = {
         success: true,
         message: message,
         result
      }

      res.status(status_code)
      res.json(response)
      return (res)
   }

   /* Function Middleware to chech the request
      body is valid or catching errors */
   validation_error = (req: Request, res: Response, next: NextFunction): void => {
      const validation = validationResult(req)

      if (!validation.isEmpty()) {
         const apiError = Api_error.create_validation_err("validation error!", validation.array())
         return (next(apiError))
      }
      return (next())
   }

   send_mail = async (user_email: string, subject: string, html_code: string): promise_bool => {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
         }
      })

      const mail = {
         from: process.env.GMAIL_USER,
         to: user_email,
         subject: subject,
         html: html_code,
      }
   
      try {
         await transporter.sendMail(mail)
   
         return (true)
      } catch (err) {
         return (false)
      }
   }
}

export default Global_utilies;
