const {Schema, model, models} = require("mongoose");

const listSchema = new Schema(

    {
        name:{
            type: String,
            required: true,
        },

        favs:{
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