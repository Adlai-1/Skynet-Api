const mongo = require('mongoose')
const bcry = require('bcrypt')


mongo.connect(MONGODB_URI||'mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const Driver_Schema = mongo.Schema({
    Name:String,
    Username:{
        type : String,
        unique: true
    },
    Password :{
        type : String,
        minlength : 6
    },
    On_Delivery:{
        type: Boolean,
        default: false
    },
},{timestamps: true})



const Driver_Model = mongo.model('Skynet-Drivers',Driver_Schema)



module.exports = { Driver_Model }