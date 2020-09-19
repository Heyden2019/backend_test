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
const Status_1 = __importDefault(require("../models/Status"));
const User_1 = __importDefault(require("../models/User"));
let should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
const agent = chai_1.default.request.agent(index_1.default);
describe('Statuses', () => {
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.deleteMany({});
        yield Status_1.default.deleteMany({});
    }));
    before(done => {
        console.log("clearing db");
        Status_1.default.deleteMany({}, err => {
            done();
        });
    });
    const status = {
        title: "firstName",
        desc: "lastName"
    };
    const newTitle = "qwerty";
    const newDesc = "Some new description";
    const user = {
        firstName: "firstName",
        lastName: "lastName",
        email: "qwerty@mail.com",
        password: "123qwe123"
    };
    let statusId;
    describe('POST /statuses', () => {
        it("it should return error (no permissions)", (done) => {
            agent.post('/statuses')
                .send(status)
                .end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });
        it("it should create the user", (done) => {
            agent
                .post('/users/register')
                .send(user)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('email');
                res.body.should.not.have.property('password');
                done();
            });
        });
        it("it should create the status", (done) => {
            agent.post('/statuses')
                .send(status)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.desc.should.be.eql(status.desc);
                res.body.title.should.be.eql(status.title);
                statusId = res.body._id;
                done();
            });
        });
        it("it should return status(400) (newTitle is empty)", (done) => {
            agent.post('/statuses')
                .send({ title: "", desc: status.desc })
                .end((err, res) => {
                res.should.have.status(400);
                res.body.errors[0].msg.should.be.eql("Required");
                done();
            });
        });
    });
    describe('GET /statuses/:id', () => {
        it("it should return status by id", (done) => {
            agent.get('/statuses/' + statusId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(status.title);
                res.body.desc.should.be.eql(status.desc);
                done();
            });
        });
        it("it should return status 404", (done) => {
            agent.get('/statuses/12345678901234567890abck')
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
    describe('GET /statuses', () => {
        it("it should return statuses", (done) => {
            agent.get('/statuses')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(1);
                res.body[0].title.should.be.eql(status.title);
                res.body[0].desc.should.be.eql(status.desc);
                done();
            });
        });
    });
    describe('PUT /statuses/:id', () => {
        it("it should return status and update it by id", (done) => {
            agent.put('/statuses/' + statusId)
                .send({ title: newTitle, desc: newDesc })
                .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it("it should return status by id", (done) => {
            agent.get('/statuses/' + statusId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(newTitle);
                res.body.desc.should.be.eql(newDesc);
                done();
            });
        });
        it("it should return status 404", (done) => {
            agent.put('/statuses/12345678901234567890abck')
                .send({ title: newTitle, desc: newDesc })
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it("it should return status 400 (Title invalid)", (done) => {
            agent.put('/statuses/' + statusId)
                .send({ title: "", desc: newDesc })
                .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
        it("it should return status with updated title", (done) => {
            agent.put('/statuses/' + statusId)
                .send({ title: newTitle })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.eql(newTitle);
                done();
            });
        });
    });
    describe('DELETE /statuses/:id', () => {
        it("it should return status and update it by id", (done) => {
            agent.delete('/statuses/' + statusId)
                .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.be.eql("Deleted successful");
                done();
            });
        });
        it("it should return status by id", (done) => {
            agent.get('/statuses/' + statusId)
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it("it should return status 404", (done) => {
            agent.delete('/statuses/12345678901234567890abck')
                .send({ title: newTitle, desc: newDesc })
                .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
});
//# sourceMappingURL=statuses.test.js.map