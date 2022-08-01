const {response}=require('express');

const bcryptjs=require('bcryptjs')


const Usuario=require('../models/usuario');




const usuariosGet=async(req, res=response) => {

/*     const {q, nombre="No name", apikey, page="1", limit}=req.query; */

    const{limite=5, desde=0}=req.query;
    const query={estado:true};


    //los await son bloqueantes por lo que la respuesta seria mas larga sin que un resultado dependa del otro

/*     const usuarios=await Usuario.find(query).skip(Number(desde)).limit(Number(limite))

    const total=await Usuario.countDocuments(query);  */

    //Esto se hace como solución de lo anterior descrito
    const [total, resp]=await Promise.all(
        [Usuario.countDocuments(query),Usuario.find(query).skip(Number(desde)).limit(Number(limite))])

    res.json({
        total,
        resp,
      
       /* total,
        usuarios, */
      
    })
}

const usuariosPost=async(req, res=response)=>{

    const {nombre, correo, password, rol}=req.body;

   const usuario=new Usuario({nombre, correo, password, rol});

   /* //Verificar si el correo existe
    const existeEmail=await Usuario.findOne({correo});

    if(existeEmail){
        return res.status(400).json({
            msg:'El correo ya está registrado'
        })
    } */





   //Encriptar la contraseña
    const salt=bcryptjs.genSaltSync();
    usuario.password= bcryptjs.hashSync(password, salt);

   //Guadar en base de datos
   await usuario.save();

    res.json({
        usuario
        
    })
}

const usuariosPut=async(req, res=response)=>{

    const {id}=req.params;
    const {_id, password,google,correo, ...resto}=req.body

    //TODO validar contra base de datos
    if(password){
         //Encriptar la contraseña
        const salt=bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password, salt);
    }

    const usuario=await Usuario.findByIdAndUpdate(id,resto);
    res.json(usuario)
}

const usuariosPatch=(req, res=response)=>{
    res.json({
        "msg":"Patch Api - Controlador"
    })
}


const usuariosDelete=async(req, res=response)=>{

    const {id}=req.params;
    /* const uid=req.uid; */

    //Fisicamente borrar de la base de datos.
    // No es lo ideal, a la hora de borrar los datos perderiamos la integridad referencial.
    /* const usuario=await Usuario.findByIdAndDelete(id); */

    const usuario=await Usuario.findByIdAndUpdate(id, {estado:false});



 
   

    res.json({
        usuario
        
        /* uid */
    })
}

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}