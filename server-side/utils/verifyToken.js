// utils/verifyToken.js

// import jwt form jsonwebtoken
const jwt = require('jsonwebtoken');

// Verify Token
const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(401).json({ message: "You're not Authorize" });
    }

    // if token is exist then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err){
            return res.status(401).json({ message: "Token is Invalid"});
        }

        req.user = user;
        next();
    })
};

// Verify User Token
const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.role === "admin"){
            next();
        }else{
            return res.status(401).json({ message: "You're not Authenticated"});
        }
    });
};

// Verify Admin Token
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.role === "admin"){
            next();
        }else{
            return res.status(401).json({ message: "You're not Authorize"});
        }
    });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };