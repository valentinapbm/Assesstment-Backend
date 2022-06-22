const User = require("../models/user.model");
const List = require("../models/list.model");
const Fav = require("../models/fav.model");


module.exports = {

    //GET -READ
    async list(req, res) {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const lists = await List.find({user: {$eq:user._id}})
        res.status(200).json({ message: "Lists found", data: lists });
    } catch (err) {
        res.status(404).json({ message: "Lists not found" });
    }
    },
    //GET ID
    async show(req, res) {
        try {
            const {listId}=req.params;
            const id = req.user;
            const user = await User.findById(id);

            const list = await List.findById(listId)
            .populate({ path: 'user', select: 'email' })
            .populate({ path: 'favs', select: 'title description link' })
            if(!list){
                throw new Error("List does not exist");
            }
            res.status(200).json({ message: "List found", data: list });
        } catch (err) {
            res.status(404).json(err);
        }
        },

    //create list post
    async create(req, res) {
            try{
                const id = req.user;
                const user = await User.findById(id);
                if(!user){
                    throw new Error("Invalid user");
                }
            const list = await List.create({...req.body, user: user._id})
            await user.listsfavs.push(list);
            await user.save({validateBeforeSave:false});
            res.status(201).json({ message: "List created", data: list });
        }catch (err) {
            res.status(400).json({ message: "List could not be created", data: err });
        }
    },

    //update list 
    async update(req, res) {
        try {
        const {listId}=req.params;
        const id = req.user;
        const user = await User.findById(id);
                
        const data = req.body;
        const list = await List.findByIdAndUpdate(listId, data,{
                new: true, 
                runValidators: false,
                context: "query",
                })
        if(!list){
                    throw new Error("List does not exist");
                }
        res.status(200).json({ message: "List updated", data:list});
        } catch (err) {
            res.status(400).json({ message: "List could not be updated", data: err });
        }
    },

    //delete list
    async destroy(req, res) {
        try {
            const {listId}=req.params;
            const id = req.user;
            const user = await User.findById(id);

            const list = await List.findByIdAndDelete(listId)
            if(!list){
                throw new Error("List does not exist");
            }

            const fav = await Fav.deleteMany({list: {$eq:listId}})
            user.listsfavs.toString().split(",").filter(item=> item !== listId)
            user.save({validateBeforeSave:false});

            res.status(200).json({ message: "List deleted", data:list});
            } catch (err) {
                res.status(400).json({ message: "List could not be deleted", data: err });
            }
        },

}