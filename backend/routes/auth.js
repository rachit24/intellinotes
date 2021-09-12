const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Rachitisawesome$oy';
var fetchuser = require('../middleware/fetchUser');

//ROUTE 1: Create a User using POST: "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a valid Name').isLength({min:3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password','Must be atleast 5 characters').isLength({min:5})
    ], async (req,res)=>{
        let success=false;
    //If errors, return Bad Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try{
        //Check whether the email exists already
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({success, error:"Email already exists!"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: Create a User using POST: "/api/auth/login". No login required
router.post('/login',[
    body('email', 'Enter a valid Name').isEmail(),
    body('password','Can not be blank').exists()
    ], async (req,res)=>{
        let success = false;
    //If errors, return Bad Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const{email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Login Denied. Check Credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "Login Denied. Check Credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success,authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
})

//ROUTE 3: GET LoggedIn User Details POST: "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req,res)=>{
    try{
        userID = req.user.id;
        const user = await User.findById(userID).select("-password");
        res.send(user);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured!");
    }
})

module.exports = router;