const path = require("path");

const sendPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "view", "book.html"));
}

module.exports = { sendPage };