import {body, ValidationChain} from 'express-validator'
import { Request } from 'express'
import prisma_db from '../prisma.db.ts';
import { promise_custom, validator_chain } from '../types/app.types.ts';
import Auth_utilies from '../utilies/auth.utilies.ts';
import { User } from '@prisma/client';



/**
 * Authintication class validator
 */
class Auth_validator extends Auth_utilies{

   /* Function to validate the Registering process */
   register_valid = (): validator_chain => {
      return ([
         body("first_name")
            .trim()
            .notEmpty().withMessage("Please Enter your first name!")
            .isString().withMessage("Please First name must be just Characters!")
            .isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
         body("last_name")
            .trim()
            .notEmpty().withMessage("Please Enter your Last name!")
            .isString().withMessage("Please Last name must be just Characters!")
            .isLength({min: 3}).withMessage("Last name must be at least 3 characters long"),
         body("email")
            .trim()
            .notEmpty().withMessage("Email field is required!")
            .isEmail().withMessage("Please provide a valid email address!")
            .custom( async (val: string, { req }): promise_custom => {
               try {
                  const user = await prisma_db.user.findUnique({
                     where: {
                        email: val
                     }
                  })
                  /* Check of user exists or not */
                  if (user)
                     throw (new Error("User email is exists!"))

                  return (true)
               } catch (err) {
                  throw (err)
               }
            }),
         body("password")
            .trim()
            .notEmpty().withMessage("Password field is required!")
            .isStrongPassword({minLength: 5, minSymbols: 0, minUppercase: 0}).withMessage("Password must be at least 5 characters with numbers!")
      ])
   }

   /* Function to validate login process */
   login_valid = (): validator_chain => {
      return ([
         body("email")
            .trim()
            .notEmpty().withMessage("Email field is required!")
            .isEmail().withMessage("Please provide a valid email address!")
            .custom(async (val: string, {req}): promise_custom => {
               try {
                  const user = await prisma_db.user.findUnique({
                     where: {
                        email: val
                     }
                  })

                  if (!user)
                     throw (new Error("We dont have This email in our records, please register first!"))

                  req.user = user
                  return (true)
               } catch (err) {
                  throw (err)
               }
            }),
         body("password")
            .trim()
            .notEmpty().withMessage("Password field is required!")
      ])
   }

   /* Function to validate verifing sending html file
      which will reset user password */
   send_reset_page_valid = (): validator_chain => {
      return ([
         body("email")
            .trim()
            .notEmpty().withMessage("Email feild is required!")
            .isEmail().withMessage("Email addresss is not valid!")
            .custom(async (val: string, {req}): promise_custom => {
               try {
                  const user = await prisma_db.user.findUnique({
                     where: {
                        email: val
                     }
                  })

                  if (!user)
                     throw (new Error("We dont have This email in our records, please register first!"))

                  req.user = user
                  return (true)
               } catch (err) {
                  throw (err)
               }
            })
      ])
   }
}

export default Auth_validator;
