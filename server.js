const express = require("express");
const path = require("path");
const passport = require("passport");
const logger = require("morgan");
const session = require("express-session");
const app = express();

const applyRoutes = require("./routing");

app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")))
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
    // TODO: add redis session store 
}));
app.use(passport.authenticate("session"));

applyRoutes(app);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Express server spinning up!`);
});