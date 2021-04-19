const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        auther: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        comments: [ commentSchema ]
    },
    {
        timestamps: true
    }
);


module.exports = Dishes = mongoose.model('Dish', dishSchema);
