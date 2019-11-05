const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false,
        required:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Task=mongoose.model('Task',taskSchema)
/*const newtask=new task({
    description:"washing dishes",
    completed:true
})
newtask.save().then(()=>{
    console.log('task added successfully')
}).catch((error)=>{
    console.log(error)
})*/

module.exports=Task