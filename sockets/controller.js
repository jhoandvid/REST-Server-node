const {Socket}=require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes=new ChatMensajes();

const socketController= async(socket=new Socket(), io) => {
  
  const usuario=await comprobarJWT(socket.handshake.headers['x-token']); 






  if(!usuario){
    return socket.disconnect();
  }


  //Agregar el usuario conectado

  chatMensajes.conectarUsuario(usuario);
  io.emit('usuarios-activos', chatMensajes.usuariosArr)

  socket.emit('recibir-mensajes', chatMensajes.ultimos10)


  //conectarlo a una sana especial
  socket.join(usuario.id);//gracias a este codigo los usuarios se pueden conectar
  
  //global, socket.id, usuario.id



  socket.on('enviar-mensaje',({ mensaje, uid})=>{

      if(uid){
        //mensaje privado
        socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
      }else{
        chatMensajes.enviarMensaje(usuario._id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10); 
      }

})


  
  //Limpiar cuando alguien se desconecta


  socket.on('disconnect', ()=>{


    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
  })

 


 






}


module.exports={
    socketController
}