

const path=require('path');
const fs =require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_UR);

const { response } = require("express");
const {subirArchivo}=require('../helpers')

const {Usuario, Producto}=require('../models')



const cargarArchivo=async(req, res=response)=>{
    
  

    //Imagenes
//txt, md
 try{
 /*  const nombre=await subirArchivo(req.files, ['txt','md'], 'textos'); */
  const nombre=await subirArchivo(req.files, undefined, 'imgs');
  
  res.json({
    nombre
  })
 }catch(msg){
    res.status(400).json({msg})
 }



    

}


const actualizarImagen=async(req, res=response)=>{


  const {id, coleccion}=req.params

  let modelo;

  switch(coleccion){
    case 'usuarios':

    modelo=await Usuario.findById(id);

    if(!modelo){
      return res.status(400).json({
        msg:`No existe un usuario con el id ${id}`
      })
    }
    break;

    case 'productos':
      modelo=await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        })
      }
      break;


    default:
      return res.status(500).json({msg:'Se me olvidó validar esto'})
  
  }

  //Limpiar imagnees previas
  try {
    
    if(modelo.img){
      //Borrar la imagen del servidos
      const pathImagen=path.join(__dirname, '../uploads', coleccion, modelo.img);

      if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
      }
    }

  } catch (error) {
    
  }


  const nombre=await subirArchivo(req.files, undefined, coleccion)

  modelo.img=nombre

  await modelo.save();

  res.json(modelo);

}


const mostrarImagen=async(req, res=response)=>{ 

  let modelo;

  const {id, coleccion}=req.params;

  switch (coleccion){

    case 'usuarios':
      modelo=await Usuario.findById(id);

      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }


    break;


    case 'productos':

      modelo=await Producto.findById(id);

      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }



    break;

    default:

      return res.status(500).json({msg: 'Se me olvidó validar esto'})

  }


  if(modelo.img){
      const pathImagen=path.join(__dirname, '../uploads', coleccion, modelo.img)
      if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
      }
  }

  const pathNoImage=path.join(__dirname, '../assets/no-image.jpg')
  return res.sendFile(pathNoImage)
}

const actualizarImagenCloudinary=async(req, res=response)=>{


  const {id, coleccion}=req.params

  let modelo;

  switch(coleccion){
    case 'usuarios':

    modelo=await Usuario.findById(id);

    if(!modelo){
      return res.status(400).json({
        msg:`No existe un usuario con el id ${id}`
      })
    }
    break;

    case 'productos':
      modelo=await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        })
      }
      break;


    default:
      return res.status(500).json({msg:'Se me olvidó validar esto'})
  
  }

  //Limpiar imagnees previas

    
    if(modelo.img){
      //Borrar la imagen del servidor

      console.log(modelo.img)

       const nombreArr=modelo.img.split("/");
      const nombre=nombreArr[nombreArr.length-1];
      const [public_id]=nombre.split(".");

      console.log(public_id); 
       cloudinary.uploader.destroy(public_id)


    
    }

    const {tempFilePath}=req.files.archivo;
    
    const {secure_url}=await cloudinary.uploader.upload(tempFilePath);

   modelo.img=secure_url

  await modelo.save();

  res.json(modelo);

}






module.exports={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
  }