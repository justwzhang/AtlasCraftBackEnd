const { MongoMemoryServer } = require('mongodb-memory-server');
const mockConnectDB = async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   useFindAndModify: false,
    });
};

const request = require('supertest');
const { app, server } = require('../index');
const mongoose = require('mongoose');
const User = require("../models/user-model");

jest.mock('../db', () => jest.fn(() => mockConnectDB()));

var mongod;

describe("All tests", () => {
    afterAll(async () => {
        try {
            await mongoose.connection.close();
            if (mongod) {
                await mongod.stop();
            }
            server.close();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    })
    test("should register a new user", async () => {
        // test register route
        let response = await request(app)
            .post("/api/register")
            .send({
                firstName: "Huga",
                lastName: "Mielaa",
                email: "hugmielaa@test.com",
                password: "hugapassword",
                passwordVerify: "hugapassword",
                username: "hugamiela"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        // test login route
        response = await request(app)
            .post("/api/login")
            .send({
                username: "hugamiela",
                password: "hugapassword"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    }, 60000);

    test("get topfivelist", () => {
        // mongo model User add some data
        // test app.get('.')
    });
});