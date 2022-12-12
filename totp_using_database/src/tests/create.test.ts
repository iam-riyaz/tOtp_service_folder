// import { descrbe, expect, it, test } from "@jest/globals";
import { response } from "express";
import request from "superagent";
import supertest from "supertest";
import { app } from "../app";
import  {createServer} from "../utils/server"





describe("Create OTP and Resend otp ", () => {
   
    it("It should return response code 200 ", async()=>{
       const res= await  supertest(app).post("/v1/otp/createOtp").send({email:"riyaz@abc.com",phone:86869986})

       expect(res.statusCode).toEqual(200)
    })
    
  }); 