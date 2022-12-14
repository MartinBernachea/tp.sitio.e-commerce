module.exports = (sequelize, dataTypes) => {
    const Marca = sequelize.define('marca', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            allowNull: false,
            type: dataTypes.STRING
        }
    }, {
        camelCase: false,
        timestamps: false,
        tableName: 'marca',
        freezeTableName: true,
    });

    Marca.associate = function (models) {
        Marca.hasMany(models.producto, {
            foreignKey: "marca_id",
        }) 
    }

    return Marca;
}