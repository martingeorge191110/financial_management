import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ValidationError } from "express-validator";
dotenv.config();


/** 
 * Api Error class
 * Description:
 *             Creating error for each satiuation, and
 *             path it to the error middleware function
 */
class Api_error extends Error{
   private status: string;
   private status_code: number;
   private errors: ValidationError[] | null

   constructor (message: string, errors: ValidationError[] | null, status_code: number = 500) {
      super(message)
      this.status_code = status_code
      this.stack = process.env.NODE_ENV === "development" ? this.stack : ""
      this.status = status_code >= 400 && status_code <= 500 ? "Failuire" : "Error"
      this.errors = errors
   }

   public static server_error = (message: string): Api_error => {
      return (new Api_error(message, null))
   }

   /* creating error */
   public static create_error = (message: string, status_code: number): Api_error => {
      return (new Api_error(message, null, status_code))
   }

   /* creating error */
   public static create_validation_err = (message: string, arr: ValidationError[]): Api_error => {
      return (new Api_error(message, arr, 400))
   }

   /* Function middle ware (final step in this project) when errors exist */
   public static error_middleware = (error: Api_error, req: Request, res: Response, next: NextFunction): void => {
      res.status(error.status_code).json({
         success: false,
         message: error.message,
         errors: error.errors,
         stack: process.env.NODE_ENV === "development" ? error.stack : "",
         status: error.status,
      })
   }
}

export default Api_error;
