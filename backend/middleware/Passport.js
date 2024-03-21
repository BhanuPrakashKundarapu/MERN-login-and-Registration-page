const jwt=require('jsonwebtoken');

module.exports=passport=(req,res,next)=>{
    try{
        var token=req.header('x-token');

        if(!token){
            return res.send('invalid token')
        }

        var decodedtoken=jwt.verify(token,"ABDB123U");
        req.user=decodedtoken.user;
        next();
    }catch(err){
        res.send(err);
    }
}