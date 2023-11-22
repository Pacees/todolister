const Users = require("./../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res, next) => {

    // 1
    if(!req.body.email || !req.body.pwd) return res.status(400).json({"error": "Check if all fields had been filled"});

    // 2
    const foundUser = await Users.findOne( { email: req.body.email } ).exec();
    if(!foundUser) return res.sendStatus(401);

    // 3
    const match = await bcrypt.compare(req.body.pwd, foundUser.password);
    if(!match) return res.sendStatus(401);

    // 4
    const token = await jwt.sign(
        {
            email: foundUser.email,
            roles: foundUser.roles,
            books: foundUser.books
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    res.cookie('jwt', token , { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });


    // End
    res.redirect("/my-books")



}

module.exports = handleLogin; 