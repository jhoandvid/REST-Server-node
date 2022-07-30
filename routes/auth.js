const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campo');



const router=new Router();

router.post('/login',[
    check('correo', 'No es un correo valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    
    validarCampos

], login)
  




module.exports=router;