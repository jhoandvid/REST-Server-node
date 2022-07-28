const express = require('express')
const  cors = require('cors')

class Server{



    constructor(){
       this.app = express();

       this.port=process.env.PORT;

        this.usuariosPath='/api/usuarios';

       //Middlewares: Función que se va a ejecutar siempre  que levantemos la app 
        this.middlewares();
       //rutas de aplicación
       this.routes();
    }


    middlewares(){

        //cors
        this.app.use(cors());

        //Lectura y parseo del body 
        this.app.use(express.json())

        //Direcctorio public
        this.app.use(express.static('public'))
    }


    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios'))

        

    }

    listen(){
        this.app.listen(process.env.PORT,()=>{
            console.log('Servidor corriendo en', this.port)
        })
    }




}


module.exports=Server;