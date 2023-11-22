const express = require('express');
const router = express.Router();
const path = require("path");
const controllers = require("./../controller/book.controller");

router.get("/", (req, res) => {
    res.redirect("/my-books");
});
router.get("/:id", controllers.sendPage);


module.exports = router;