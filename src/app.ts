import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Api_error from './middlewares/error.middleware.ts'
import Auth_router from './routes/auth.routes.ts'


dotenv.config()

export const env = process.env
const app = express()

/* Built in middle wares */
app.use(cors({
   origin: env.NODE_ENV === "development" ? "*" : undefined,
   credentials: false as boolean
}))

app.use(express.json())
app.use(morgan("tiny"))
app.use(cookieParser())
app.use(express.urlencoded({
   limit: '5gb',
   'extended': true
}))



/* Starting api routes */


app.use("/api/auth", Auth_router)



/* End of api routes */

/* Api error handling middle ware*/
app.use("*", Api_error.error_middleware)


app.listen(env.PORT, () => {
   console.log(`Server running http://${env.HOSTNAME}:${env.PORT}`)
})
