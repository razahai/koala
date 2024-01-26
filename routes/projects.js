const { Router } = require("express");
const { authenticated } = require("../middleware/auth");
const pool = require("../init/db");
const { readFile, createFile, deleteFile, updateFile } = require("../runner/files");
const { compileFlutter } = require("../runner/compile");

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
    const query = "INSERT INTO projects (user_id, name, type, description) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await pool.query(query, [req.user.id, name, type, description]);
    await createFile(`${req.user.id}-${result.rows[0].id}.dart`);
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
        await deleteFile(`${req.user.id}-${id}.dart`);
        res.json({
            success: true
        });
    }
})

router.get("/project/:id(\\d+)", authenticated, async (req, res) => {
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
    
    const content = await readFile(`${req.user.id}-${id}.dart`);

    res.render("projects/editor", { authenticated: req.isAuthenticated(), project: project, file: content })
})

router.post("/project/:id/update", authenticated, async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    const query = "SELECT user_id FROM projects where id = $1";
    const result = await pool.query(query, [id]);

    if (
        (!result || result.rows.length === 0) ||
        (result.rows[0].user_id != req.user.id) 
    ) {
        res.json({
            "success": false,
            "error": "You do not have permission to update this project."
        });
    }

    try {
        await updateFile(`${req.user.id}-${id}.dart`, code);
        res.json({
            "success": true
        });
    } catch (err) {
        res.json({
            "success": false,
            "error": err
        });
    }
})

router.post("/project/:id/compile", authenticated, async (req, res) => {
    const { id } = req.params;
    const query = "SELECT user_id FROM projects where id = $1";
    const result = await pool.query(query, [id]);

    if (
        (!result || result.rows.length === 0) ||
        (result.rows[0].user_id != req.user.id) 
    ) {
        res.json({
            "success": false,
            "error": "You do not have permission to compile this project."
        });
    }

    const { flutterJS, mainDartJS } = await compileFlutter(`${req.user.id}-${id}.dart`);
    res.json({
        "success": true,
        "flutterJS": flutterJS,
        "mainDartJS": mainDartJS
    })    
})

module.exports = {
    "name": "/projects",
    "router": router
}