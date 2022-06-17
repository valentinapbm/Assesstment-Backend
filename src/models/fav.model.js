const {Schema, model, models} = require("mongoose");

const favSchema = new Schema(

    {
        title:{
            type: String,
            required: true,
            minlength: [10, "title too short"],
            maxlength: [50, "title too long"],
        },

        password: {
            type: String,
            required: true,
            minlength: [20, "description too short"],
            maxlength: [200, "description too long"],
        },

        link:{
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        list:{
            type: Schema.Types.ObjectId,
            ref: 'List',
        }

    },
    {
        timestamps: true,
    }
)

const Fav = model("Fav", favSchema);
module.exports = Fav;