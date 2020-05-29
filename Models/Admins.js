const mongo = require('mongoose')

mongo.connect(MONGODB_URI||'mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})


const Admin_Schema = mongo.Schema({
    Name: String,
    Username : {
        type: String,
        unique : true
    },
    Password : {
        type : String,
        minlength : 6
    },
},{ timestamps: true})

const Admin_Model = mongo.model('Skynet-Administrator',Admin_Schema)


module.exports = { Admin_Model }