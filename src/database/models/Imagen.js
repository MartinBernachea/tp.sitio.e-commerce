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
            type: dataTypes.BOOLEAN,
        },
    }, {
        camelCase: false,
        timestamps: false,
        freezeTableName: true,
    });

    Imagen.associate = (models) => {
        Imagen.belongsTo(models.producto, {
            foreignKey: "producto_id",
        })
    }

    return Imagen;
}