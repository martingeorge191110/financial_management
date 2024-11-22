import express from "express";
import Company_controller from "../controllers/company.controller.ts";


const Company_route: express.Router = express.Router()

const company_instance: Company_controller = new Company_controller()



Company_route.route("/register/")
                     .post(
                        company_instance.creation_valid(),
                        company_instance.validation_error,
                        company_instance.create_account
                     )




export default Company_route;
