const  validarCampos  = require('../middlewares/validar-campo');
const  validarJWT  = require('../middlewares/validar-jwt');
const  validaRoles = require('../middlewares/validar-roles');


module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}