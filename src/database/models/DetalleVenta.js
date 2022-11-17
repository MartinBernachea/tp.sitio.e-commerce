module.exports = (sequelize, dataTypes) => {
    const detalleVenta = sequelize.define('DetallesVenta',{ 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type:  dataTypes.INTEGER
        },
        fecha_venta: {
            allowNule: false,
            type: dataTypes.DATE

        },
        // Metodo_pago_id:{

        // }
},{camelCase: false,
    timestamps: false,
    tableName: 'detalle_venta'});

    return detalleVenta;
}