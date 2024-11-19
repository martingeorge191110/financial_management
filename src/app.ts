import express, {Response, Request} from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'


dotenv.config()

const env = process.env
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





/* End of api routes */

/* Api error handling middle ware*/



app.listen(env.PORT, () => {
   console.log(`Server running http://${env.HOSTNAME}:${env.PORT}`)
})
