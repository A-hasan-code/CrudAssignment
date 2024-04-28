const mongoose = require('mongoose')
const bycrypt =require('bcryptjs')

const jwt =require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true ,"please enter  Full Name"]
    },
    email:{
        type: String,
        required: [true, "please enter your email"]
    },
    password:{
        type: String,
        required:[true, "please enter your password"]
        ,
        minlength: [6,"please enter greater then 7 character one must be special  and small character"],
        select:false
    },
    role:{
        type:String,
        enum:["admin", "User"],
        default:"User"
    },
    
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,
})

//hash the password 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    
   
    this.password=await bycrypt.hash(this.password,10);
})
//jwt token make
userSchema.methods.getJwtToken =  function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
};

//compare password

userSchema.methods.comparePassword =async function(enteredPassword){
    return await bycrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User",userSchema);