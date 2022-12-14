const router = require('express').Router();
const auth = require('../middlewares/auth').isAuthenticated;
const product = require('../model/product.model');

router.post('/', auth,async(req,res)=>{
    const userdetails = req.tokenData;

    const createparams = {
        Name:req.body.Name,
        model:req.body.model,
        year:req.body.year,
        status:req.body.status,
        createdBy: userdetails.email,
    }
    const newproduct = await product.create(createparams);
    if(newproduct){
        res.send({message:"product created successfully",data:newproduct})
    }else{
        res.send({message:"product created failed",data:newproduct})

    }
});

router.get('/', auth,async(req,res)=>{
    const userdetails = req.tokenData;
    const newproduct = await product.find();
    if(newproduct){
        res.send({message:"product fetched successfully",data:newproduct})
    }else{
        res.send({message:"product fetched failed",data:newproduct})
    }
});

router.get('/:id', auth,async(req,res)=>{
    const newproduct = await product.findById(req.params.id);
    if(newproduct){
        res.send({message:"product fetched successfully",data:newproduct})
    }else{
        res.send({message:"product fetched failed",data:newproduct})
    }
});

router.put('/:id', auth,async(req,res)=>{
    const updateParams ={

    }
    const newproduct = await product.findByIdAndUpdate({"_id":req.params.id},updateParams, {new: true})
    if(newproduct){
        res.send({message:"product updated successfully",data:newproduct})
        }else{
        res.send({message:"product updated failed",data:newproduct})
    }
});

router.delete('/:id', auth,async(req,res)=>{
    const newproduct = await product.findByIdAndDelete(req.params.id)
    if(newproduct){
        res.send({message:"product deleted successfully"})
    }else{
        res.send({message:"product deleted failed"})
    }
});


module.exports = router;