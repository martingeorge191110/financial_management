import { body } from "express-validator";
import prisma_db from "../prisma.db.ts";
import Global_utilies from "../utilies/global.utilies.ts";
import { promise_custom, validator_chain } from "../types/app.types.ts";
import { Company } from "@prisma/client";



class Company_validator extends Global_utilies {


   /* Function to validate creating company account */
   public creation_valid = (): validator_chain => {
      return ([
         body("name")
            .trim()
            .notEmpty().withMessage("Company name is required feild!")
            .isString().withMessage("name must be a string value!"),
         body("account_email")
            .trim()
            .notEmpty().withMessage("Email account is required feild!")
            .isEmail().withMessage("This email not valid")
            .custom( async (val: string, {req}): promise_custom => {
               try {
                  const account: (Company | null) = await prisma_db.company.findUnique({
                     where: { account_email: val}
                  })

                  if (account)
                     throw (new Error("This account already exists!"))

                  return (true)
               } catch (err) {
                  throw (err)
               }
            }),
         body("email")
            .trim()
            .notEmpty().withMessage("Email account is required feild!")
            .isEmail().withMessage("This email not valid")
            .custom( async (val: string, {req}): promise_custom => {
               try {
                  const account: (Company | null) = await prisma_db.company.findUnique({
                     where: { email: val}
                  })

               if (account)
                  throw (new Error("This Email is already for another company!"))

               return (true)
            } catch (err) {
               throw (err)
            }
            }),
         body("password")
            .trim()
            .notEmpty().withMessage('Password is required')
            .isStrongPassword({minLength: 5, minSymbols: 0, minUppercase: 0}).withMessage("Password must be at least 5 characters with numbers!"),
      ])
   }
}

export default Company_validator;
