const { Router } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const pool = require("../init/db"); 
const { anonymous, authenticated } = require("../middleware/auth");

const router = Router();

passport.use(new LocalStrategy(async (username, password, cb) => {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (!result || result.rows.length === 0)
        return cb(null, false, { message: "Incorrect username or password!" });

    const hashedPwd = Buffer.from(result.rows[0].pwd).toString("ascii");
    bcrypt.compare(password, hashedPwd, (err, res) => {
        if (err) return cb(err);
        if (!res) return cb(null, false, { message: "Incorrect username or password!" });
        return cb(null, result.rows[0]);
    })
}))

passport.serializeUser((user, cb) => {
    cb(null, { id: user.id, username: user.username });
})

passport.deserializeUser((user, cb) => {
    return cb(null, user);
})

router.get("/login", anonymous, (req, res) => {
    res.render("auth/login", { messages: req.session.messages, authenticated: req.isAuthenticated() });
})

router.get("/signup", anonymous, (req, res) => {
    res.render("auth/signup", { authenticated: req.isAuthenticated() });
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login",
    failureMessage: true
}))

router.post("/logout", authenticated, (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/");
    });
})

router.post("/signup", anonymous, async (req, res, next) => {
    const { username, pwd } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);
    
    const query = "INSERT INTO users (username, pwd) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [username, hashedPwd]);

    if (!result || result.rows.length === 0) 
        return next("PostgreSQL error! Please contact the owner or view the logs.");

    req.login(result.rows[0], (err) => {
        if (err) return next(err);
        res.redirect("/");
    })
})

module.exports = {
    "name": "/",
    "router": router
}