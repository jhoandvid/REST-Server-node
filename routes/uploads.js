const {Router}= require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccioesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');





const router=Router();


router.post('/',validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe ser de mondo').isMongoId(),
    check('coleccion').custom(c=>coleccioesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
    ],actualizarImagenCloudinary)
    
/*     actualizarImagen) */


router.get('/:coleccion/:id', [
    check('id', 'Eñ id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccioesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos


], mostrarImagen)


module.exports=router;