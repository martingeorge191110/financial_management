import express from "express";
import Auth_controller from "../controllers/auth.controller.ts";


const Auth_router: express.Router = express.Router()

const auth_instance: Auth_controller = new Auth_controller()



Auth_router.route("/register/")
                     .post(
                        auth_instance.register_valid(), auth_instance.validation_error,
                        auth_instance.register
                     )


Auth_router.route("/login/")
                     .post(
                        auth_instance.login_valid(), auth_instance.validation_error,
                        auth_instance.login
                     )



Auth_router.route("/verify_reseting_password/")
                     .post(
                        auth_instance.send_reset_page_valid(), auth_instance.validation_error,
                        auth_instance.send_reseting_page
                     )


export default Auth_router;
