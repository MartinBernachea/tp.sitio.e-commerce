function localesData(sequelize, Datatypes) {
    let a = "Locales";

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
        telefono: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        direccion: {
            type: Datatypes.STRING,
            allowNull: false,
        },
    }

    let c = {
        camelCase: false,
        timestamps: false,
    }

    return sequelize.define(a, b, c);
}

module.exports = localesData