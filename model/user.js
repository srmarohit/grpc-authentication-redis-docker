const mongoose = require("mongoose");


// import npms modules
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
});

userSchema.statics.login = async function(email, password){

    const user = await this.findOne({email});

    if(!user){
        return ;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    return isPasswordMatched ? user : null ;
}


module.exports = mongoose.model("User", userSchema) ;