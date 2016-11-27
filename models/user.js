var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var userSchema = new Schema(
{
    userName:
    {
        type: String
    },
    email:
    {
        type: String,
        unique: true,
        sparse: true
    },
    phone:
    {
        type: String,
        unique: true,
        sparse: true
    },
    name:String,
    city:String,
    country:String,
    facebookID: String,
    avatar: String,
    password: String,
    accessLevel: Number,
    signupDate: Date,
    lastLogin: Date,
    forgotPasswordToken: String,
    linkedIdentifier: String // for uniquely identifying user when sharing
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};