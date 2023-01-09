import request from 'supertest';
import server from "../server";
import {v4 as uuidv4} from "uuid";

jest.mock('uuid', () => {
    return {
        v4: () => {
            return '12345';
        },
    }
});

describe("API", () => {
    afterAll(() => {
        server.close();
    });

    describe("set invalid url", () => {
        it("should return server error with message", async () => {
            const res = await request(server).get("/not-valid");
            expect(res.status).toBe(500);
            expect(res.body).toEqual({message: "Not found"});
        });
    });

    describe("GET /api/users", () => {
        it("should return an empty array when there are no users and status 200", async () => {
            const res = await request(server).get("/api/users");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe("POST /api/users", () => {
        const user = {
            id: uuidv4(),
            username: 'John',
            age: 30,
            hobbies: ['running', 'swimming']
        };

        it("should return user and status 201", async () => {
        const createResponse = await request(server).post('/api/users').send(JSON.stringify(user));
        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toEqual(JSON.stringify(user));
        });
    });
});