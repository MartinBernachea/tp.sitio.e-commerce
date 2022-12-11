module.exports = (sequelize, dataTypes) => {
    const CategoriaProducto = sequelize.define('categoriaProducto', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
    }, {
        camelCase: false,
        timestamps: false,
        tableName: 'categoria_producto',
        freezeTableName: true,
    });

    CategoriaProducto.associate = function (models) {
        CategoriaProducto.belongsTo(models.categoria, {
            foreignKey: "categoria_id",
        })

        CategoriaProducto.belongsTo(models.producto, {
            foreignKey: "producto_id",
        })

    }

    return CategoriaProducto;
}