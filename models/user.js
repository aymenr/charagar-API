var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var contributionSchema = new Schema(
{
    campaignId: String,
    amount: Number,
    confirmed: Boolean,
    dateGiven: Date
})



var userSchema = new Schema(
{
    name:
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

    },
    name:String,
    contributions: [contributionSchema],
    city:String,
    country:String,
    postalCode:String,
    streetAddress:String,
    password: String,
    accessLevel: String,
    signupDate: Date,
    updatedAt:Date,
    createdAt:Date
});

var contributionSchema = new Schema(
{
    campaignId: String,
    amount: Number,
    confirmed: Boolean,
    dateGiven: Date
})


var User = mongoose.model('User', userSchema);

var Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = {
    User: User,
    Contribution: Contribution
};