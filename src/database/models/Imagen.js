module.exports = (sequelize, dataTypes) => {
    const Imagen = sequelize.define('imagen', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            allowNull: false,
            type: dataTypes.STRING
        },
        principal: {
            allowNull: false,
            type: dataTypes.INTEGER
        },
        producto_id: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    }, {
        camelCase: false,
        timestamps: false,
        freezeTableName: true,
        tableName: "imagen"
    });

    Imagen.associate = (models) => {
        Imagen.belongsTo(models.producto, {
            foreignKey: "producto_id"
        })
    }

    return Imagen;
}