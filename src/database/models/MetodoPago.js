function MetodoPagoData(sequelize, Datatypes) {
    let a = "metodoPago";

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
    }

    let c = {
        camelCase: false,
        timestamps: false,
        freezeTableName: true,
        tableName: 'metodo_pago',
    }

    const MetodoPago = sequelize.define(a, b, c);

    MetodoPago.associate = (models) => {
        MetodoPago.hasMany(models.detalleVenta, {
            foreignKey: "metodo_pago_id"
        })
    }
    return MetodoPago
}

module.exports = MetodoPagoData