const {response}=require('express');
const Usuario=require('../models/usuario')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


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


module.exports={
    login
}