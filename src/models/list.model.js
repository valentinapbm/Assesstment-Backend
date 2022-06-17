const {Schema, model, models} = require("mongoose");

const listSchema = new Schema(

    {
        name:{
            type: String,
            required: true,
            minlength: [10, "name too short"],
            maxlength: [50, "name too long"],
        },

        items:{
            type: [{ type: Schema.Types.ObjectId, ref: "Fav" }],
            required: false,
        },


        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

const List = model("List", listSchema);
module.exports = List;