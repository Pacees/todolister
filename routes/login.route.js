const express = require('express');
const router = express.Router();
const path = require("path");
const loginHandler = require("./../controller/login.controller");

router.route("/")
    .get((req,res) => {
        res.sendFile(path.join(__dirname, "..", "view", "login.html"));
    })
    .post(loginHandler);

module.exports = router;