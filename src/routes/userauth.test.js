const req = require("supertest");
const jwt = require("jsonwebtoken");
const { connect, disconnected, cleanup } = require("../db");
const app = require("../app");
const User =require("../models/user.model")


describe("UserAuth", ()=>{
    let user;
    let token;
    beforeAll(async()=>{
        await connect();
    })
    beforeEach(async()=>{
        await cleanup();

        const usermockup={email:"test@test.com", password:"Password123@"}
        user= await User.create(usermockup);
        token = jwt.sign(
            { id: user._id }, //Payload ó datos usuario
            process.env.SECRET_KEY, //llave secreta
            { expiresIn: 60 * 60 * 24 }
            );

    })
    afterAll(async()=>{
        await disconnected();
    })

    it("should  show user if there is an authentication token", async () => {
        const res = await req(app).get("/users/getuser").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);   
        expect(res.body.email).toMatch(user.email);     
        
    });
    it("should update user if there is an authentication token", async () => {
        const newuser={...user, email:"test@test.com", password:"Password123@"}
        const res = await req(app).put("/users/update").send(newuser).set("Authorization", `Bearer ${token}`).set("Content-Type", "application/json");
        
        expect(res.statusCode).toBe(200);   
        expect(res.body.message).toMatch(/User updated/i);    
        
    });
    it("should delete user if there is an authentication token", async () => {
        const res = await req(app).delete("/users/delete").set("Authorization", `Bearer ${token}`);;

        expect(res.statusCode).toBe(200);   
        expect(res.body.message).toMatch(/User deleted/i);   
        
    });


})
