const mongo = require('mongoose')

mongo.connect('mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
