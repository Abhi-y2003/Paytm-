const jwt = require("jsonwebtoken")
const JWT_SECRET = require('./config')

const authMiddleware = async (req, res, next )=>{
    const authHeader = req.header.authorization;

    if(!authHeader || !authHeader.startswith('Bearer ')){
        return res.status(400).json({

            success:false,
            message: "can not find token"
        })
    }

    const token = authHeader.split(" ")[1]

    try{
        const decode = jwt.verify(token, JWT_SECRET)
        req.userId = decode.userId

        next()
    } catch(err){
        return res.status(403).json({})
    }
}


module.exports ={
    authMiddleware
}