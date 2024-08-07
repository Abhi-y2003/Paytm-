const express = require("express")
const zod = require("zod")
const {User, Account} = require("../db")
const JWT_SECRET = require("../config")
const bcrypt = require("bcrypt")
const { authMiddleware } = require("../middleware")
const router = express.Router()


const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password:zod.string()
})


router.post("/signup", async(req,res)=>{
    try {
        
        const {success} = signupBody.safeParse(req.body);

        if(!success){
            return res.status(401).json({
                success:false,
                msg:"Invalid inputs"
            })
        }

        console.log(username)

        const existingUser = await User.findOne({username})

        if(existingUser){
            return res.status(401).json({
                success:false,
                msg:"User already exists"
            })
        }

        const hashedPassword = bcrypt.hash(password, 10)

        console.log(hashedPassword)

        const createUser  = await User.Create({
            username,
            firstName,
            lastName,
            password:hashedPassword,
        })

        const userId = createUser._id;

        await Account.create({
            userId,
            balance: 1 + Math.random()*10000,
        })

        const token = jwt.sign({userId}, JWT_SECRET)

        return res.status(200).json({
            success:true,
            msg:"User signed in",
            token,
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"User not signed in"
        })
    }
})


router.post('/signin', async(req,res)=>{

    try {

        const signinBody = zod.object({
            username:zod.string().email(),
            password:zod.string()
        })

        const {success}  =  signinBody.safeParse(req.body);

        if(!success){
            return res.status(400).json({
                success:false,
                msg:"Invalid Inputs"
            })
        }

        const hashedPassword = bcrypt.hash(password, 10)

        const validUser = await User.findOne({username:username,password:hashedPassword})

        if(validUser){
            const userId = validUser._id;
            const token = jwt.sign({userId} , JWT_SECRET)
        } else {
            return res.status(400).json({
              success:false,
              msg:"wrong credentials"  
            })
        }

        return res.status(200).json({
            success:true,
            msg:"User signed in"  
          })
        

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"Error while sign in"  
          })
    }
})


router.put('/', authMiddleware, async (req,res)=>{
    try {
        
        const updatedData = zod.object({
            firstName:zod.string(),
            lastName:zod.string(),
            password:zod.string()
        })
    
        const { success } =  updatedData.safeParse(req.body)
    
        if(!success){
            return res.status(400).json({
                success:false,
                msg:"Invalid credentials"
            })
        }
    
        await User.findOneandUpdate({_id: req.userId}, req.body)
    
        return res.status(200).json({
            msg:"updated successfully"
        })

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            msg:"Error in updating credentials"
        })

    }
    

})



router.get('/bulk', authMiddleware, async (req,res)=>{
    try {
        const filter = req.body.filter || "";

        const ExistingUser = await User.find({
            $or:[{
                firstName:{
                    $regex:filter
                },
                lastName:{
                    $regex:filter
                }
            }]
        })

        return res.status(200).json({
            success:true,
            user: ExistingUser.map(user=> ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"No user found"
        })
    }
})
module.exports = router;