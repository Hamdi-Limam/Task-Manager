const express=require('express')
const Task=require('../models/tasks')
const router = new express.Router()
const auth=require('../middleware/auth')

router.post('/tasks',auth,async(req,res)=>{
    
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.send(e)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:dec
router.get('/tasks',auth,async(req,res)=>{
   const match={}
   const sort={}
   if(req.query.completed){
       match.completed=req.query.completed==='true'
   }

   if(req.query.sortBy){
       const parts=req.query.sortBy.split(':')
       sort[parts[0]]=parts[1]==='desc' ? -1 : 1
   }

try{
    //const tasks=await Task.find({owner:req.user._id,path:'tasks',match:{completed:false}})
    await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.send(req.user.tasks)
}catch(e){
    res.send(e)
}
        
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    try{
        const task=await Task.findOne({_id,owner:req.user._id})

        if(!task){
           return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedupdates=['completed','description']
    const isValidOperation = updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'invalid updates !'})
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

        
        
       // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.send(e)
    }
 
})

module.exports=router