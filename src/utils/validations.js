const { body } = require('express-validator');

const productCreateValidation = [
    body('name').notEmpty().withMessage('Completar campo'),
    body('price').notEmpty().withMessage('Completar campo'),  // .isNumeric([locale(['ar']), options({no_symbols: true})])
    body('categoriaId').notEmpty().withMessage('Completar campo'),
    body('marcaId').notEmpty().withMessage('Completar campo'),
    body('generoId').notEmpty().withMessage('Completar campo'),
]

const userRegisterValidation = [
    body('cName').notEmpty().withMessage('Completar campo'),
    body('cLastName').notEmpty().withMessage('Completar campo'),
    body('email').notEmpty().withMessage('Completar campo'),
    body('password').notEmpty().withMessage('Completar campo'),  // .isNumeric([locale(['ar']), options({no_symbols: true})])
    body('cPassword').notEmpty().withMessage('Completar campo'),  // .isNumeric([locale(['ar']), options({no_symbols: true})])
]

const customValidationErrorMsg = {
    existentMail: "Ya existe un usuario registrado con el mismo email",
    notMatchPass: "Las contraseñas ingresadas deben coincidir",
}

module.exports = {
    productCreateValidation,
    userRegisterValidation,
    customValidationErrorMsg
}