const jjest = require("@jest/globals");
const RWA = require('../../models/RWA');
const app = require('../../server');
const request = require('supertest');

const path = '/api/auth/create-wallet';
let token = "";
const connectDatabase = require("../../config/mgdb");
const { connectXRPL } = require("../../config/xrplConnect");

jjest.describe("Creating Wallet", () => {
  jjest.beforeAll(async () => {
    console.log("Connections");
    try {
      connectXRPL().then(() => {
        console.log("Connected to XRPL i thing");
        connectDatabase().then(() => {
          console.log("Now connected to db bozzo");
        })

      });
    } catch (e) {
      console.log(`error : ${e}`);
    }
  });

  jjest.afterAll(async () => {
  });

  jjest.test("Success", async () => {

    //const response = await request(app).post(path + `/`).set('Authorization', 'Bearer ' + token);
    //jjest.expect(response.status).toEqual(200);
    //jjest.expect(response.body).toHaveProperty("success");
    //jjest.expect(response.body.success).toEqual(true);

  });
});

