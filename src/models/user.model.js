const {Schema, model, models} = require("mongoose");

const emailRegex = new RegExp(
    "[a-z0-9._-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[.])+[a-z0-9]{2,}"
);
const passRegex = new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

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
        match: [passRegex, "Password must have 8 characteres, at least 1 number, 1 uppercase, 1 lowercase and 1 special character"]
    },

    listsfavs:{
        type: [{ type: Schema.Types.ObjectId, ref: "List" }],
        required: false,
    },

    }, 
    {
        timestamps: true,
    }
)

const User = model("User", userSchema);
module.exports = User;
