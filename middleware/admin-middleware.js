

const isAdminUser = (req,res,next)=>{
    if(req.userInfo.role !== "admin"){
        return res.status(403).json({
            success: false,
            message: "access forbidden"
        })
    }
    next();
}

module.exports = isAdminUser;