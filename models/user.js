const mongoose=require('mongoose');
const passport = require('passport');
const schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema);