const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./tasks')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive')
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valide')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.includes('password')){
                throw new Error('the password should not containt the word password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCrendentials=async(email,password)=>{
    const user=await User.findOne({email})

    if(!user){
        
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){

        throw new Error('unable to login')
    }

    return user
}

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user.id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON= function (){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


//hash password before saving
userSchema.pre('save',async function (next){
    const user =this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

//delete user tasks when user is deleted
userSchema.pre('remove',async function (next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
/*const me=new User({
    name:'houssem',
    age:10,
    email:'ssddadf@gmail.com',
    password:'abcdefghijklmnop'
})

me.save().then((result)=>{
    console.log('Success')
}).catch((error)=>{
    console.log(error)
})
*/
module.exports=User