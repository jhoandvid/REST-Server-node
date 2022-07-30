const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

/* const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles'); */

const {validarCampos, validarJWT,esAdminRole, tieneRole}=require('../middlewares')




const router = Router();

router.get('/', usuariosGet);



router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
]
    , usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail().custom(emailExiste),
    //check('rol','No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    /*      check('correo').custom(emailExiste), */
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);


router.patch('/', usuariosPatch);

router.delete('/:id',
    [ 

    validarJWT,
   /*  esAdminRole, */
   tieneRole('ADMIN_ROLE','VENTAS_ROLE'),

    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
    ],
    usuariosDelete);


module.exports = router;