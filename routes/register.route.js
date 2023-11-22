const express = require('express');
const router = express.Router();
const path = require("path");
const handleRegister = require("../controller/register.controller");

router.route("/")
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "..", "view", "register.html"));
    })
    .post(handleRegister);

module.exports = router;