function metodosPagoData(sequelize, Datatypes) {
    let a = "MetodosPago";

    let b = {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Datatypes.STRING,
            allowNull: false,
        },
    }

    // TODO: DEFINIR RELACION CON Local_id

    let c = {
        camelCase: false,
        timestamps: false,
    }

    return sequelize.define(a, b, c);
}

module.exports = metodosPagoData