import { body, query, param } from "express-validator";
import prisma_db from "../prisma.db.ts";
import { payment_method_arr, promise_custom, transaction_category_arr, validator_chain } from "../types/app.types.ts";
import Global_utilies from "../utilies/global.utilies.ts";
import { Transaction } from "@prisma/client";


class Transactions_validator extends Global_utilies{


   public add_one_valid = ():validator_chain => {
      return ([
         body("amount")
            .notEmpty().withMessage("amount feild is required!")
            .custom((val: number, {req}) => {
               if (typeof val === "string")
                  throw (new Error("Amount feild must be a number!"))

               return (true)
            }),
         body("type")
            .trim()
            .notEmpty().withMessage("Transaction type is required!")
            .isIn(["REVENUE", "EXPENSE", "LIABILITY"]).withMessage("Wrong value!"),
         body("category")
            .trim()
            .notEmpty().withMessage("category is required!")
            .isIn(transaction_category_arr).withMessage("Wrong value!"),
         body("paymentMethod")
            .trim()
            .notEmpty().withMessage("category is required!")
            .isIn(payment_method_arr).withMessage("Wrong value!"),
      ])
   }


   public transaction_id_valid = ():validator_chain => {
      return ([
         param("id")
            .trim()
            .notEmpty().withMessage("id param is required!")
            .custom(async (val:string, {req}):promise_custom => {
               try {
                  const transaction: (Transaction | null) = await prisma_db.transaction.findUnique({
                     where: {
                        id: val, userId: req.token.id
                     }
                  })

                  if (!transaction)
                     throw (new Error("Transaction with this info not found"))

                  req.transaction = transaction
                  return (true)
               } catch (err) {
                  throw (err)
               }
            })
      ])
   }

   public transactions_filter_valid = (): validator_chain => {
      return ([
         query("filter")
            .trim()
            .notEmpty().withMessage("filter feild is required!")
            .custom((val: string, {req}): boolean => {
               req.filter_query = val
               return (true)
            }),
         query("value")
            .trim()
            .notEmpty().withMessage("filter value is required!")
            .custom((val: string, {req}): boolean => {
               req.filter_value = val
               return (true)
            }),
         query("start_from")
            .trim()
            .notEmpty().withMessage("start time is required")
            .custom((val: number, {req}): boolean => {
               req.max_time = val
               return (true)
            })
      ])
   }
}

export default Transactions_validator;
