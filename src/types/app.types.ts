import { User } from "@prisma/client"
import { Request, Response } from "express"
import { ValidationChain } from "express-validator"

/* Type alias for returning array of validation chan */
export type validator_chain = Array<ValidationChain>


/* Type alias for returning promise of boolean or void (Custom functions) */
export type promise_custom = Promise<boolean | void>

/* Token assign object interface */
export interface token_object {
   id: string,
   is_admin: boolean
}

/* type alias for response */
export type response_type = Promise<void>

/* Interface for response object */
export interface response_object {
   success: boolean;
   message: string;
   result: object;
}

/* Type alias for promise boolean */
export type promise_bool = Promise<boolean> 

/* Add `user` with the type of your Prisma User mode */
declare global {
   namespace Express {
      interface Request {
         user?: User;
      }
   }
}
