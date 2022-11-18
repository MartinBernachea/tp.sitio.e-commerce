function localData(sequelize, Datatypes) {
    let a = "local";

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
        freezeTableName: true,
    }

    const Local = sequelize.define(a, b, c);

    Local.associate = (models) => {
        Local.hasMany(models.venta, {
            foreignKey: "local_id"
        })

        Local.hasMany(models.usuario, {
            foreignKey: "local_id"
        })
    }

    return Local
}

module.exports = localData