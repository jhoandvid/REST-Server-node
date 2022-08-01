//TODO:Obtener productos,

const { Producto } = require("../models");


const obtenerProductos=async(req, res)=>{

    const {limite=5, desde=0}=req.query;
    const query={estado:true};


    const [total, productos]=await Promise.all
    (
        [await Producto.countDocuments(query),
         await Producto.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre').populate('categoria', 'nombre')   
    ])

    res.json({
        total,
        productos
    })


}


//TODO:Obtener producto,

const obtenerProducto=async(req,res)=>{

    const {id}=req.params;
    const producto=await Producto.findById(id).populate('usuario', 'nombre').populate('categoria','nombre');

    res.status(200).json({
        producto
    })

}


//TODO:crear producto,

const crearProducto=async(req, res)=>{

    const{estado, usuario, ...body}=req.body;

    const productoDB=await Producto.findOne({nombre:body.nombre});

    
    //Validación de que el producto no exista.......
       if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre} que desea crear ya existe`
        })

       }

    const data={
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario:req.usuario._id,
 
    }

    const producto= new Producto(data);

    await producto.save();

    res.status(201).json({
        producto
    })

}


//TODO:Actualizar producto,

const actualizarProducto=async(req,res)=>{

    const {id}=req.params;

    const{estado, usuario,...data }=req.body;
/* 
    const nombre=req.body.nombre.toUpperCase();
    const precio=Number(req.body.precio); */

if(data.nombre){
    data.nombre=data.nombre.toUpperCase();
}
 
    data.usuario=req.usuario._id;




    const producto=await Producto.findByIdAndUpdate(id, data,{new:true});


    res.json({
        producto
    })


}


//TODO:Eliminar producto,


const eliminarProducto=async(req, res)=>{

    const {id}=req.params


    const productoEliminado=await Producto.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.json({
        productoEliminado
    })


}



module.exports={
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    actualizarProducto,
    eliminarProducto
}