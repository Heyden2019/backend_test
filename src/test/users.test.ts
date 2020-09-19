process.env.NODE_ENV = 'test'
process.env.PORT = "3006"

import User from "../models/User"
import app from "../index"
import chai from "chai"
import chaiHttp from "chai-http"

//@ts-ignore
let should = chai.should()

chai.use(chaiHttp)
const agent = chai.request.agent(app)

describe('Users', () => {
    //@ts-ignore
    after(async () => {
        await User.deleteMany({})
    })
    //@ts-ignore
    before(done => {
        console.log("clearing db")
        User.deleteMany({}, err => {
            done()
        })
    })

    const user = {
        firstName: "firstName",
        lastName: "lastName",
        email: "qwerty@mail.com",
        password: "123qwe123"
    }
    const newPassword = "qwe123qwe"
    const newFirstName = "newFirstName"

    let userId: any

    describe('POST /users/register', () => {

        it("it should create the user", (done) => {
            agent
                .post('/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.have.property('firstName')
                    res.body.should.have.property('lastName')
                    res.body.should.have.property('email')
                    res.body.should.not.have.property('password')
                    userId = res.body._id
                    done()
                })
        })
        it("it should return status(400) (Email already exist)", (done) => {
            agent
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.errors[0].msg.should.be.eql("Email already exist")
                done()
            })
        })
    })

    describe('GET /users', () => {
        it("it should get 1 user", (done) => {
            agent
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.length.should.be.eql(1)
                    res.body[0].should.not.have.property('password')
                    res.body[0].email.should.be.eql(user.email)
                    done()
                })
        })
    })

    describe('GET /users/me GET /users/logout POST /users/login', () => {
        it("it should return 'me'", done => {
            agent
                .get('/users/me')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    res.body.email.should.be.eql(user.email)
                    done()
                })
        })
        it("it should delete cookies", done => {
            agent
                .get('/users/logout')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.message.should.be.eql('Logout success')
                    done()
                })
        })
        it("it should not return 'me'", done => {
            agent
                .get('/users/me')
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
        it("it should not login user (wrong password)", done => {
            agent
                .post('/users/login')
                .send({
                    email: user.email,
                    password: "wqdqwdds"
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
        it("it should login user", done => {
            agent
                .post('/users/login')
                .send({
                    email: user.email,
                    password: user.password
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    done()
                })
        })
        it("it should return 'me'", done => {
            agent
                .get('/users/me')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    res.body.email.should.be.eql(user.email)
                    done()
                })
        })
    })

    describe('GET /users/:id', () => {
        it("it should return user by id", done => {
            agent
                .get('/users/' + userId )
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    res.body.email.should.be.eql(user.email)
                    done()
                })
        })
        it("it should return error 404", done => {
            agent
                .get('/users/12345678901234567890abcabc' )
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.message.should.be.eql('404 not found')
                    done()
                })
        })
        it("it should return error 404 (#2)", done => {
            agent
                .get('/users/a' + userId )
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.message.should.be.eql('404 not found')
                    done()
                })
        })
    })

    describe('PUT /users', () => {
        it("it should change password and firstName", done => {
            agent
                .put('/users')
                .send({
                    password: newPassword,
                    firstName: newFirstName
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    done()
                })
        })
        it("it should return new 'me'", done => {
            agent
                .get('/users/me')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.not.have.property('password')
                    res.body.email.should.be.eql(user.email)
                    res.body.firstName.should.be.eql(newFirstName)
                    done()
                })
        })
        it("it should not change password and firstName", done => {
            agent
                .put('/users')
                .send({
                    password: "12345",
                    firstName: newFirstName
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('DELETE /users', () => {
        it("it should delete user", done => {
            agent
                .delete('/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.message.should.be.eql('You were deleted successful')
                    done()
                })
        })
        it("it should get no users", (done) => {
            agent
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.length.should.be.eql(0)
                    done()
                })
        })  
    })
})