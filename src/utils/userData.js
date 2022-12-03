const getUserData = (req) => {
    if (!req) throw new Error("Para extraer la data del usuario es necesario tener el req")

    const userCookies = req.cookies?.user
    const userSession = req.session?.usuarioLogueado
    const userData = userCookies || userSession
    const userDataParsed = userData ? JSON.parse(userData) : null;
    return userDataParsed
}

module.exports = { getUserData }