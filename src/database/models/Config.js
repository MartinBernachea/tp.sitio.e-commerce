module.exports = (sequelize, dataTypes) => {
    const Config = sequelize.define('config', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        nombre: {
            allowNull: false,
            type: dataTypes.STRING
        },
        valor: {
            allowNull: false,
            type: dataTypes.STRING
        },
        descripcion: {
            allowNull: false,
            type: dataTypes.STRING
        }
    }, {
        camelCase: false,
        timestamps: false,
        tableName: 'config',
        freezeTableName: true,
    });

    return Config;
}