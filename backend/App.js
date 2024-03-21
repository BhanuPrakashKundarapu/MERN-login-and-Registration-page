const express=require("express");
const mongoose=require("mongoose");
const cors=require('cors');
const bjs=require("bcryptjs");
const path=require('path');
const multer=require('multer');
const jwt=require('jsonwebtoken');
const middleware=require('./middleware/Passport')

const url=require('./config/Keys').mongoURL;
const UserModel=require("./models/User");
const app=express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'))


mongoose.connect(url).then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err);
})
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({
    storage:storage
})
app.get("/",(req,res)=>{
    // res.send("hello World")

})

app.post("/reg",upload.single('file'),(req,res)=>{
    
    const {name,phone,email,password,gender}=req.body;
    const {file}=req;
    
    const regDate=new UserModel({
        name:name,
        phone:phone,
        email:email,
        password:password,
        gender:gender,
        Image:file.filename
    })
    bjs.genSalt(10,(err,salt)=>{
        if(err){throw err};
        bjs.hash(regDate.password,salt,async(err,hash)=>{
            regDate.password=hash
            const data=await regDate.save();
            res.json({status:200,message:data});
    })
    });
})
app.post('/log',async(req,res)=>{
    const {email,password}=req.body;
    console.log(email+""+password)
    const UserLog=await UserModel.findOne({email:email});
    if(UserLog){
        bjs.compare(password,UserLog.password).then((yes)=>{
            if(yes){
                const payload={
                    user:{
                        id:UserLog.id
                    }
                }
                jwt.sign(payload,"ABDB123U",{expiresIn:3600000},(err,token)=>{
                    if(err){throw err}
                    
                    return res.json({status:200,token:token});
                })
                // res.json({status:200,data:UserLog})
            }else if(!yes){
                res.json({status:400,data:"password didn't matched"});
            }
        })
    } 
})

app.get('/details',middleware,async(req,res)=>{
    try {
        const data=await UserModel.findById({_id:req.user.id});
        res.json({status:200,data})
    } catch (error) {
        res.send(error);
    }
})


app.listen(8080,()=>{
    console.log("server running on port 8080")
})


