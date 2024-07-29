const express = require("express");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router()

router.get('/balance', authMiddleware , async (req,res)=>{

    const user = await Account.findOne({userId: req.userId})

    re.json({
        balance : account.balance
    })

    
})



router.post('/transfer', authMiddleware, async(req,res)=>{

    //creating a session for a secure transactions
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount, to} = req.body;

    const account = await Account.findOne({userId:req.userId})


    if(account.balance < amount){
        return res.status(400),json({
            success:false,
            msg:"Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({userId:to})

    if(!toAccount){
        return res.status(400),json({
            success:false,
            msg:"Reciever is not a valid user"
        })
    }

    //Performing the account transfer
    await Account.update({userId:req.userId}, {$inc: {balance: -amount}})
    await Account.update({userId:to}, {$inc: {balance: amount}})

    await session.commitTransaction();
    
    return res.status(200).json({
        success:true,
        message: "Transfer successful"
    })

})


module.exports = router;