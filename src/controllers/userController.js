// ************ Require's ************
const bcrypt = require ('bcrypt');
const path = require ('path');
const fs = require ('fs');
const multer = require ('multer');

const userFilePath = path.join(__dirname, '../data/usersDataBase.json');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));


const controller = {
    login: (req, res) => {
        res.render('./pages/formLogin');
    },
    register: (req, res) => {
        res.render('./pages/formRegister');
    },
    userStore: (req, res, next) => {
        let nuevoUsuario = {
            nombre: req.body.cName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }

        user.push(nuevoUsuario);

        fs.writeFileSync(productsFilePath, JSON.stringify(user, null, ' '), 'utf-8');

        res.redirect('/');

    },
    processLogin: (req, res) => {
        let archivoUsuario = fs.readFileSync('usersDataBase.json', {encoding: 'utf-8'}); 
        let usuarios;
        if (archivoUsuario == ""){
            usuarios = [];
        } else {
            usuarios = JSON.parse(archivoUsuario);
        }
        for (let i=0; i<= usuarios.length; i++){
            if(req.body.email == usuarios [i].email && bcrypt.compareSync(req.body.password, usuarios[i].password));
        }
    }
};
module.exports = controller;