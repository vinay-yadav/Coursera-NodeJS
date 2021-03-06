const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        admin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model('User', userSchema);
