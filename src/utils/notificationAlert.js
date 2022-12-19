/* Para obtener la notificacion creada */
const getNotificationAlert = (localsParams, req) => {
    if (req.session.notificationAlert) {
        localsParams.notificationAlert = req.session.notificationAlert;
        req.session.notificationAlert = null
    }

    return localsParams
}

/* Para crearla
    req.session.notificationAlert = {  }
 */

module.exports = {
    getNotificationAlert,
}