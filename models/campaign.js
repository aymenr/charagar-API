var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var campaignSchema = new Schema(
{
    name: String,
    goal: Number,
    description: String,
    campaignImage: String,
    startDate: Date,
    endDate: Date,
    published: Boolean,
    isZakaat: Boolean,
    amountRaised: Number,
    image: String,
    video: String,
    type: String, //individual or cause
    creator: String, //id
    isApproved : Boolean,
    requestedDeletion: Boolean,
    category: String //DEFINE LIST HERE: health,education
});


var Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {
    Campaign: Campaign
};