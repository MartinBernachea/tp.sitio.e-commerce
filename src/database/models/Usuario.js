function usuariosData(sequelize, Datatypes) {
    let a = "Usuarios";

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
        apellido: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        contra: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        admin: {
            type: Datatypes.BOOLEAN,
            allowNull: false,
        },
    }

    /* 
        TODO: DEFINIR RELACION CON 
        Local_id
     */

    let c = {
        camelCase: false,
        timestamps: false,
    }

    return sequelize.define(a, b, c);
}

module.exports = usuariosData