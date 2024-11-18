import express, {Response, Request} from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'


dotenv.config()

const app = express()


/* Built in middle wares */
app.use(cors({
   origin: "*",
   credentials: false
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



app.listen(8000, () => {
   console.log("server is running")
})
