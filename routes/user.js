
const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { getCurrentUser } = require("../utils/getCurrentUser");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/signup", (req, res) => {
    res.render("signup", {
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
        title: "Create User"
    })
});

router.post("/signup", async (req, res) => {
    const checkUser = await User.findOne({ username: req.body.username });
    if (checkUser) {
        res.status(409).json("Username is taken");
    } else {
        // const currentUsername = getCurrentUser(req);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            fullname: req.body.fullname,
            phone: req.body.phone,
            password: CryptoJs.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString(),
            roles: req.body.roles,
        });

        try {
            const savedUser = await newUser.save();

            res.redirect('/');
            //res.status(201).json(savedUser);
        } catch (err) {
            //res.status(500).json(err);
            res.redirect('/signup');
        }
    }
});

//LOGIN
router.get("/login", (req, res) => {
    res.render("login", {
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
        title: "Signin page"
    })
});
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user == null) {
            res.status(401).json("Wrong username");
        } else {
            const hashedPassword = CryptoJs.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            );
            const orginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
            //console.log(hashedPassword);
            //orginalPassword !== req.body.password && res.status(401).json("Incorrect password");
            if (orginalPassword !== req.body.password) {
                res.status(401).json("Incorrect password");
            } else {
                let payload = {
                    username: user.username,
                    userid: user._id,
                    roles: user.roles,
                };
                //create the access token with the shorter lifespan
                let accessToken = jwt.sign(payload, process.env.JWT_SEC, {
                    algorithm: "HS256",
                    expiresIn: "3d",
                });

                //var userRoles = user.roles;
                var userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

                req.session.accessToken = accessToken;

                const { password, ...others } = user._doc;
                const userData = { ...others };
                isAuthenticated = true;
                req.session.isAuthenticated = true;
                req.session.userRoles = userRoles;
                //res.status(200).json({ ...others, roles, accessToken });
                //res.redirect('/index');
                res.render("index", {
                    user: userData,
                    isAuthenticated: true,
                    userRoles: userRoles,
                    accessToken: accessToken
                })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGOUT
router.get('/logout', (req, res) => {
    // Clear the session data
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);

            // res.render("index", {
            //     isAuthenticated: req.session.isAuthenticated,
            //     userRoles: req.session.userRoles,
            //     title: "Home page"
            // })
        } else {
            // Redirect or handle logout success
            res.redirect('/'); // Redirect to login or any other appropriate page
        }
    });
});

module.exports = router;