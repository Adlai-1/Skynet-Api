const mongo = require('mongoose')
mongo.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const User_Schema = mongo.Schema({

    Name : String,

    Email:{
        type: String,
        trim : true
    },
    
    Contact:{
        type:String,
        required:true
    },

    Username : {
        type: String,
        unique : true
    },

    Password : {
        type : String,
        minlength : 6
    },

    Address : {
        type: String,
        required:true
    },
   
},{timestamps: true})


const User_Model = mongo.model('User',User_Schema)


module.exports = { User_Model }