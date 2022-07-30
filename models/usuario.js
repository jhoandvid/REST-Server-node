/* {
    nombre:'',
    corre:'',
    password:'',
    img: '',
    rol:'',
    estado:true|false,
    google: true|false
} */

const {Schema, model}=require('mongoose');

const UsuarioSchema=Schema({


    nombre:{
        type:String,
        require:[true, 'El nombre es obligatorio']
    },

    correo:{
        type:String,
        require:[true, 'El correo es obligatorio'],
        unique:true

    },
     

      password:{
        type:String,
        require:[true, 'La contraseña es requerida'],
      },


    img:{
        type:String,
    
    },
    rol:{
        type:String,
        require:true,
        enum:['ADMIN_ROLE', 'USER_ROLE']
    },

    estado:{
        type:Boolean,
        default:true
    },

    google:{
        type:Boolean,
        default:false
    }

});

//Para que la contraseña y el __v no lo muestre como respuesta
 UsuarioSchema.methods.toJSON=function (){

    const {__v, password, _id, ...usuario}=this.toObject();
    usuario.uid=_id //cambio de id en el res.json 
    return usuario;
 }
module.exports=model('Usuario', UsuarioSchema);
