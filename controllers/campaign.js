var campaignModel = require('../models/campaign.js');
var utilities = require('./helpers.js')
var ObjectId = require('mongoose').Types.ObjectId;
var q = require('q');
var _ = require('lodash-node');



exports.getLiveCampaigns = function(req, res)
{
	console.log("inside function ");
	campaignModel.Campaign
	.find({"endDate":
	{
		"$gte": new Date()
	}})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {

			if(result.length == 0) {
				utilities.make_error(res,"NOT_EXISTS",err)
			} else {
				res.send(result);
			}
		}


	})

}




exports.getPastCampaigns = function(req, res)
{

	campaignModel.Campaign
	.find({"endDate":
	{
		"$lte": new Date()
	}})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {

			if(result.length == 0) {
				utilities.make_error(res,"NOT_EXISTS",err)
			} else {
				res.send(result);
			}
		}


	})

}




exports.getCampaign = function(req, res)
{

	campaignModel.Campaign
	.find({"_id":ObjectId(req.params.campaignId)})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {

			if(result.length == 0) {
				utilities.make_error(res,"NOT_EXISTS",err)
			} else {
				res.send(result);
			}
		}


	})

}





