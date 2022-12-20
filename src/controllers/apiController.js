const db = require("../database/models");
const sequelize = require("sequelize");


const controller = {
    usersList: (req, res) => {
        db.usuario.findAll({attributes: ["id", "nombre", "apellido", "email"]})
            .then (usuarios => {
                return res.status(200).json({
                    total: usuarios.length,
                    data: usuarios,
                    status: 200  
                })
            })
    },
    user: (req, res) => {
        db.usuario.findByPk(req.params.id, {attributes: ["id", "nombre", "apellido", "email"]})
            .then(usuario => {
                if(usuario !== null){
                    return res.json({
                        data: usuario,
                        status: 200
                
                    })
                }else{
                    return res.status(404).json({
                        error: "no se encontro el usuario",
                        status: 404
                    })
                }
            })
    }
}

module.exports = controller;