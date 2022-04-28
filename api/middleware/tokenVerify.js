const jwt = require("jsonwebtoken")



const verify = (req, res, next) =>{
    
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err){
                console.log(err)
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            console.log(req.user)
            next();
        });
    } else{
        res.status(401).json("You're not authenticated")
    }
};

//function to verify the jwt token for password reset. This would be on the header.
const verifyPasswordResetToken = async (req, res, next) =>{
     const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.PASS_ACCESS_RESET, (err, user)=>{
            if(err){
                console.log(err)
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            console.log(req.user)
            next();
        });
    } else{
        res.status(401).json("You're not authenticated")
    }

}

module.exports = {verify, verifyPasswordResetToken}