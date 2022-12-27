import supertest from "supertest";
import { app } from "../app";

describe("Create OTP and Resend otp ", () => {
  it("It should return response code 200 ", async () => {
    const res = await supertest(app)
      .post("/v1/otp/createOtp")

      .send({ email: "riyaz@abc.com", phone: 86869986 });

    expect(res.statusCode).toEqual(200);
  });
});
