const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//register controller
const registerUser = async (req,res) => {
    try{
        const {username,email,password,role} = req.body;
        const checkExistingUser = await User.findOne({$or :[{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message: `user already exists try different email or username`
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create a new user and save in database
        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role: role || 'user'
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success: true,
                message:`new user registered sucessfully`
            })
        }
        else{
            res.status(400).json({
                success: true,
                message:`unable to register user`
            })
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Something went wrong try again!'
        })
    }
}

//login controller
const loginUser = async (req,res) => {
    try{
        const {username,password} = req.body;

        //find if user exists with given username
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exist with this username"
            })
        }

        //check password
        const checkPass = await bcrypt.compare(password,user.password);

        if(!checkPass){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        //create user token
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn: '30m'
        })

        res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            accessToken
        })

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Something went wrong try again!'
        })
    }
}

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;

        const {oldPassword,newPassword} = req.body;

        //find current loggedin user
        const user = await User.findById(userId);

        if(!user){
            res.status(400).json({
                success:false,
                message:'User not find' 
            })
        }
    //check if old pass is correct
        const isPasswordMatched = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordMatched){
            res.status(400).json({
                success: false,
                message: 'Old password is not correct!'
            })
        }
        //hash new pass
        const salt = await bcrypt.genSalt(10);
        const newhashedPassword = await bcrypt.hash(newPassword,salt);

        //update user pass
        user.password = newhashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'password changed successfully'
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Something went wrong try again!'
        })
    }
}

module.exports = {registerUser,loginUser,changePassword};