const Users = require("./../model/User.model");
const bcrypt = require("bcrypt");

/* Register steps
1) Check if all fields had been filled
2) Check for duplicated users
3) Encrypt pwd with bcrypt
4) Save user to database
*/

const handleRegister = async (req, res, next) => {

    // 1
    if(!req.body.email || !req.body.pwd) return res.status(400).json({"error": "Check if all fields had been filled"});

    // 2
    const duplicated = await Users.findOne({ email: req.body.email });
    if(duplicated) return res.sendStatus(409);

    // 3
    const hashedPwd = await bcrypt.hash(req.body.pwd, 10);

    // 4
    await Users.create({
        "email": req.body.email,
        "password": hashedPwd
    });

    // End
    res.sendStatus(201);

};

module.exports = handleRegister;
