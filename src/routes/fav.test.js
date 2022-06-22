const req = require("supertest");
const jwt = require("jsonwebtoken");
const { connect, disconnected, cleanup } = require("../db");
const app = require("../app");
const User = require("../models/user.model");
const List = require("../models/list.model")
const Fav = require("../models/fav.model")

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


    it("should  create a fav", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const fav={title:"Item 1", description:"description item 1", link:"www.hola.com"}
        const res = await req(app).post(`/favs/${listcreated.body.data._id}`).send(fav).set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Fav created/i);
    });

    it("should  show all favs", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const fav={title:"Item 1", description:"description item 1", link:"www.hola.com"}
        const favCreated = await req(app).post(`/favs/${listcreated.body.data._id}`).send(fav).set("Authorization", `Bearer ${token}`);
        const res=await req(app).get(`/favs/list`).set("Authorization", `Bearer ${token}`)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Favs found/i);
    });

    it("should  show one fav", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const fav={title:"Item 1", description:"description item 1", link:"www.hola.com"}
        const favCreated = await req(app).post(`/favs/${listcreated.body.data._id}`).send(fav).set("Authorization", `Bearer ${token}`);
        const res=await req(app).get(`/favs/${favCreated.body.data._id}`).set("Authorization", `Bearer ${token}`)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Fav found/i);
    });

    it("should  update a fav", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const fav={title:"Item 1", description:"description item 1", link:"www.hola.com"}
        const favCreated = await req(app).post(`/favs/${listcreated.body.data._id}`).send(fav).set("Authorization", `Bearer ${token}`);
        const newFav={...fav, title:"Item 2", description:"description item 2", link:"www.hola2.com"}
        const res=await req(app).put(`/favs/update/${favCreated.body.data._id}`).send(newFav).set("Authorization", `Bearer ${token}`)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Fav updated/i);
    });

    it("should delete a fav", async () => {
        const list = { name: "List 1" };
        const listcreated = await req(app).post("/lists/").send(list).set("Authorization", `Bearer ${token}`);
        const fav={title:"Item 1", description:"description item 1", link:"www.hola.com"}
        const favCreated = await req(app).post(`/favs/${listcreated.body.data._id}`).send(fav).set("Authorization", `Bearer ${token}`);
        const res=await req(app).delete(`/favs/delete/${favCreated.body.data._id}`).set("Authorization", `Bearer ${token}`)
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Fav deleted/i);
    });
    
})
