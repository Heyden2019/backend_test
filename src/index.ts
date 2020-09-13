import express from "express"
import mongoose from "mongoose"
import tasksRoutes from "./routes/tasks"
import usersRoutes from "./routes/users"
import statusesRoutes from "./routes/statuses"
import bodyParser from "body-parser"
import session from "express-session"
import connectMongo from "connect-mongo"

const app = express()

app.use(bodyParser.json())

mongoose.connect(
    "mongodb://localhost/testdb",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("mongo started"))
.catch((err) => console.error(err))

const MongoStore = connectMongo(session) 

app.use(
    session({
        name: "qid",
        store: new MongoStore({
            url: "mongodb://localhost/testdb",
            stringify: false,
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
            sameSite: "lax"
        },
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

app.use("/tasks", tasksRoutes)
app.use("/users", usersRoutes)
app.use("/statuses", statusesRoutes)

app.listen(process.env.PORT, () => {
    console.log("server started on port: " + process.env.PORT)
})