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
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./passport"));
const app = express_1.default();
passport_2.default(passport_1.default);
app.use(body_parser_1.default.json());
mongoose_1.default.connect("mongodb://localhost/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongo started"))
    .catch((err) => console.error(err));
app.use(express_session_1.default({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/tasks", tasks_1.default);
app.use("/users", users_1.default);
app.use("/statuses", statuses_1.default);
app.listen(process.env.PORT, () => {
    console.log("server started on port: " + process.env.PORT);
});
//# sourceMappingURL=index.js.map