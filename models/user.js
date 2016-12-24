var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var campaignSchema = new Schema(
{
    name: String,
    goal: Number,
    description: String,
    campaignImage: String,
    campaignStartDate: Date,
    published: Boolean
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
    campaigns: [campaignSchema],
    city:String,
    country:String,
    postalCode:String,
    streetAddress:String,
    facebookID: String,
    avatar: String,
    password: String,
    accessLevel: Number,
    signupDate: Date,
    forgotPasswordToken: String,
    linkedIdentifier: String, // for uniquely identifying user when sharing
    updatedAt:Date,
    createdAt:Date
});

var User = mongoose.model('User', userSchema);
var Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {
    User: User,
    Campaign: Campaign
};