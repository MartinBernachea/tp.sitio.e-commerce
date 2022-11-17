module.exports = (sequelize, dataTypes) => {
    const Producto = sequelize.define('Productos',{ 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type:  dataTypes.INTEGER
        },
        nombre: {
            allowNule: false,
            type: dataTypes.STRING
        },
        precio: {
            allowNule: false,
            type: dataTypes.DECIMAL
        },
        // creador_id: {
        
        // },
        imagen: {
            allowNule: false,
            type: dataTypes.STRING
        },
        fecha_creacion: {
            allowNule: false,
            type: dataTypes.DATE
        },
        fecha_modificacion: {
            allowNule: false,
            type: dataTypes.DATE
        },
        fecha_borrador:{
            allowNule: false,
            type: dataTypes.DATE
        },
        // Categoria_id:{

        // }
},{camelCase: false,
    timestamps: false,
    tableName: 'producto'});

    return Producto;
}