import { NextFunction, Request, Response } from "express";
import prisma_db from "../prisma.db.ts";
import { response_type } from "../types/app.types.ts";
import User_validator from "../validators/user.validator.ts";



class User_controller extends User_validator {


}

export default User_controller;
