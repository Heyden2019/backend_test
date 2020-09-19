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
        yield Task_1.default.deleteMany({});
        yield User_1.default.deleteMany({});
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
            console.log("status created");
        });
    }));
    describe('POST /tasks', () => {
        it("it should create the status", (done) => {
            agent.post('/tasks')
                .send(Object.assign(Object.assign({}, task), { status_id: statusId }))
                .end((err, res) => {
                res.should.have.status(201);
                res.body.desc.should.be.eql(task.desc);
                res.body.title.should.be.eql(task.title);
                taskId = res.body._id;
                done();
            });
        });
        it("it should return error (invalid status_id)", (done) => {
            agent.post('/tasks')
                .send(Object.assign(Object.assign({}, task), { status_id: (statusId + 'a') }))
                .end((err, res) => {
                res.should.have.status(400);
                res.body.errors[0].msg.should.be.eql('Invalid');
                done();
            });
        });
    });
    describe("GET tasks/:id", () => {
        it('it should return task by id', (done) => {
            agent.get('/tasks/' + taskId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(task.title);
                res.body.user_id.should.be.eql(userId);
                res.body.status_id.should.be.eql(statusId);
                done();
            });
        });
        it('it should return 404', (done) => {
            agent.get('/tasks/12345678901234567890abcp')
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
    describe("GET tasks/", () => {
        it('it should return tasks', (done) => {
            agent.get('/tasks')
                .end((err, res) => {
                res.should.have.status(200);
                res.body[0].title.should.be.eql(task.title);
                res.body[0].user_id.should.be.eql(userId);
                res.body[0].status_id.should.be.eql(statusId);
                done();
            });
        });
        it('it should return 404', (done) => {
            agent.get('/tasks?status_id=12345678901234567890abcp')
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('it should return tasks by status_id', (done) => {
            agent.get('/tasks?status_id=' + statusId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body[0].status_id.should.be.eql(statusId);
                done();
            });
        });
    });
    describe("PUT tasks/:id", () => {
        it('it should update task', (done) => {
            agent.put('/tasks/' + taskId)
                .send({
                _id: "123qwe123",
                createdAt: "120371204",
                user_id: "fakeuserID",
                title: newTitle,
                desc: newDesc
            })
                .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it('it should return errors', (done) => {
            agent.put('/tasks/' + taskId)
                .send({
                status_id: (statusId + 'a')
            })
                .end((err, res) => {
                res.should.have.status(400);
                res.body.errors[0].msg.should.be.eql('Invalid');
                done();
            });
        });
        it('it should return task by id', (done) => {
            agent.get('/tasks/' + taskId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(newTitle);
                res.body.desc.should.be.eql(newDesc);
                res.body.user_id.should.be.eql(userId);
                res.body.status_id.should.be.eql(statusId);
                done();
            });
        });
    });
    describe("DELETE tasks/:id", () => {
        it('it should delete task', (done) => {
            agent.delete('/tasks/' + taskId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.be.eql("Deleted successful");
                done();
            });
        });
        it('it should return error', (done) => {
            agent.delete('/tasks/2dqw3xqw3dxqd5')
                .end((err, res) => {
                res.should.have.status(404);
                res.body.message.should.be.eql("404 not found");
                done();
            });
        });
        it('it should return tasks ([])', (done) => {
            agent.get('/tasks')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.eql([]);
                done();
            });
        });
    });
});
//# sourceMappingURL=tasks.test.js.map