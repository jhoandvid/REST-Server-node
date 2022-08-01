const express = require('express')
const cors = require('cors')

const { dbConnection } = require('../database/config')

class Server {



    constructor() {
        this.app = express();

        this.port = process.env.PORT;

        this.paths={
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuarios:'/api/usuarios',

        }



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

        
        this.app.use(this.paths.auth,     require('../routes/auth'))
        this.app.use(this.paths.buscar,     require('../routes/buscar'))
        this.app.use(this.paths.usuarios,  require('../routes/usuarios'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))  
    






    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo en', this.port)
        })
    }




}


module.exports = Server;