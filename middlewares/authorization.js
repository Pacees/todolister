const jwt = require("jsonwebtoken");

/*
1) Collect jwt token
2) verify jwt token
3) write decoded token infos to the request object
*/

const jwtDecoder = (req, res, next) => {

    let user;

    const token = req.cookies?.jwt;
    if(!token) {
        user = null;
        req.user = user;
        return next();
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if(err) {
            user = null;
            req.user = user;
            return next();
            };

            user = {
                email: decoded.email,
                roles: decoded.roles,
                books: decoded.books
            };

            req.user = user;

            return next();
        }
        );

};

const authRequired = (requiredRole) => {
    return (req, res, next) => {

        if(!req.user || !req.user.roles) return res.redirect("/login");

        const permissions = req.user.roles;
        if(permissions.indexOf(requiredRole) === -1) return res.send("You have no permission to view this page");
        next();


    }
}

module.exports = { jwtDecoder, authRequired };