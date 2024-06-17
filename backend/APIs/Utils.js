const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')


// req handler for user / author registration
const createUserOrAuthor=async (req,res)=>{
    // get users and authors collection object
    const usersCollectionObj=req.app.get('usersCollection')

    const user=req.body;

    // check duplicate user
    // console.log(user)
    // if(user.userType==="user"){
        // find user by username
        let dbuser=await usersCollectionObj.findOne({username:user.username})
        // if user existed
        if(dbuser!==null){
           return res.send({message:"User already existed"});
        }
    // }
    // check duplicate author

    // Hash password
    const hashedPassword=await bcryptjs.hash(user.password,7)
    // replace plain password with hashed password
    user.password=hashedPassword;

    // save user ? author
        await usersCollectionObj.insertOne(user)
        res.send({message:"USER CREATED"})
};

const userOrAuthorLogin=async (req,res)=>{
    // get users and authors collection object
    const usersCollectionObj=req.app.get('usersCollection')
    // const authorsCollectionObj=req.app.get('authorsCollection')
    let dbuser;
    // get user or author
    const userCred=req.body;
    // Verify username of user
        dbuser=await usersCollectionObj.findOne({username:userCred.username})
        if(dbuser===null){
            return res.send({message:'Invalid username'})
        }else{
            let status=await bcryptjs.compare(userCred.password,dbuser.password)
            if(status===false){
                return res.send({message:'Invalid password'})
            }
        }
    // Create Token
    const signedToken=jwt.sign({username:dbuser.username},'abcdef',{expiresIn:50})
    delete dbuser.password;
    res.send({message:'login success',token:signedToken,user:dbuser})
}


module.exports={createUserOrAuthor,userOrAuthorLogin};