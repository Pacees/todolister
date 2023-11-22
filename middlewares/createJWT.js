const jwt = require("jsonwebtoken");

const createJWT = async (user) => {

    return await jwt.sign(
        {
        email: user.email,
        roles: user.roles,
        books: user.books
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
    );

};

module.exports = createJWT;