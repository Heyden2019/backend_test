import express from "express"
import mongoose from "mongoose"
import tasksRoutes from "./routes/tasks"
import usersRoutes from "./routes/users"
import statusesRoutes from "./routes/statuses"
import bodyParser from "body-parser"
import session from "express-session"
import passport from "passport"
import passportStr from "./passport"

const app = express()

passportStr(passport)

app.use(bodyParser.json())

mongoose.connect(
    "mongodb://localhost/testdb",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("mongo started"))
.catch((err) => console.error(err))

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/tasks", tasksRoutes)
app.use("/users", usersRoutes)
app.use("/statuses", statusesRoutes)

app.listen(process.env.PORT, () => {
    console.log("server started on port: " + process.env.PORT)
})