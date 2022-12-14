module.exports = (sequelize, dataTypes) => {
    const Genero = sequelize.define('genero', {
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
        tableName: 'genero',
        freezeTableName: true,
    });

    Genero.associate = function (models) {
        Genero.hasMany(models.producto, {
            foreignKey: "genero_id",
        }) 
    }

    return Genero;
}