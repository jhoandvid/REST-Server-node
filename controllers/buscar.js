const { response } = require("express");

const {Usuario, Categoria, Producto}=require('../models')

const {ObjectId}=require('mongoose').Types;

const coleccionesPermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios=async(termino='', res=response)=>{

    const esMongoID=ObjectId.isValid(termino); //true

    if(esMongoID){
        const usuario=await Usuario.findById(termino);
        return res.json({
            
            results:(usuario)?usuario:[]
        
        })
    }

    const regexp=new RegExp(termino, 'i');


    //Buscar o por nombre o por correo

    const usuarios=await Usuario.find({

        $or:[{nombre:regexp},{correo:regexp}, ],
        $and:[{estado:true}]

    });

    res.json({
            
        results:usuarios
    
    })

}


const buscarCategorias=async(termino='', res=response)=>{

    const esMongoID=ObjectId.isValid(termino); //true


    
    if(esMongoID){
        const categoria=await Categoria.findById(termino);
        return res.json({
            results:(categoria)?(categoria):[]
        })
    
    }
  
        const regexp=new RegExp(termino, 'i');

     const categorias=await Categoria.find({nombre:regexp, estado:true});

    console.log(categorias)

    res.json({
        results:categorias
    })

}

const buscarProductos=async(termino='', res)=>{



    const isValidId=ObjectId.isValid(termino);

    if(isValidId){
        const producto=await Producto.findById(termino).populate('categoria', 'nombre');
      return res.json({
            results: (producto)?(producto):[]
        })

    }


    const regExp=new RegExp(termino, 'i') //sera una busqueda insensible (no estricta)

    const productos=await Producto.find({
        $or: [{nombre:regExp}, {descripcion:regExp}],
        $and: [{estado:true}]
    }).populate('categoria', 'nombre')


    res.json({
        results:productos
    })

}


//Otra busqueda: {categoria:ObjectId('62e6696980803941900237e7')}



const buscar=(req, res=response)=>{

    const {coleccion, termino}=req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }


    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;
        case 'categorias':
            buscarCategorias(termino,res)
        break;
        case 'productos':
            buscarProductos(termino, res)

        break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta busqueda'
            })
        break;
    }
    

}


module.exports={
    buscar
}