"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const users_1 = __importDefault(require("./routes/users"));
const statuses_1 = __importDefault(require("./routes/statuses"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = express_1.default();
app.use(body_parser_1.default.json());
mongoose_1.default.connect("mongodb://localhost/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongo started"))
    .catch((err) => console.error(err));
const MongoStore = connect_mongo_1.default(express_session_1.default);
app.use(express_session_1.default({
    name: "qid",
    store: new MongoStore({
        url: "mongodb://localhost/testdb",
        stringify: false,
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax"
    },
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use("/tasks", tasks_1.default);
app.use("/users", users_1.default);
app.use("/statuses", statuses_1.default);
app.listen(process.env.PORT, () => {
    console.log("server started on port: " + process.env.PORT);
});
//# sourceMappingURL=index.js.map