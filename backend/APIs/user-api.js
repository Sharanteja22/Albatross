// create mini express app
const exp=require('express')
const userApp=exp.Router()
const {createUserOrAuthor,userOrAuthorLogin}=require('./Utils')
const expressAsyncHandler=require('express-async-handler');
let usersCollection;
// let articlesCollection
userApp.use((req,res,next)=>{
    usersCollection=req.app.get("usersCollection")
    // articlesCollection=req.app.get("articlesCollection")
    next();
})


// define routes
// user creation
userApp.post('/register',expressAsyncHandler(createUserOrAuthor))


// user login
userApp.post('/login',expressAsyncHandler(userOrAuthorLogin))


//user- get request
userApp.get("/getUsers",expressAsyncHandler(async (req,res)=>{
    const usersCollectionObj=req.app.get('usersCollection')
    const users=await usersCollectionObj.find().toArray();
    res.send({message:"All Voters",payload:users});
}))


// export userApp
module.exports=userApp;