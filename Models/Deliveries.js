const mongo = require('mongoose')

mongo.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const Delivery_Schema = mongo.Schema({

    Parcel_Type:{
        type:String,
    },

    Parcel_Description:{
        type : String,
    },

    Pickup_Address:{
        type: String,
    },
    
    Username:{
        type: String
    },

    Recepient_Name:{
        type:String,
    },

    Recepient_Contact:{
        type:String,
    },

    Dropoff_Address:{
        type:String,
    },

    Driver:{
        type:String,
        default:'None'
    },

    Pickup_Made:{
        type: Boolean,
        default: false
    },

    On_Delivery:{
        type: Boolean,
        default: false
    },

    Completed:{
        type: Boolean,
        default: false
    },

},{timestamps:true})

const Delivery_Model = mongo.model('Deliveries',Delivery_Schema)

module.exports = { Delivery_Model }