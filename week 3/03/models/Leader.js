const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = Schema(
    {
        name: {
            type: String,
            unique: true,
            reuired: true
        },
        image: {
            type: String,
            reuired: true
        },
        designation: {
            type: String,
            reuired: true
        },
        abbr: {
            type: String,
            reuired: true
        },
        description: {
            type: String,
            reuired: true
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)


module.exports = Leader = mongoose.model('Leader', leaderSchema);
