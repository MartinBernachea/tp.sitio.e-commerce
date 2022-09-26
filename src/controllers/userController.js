const controller = {
    login: (req, res) => {
        res.render('./pages/formLogin');
    },
    register: (req, res) => {
        res.render('./pages/formRegister');
    }
};
module.exports = controller;