const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    roles: {
        type: Array,
        default: [1000]
    },

    books: Array
});

/*User: {
            type: Number,
            default: 1000
        },
        Editor: Number,
        Admin: Number*/

module.exports = mongoose.model("User", userSchema);