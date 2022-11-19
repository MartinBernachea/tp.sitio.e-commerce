module.exports = (sequelize, dataTypes) => {
    const Producto = sequelize.define('producto', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            allowNule: false,
            type: dataTypes.STRING
        },
        precio: {
            allowNule: false,
            type: dataTypes.DECIMAL
        },
        // categoria: {
        //     allowNule: false,
        //     type:dataTypes.STRING
        // },
        imagen: {
            allowNule: false,
            type: dataTypes.STRING
        },
        fecha_creacion: {
            allowNule: false,
            type: dataTypes.DATE
        },
        fecha_modificacion: {
            allowNule: false,
            type: dataTypes.DATE
        },
        fecha_borrador: {
            allowNule: false,
            type: dataTypes.DATE
        },
    }, {
        camelCase: false,
        timestamps: false,
        tableName: 'producto',
        freezeTableName: true,
    });

    Producto.associate = (models) => {
        Producto.belongsTo(models.usuario, {
            foreignKey: "usuario_id"
        })

        Producto.hasMany(models.venta, {
            foreignKey: "producto_id"
        })

        Producto.belongsTo(models.categoria, {
            foreignKey: "categoria_id"
        })
    }

    return Producto;
}