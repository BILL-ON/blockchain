
const jjest = require("@jest/globals");
const request = require('supertest');

const path = '/api/auth';

jjest.describe("", () => {
    let result = 4;
    jjest.beforeAll(async () => {
        console.log("Before All");
        result = 6;
    });

    jjest.afterAll(async () => {
        result = 7;
        console.log(`Res: ${result}`);
    });

    jjest.test("", async () => {
        jjest.expect(result).toEqual(6);
    });
});