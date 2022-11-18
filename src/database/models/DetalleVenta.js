module.exports = (sequelize, dataTypes) => {
    const DetalleVenta = sequelize.define('detalleVenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        fecha_venta: {
            allowNule: false,
            type: dataTypes.DATE
        },
    }, {
        camelCase: false,
        timestamps: false,
        tableName: 'detalle_venta',
        freezeTableName: true,
    });

    DetalleVenta.associate = (models) => {
        DetalleVenta.hasMany(models.venta,{
            foreignKey: "detalle_venta_id"
        })

        DetalleVenta.belongsTo(models.metodoPago, {
            foreignKey: "metodo_pago_id"
        })
    }

    return DetalleVenta;
}