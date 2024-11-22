import { Company, Transaction, User } from "@prisma/client"
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

export interface transaction_input {
   amount: number;
   category: string;
   paymentMethod: string;
}

/* Add `user` with the type of your Prisma User mode */
declare global {
   namespace Express {
      interface Request {
         user?: User;
         token?: token_object;
         transaction?: Transaction;
         filter_query?: string;
         filter_value?: string;
         max_time?: number;
         company?: Company;
      }
   }
}

/* Transaction categories enums */
enum transaction_category {
   GROCERIES = "GROCERIES",
   TRANSPORTATION = "TRANSPORTATION",
   ENTERTAINMENT = "ENTERTAINMENT",
   UTILITIES = "UTILITIES",
   SALARY = "SALARY",
   RENT = "RENT",
   MEDICAL = "MEDICAL",
   EDUCATION = "EDUCATION",
   INVESTMENT = "INVESTMENT",
   OTHER = "OTHER",
}

export const transaction_category_arr: Array<string> = Object.values(transaction_category)

/* Payment method enums */
export enum payment_method {
   CASH = "CASH",
   CREDIT_CARD = "CREDIT_CARD",
   DEBIT_CARD = "DEBIT_CARD",
   BANK_TRANSFER = "BANK_TRANSFER",
   PAYPAL = "PAYPAL",
   CRYPTO = "CRYPTO",
   OTHER = "OTHER",
}

export const payment_method_arr: Array<string> = Object.values(payment_method)

/* Transaction status enums */
enum transaction_satus {
   COMPLETED = "COMPLETED",
   PENDING = "PENDING",
   FAILED = "FAILED",
   CANCELED = "CANCELED",
}

export const transaction_satus_arr: Array<string> = Object.values(transaction_satus)
