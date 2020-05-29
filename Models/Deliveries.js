const mongo = require('mongoose')

mongo.connect('mongodb://127.0.0.1:27017/Skynet-Express',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const Delivery_Schema = mongo.Schema({

    Parcel_Type:String,

    Parcel_Description:{
        type : String,
        minlength:10,
        required : true
    },

    Pickup_Address:{
        type: String,
        required: true
    },
    
    Sender_Name:{
        type:String,
        required: true
    },

    Sender_Contact:{
        type:String,
        required: true
    },

    Recepient_Name:{
        type:String,
        required: true
    },

    Recepient_Contact:{
        type:String,
        required: true
    },

    Recepient_Region:{
        type:String,
        required: true
    },

    Recepient_City:{
        type:String,
        required: true
    },

    Dropoff_Address:{
        type:String,
        required: true
    },
    Courier_Name:{
        type:String,
        default:'Nobody'
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

const Delivery_Model = mongo.model('Skynet-Deliveries',Delivery_Schema)



module.exports = { Delivery_Model }