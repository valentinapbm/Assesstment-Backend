const req = require("supertest");
const { connect, disconnected, cleanup } = require("../db");
const app = require("../app");
const User =require("../models/user.model")


describe("User", ()=>{
    beforeAll(async()=>{
        await connect();
    })
    beforeEach(async()=>{
        await cleanup();
    })
    afterAll(async()=>{
        await disconnected();
    })

    it("should create a user /sign up", async ()=>{
        const user = {email:"test@test.com", password:"Password123@"};
        const res= await req(app).post("/users/singup").send(user)

        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data.token).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        );
    });
    it("should not create a user when there is no an email", async ()=>{
        const user = { password:"Password123@"};
        const res= await req(app).post("/users/singup").send(user)
        expect(res.statusCode).toBe(400);
        expect(res.body.data.message).toMatch(/User validation failed: email: Path `email` is required./i);
    });
    it("should not create user when email is invalid", async () => {
        const user = {email:"test", password:"Password123@"};
        const res= await req(app).post("/users/singup").send(user)

        expect(res.statusCode).toBe(400);
        expect(res.body.data.message).toMatch(/invalid email/i);
    });

    it("should not create user when email already exists", async () => {
        const user = {email:"test@test.com", password:"Password123@"};
        await User.create(user);
        const res = await req(app).post("/users/singup").send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body.data.message).toMatch(/User validation failed: email: email already exist/i);
    });

    it("should login user correctly", async () => {
        const user = {email:"test@test.com", password:"Password123@"};
        await req(app).post("/users/singup").send(user)
        const res = await req(app).post("/users/login").send(user);
    
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty("token");
    });
    
    it("should not login if incorrect password", async () => {
        const user = {email:"test@test.com", password:"Password123@"};
        await User.create(user);
    
        const res = await req(app)
        .post("/users/login")
        .send({ ...user, password: "1" });
    
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/user cannot login/i);
    });
    
    it("should not login user if email does not exist", async () => {
        const user = {email:"test@test.com", password:"Password123@"};
        const res = await req(app).post("/users/login").send(user);
    
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/user cannot login/i);
    });

    it("should list users", async () => {
        const user = {email:"test@test.com", password:"Password123@"};
        await req(app).post("/users/singup").send(user)
        const res = await req(app).get("/users/");
        
        expect(res.statusCode).toBe(200);   
        expect(res.body.message).toMatch(/users found/i);     
        
    });
    it("should not show user if there is no authentication token", async () => {
        const res = await req(app).get("/users/getuser");
        
        expect(res.statusCode).toBe(401);   
        expect(res.body.message).toMatch(/expired session auth/i);     
        
    });
    
    it("should not update user if there is no authentication token", async () => {
        let user = {email:"test@test.com", password:"Password123@"};
        await req(app).post("/users/singup").send(user)
        await req(app).post("/users/login").send(user);
        user = {email:"test1@test.com", password:"Password123@"}
        const res = await req(app).put("/users/update").send(user);
        
        expect(res.statusCode).toBe(401);   
        expect(res.body.message).toMatch(/expired session auth/i);  
        
    });
    it("should not delete user if there is no authentication token", async () => {
        const res = await req(app).delete("/users/delete");
        
        expect(res.statusCode).toBe(401);   
        expect(res.body.message).toMatch(/expired session auth/i);   
        
    });


})
