var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var userCampaignSchema = new Schema(
{
    name: String,
    goal: Number,
    description: String,
    campaignImage: String,
    campaignStartDate: Date
    //@todo: add category from predefined list
});

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
    campaigns: [userCampaignSchema],
    city:String,
    country:String,
    postalCode:String,
    streetAddress:String,
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