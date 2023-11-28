require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require('path');
const routes = require("./routes/routes");
const experienceRoute = require("./routes/experience");
const userRoute = require("./routes/user");
const contactRoute = require("./routes/contact.route");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database"));

// middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set template engine 
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Serve static files from 'assets', 'css', 'js' folders within 'views'
app.use('/assets', express.static(path.join(__dirname, 'views', 'client_side','assets')));
app.use('/css', express.static(path.join(__dirname, 'views', 'client_side','css')));
app.use('/js', express.static(path.join(__dirname, 'views', 'client_side','js')));
app.use("/uploads", express.static(path.join(__dirname, '/uploads')))



// app.get("/", (req, res) => {
//     res.send("Hello world");
// });

// route prefix 
app.use("", routes)
app.use("", experienceRoute)
app.use("", userRoute)
app.use("", contactRoute)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})