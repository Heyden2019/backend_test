process.env.NODE_ENV = 'test'
process.env.PORT = "3006"

import app from "../index"
import chai from "chai"
import chaiHttp from "chai-http"
import Task from "../models/Task"
import User from "../models/User"
import Status from "../models/Status"

//@ts-ignore
let should = chai.should()

chai.use(chaiHttp)
const agent = chai.request.agent(app)

    let taskId: any
    let userId: any
    let statusId: any
    const status = {
        title: "firstName",
        desc: "lastName"
    }
    const task = {
        title: "default title",
        desc: "default desc"
    }
    const newTitle = "new Title"
    const newDesc = "new description"
    const user = {
        firstName: "firstName",
        lastName: "lastName",
        email: "qwerty@mail.com",
        password: "123qwe123"
    }

describe('Tasks', () => {
    //@ts-ignore
    after(async () => {
        await Task.deleteMany({})
        await User.deleteMany({})
        await Status.deleteMany({})
    })

    //@ts-ignore
    before(async () => {
        await Task.deleteMany({})
        await agent.post('/users/register').send(user)
            .then((res) => {
                userId = res.body._id
                console.log("user created")
            })
        await agent.post('/statuses').send(status)
            .then((res) => {
                statusId = res.body._id
                console.log("status created")
            })
    })

    describe('POST /tasks', () => {

        it("it should create the status", (done) => {
            agent.post('/tasks')
                .send({...task, status_id: statusId})
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.desc.should.be.eql(task.desc)
                    res.body.title.should.be.eql(task.title)
                    taskId = res.body._id
                    done()
                })
        })

        it("it should return error (invalid status_id)", (done) => {
            agent.post('/tasks')
                .send({...task, status_id: (statusId + 'a')})
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.errors[0].msg.should.be.eql('Invalid')
                    done()
                })
        })
    })

    describe("GET tasks/:id", () => {
        it('it should return task by id', (done) => {
            agent.get('/tasks/' + taskId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.title.should.be.eql(task.title)
                    res.body.user_id.should.be.eql(userId)
                    res.body.status_id.should.be.eql(statusId)
                    done()  
                })
        })
        it('it should return 404', (done) => {
            agent.get('/tasks/12345678901234567890abcp')
                .end((err, res) => {
                    res.should.have.status(404)
                    done()  
                })
        })
    })

    describe("GET tasks/", () => {
        it('it should return tasks', (done) => {
            agent.get('/tasks')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body[0].title.should.be.eql(task.title)
                    res.body[0].user_id.should.be.eql(userId)
                    res.body[0].status_id.should.be.eql(statusId)
                    done()  
                })
        })
        it('it should return 404', (done) => {
            agent.get('/tasks?status_id=12345678901234567890abcp')
                .end((err, res) => {
                    res.should.have.status(404)
                    done()  
                })
        })
        it('it should return tasks by status_id', (done) => {
            agent.get('/tasks?status_id=' + statusId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body[0].status_id.should.be.eql(statusId)
                    done()  
                })
        })
    })

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
                    res.should.have.status(200)
                    done()  
                })
        })
        it('it should return errors', (done) => {
            agent.put('/tasks/' + taskId)
                .send({
                    status_id: (statusId + 'a')
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.errors[0].msg.should.be.eql('Invalid')
                    done()  
                })
        })
        it('it should return task by id', (done) => {
            agent.get('/tasks/' + taskId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.title.should.be.eql(newTitle)
                    res.body.desc.should.be.eql(newDesc)
                    res.body.user_id.should.be.eql(userId)
                    res.body.status_id.should.be.eql(statusId)
                    done()  
                })
        })
    })

    describe("DELETE tasks/:id", () => {
        it('it should delete task', (done) => {
            agent.delete('/tasks/' + taskId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.message.should.be.eql("Deleted successful")
                    done()  
                })
        })
        it('it should return error', (done) => {
            agent.delete('/tasks/2dqw3xqw3dxqd5')
            .end((err, res) => {
                res.should.have.status(404)
                res.body.message.should.be.eql("404 not found")
                done()  
            })
        })
        it('it should return tasks ([])', (done) => {
            agent.get('/tasks')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.eql([])
                    done()  
                })
        })
    })
})