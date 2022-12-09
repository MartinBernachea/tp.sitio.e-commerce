const { getUserDataParsed } = require("../utils/userData");

const adminPermissions = (req, res, next) => {
    const userData = getUserDataParsed(req)

    if (userData) {
        if (userData.admin) return next()
    }
    res.redirect("/");
}

const superPermissions = (req, res, next) => {
    const userData = getUserDataParsed(req)
    if (userData) { if (userData.super) return next() }
    res.redirect("/");
}

const superPermissionsJSON = (req, res, next) => {
    const userData = getUserDataParsed(req)
    if (userData) { if (userData.super) return next() }
    res.status(401).json({ status: 401, message: "No tienes permisos suficientes" });
}

const userPermissions = (req, res, next) => {
    const userData = getUserDataParsed(req)

    if (userData) {
        return next()
    }
    res.redirect("/");
}

const noUserPermissions = (req, res, next) => {
    const userData = getUserDataParsed(req)

    if (userData) {
        res.redirect("/");
    }
    return next()
}


module.exports = {
    adminPermissions,
    superPermissions,
    userPermissions,
    noUserPermissions,
    superPermissionsJSON,
}