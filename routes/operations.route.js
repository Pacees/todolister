const express = require('express');
const router = express.Router();
const path = require("path");
const controllers = require("../controller/operations.controller");

router.get("/get-user-email", controllers.getUserEmail)
router.get("/books", controllers.sendAllBooks);
router.post("/create-book", controllers.createBook);
router.get("/logout", controllers.logOut);

router.route("/books/:id")
    .get(controllers.sendById)
    .put(controllers.updateBook)
    .delete(controllers.deleteBook);

router.delete("/books/:id/todos", controllers.deleteTodos);

module.exports = router;