const { Router } = require("express");
const { authenticated } = require("../middleware/auth");
const pool = require("../init/db");

const router = Router();

router.get("/", authenticated, async (req, res) => {
    const query = "SELECT projects.* FROM users JOIN projects ON users.id = projects.user_id WHERE users.username = $1";
    const result = await pool.query(query, [req.user.username]);
    res.render("projects/dashboard", { authenticated: req.isAuthenticated(), projects: result.rows });
})

router.get("/create", authenticated, (req, res) => {
    res.render("projects/create_project", { authenticated: req.isAuthenticated() });
})

router.post("/create_project", authenticated, async (req, res) => {
    const { name, type, description } = req.body;
    const query = "INSERT INTO projects (user_id, name, type, description) VALUES ($1, $2, $3, $4)";
    await pool.query(query, [req.user.id, name, type, description]);
    res.redirect("/projects");
})

module.exports = {
    "name": "/projects",
    "router": router
}