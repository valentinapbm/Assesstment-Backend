const req = require("supertest");
const jwt = require("jsonwebtoken");
const { connect, disconnected, cleanup } = require("../db");
const app = require("../app");
const User =require("../models/user.model");
const List = require("../models/list.model")

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

    it("should not create a list if user is not authenticated", async () => {
        const list = { name: "List 1" };
        const res = await req(app).post("/lists/").send(list);
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/expired session auth/i);
    });
    it("should not create a list if user is not authenticated", async () => {
        const list = { name: "List 1" };
        const res = await req(app).post("/lists/").send(list).set("Authorization", `Bearer `);;
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/expired session token/i);
    });
    it("should  create a list", async () => {
        const list = { name: "List 1" };
        const res = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/List created/i);
    });
    it("should show all lists", async () => {

        const res = await req(app).get("/lists/lists").set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Lists found/i);
    });

    it("should  show a list", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const res = await req(app).get(`/lists/lists/${listcreated.body.data._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List found/i);
    });

    it("should  update a list", async () => {
        let list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const newList={...list, name:"List 1 update"}
        const res = await req(app).put(`/lists/update/${listcreated.body.data._id}`).send(newList).set("Authorization", `Bearer ${token}`).set("Content-Type", "application/json");;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List updated/i);
    });
    it("should  delete a list", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const res = await req(app).delete(`/lists/delete/${listcreated.body.data._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/List deleted/i);
    });

})
