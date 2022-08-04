const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarJWT,validarCampos } = require('../middlewares');




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


router.get('/', validarJWT, renovarToken);



module.exports=router;