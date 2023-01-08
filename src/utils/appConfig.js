const db = require("../database/models");

const getAppConfig = async () => {

    const appConfig = await db.config.findAll();
    let appConfigFormated = {}

    appConfig.forEach(ctConfig => {
        const ctConfigFormated = {
            [ctConfig.dataValues.nombre]: ctConfig.dataValues
        }
        appConfigFormated = { ...appConfigFormated, ...ctConfigFormated }
    })

    return appConfigFormated
}

module.exports = { getAppConfig }



