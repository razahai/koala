const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.render("general/home", { authenticated: req.isAuthenticated() });
})

router.get("/about", (req, res) => {
    res.render("general/about", { authenticated: req.isAuthenticated() });
})

module.exports = {
    "name": "/",
    "router": router
}