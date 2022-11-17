module.exports = (sequelize, dataTypes) => {
    const Categoria = sequelize.define('Categorias',{ 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type:  dataTypes.INTEGER
        },
        nombre: {
            allowNule: false,
            type: dataTypes.STRING
        }
},{camelCase: false,
    timestamps: false,
    tableName: 'categoria'});

    return Categoria;
}