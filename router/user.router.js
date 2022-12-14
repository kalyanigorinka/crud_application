const router = require('express').Router();
const User = require('../model/user.model');
const auth = require('../middlewares/auth').isAuthenticated;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email && !password) {
        res.status(404).send("please enter all feild");
      }
      const validUser =await User.findOne({email});
      if (!validUser) {
        res.status(404).send({ msg: "User Not Found" });
      }else{
        const isMatch = bcrypt.compareSync(password, validUser.password)
        if (validUser && isMatch) {
          const accessToken = jwt.sign(
            {
              _id: validUser._id,
              email: validUser.email,
            },
            (process.env.JWT_SECRET || "secret"),
            {
              expiresIn: '48h',
            })
            res.status(200).send({
              msg: "login-success",
              token: accessToken,
              data: validUser,
            });
        } else {
          res.status(404).send({ msg: "Invalid Credentials" });
        }
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
});

router.post("/signup", async (req, res) => {
    try {
      const {firstName, email,password} = req.body;
      const UserExistHere = await User.findOne({ email });
      if (UserExistHere) {
        res.status(226).send({ msg: "User Already Registered here" });
      }
      const HashedPassword = bcrypt.hashSync(password,10)
  
      const createParams ={
        firstName: firstName,
        email: email,
        password: HashedPassword,
      };
      const NewUser = await User.create(createParams)
      if (NewUser) {
        const accessToken = jwt.sign(
          {
            _id: NewUser._id,
            email: NewUser.email,
          },
          'screct',
          {
            expiresIn: '48h',
          })
        if (accessToken) {
          res.status(201).send({ msg: "User registration success",token: accessToken, Response: NewUser });
        }
      }else{
        res.status(500).send({ msg: "user registration failed" });
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
});

router.get('/', auth, async(req,res)=>{
    const newUser = await User.find();
    if(newUser){
        res.send({message:"User fetched successfully",data:newUser})
    }else{
        res.send({message:"User fetched failed",data:newUser})
    }
});

router.get('/:id', auth, async(req,res)=>{
    const newUser = await User.findById(req.params.id)
    if(newUser){
        res.send({message:"User fetched successfully",data:newUser})
    }else{
        res.send({message:"User fetched failed",data:newUser})
    }
});

router.put('/:id', auth,async(req,res)=>{
  const updateParams = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    mobileNumber:req.body.mobileNumber,
  }
    const newUser = await User.findByIdAndUpdate({"_id":req.params.id} ,updateParams, {new: true})
    if(newUser){
        res.send({message:"User updated successfully",data:newUser})
    }else{
        res.send({message:"User updated failed",data:newUser})
    }
});

router.delete('/:id', auth,async(req,res)=>{
    const newUser = await User.findByIdAndDelete(req.params.id)
    if(newUser){
        res.send({message:"User deleted successfully"})
    }else{
        res.send({message:"User deleted failed"})
    }
});


module.exports = router;