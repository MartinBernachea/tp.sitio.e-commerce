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
        createdAt: {
            allowNull: false,
            type: dataTypes.DATE,
            defaultValue: dataTypes.NOW,
            field: "created_at",
        },
        updatedAt: {
            type: dataTypes.DATE,
            field: "updated_at",
            defaultValue: dataTypes.NOW,
            allowNull: false,
        },
        deletedAt: {
            type: dataTypes.DATE,
            field: "deleted_at",
            allowNull: true,
        },
        Categoria_id: {
            type:dataTypes.INTEGER,
            allowNull: false
        },
        creador_id: {
            type: dataTypes.INTEGER,
            allowNule: false
        }
    }, {
        camelCase: false,
        tableName: 'producto',
        freezeTableName: true,
    });

    Producto.associate = (models) => {
        Producto.belongsTo(models.usuario, {
            foreignKey: "creador_id"
        })

        Producto.hasMany(models.venta, {
            foreignKey: "producto_id"
        })

        Producto.belongsTo(models.categoria, {
            foreignKey: "categoria_id"
        })

        Producto.hasMany(models.imagen, {
            foreignKey: "producto_id"
        })
    }

    return Producto;
}