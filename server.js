const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 80;
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { jwtDecoder, authRequired } = require("./middlewares/authorization");



// DB Connection
const mongoose = require("mongoose");
const connectDB = require("./config/db.config");
connectDB();

// middlewares
app.use(require("cors")());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(jwtDecoder);

// Serve Static Files
app.use('/', express.static(path.join(__dirname, 'view', "public")));

app.get("/", (req, res) => {
    res.redirect("/my-books")
});

app.use("/login", require("./routes/login.route"));
app.use("/register", require("./routes/register.route"));

app.get("/my-books", authRequired(1000), (req, res) => {
    res.sendFile(path.join(__dirname, "view", "my-books.html"));
});

app.get("/settings", authRequired(1000), (req, res) => {
    res.sendFile(path.join(__dirname, "view", "settings.html"))
})

app.use("/book", authRequired(1000), require("./routes/book.route"));


// Requests using javascript in client
app.use("/operations", authRequired(1000), require("./routes/operations.route"));

app.get("/*", (req, res) => {
    res.redirect("/my-books");
});


mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log("Server Running on PORT", PORT));
});