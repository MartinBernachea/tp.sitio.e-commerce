const { getUserData } = require("../utils/userData");

const adminPermissions = (req, res, next) => {
    const userData = getUserData(req)

    if (userData) {
        if (userData.admin) return next()
    }
    res.redirect("/");
}

const superPermissions = (req, res, next) => {
    const userData = getUserData(req)

    if (userData) {
        if (userData.super) return next()
    }
    res.redirect("/");
}

const userPermissions = (req, res, next) => {
    const userData = getUserData(req)

    if (userData) {
        return next()
    }
    res.redirect("/");
}

const noUserPermissions = (req, res, next) => {
    const userData = getUserData(req)

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
}