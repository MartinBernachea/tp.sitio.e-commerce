function ventaData(sequelize, Datatypes) {
    let a = "venta";

    let b = {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        monto_unitario: {
            type: Datatypes.DECIMAL,
            allowNull: false,
        },
    }

    let c = {
        camelCase: false,
        timestamps: false,
        freezeTableName: true,
    }

    const Venta = sequelize.define(a, b, c);

    Venta.associate = (models) => {
        Venta.belongsTo(models.local, {
            foreignKey: "local_id"
        })

        Venta.belongsTo(models.producto, {
            foreignKey: "producto_id"
        })

        
        Venta.belongsTo(models.detalleVenta, {
            foreignKey: "detalle_venta_id"
        })
    }

    return Venta
}

module.exports = ventaData