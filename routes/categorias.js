const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT,validarCampos, tieneRole, esAdminRole } = require('../middlewares');
const {response}=require('express');
const { usuariosGet } = require('../controllers/usuarios');
const { crearCategoria, ObtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');




const router = Router();


//Obtener todas las categorias - publico
router.get('/',ObtenerCategorias);

//Obtener una categoria por id
router.get('/:id',[
    check('id', 'No es un id Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos], obtenerCategoria)


//Crear categoria - privado - cualquier persona con un token válido
router.post('/',[validarJWT, check('nombre','El nombre es Obligatorio').not().isEmpty(), validarCampos],crearCategoria);



//Actualizar - privado- cualquiera con token valido

router.put('/:id',[validarJWT,
    check('id','No es un id Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(), 
    validarCampos]
    ,actualizarCategoria);

//Borrar una categoria - Admin

router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un id Valido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
],borrarCategoria)



module.exports=router;