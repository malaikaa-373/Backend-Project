import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true , limit: "16kb" }))
app.use(express.static("public"))

app.use(cookieParser())

//routes import (segregation of files)
import userRouter from "./routes/User.routes.js"
import  tweetRouter from "./routes/tweet.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets",tweetRouter )
app.use("/api/v1/subsctiption", subscriptionRouter )
app.use("/api/v1/videos", videoRouter ) 
app.use("/api/v1/comments",commentRouter )
app.use("/api/v1/likes", likeRouter )

// http://localhost:8000/api/v1/users/register

export {app}