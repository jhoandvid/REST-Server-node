const { Router } = require("express");
const { check } = require("express-validator");
const { crearProducto, obtenerProducto,obtenerProductos, actualizarProducto, eliminarProducto } = require("../controllers/productos");

const { existeProductoPorId, existeCategoriaPorId} = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get('/', obtenerProductos)


router.get('/:id',  
                    [
                        check('id','el id no es valido').isMongoId(),
                        check('id',).custom(existeProductoPorId),
                        validarCampos,

                    ],obtenerProducto)

router.post('/' ,
[validarJWT, 
    check('categoria', 'el nombre de la categoria es obligatoria').notEmpty(),
    check('nombre','El nombre del producto es obligatorio').notEmpty(),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
     validarCampos]
,crearProducto)


router.put('/:id', [validarJWT, 
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
     validarCampos], actualizarProducto )

router.delete('/:id', [
                        validarJWT, 
                        esAdminRole,
                        check('id', 'no es un id valido').isMongoId(),
                        check('id').custom(existeProductoPorId),
                        validarCampos
                        ], eliminarProducto)


module.exports = router;