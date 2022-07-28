const {response}=require('express')



const usuariosGet=(req, res=response) => {

    const {q, nombre="No name", apikey, page="1", limit}=req.query;



    res.json({
        "msg": "get API - Controlador",
        q, 
        nombre,
        apikey,
        page, 
        limit
    })
}

const usuariosPost=(req, res=response)=>{

    const {nombre, edad}=req.body;

    res.json({
        "msg":"post Api - Controller",
        nombre, 
        edad
    })
}

const usuariosPut=(req, res=response)=>{

    const id=req.params.id;

    res.json({
        "msg":"Put Api - Controlador",
        id

    })
}

const usuariosPatch=(req, res=response)=>{
    res.json({
        "msg":"Patch Api - Controlador"
    })
}


const usuariosDelete=(req, res=response)=>{
    res.json({
        "msg":"Delete Api - Controlador"
    })
}

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}