function ventasData(sequelize, Datatypes) {
    let a = "Ventas";

    let b = {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        monto_unitario: {
            type: Datatypes.STRING,
            allowNull: false,
        },
    }

    /* 
         TODO: DEFINIR RELACION CON:
         Detalle_Venta_id
         Producto_id
         Local_id
     */

    let c = {
        camelCase: false,
        timestamps: false,
    }

    return sequelize.define(a, b, c);
}

module.exports = ventasData