import request from 'supertest';
import app from '../index';
import {server} from "../index";

afterAll( () => {
     server.close();
});

//test '/demo'
describe("POST /demo", () => {
    test("should insert data into the table 'demo' successfully", async () => {
        const data = {
            uuid: "demo-test",
            event: "testEvent",
            event_data: "test",
            page_url: "https://example.com"
        }

        const response = await request(app)
            .post('/demo')
            .send(data)

        expect(response.status).toBe(200);
    })
})

describe('GET /demo', () => {
    test('should return a message', async () => {
        const response = await request(app).get('/demo');

        expect(response.status).toBe(200);
        expect(response.body).toBe('This is the demo API');
    });
});


//test 'baseInfo'
describe('POST /baseInfo', () => {
    test("should insert data into the table 'baseInfo' successfully", async () => {
        const data = {
            uuid: 'baseInfo-test',
            browser: 'Chrome',
            os: 'Windows',
            referrer: 'https://example.com',
        };

        const response = await request(app)
            .post('/baseInfo')
            .send(data)

        expect(response.status).toBe(200);
    })
})

describe('GET /baseInfo', () => {
    test('should return a message', async () => {
        const response = await request(app).get('/baseInfo');

        expect(response.status).toBe(200);
        expect(response.body).toBe('This is the baseInfo API');
    });
});


//test '/error'
describe('POST /error', () => {
    test("should insert data into the table 'error' successfully", async () => {
        const data = {
            uuid: 'error-test',
            message: 'test',
            stack: 'test',
            type: 'test',
            page_url: "https://example.com",
        };

        const response = await request(app)
            .post('/error')
            .send(data)

        expect(response.status).toBe(200);
    })
})

describe('GET /error', () => {
    test('should return a message', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(200);
        expect(response.body).toBe('This is the error logging API');
    });
});


//test '/timing'
describe('POST /timing', () => {
    test("should insert data into the table 'timing' successfully", async () => {
        const data = {
            uuid: 'timing-test',
            event: 'testEvent',
            page_url: 'https://example.com',
            FP: 1000,
            DCL: 2000,
            L: 3000,
        };

        const response = await request(app)
            .post('/timing')
            .send(data)

        expect(response.status).toBe(200);
    })
})

describe('GET /timing', () => {
    test('should return a message', async () => {
        const response = await request(app).get('/timing');

        expect(response.status).toBe(200);
        expect(response.body).toBe('This is the timing API');
    });
});
