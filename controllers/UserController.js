const User = require("../models/userModel")



async function signup(req, res,next) {
    let  username ,user_type, email, password
        username = req.body.username,
        user_type = req.body.user_type,
        email = req.body.email,
        password = req.body.password
    try {
        const newUser = new User({email,username,user_type,password})
        newUser.save()
        return res.json({newUser})
    } catch (error) {
        console.log(error)
        return res.json({error})
    }
    

}



module.exports.signup = signup

async function signin(req, res,next) {
    let email , password 
    email = req.body.email
    password = req.body.password

    const doc = await User.findOne().where({email , password })
    .then((doc)=>{
        if(doc === null){
            return res.json({doc,type:false})
        }
        return res.json({doc,type:true})
    })
    .catch((err)=>{
        console.log(err)
    })
    

}



module.exports.signin = signin