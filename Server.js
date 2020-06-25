const express = require('express')
const app = express()
const brc = require('bcrypt')
const body = require('body-parser')
const {User_Model} = require('./Models/Users')
const {Admin_Model} = require('./Models/Admins')
const {Driver_Model} = require('./Models/Driver')
const {Delivery_Model} = require('./Models/Deliveries')
const {gql,ApolloServer}  = require('apollo-server-express')

//Salt Generation...
const Salt = brc.genSalt(10)

app.use(body.json())
const Schema = gql`

scalar Date
type Query{
    text:String
    Users: [User!]!
    Drivers: [Driver!]!
    Admins : [Admin!]!
    Deliveries : [Deliveries]
    Driver(username:String!): Driver
    User(username:String!): User
    Admin(username:String!): Admin
    Available_Drivers:[Driver]
    Find_Delivery(username:String!): [Deliveries]
    Available_Delivery:[Deliveries]
    Customer_Records(username:String!):[Deliveries]
    Driver_Records(username:String):[Deliveries]
}

type User{
    _id:ID!
    Name : String!
    Email: String!
    Contact: String!
    Username:String!
    Password:String!
    Address:String!
    createdAt:Date
    updatedAt:Date
}
type Driver{
    _id:ID
    Name:String
    Username:String
    Contact:String
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
    Parcel_Type:String
    Parcel_Description:String
    Pickup_Addess:String
    Username:String
    Recepient_Name:String
    Recepient_Contact:String
    Dropoff_Address:String
    Driver:String
    Pickup_Made:String
    On_Delivery:Boolean
    Completed:Boolean
    createdAt:Date
    updatedAt:Date
}

type Mutation{
   Assign_Driver (name:String!,_id:ID!): Deliveries

   Completed(status:Boolean!,_id:ID!): Deliveries

   Delivering(status:Boolean!,_id:ID!): Deliveries

   Pickedup(status:Boolean!,_id:ID!): Deliveries

   Moved(status:Boolean!,_id:ID!): Driver
    
    Delivery_Request(
        Parcel_Type:String!
        Parcel_Description:String!
        Pickup_Addess:String!
        Username:String!
        Recepient_Name:String!
        Recepient_Contact:String!
        Dropoff_Address:String!) : Deliveries!
}`

const root = {

    Query:{

    text:()=>'Hello World!',

    Users:()=>User_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Drivers:()=>Driver_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Admins:()=> Admin_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Deliveries:()=> Delivery_Model.find({},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Driver:(parent,{username})=>Driver_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Admin:(parent,{username})=>Admin_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    User:(parent,{username})=>User_Model.findOne({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),
    
    Find_Delivery:(parent,{username})=> Delivery_Model.find({Username:username},(err,doc)=>{
        if(doc) return doc
        else return err
    }),
    
    Available_Delivery:()=> Delivery_Model.find({Driver:'None'},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Available_Drivers:()=> Driver_Model.find({On_Delivery:false},(err,doc)=>{
        if(doc) return doc
        return err
    }),

    Customer_Records:(parent,{username})=> Delivery_Model.find({Username:username},(err,doc)=>{
        if(doc) return doc
        return err
    }),

    Driver_Records:(parent,{username})=> Delivery_Model.find({Driver:username},(err,doc)=>{
        if(doc) return doc
        return err
    }),
},


Mutation:{
            
    Assign_Driver:(parent,{name,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Driver:name}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Completed:(parent,{status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Completed:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Delivering:(parent,{status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{On_Delivery:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Pickedup:(parent,{status,_id})=> Delivery_Model.findByIdAndUpdate({_id:_id},{$set:{Pickup_Made:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Moved:(parent,{_id,status})=>Driver_Model.findByIdAndUpdate({_id:_id},{$set:{On_Delivery:status}},(err,doc)=>{
        if(doc) return doc
        else return err
    }),

    Delivery_Request:(parent,args)=>{
        const file = new Delivery_Model(args)
        return file.save()
    },
}}

const server = new ApolloServer({
    typeDefs:Schema,
    resolvers:root,
    playground:true,
    engine:{
        reportSchema:true
    }
})


server.applyMiddleware({app,bodyParserConfig:true})

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