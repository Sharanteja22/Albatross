// Create express application
const exp=require('express');
const app=exp();
const path=require('path')
require('dotenv').config() //process.env.variable

// add body parser middleware
app.use(exp.json())

// place react build in http web server
app.use(exp.static(path.join(__dirname,"../frontend/build")))

const mongoClient=require('mongodb').MongoClient;


//connect to mongo db server
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    // get database object
    const blogDBobj=client.db('voting')
    // create collection objects
    const usersCollection=blogDBobj.collection('users')
    const adminsCollection=blogDBobj.collection('admin')
    const candidatesCollection=blogDBobj.collection('candidates')

    // Share the collection objects with APIs
    app.set('usersCollection',usersCollection)
    app.set('adminsCollection',adminsCollection)
    app.set('candidatesCollection',candidatesCollection)
    console.log("DB CONNECTION SUCCESS");

})
.catch(err=>{
    console.log(" ERROR IN DB CONECT",err)
}) 

// import apis
const userApp=require('./APIs/user-api')
const adminApp=require('./APIs/admin-api')
// const adminApp=require('./APIs/admin-api')

// handover req to specific route based on starting of path
app.use('/user-api',userApp)
app.use('/admin-api',adminApp)
// app.use('/admin-api',adminApp)



// error handling middleware
app.use((err,req,res,next)=>{
    res.send({status:"error",message:err.message})
})

// get port number from env
const port=process.env.PORT || 4000;

// Assign port number to http server
app.listen(port,()=>console.log(`http server on port ${port}`));