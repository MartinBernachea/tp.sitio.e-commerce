const db = require("../models");

const generarOrderTablaProducto = (order) => {
    switch (order) {
        case "id_asc":
            return [["id", "ASC"]];

        case "id_desc":
            return [["id", "DESC"]];

        case "nombre_asc":
            return [["nombre", "ASC"], ["id", "ASC"]];

        case "nombre_desc":
            return [["nombre", "DESC"], ["id", "ASC"]];

        case "precio_asc":
            return [["precio", "ASC"], ["id", "ASC"]];

        case "precio_desc":
            return [["precio", "DESC"], ["id", "ASC"]];

        case "categoria_asc":
            return [[db.categoria, "nombre", "ASC"], ["id", "ASC"]];

        case "categoria_desc":
            return [[db.categoria, "nombre", "DESC"], ["id", "ASC"]];

        case "genero_asc":
            return [[db.genero, "nombre", "ASC"], ["id", "ASC"]];

        case "genero_desc":
            return [[db.genero, "nombre", "DESC"], ["id", "ASC"]];

        case "marca_asc":
            return [[db.marca, "nombre", "ASC"], ["id", "ASC"]];

        case "marca_desc":
            return [[db.marca, "nombre", "DESC"], ["id", "ASC"]];

        case "createdAt_asc":
            return [["createdAt", "ASC"], ["id", "ASC"]];

        case "createdAt_desc":
            return [["createdAt", "DESC"], ["id", "ASC"]];

        case "usuario_asc":
            return [[db.usuario, "nombre", "ASC"], [db.usuario, "apellido", "ASC"], ["id", "ASC"]];

        case "usuario_desc":
            return [[db.usuario, "nombre", "DESC"], [db.usuario, "apellido", "DESC"], ["id", "ASC"]];

        default:
            return [["id", "ASC"]];
    }
}

const generarOrderGenericoIdNombre = (order) => {
    switch (order) {
        case "id_asc":
            return [["id", "ASC"]];

        case "id_desc":
            return [["id", "DESC"]];

        case "nombre_asc":
            return [["nombre", "ASC"], ["id", "ASC"]];

        case "nombre_desc":
            return [["nombre", "DESC"], ["id", "ASC"]];

        default:
            return [["id", "ASC"]];
    }
}

module.exports = {
    generarOrderTablaProducto,
    generarOrderGenericoIdNombre,
}