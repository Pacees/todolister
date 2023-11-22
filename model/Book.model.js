const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    todos: Array,
    completedTodos: Array

})

module.exports = mongoose.model("Book", bookSchema);