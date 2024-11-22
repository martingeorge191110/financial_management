import { Request, Response, NextFunction } from "express";
import Company_validator from "../validators/company.validator.ts";
import { response_type } from "../types/app.types.ts";
import Api_error from "../middlewares/error.middleware.ts";
import { Company } from "@prisma/client";
import prisma_db from "../prisma.db.ts";




class Company_controller extends Company_validator {


   /* Controller to create company account
      --> get body inf after validation
      --> creating new company account, then response */
   public create_account = async (req: Request, res: Response, next: NextFunction): response_type => {
      const body = req.body

      try {
         const company: Company = await prisma_db.company.create({
            data: {
               ...body
            }
         })

         this.response_successfuly(res, 201, "Our Team will contact with your Company (within your email) to verify your account!", {
            ...company
         })
      } catch (err) {
         return (next(Api_error.server_error("Server error during Creating an company account")))
      }
   }
}

export default Company_controller;
