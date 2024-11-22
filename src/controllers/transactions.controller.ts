import { Request, Response, NextFunction } from "express";
import { Transaction, User } from '@prisma/client'
import { startOfMonth, endOfMonth } from 'date-fns';
import Transactions_validator from "../validators/transactions.validator.ts";
import { response_type, token_object } from "../types/app.types.ts";
import Api_error from "../middlewares/error.middleware.ts";
import prisma_db from "../prisma.db.ts";



class Transactions_controller extends Transactions_validator {


   /* Controller for adding new transaction
      --> create new transation, then repsonse */
   public add_one_controller = async (req: Request, res: Response, next: NextFunction): response_type => {
      const body = req.body;
      const token_inf: (token_object | null) = req.token || null

      try {
         const transaction: Transaction = await prisma_db.transaction.create({
            data: {
               userId: token_inf?.id as string,
               ...body
            }
         })

         this.response_successfuly(res, 201, "New transaction created!", {...transaction})
      } catch (err) {
         return (next(Api_error.server_error("Server error while recording new transation!")))
      }
   }

   /* Controller to update transactions
      --> get body and token inf and transaction info
      --> update the transaction, then response */
   public update_one_controller = async (req: Request, res: Response, next: NextFunction): response_type => {
      const body = req.body
      const token_inf: (token_object | null) = req.token || null
      const transaction: (Transaction | null) = req.transaction || null

      try {
         const update_transaction: Transaction = await prisma_db.transaction.update({
            where: {
               id: transaction?.id, userId: token_inf?.id
            },
            data: {
               ...body
            }
         })

         this.response_successfuly(res, 200, "Transaction successfuly updated!", update_transaction)
      } catch (err) {
         return (next(Api_error.server_error("Server error during Updating an existing transaction!")))
      }
   }

   /* Controller to retreive all user transactions 
      --> get token info
      --> query to get all transactions, then response*/
   public get_all_transactions = async (req: Request, res: Response, next: NextFunction): response_type => {
      const token_inf: (token_object | null) = req.token || null

      try {
         const transactions: Array<Transaction> = await prisma_db.transaction.findMany({
            where: {
               userId: token_inf?.id
            }
         })

         this.response_successfuly(res, 200, "All transactions have been retreived!", transactions)
      } catch (err) {
         return (next(Api_error.server_error("Server error while retreiving User transactions!")))
      }
   }

   /* Controller to Delete transaction
      --> get token info and transaction info
      --> delete transaction, then response */
      public delete_transaction = async (req: Request, res: Response, next: NextFunction): response_type => {
         const token_inf: (token_object | null) = req.token || null
         const transaction: (Transaction | null) = req.transaction || null

         try {
            await prisma_db.transaction.delete({
               where: {
                  id: transaction?.id, userId: token_inf?.id
               }
            })
         } catch (err) {
            return (next(Api_error.server_error("Server error while deleting a transaction!")))
         }
         this.response_successfuly(res, 200, "Transaction has been deleted successfuly!", {
            deleted: true
         })
      }

   /* Controller to retreive informations about all trans in current month
      --> get user info, and current data and current month inf
      --> create transaction query
      --> calculate total, rev, exp and liablities, then response*/
   public current_month_transactions = async (req: Request, res: Response, next: NextFunction): response_type => {
      const token_inf: (token_object | null) = req.token || null

      const current_date: Date = new Date()
      const start_of_month: Date = startOfMonth(current_date);
      const end_of_month: Date = endOfMonth(current_date);

      try {
         const transactions: Array<Transaction> = await prisma_db.$queryRaw`
         SELECT * FROM Transaction
         WHERE user_id = ${token_inf?.id}
         AND date >= ${start_of_month}
         AND date <= ${end_of_month}`

         let total: number = 0;
         let revenues: number = 0, expenses: number = 0, liabilities: number = 0;
         for (const i of transactions) {
            if (i.type === "REVENUE")
               total += i.amount, revenues += i.amount;
            else if (i.type === "EXPENSE")
               total -= i.amount, expenses += i.amount
            else
               total -= i.amount, liabilities += i.amount
         }

         this.response_successfuly(res, 200, "All transactions retreived based on month filtering!", {
            transactions, total, revenues, expenses, liabilities
         })
      } catch (err) {
         return (next(Api_error.server_error("Server error while filtering based on month!")))
      }
   }
}

export default Transactions_controller;
