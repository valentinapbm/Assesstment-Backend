const User = require("../models/user.model");
const List = require("../models/list.model");
const Fav = require("../models/fav.model")


module.exports = {

    //GET -READ
    async list(req, res) {
    try {
        const id = req.user;
        const user = await User.findById(id);

        const favs = await Fav.find({user: {$eq:user._id}})
        res.status(200).json({ message: "Favs found", data: favs });
    } catch (err) {
        res.status(404).json({ message: "Fav not found" });
    }
    },
    //GET ID
    async show(req, res) {
        try {
            const {favId}=req.params;
            const id = req.user;
            const user = await User.findById(id);

            const fav = await Fav.findById(favId)
            .populate({ path: 'user', select: 'email' })
            .populate({ path: 'list', select: 'name' })

            res.status(200).json({ message: "Fav found", data: fav });
        } catch (err) {
            res.status(404).json(err);
        }
        },

    //create fav
    async create(req, res) {
            try{
                const id = req.user;
                const user = await User.findById(id);

                const {listId}=req.params;

                const list = await List.findById(listId)

                const fav = await Fav.create({...req.body, user: user._id, list:list._id});
                

                await list.favs.push(fav);
                await list.save({validateBeforeSave:false});
            res.status(201).json({ message: "Fav created", data: fav });
        }catch (err) {
            res.status(400).json({ message: "Fav could not be created", data: err });
        }
    },

    //update list 
    async update(req, res) {
        try {
        const {favId}=req.params;
        const id = req.user;
        const user = await User.findById(id);

        const data = req.body;
        const fav = await Fav.findByIdAndUpdate(favId, data,{
                new: true, 
                runValidators: false,
                context: "query",
                })

        res.status(200).json({ message: "Fav updated", data:fav});
        } catch (err) {
            res.status(400).json({ message: "Fav could not be updated", data: err });
        }
    },

    //delete user
    async destroy(req, res) {
        try {
        const id = req.user;
        const user = await User.findById(id);

        const {favId}=req.params;
        const fav = await Fav.findByIdAndDelete(favId)
        const listId= fav.list

        const list = await List.findById(listId);  
        await list.favs.filter((item)=>{
            item._id.toString() !== favId
        })
        await list.save({validateBeforeSave:false});
        res.status(200).json({ message: "Fav deleted", data: fav });
    } catch (err) {
        res.status(400).json({ message: "Fav could not be deleted", data: err });
    }
    },

}