const { json } = require("express");
const jwt = require("jsonwebtoken");

function getCurrentUser(req) {
    const authHeader = req.headers.token;
    var username = "";
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (!err) {
                username = user.username;
            }
        })
    } 

    return username;
}


module.exports = { getCurrentUser };