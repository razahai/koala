const path = require("path");
const { glob } = require("glob");

async function applyRoutes(app) {
    const files = await glob(["routes/*.js", "routes/**/*.js"]);
    
    files.forEach(file => {
        const { name, router } = require(path.join(__dirname, file));
        app.use(name, router); 
    })
}

module.exports = applyRoutes;