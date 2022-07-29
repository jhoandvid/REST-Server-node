const express = require('express')
const cors = require('cors')

const { dbConnection } = require('../database/config')

class Server {



    constructor() {
        this.app = express();

        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';

        //conectar a base de datos
        this.conectarDB();

        //Middlewares: Función que se va a ejecutar siempre  que levantemos la app 
        this.middlewares();
        //rutas de aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        //cors
        this.app.use(cors());

        //Lectura y parseo del body 
        this.app.use(express.json())

        //Direcctorio public
        this.app.use(express.static('public'))
    }


    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'))



    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo en', this.port)
        })
    }




}


module.exports = Server;