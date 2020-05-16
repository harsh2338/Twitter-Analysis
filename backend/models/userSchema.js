const mongo = require("mongoose");




const userSchema = mongo.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :  {
        type : String,
        required : true
    },
    created_at : {
        type :Date,
        default : Date.now()
    }
})

module.exports = mongo.model('User',userSchema);