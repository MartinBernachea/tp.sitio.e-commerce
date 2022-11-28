function usuarioData(sequelize, Datatypes) {
    let a = "usuario";

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
        password: {
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


    let c = {
        camelCase: false,
        timestamps: false,
        freezeTableName: true,
    }

    const Usuario = sequelize.define(a, b, c);

    Usuario.associate = (models) => {
        Usuario.belongsTo(models.local, {
            foreignKey: "local_id"
        })

        Usuario.hasMany(models.producto, {
            foreignKey: "usuario_id"
        })
    }

    return Usuario;
}

module.exports = usuarioData