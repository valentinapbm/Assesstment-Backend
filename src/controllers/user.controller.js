const User = require("../models/user.model");

const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

    //GET -READ
    async list(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users found", data: users });
    } catch (err) {
        res.status(404).json({ message: "Users not found" });
    }
    },
    //GET ID
    async show(req, res) {
        try {
            const id = req.user;
            const user = await User.findById(id)
            .select("-password")
            .populate({ path: 'listsfavs', select: 'name' })
            res.status(200).json(user);
        } catch (err) {
            res.status(404).json({ message: "can't show user" });
        }
        },

    //sing up-create
    async create(req, res) {
        try {
            const data = req.body;
            const encPassword = await bcrypt.hash(data.password, 8);
            const newUser = { ...data, password: encPassword };
            const user = await User.create(newUser);
    
            const token = jwt.sign(
            { id: user._id }, //Payload ó datos usuario
            process.env.SECRET_KEY, //llave secreta
            { expiresIn: 60 * 60 * 24 }
            );
            res.status(201).json({
            message: "user created",
            data: { token, name: user.name, email: user.email },
        });
        } catch (err) {
            res.status(400).json({ message: "user could not be created", data: err });
        }
    },


    //login post
    async signin(req, res) {
        try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("user or password invalid");
        }
    
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("user or password invalid");
        }
    
        const token = jwt.sign(
            { id: user._id }, //Payload ó datos usuario
            process.env.SECRET_KEY, //llave secreta
            { expiresIn: 60 * 60 * 24 }
        );
        res.status(201).json({ message: "user login successfully", data: { token} });
        } catch (err) {
        res.status(400).json({ message: "user cannot login", data:err });
        }
    },

    //update user
    async update(req, res) {
        try {
        const userId = req.user;
        const data = req.body;
        const encPassword = await bcrypt.hash(data.password, 8);
        const newUser = { ...data, password: encPassword };
        const user = await User.findByIdAndUpdate(userId, newUser, {
            new: true,
            runValidators: false,
            context: "query",
            })
            .select("-password")

            res.status(200).json({ message: "User updated", data:user});
        } catch (err) {
            res.status(400).json({ message: "User could not be updated", data: err });
        }
    },

    //delete user
    async destroy(req, res) {
        try {
        const userId = req.user;

        const user = await User.findByIdAndDelete(userId)
        .select("-password")
        res.status(200).json({ message: "User deleted", data: user });
    } catch (err) {
        res.status(400).json({ message: "User could not be deleted", data: err });
    }
    },





}