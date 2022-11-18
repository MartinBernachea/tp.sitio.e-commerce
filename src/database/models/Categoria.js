module.exports = (sequelize, dataTypes) => {
    const Categoria = sequelize.define('categoria', {
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
        tableName: 'categoria',
        freezeTableName: true,
    });

    Categoria.associate = function (models) {
        Categoria.hasMany(models.producto, {
            foreignKey: "categoria_id"
        })
    }

    return Categoria;
}