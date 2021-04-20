const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;


const promotionSchema = Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        lable: {
            type: String,
            default: ""
        },
        price: {
            type: Currency,
            required: true,
            min: 0
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)


module.exports = Promotions = mongoose.model('Promotion', promotionSchema);
