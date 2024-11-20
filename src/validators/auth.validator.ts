import {body, param, query, ValidationChain} from 'express-validator'
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

   /* Function to validate user to send him
      html file which will reset the password */
      reset_password_page_valid = (): validator_chain => {
         return ([
            param("id")
               .trim()
               .notEmpty().withMessage("id param is required!")
               .isString().withMessage("id param must be a string!")
               .custom(async (val: string, {req}): promise_custom => {
                  try {
                     const user = await prisma_db.user.findUnique({
                        where: {
                           id: val
                        }
                     })

                     if (!user)
                        throw (new Error("User with this id is not in our Records!"))

                     if (!user.pass_code || !user.exp_date)
                        throw (new Error("User deos not requested to reset his password"))

                     const current_date: Date = new Date(Date.now() + 1 * 60 * 1000)
                     if (user.exp_date < current_date)
                        throw (new Error("Code has been expired you must request another reseting password process!"))

                     req.user = user
                     return (true)
                  } catch (err) {
                     throw (err)
                  }
               })
         ])
      }

      /* Function to validate checking code process */
      check_code_valid = (): validator_chain => {
         return ([
            body("email")
               .trim()
               .notEmpty().withMessage("Email field is required!")
               .isEmail().withMessage("Please provide a valid email address!")
               .custom(async (val: string, {req}): promise_custom => {
                  try {
                     const user: (User | null) = await prisma_db.user.findUnique({
                        where: {
                           email: val
                        }
                     })

                     if (!user)
                        throw (new Error("User is not found!"))

                     req.user = user
                     return (true)
                  } catch (err) {
                     throw (err)
                  }
               }),
            body("code")
               .trim()
               .notEmpty().withMessage("code is required!")
         ])
      }

      /* Function to validate send html file which
         user will reset his password on */
      resetting_page_valid = (): validator_chain => {
         return ([
            param("id")
               .trim()
               .notEmpty().withMessage("Id feild in params is required")
               .isString().withMessage("Id must be string!")
               .custom(async (val: string, {req}): promise_custom => {
                  try {
                     const user = await prisma_db.user.findUnique({
                        where: {
                           id: val
                        }
                     })

                     if (!user)
                        throw (new Error("User with this id is not in our Records!"))

                     return (true)
                  } catch (err) {
                     throw (err)
                  }
               }),
            query("success")
               .trim()
               .notEmpty().withMessage("This operation is not succeed!")
         ])
      }

   /* Function to validate resetting password information */
   reset_password_valid = (): validator_chain => {
      return ([
         param("id")
            .trim()
            .notEmpty().withMessage("Id feild in params is required")
            .isString().withMessage("Id must be string!"),
         body("email")
            .notEmpty().withMessage("Email field is required!")
            .isEmail().withMessage("Please provide a valid email address!")
            .custom(async (val: string, {req}): promise_custom => {
               try {
                  const user: (User | null) = await prisma_db.user.findUnique({
                     where: {
                        id: req.params?.id,
                        email: val
                     }
                  })

                  if (!user)
                     throw (new Error("This user information is not exists!"))

                  req.user = user
                  return (true)
               } catch (err) {
                  throw (err)
               }
            }),
         body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isStrongPassword({minLength: 5, minSymbols: 0, minUppercase: 0}).withMessage("Password must be at least 5 characters with numbers!"),
         body('confirm_password')
            .trim()
            .notEmpty().withMessage('Confirm password is required')
            .custom((value: string, { req }): (boolean | null) => {
               if (value !== req.body.password) {
                  throw new Error('Passwords do not match');
               }
               return true;
            })
      ])
   }
}

export default Auth_validator;
