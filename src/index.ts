import express from "express"
import mongoose from "mongoose"
import tasksRoutes from "./routes/tasks"
import usersRoutes from "./routes/users"
import statusesRoutes from "./routes/statuses"
import imagesRoutes from "./routes/images"
import bodyParser from "body-parser"
import session from "express-session"
import connectMongo from "connect-mongo"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(bodyParser.json())

const MONGODB_URL = process.env.NODE_ENV == "test"
    ? process.env.TEST_DB_URL as string
    : process.env.MONGO_DB_URL as string

mongoose.connect(
    MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
    }
).then(() => console.log("mongo started"))
.catch((err) => console.error(err))

const MongoStore = connectMongo(session) 

app.use(
    session({
        name: process.env.COOKIE_NAME as string,
        store: new MongoStore({
            url: MONGODB_URL,
            stringify: false,
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
            sameSite: "lax"
        },
        secret: process.env.SECRET as string,
        resave: false,
        saveUninitialized: false
    })
);

app.use("/tasks", tasksRoutes)
app.use("/users", usersRoutes)
app.use("/statuses", statusesRoutes)
app.use("/images", imagesRoutes)

app.listen(process.env.PORT as string, () => {
    console.log("server started on port: " + process.env.PORT as string)
})

export default app