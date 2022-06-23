const {Schema, model, models} = require("mongoose");
const List =require("./list.model")
const Fav =require("./fav.model")

const emailRegex = new RegExp("[a-z0-9._-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[.])+[a-z0-9]{2,}");
const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

const userSchema = new Schema(

    {
        email:{
            type: String,
            required: true,
            match: [emailRegex, "invalid email"],
            validate: [{
                validator(value) {
                    return models.User.findOne({ email: value })
                        .then((user) => !user)
                        .catch(() => false)
                },
                message: "email already exist",
            }]
        },

    password: {
        type: String,
        required: true, 
        match:[regex, "password must have at least 8 characteres, 1 uppercase, 1 number, 1 lowercase and optional a special character"]
    }
    ,

    listsfavs:{
        type: [{ type: Schema.Types.ObjectId, ref: "List" }],
    },

    }, 
    {
        timestamps: true,
    }
)

const User = model("User", userSchema);
module.exports = User;
