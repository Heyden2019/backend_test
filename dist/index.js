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
const images_1 = __importDefault(require("./routes/images"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
app.use(body_parser_1.default.json());
const MONGODB_URL = process.env.NODE_ENV == "test"
    ? process.env.TEST_DB_URL
    : process.env.MONGO_DB_URL;
mongoose_1.default.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("mongo started"))
    .catch((err) => console.error(err));
const MongoStore = connect_mongo_1.default(express_session_1.default);
app.use(express_session_1.default({
    name: process.env.COOKIE_NAME,
    store: new MongoStore({
        url: MONGODB_URL,
        stringify: false,
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax"
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use("/tasks", tasks_1.default);
app.use("/users", users_1.default);
app.use("/statuses", statuses_1.default);
app.use("/images", images_1.default);
app.listen(process.env.PORT, () => {
    console.log("server started on port: " + process.env.PORT);
});
exports.default = app;
//# sourceMappingURL=index.js.map