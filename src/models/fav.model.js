const {Schema, model, models} = require("mongoose");

const favSchema = new Schema(

    {
        title:{
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        link:{
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        list:{
            type: Schema.Types.ObjectId, 
            ref: "List",
            required: false,
        }

    },
    {
        timestamps: true,
    }
)

const Fav = model("Fav", favSchema);
module.exports = Fav;