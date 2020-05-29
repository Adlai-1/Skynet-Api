const mongo = require('mongoose')
mongo.connect('mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const User_Schema = mongo.Schema({

    Name : String,

    Email_Address:{
        type: String,
        trim : true
    },
    
    Contact: String,

    Username : {
        type: String,
        unique : true
    },

    Password : {
        type : String,
        minlength : 6
    },

    Address : String,
    City : String,
    Region : String,

},{timestamps: true})

const User_Model = mongo.model('Skynet-Users',User_Schema)

module.exports = { User_Model }