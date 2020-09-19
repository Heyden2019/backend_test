"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
process.env.PORT = "3006";
const index_1 = __importDefault(require("../index"));
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
const Status_1 = __importDefault(require("../models/Status"));
let should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
const agent = chai_1.default.request.agent(index_1.default);
let taskId;
let userId;
let statusId;
const status = {
    title: "firstName",
    desc: "lastName"
};
const task = {
    title: "default title",
    desc: "default desc"
};
const newTitle = "new Title";
const newDesc = "new description";
const user = {
    firstName: "firstName",
    lastName: "lastName",
    email: "qwerty@mail.com",
    password: "123qwe123"
};
describe('Tasks', () => {
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Task_1.default.deleteMany({}),
            yield User_1.default.deleteMany({}),
            yield Status_1.default.deleteMany({});
    }));
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Task_1.default.deleteMany({});
        yield agent.post('/users/register').send(user)
            .then((res) => {
            userId = res.body._id;
            console.log("user created");
        });
        yield agent.post('/statuses').send(status)
            .then((res) => {
            statusId = res.body._id;
            console.log("res", res.body);
            console.log("status created");
        });
    }));
    describe('POST /tasks', () => {
        it("it should create the status", (done) => {
            agent.post('/tasks')
                .send(Object.assign(Object.assign({}, task), { status_id: statusId }))
                .end((err, res) => {
                console.log(res.body);
                res.should.have.status(201);
                res.body.desc.should.be.eql(task.desc);
                res.body.title.should.be.eql(task.title);
                statusId = res.body._id;
                done();
            });
        });
    });
});
//# sourceMappingURL=tasks.test copy.js.map