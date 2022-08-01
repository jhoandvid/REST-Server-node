const { response} = require("express");
const { Categoria } = require('../models');




//ObtenerCategorias-pagina-total- *populate->investigar
const ObtenerCategorias=async(req, res=response)=>{
    const {limite=5, desde=0}=req.query;
    const query={estado:true};
    const [total, categoria]=await Promise.all([ 
         Categoria.countDocuments(query),
         Categoria.find(query).populate('usuario','nombre').skip(Number(desde)).limit(Number(limite)), 
    ])
    res.json({
        total,
        categoria
    });
}


//obtenerCategoria - populate {objeto de la categoria}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    
        res.json({
            categoria
    })
}



const crearCategoria=async(req, res=response)=>{
    const nombre=req.body.nombre.toUpperCase();
    const categoriaDB=await Categoria.findOne({nombre});
    if(categoriaDB){

        if(categoriaDB.estado){
            return res.status(400).json({
                msg:`La categoria ${categoriaDB.nombre}, ya existe`,
            })
        }else{
            const actualizar=await Categoria.findByIdAndUpdate(categoriaDB.id,{estado:true, usuario:req.usuario._id},{new:true}).populate('usuario','nombre');

            return res.status(200).json({
                actualizar
            })
            
        }
     /* 
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`,
        }) */

    }
    //Generar la data a guadar
    const data={
        nombre,
        usuario:req.usuario._id
    }
    const categoria=new Categoria(data);

    //Guadar base de datos
    await categoria.save()
    res.status(201).json(categoria)

}

//ActualizarCategoria 

    const actualizarCategoria=async(req,res)=>{

        const {id}=req.params;

        const usuario=req.usuario._id


        const nombre=req.body.nombre.toUpperCase();



        const categoria=await Categoria.findByIdAndUpdate(id, {nombre,usuario},{new:true}).populate('usuario','nombre');

        res.json({
            categoria
        }) 
        
    }


//BorrarCategoria-estado:false

    const borrarCategoria=async(req, res)=>{

        const {id}=req.params;
        
       /*      
        if(!req.categoria.estado){
            res.status(401).json({
                msg:'El producto que se quiere eliminar no existe',
            })
        }  */

    
        const categoriaBorrada= await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true})

        res.json({
            msg:'Categoria eliminada correctamente',
            categoriaBorrada
        })




    }


module.exports={
    crearCategoria,
    ObtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}