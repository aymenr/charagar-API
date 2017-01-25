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
    images: [],
    videos: [],
    type: String, //individual or cause
    creator: String //id
    //@todo: add category from predefined list
});


var Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {
    Campaign: Campaign
};