const express = require("express");
const path = require("path");
const app = express();

const applyRoutes = require("./routing");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")))
app.set("view engine", "ejs");

applyRoutes(app);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Express server spinning up!`);
});