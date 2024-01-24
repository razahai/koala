function anonymous(req, res, next) {
    if (req.user) {
        res.redirect("/");
    } else {
        next();
    }
}

function authenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = {
    "anonymous": anonymous,
    "authenticated": authenticated,
}