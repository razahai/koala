const { Router } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const router = Router();

router.get("/login", (req, res) => {
    res.render("auth/login");
})

module.exports = {
    "name": "/auth",
    "router": router
}