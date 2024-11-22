import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import Api_error from './error.middleware.ts';
import { token_object } from '../types/app.types.ts';
import dotenv from 'dotenv';
dotenv.config()




const verify_token = (req: Request, res: Response, next:NextFunction): void => {
   const { authorization } = req.headers
   const secret = process.env.JWT_KEY
   if (!secret)
      return (next(Api_error.server_error("JWT_KEY IS NULL OR undefined")))

   if (!authorization)
      return (next(Api_error.create_error("authorization should be included in the request headers", 400)))

   const token = authorization.split(' ')[1]
   if (!token)
      return (next(Api_error.create_error("Token is not found!", 400)))

   jwt.verify(token, secret, (err, payload) => {
      if (err)
         return (next(Api_error.create_error("Token is not valid!", 400)))

      /*  */
      req.token = payload as token_object
   })
   next()
}

export default verify_token;