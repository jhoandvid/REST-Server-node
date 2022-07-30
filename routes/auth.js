const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campo');



const router=new Router();

router.post('/login',[
    check('correo', 'No es un correo valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    
    validarCampos

], login)
  
router.post('/google',[
    check('id_token', 'el id_token es necesario').not().isEmpty(),
    validarCampos

], googleSignIn)



module.exports=router;