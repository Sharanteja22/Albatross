// create mini express app
const exp=require('express')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const adminApp=exp.Router()
// const {createUserOrAuthor,userOrAuthorLogin}=require('./Utils')
const expressAsyncHandler=require('express-async-handler');
let adminsCollection;
// let articlesCollection
adminApp.use((req,res,next)=>{
    adminsCollection=req.app.get("adminsCollection")
    // articlesCollection=req.app.get("articlesCollection")
    next();
})


// define routes
// user login
adminApp.post('/login',expressAsyncHandler(async (req,res)=>{
    // get users and authors collection object
    const adminsCollectionObj=req.app.get('adminsCollection')
    // const candidatesCollectionObj=req.app.get('candidatesCollection')
    let dbuser;
    // get user or author
    const userCred=req.body;
    // Verify username of user
        dbuser=await adminsCollectionObj.findOne({username:userCred.username})
        if(dbuser===null){
            return res.send({message:'Invalid username'})
        }else{
            // let status=await bcryptjs.compare(userCred.password,dbuser.password)
            // if(status===false){
            //     return res.send({message:'Invalid password'})
            // }
        }
    // Create Token
    const signedToken=jwt.sign({username:dbuser.username},'abcdef',{expiresIn:50})
    delete dbuser.password;
    res.send({message:'login success',token:signedToken,user:dbuser})
}))


// add candidate
adminApp.post('/addCandidate',expressAsyncHandler(async (req,res)=>{
    const candidatesCollectionObj=req.app.get('candidatesCollection')
    let dbUser;
    const userCred=req.body;
    dbUser=await candidatesCollectionObj.insertOne(userCred);
    if(dbUser==null){
        return res.send({message:"Failed to add candidate"})
    }else{
        return res.send({message:"successfully added"})
    }
}))


// get candidates list
adminApp.get("/getCandidates",expressAsyncHandler(async (req,res)=>{
    const candidatesCollectionObj=req.app.get('candidatesCollection')
    const candidates=await candidatesCollectionObj.find().toArray();
    res.send({message:"All Candidates",payload:candidates});
}))

// export userApp
module.exports=adminApp;