const express = require('express')
const app = express()
const brc = require('bcrypt')
const graph = require('graphql')
const body = require('body-parser')
const exgraph = require('express-graphql')
const {User_Model} = require('./Models/Users')
const {Admin_Model} = require('./Models/Admins')
const {Driver_Model} = require('./Models/Driver')
const {Delivery_Model} = require('./Models/Deliveries')


const Schema = graph.buildSchema(`

scalar Date
type Query{
    text:String
    Registered_Users: [User!]!
    Registered_Drivers: [Driver!]!
    Registered_Admins : [Admin!]!
    Requested_Deliveries : [Deliveries]
    Find_Driver(username:String!): Driver
    Find_User(username:String!): User
    Find_Admin(username:String!): Admin
    Free_Drivers:[Driver]
    Find_Delivery(name:String!): [Deliveries]
    No_Driver_Assigned_Delivery:[Deliveries]
}
type User{
    _id:ID!
    Name : String!
    Email_Address: String!
    Contact: String!
    Username:String!
    Password:String!
    Address:String!
    City:String!
    Region:String!
    createdAt:Date
    updatedAt:Date
}
type Driver{
    _id:ID
    Name:String
    Username:String
    On_Delivery:Boolean
    Password:String
    createdAt:Date
    updatedAt:Date
}
type Admin{
    _id:ID
    Name:String
    Username:String
    Password:String
    createdAt:Date
    updatedAt:Date
}

type Deliveries{
    _id:ID
    Courier_Name:String
    On_Delivery:Boolean
    Pickup_Made:Boolean
    Completed:Boolean
    Parcel_Type:String
    Parcel_Description:String
    Pickup_Address:String
    Sender_Name:String
    Sender_Contact:String
    Recepient_Name:String
    Recepient_Contact:String
    Recepient_Region:String
    Recepient_City:String
    Dropoff_Address:String
    createdAt:Date
    updatedAt:Date
}

type Mutation{
   Assign_Driver (name:String!,_id:ID!): Deliveries

   Delivery_Complete (status:Boolean!,_id:ID!): Deliveries

   On_Delivery(status:Boolean!,_id:ID!): Deliveries

   Pickup_Made(status:Boolean!,_id:ID!): Deliveries

   Moving_Driver(status:Boolean!,_id:ID!): Driver
    
    Request_Delivery (type:String!,
     description:String!,
     address:String!,
     sname:String!,
     scontact:String!,
     rname:String!,
     rcontact:String!,
     region:String!,
     city:String!,
     dropoff:String!) : Deliveries!
}`

)


const root = {

    text:()=>'Hello World!',

    Registered_Users:()=>User_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Registered_Drivers:()=>Driver_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Registered_Admins:()=> Admin_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Requested_Deliveries:()=> Delivery_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Assign_Driver:({name,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Courier_Name:name}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Delivery_Complete:({status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Completed:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    On_Delivery:({status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{On_Delivery:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Pickup_Made:({status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Pickup_Made:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Free_Drivers:()=> Driver_Model.find({On_Delivery:false},(err,doc)=>{
        if(doc) return doc
        return err
    }),

    Moving_Driver:({_id,status})=>Driver_Model.findByIdAndUpdate({_id:_id},{$set:{On_Delivery:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Find_Driver:({username})=>Driver_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Find_Admin:({username})=>Admin_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Find_User:({username})=>User_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),
    
    Find_Delivery:({name})=> Delivery_Model.find({Sender_Name:name},(err,doc)=>{
        if(doc) return doc
        else return err
    }),
    
    No_Driver_Assigned_Delivery:()=> Delivery_Model.find({Courier_Name:'Nobody'},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Request_Delivery:({type,description,address,rname,rcontact,region,city,dropoff,sname,scontact})=>{
        const file = new Delivery_Model({
            Parcel_Type: type,
            Parcel_Description: description,
            Pickup_Address:address,
            Sender_Name:sname,
            Sender_Contact:scontact,
            Recepient_Name:rname,
            Recepient_Contact:rcontact,
            Recepient_Region:region,
            Recepient_City:city,
            Dropoff_Address:dropoff
        })
        file.save()
        return file
    },
}

app.use('/graphql',exgraph({
    schema:Schema,
    rootValue:root,
    graphiql:true,
}))

app.use(body.json())

//Begining for Login and Signup Routes.....................

//End point for Signing Up Admin........
app.post('/Admin-Signup',(req,res)=>{
    brc.genSalt(10,(err,salt)=>{
        if(salt){
            brc.hash(req.body.Password,salt,(err,hash)=>{
                if(hash){
                    const file = new Admin_Model({
                        Name : req.body.Name,
                        Username : req.body.Username,
                        Password : hash
                    })
                    file.save((err,docs)=>{
                        if(docs) return res.sendStatus(200)
                        return err
                    })
                }
                else return err
            })
        }
        else return err
    })
})

//End point for Signing Up Driver........
app.post('/Driver-Signup',(req,res)=>{
    brc.genSalt(10,(err,salt)=>{
        if(salt){
            brc.hash(req.body.Password,salt,(err,hash)=>{
                if(hash){
                    const file = new Driver_Model({
                        Name : req.body.Name,
                        Username : req.body.Username,
                        Password : hash
                    })
                    file.save((err,docs)=>{
                        if(docs) return res.sendStatus(200)
                        return err
                    })
                }
                else return err
            })
        }
        else return err
    })
})

//End point for Signing Up Users........
app.post('/User-Signup',(req,res)=>{
    brc.genSalt(10,(err,salt)=>{
        if(salt){
            brc.hash(req.body.Password,salt,(err,hash)=>{
                const file = new User_Model({
                    Name : req.body.Name,
                    Email_Address : req.body.Email_Address,
                    Contact : req.body.Contact,
                    Username : req.body.Username,
                    Password : hash,
                    Address : req.body.Address,
                    City : req.body.City,
                    Region : req.body.Region
                })
                file.save((err,docs)=>{
                    if(docs) return res.sendStatus(200)
                    return err
                })
            })
        }
        return err
    })
})

//End Point for Login Driver..........
app.post('/Driver-Login',(req,res)=>{
    Driver_Model.findOne({Username:req.body.Username},(err,doc)=>{
        if(doc){
            brc.compare(req.body.Password,doc.Password,(err,same)=>{
                if(same){
                    res.json({Login:'True'})
                }
                else{
                    res.json({Login:"Wrong Password!"})
                }
            })
        }
        else{
            res.json({Login:"User not Found!"})
        }
    })
})

//End point for Logining Administrstor.........
app.post('/Admin-Login',(req,res)=>{
    Admin_Model.findOne({Username:req.body.Username},(err,doc)=>{
        if(doc){
            brc.compare(req.body.Password,doc.Password,(err,same)=>{
                if(same){
                    res.json({Login:'True'})
                }
                else{
                    res.json({Login:"Wrong Password!"})
                }
            })
        }
        else{
            res.json({Login:"User not Found!"})
        }
    })
})

//End point for Logining Users..........
app.post('/User-Login',(req,res)=>{
    User_Model.findOne({Username:req.body.Username},(err,doc)=>{
        if(doc){
            brc.compare(req.body.Password,doc.Password,(err,same)=>{
                if(same){
                    res.json({Login:'True'})
                }
                else{
                    res.json({Login:"Wrong Password!"})
                }
            })
        }
        else{
            res.json({Login:"User not Found!"})
        }
    })
})

//End........................

const PORT = process.env.PORT || 4000 
app.listen(PORT,()=>console.log("Server Started!"))