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
    res.render("projects/create-project", { authenticated: req.isAuthenticated() });
})

router.post("/create-project", authenticated, async (req, res) => {
    const { name, type, description } = req.body;
    const query = "INSERT INTO projects (user_id, name, type, description) VALUES ($1, $2, $3, $4)";
    await pool.query(query, [req.user.id, name, type, description]);
    res.redirect("/projects");
})

router.post("/delete-project", authenticated, async (req, res) => {
    const { id } = req.body;
    let precheckQuery = "SELECT user_id FROM projects WHERE id = $1";
    let precheckResult = await pool.query(precheckQuery, [id]);

    if (!precheckResult || precheckResult.rows.length === 0) {
        res.json({
            success: false,
            error: `Couldn't find project ${id}, please contact administrators.`
        });
    }

    if (precheckResult.rows[0].user_id != req.user.id) {
        res.json({
            success: false,
            error: `You are not the owner of this project.`
        });
        return;
    }

    const query = "DELETE FROM projects WHERE id = $1 RETURNING name";
    const result = await pool.query(query, [id]); 
    if (!result || result.rows.length === 0) {
        res.json({
            success: false,
            error: `Couldn't delete project $${id}, please contact administrators.`
        });
    } else {
        res.json({
            success: true,
            project: result.rows[0]
        });
    }
})

router.get("/project/:id", authenticated, async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM projects WHERE id = $1";
    const result = await pool.query(query, [id]);
    const project = result.rows[0];
    
    if (
        (!result || result.rows.length === 0) ||
        (project.user_id != req.user.id)
    ) {
        res.redirect("/")
    }
    
    

    res.render("projects/editor", { authenticated: req.isAuthenticated(), project: project })
})

module.exports = {
    "name": "/projects",
    "router": router
}