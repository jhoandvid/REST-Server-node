const {response}=require('express');
const Usuario=require('../models/usuario')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login=async(req, res)=>{


    const {correo,password }=req.body
    try{

        //verificar si el Email existe
        const usuario=await Usuario.findOne({correo})

        if(!usuario){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - email'
            })
        }

        //Si el usuario está activo

        if(!usuario.estado){
            return res.status(400).json({
                mgs:'Usuario/Password no son correctos - estado:false'
            })
        }

        //Verificar la contraseña

        const validPassword=bcryptjs.compareSync(password,usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - password'
            })
        }


        //generar el Jwt
        
        const token=await generarJWT(usuario.id)


        res.json({
            msg:'Login ok',
            usuario,
            token
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
    }


}


const googleSignIn=async (req, res=response)=>{

    const {id_token}=req.body;

    try {

        const {correo, nombre, img}=await googleVerify(id_token);

        let usuario=await Usuario.findOne({correo});

        if(!usuario){
            //Crear usuario
            const data={
                nombre,
                correo,
                password:':P',
                img,
                rol:'USER_ROLE',
                google:true
            };

            usuario=new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        //generar el JWT
        const token =await generarJWT(usuario._id);

        res.json({
           usuario,
           token
        })
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        })
    }


 

}

module.exports={
    login,
    googleSignIn
}