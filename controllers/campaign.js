var campaignModel = require('../models/campaign.js');
var utilities = require('./helpers.js')
var ObjectId = require('mongoose').Types.ObjectId;
var q = require('q');
var _ = require('lodash-node');
var userModel = require('../models/user.js');


exports.getLiveCampaigns = function(req, res)
{
	console.log("inside function ");
	campaignModel.Campaign
	.find({
		$and:[
		{"endDate":
		{
			"$gte": new Date()
		}},
		{
			"isApproved": {$ne: false}
		}]} )
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

		}


	})

}




exports.getPastCampaigns = function(req, res)
{

	campaignModel.Campaign
	.find({
		$and:[
		{"endDate":
		{
			"$lte": new Date()
		}},
		{
			"isApproved": {$ne: false}
		}]} )
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

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


			res.send(result);

		}


	})

}


exports.deleteCampaign = function(req, res)
{
	campaignModel.Campaign
	.find({"_id":ObjectId(req.body.campaignId)})
	.remove()
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {
			console.log("DELETE;");
			// if(result.length == 0) {
			// 	utilities.make_error(res,"NOT_EXISTS",err)
			// } else {
				res.send(result);
			//}
		}


	})

}



exports.getAllCampaigns = function(req, res)
{

	campaignModel.Campaign
	.find({})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

		}


	})

}


exports.getGeneralFund= function(req, res)
{

	campaignModel.Campaign
	.find({"name":"General Fund"})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

		}


	})

}


exports.getZakaatFund= function(req, res)
{

	campaignModel.Campaign
	.find({"name":"General Zakaat Fund"})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

		}


	})

}

exports.getCampaignsForUser= function(req, res)
{

	campaignModel.Campaign
	.find({"creator":req.body.userId})
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);

		}


	})

}


exports.getCampaignsByCategory= function(req, res)
{
	var query;

	if(req.body.category) {
		query = {"category":req.body.category,"isApproved":true}
	} else {
		query = {"isApproved":true}
	}
	campaignModel.Campaign
	.find(query)
	.exec(function(err,result) {

		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {


			res.send(result);
		}
	})


}

exports.saveCampaign = function(req,res) {

	var campaign = new campaignModel.Campaign(req.body.campaign);
	console.log('CAMPAIGN:',campaign);
	campaign.save(function(err, response)
	{
		if (err)
		{
			console.log(err);
			utilities.make_error(res,"API_EXCEPTION",err)
		}
		else
		{
			res.send(200);
		}
	});

}


exports.getContributionsForUser = function(req,res) {
	console.log("xxxxxxx:",req.body.userId);
	userModel.User
	.find({"_id":ObjectId(req.body.userId)},{"contributions":1,"_id":0})
	.lean()
	.exec(function(err,contributions) {
		console.log("AAAAA");
		if(err) {
			console.log("BBBBB");
			utilities.make_error(res,"API_EXCEPTION",err)
		} else {
			console.log("CCCCCCC");
			if(contributions.length==0) {
				utilities.make_error(res,"NOT_EXISTS","User Not Found");
			}

			if(contributions[0].contributions && contributions[0].contributions.length !=0 ) {

				var contributionArray = extractCampaignIds(contributions[0].contributions)
				getCampaignsByIds(contributionArray).then(function(campaigns){

					var finalResult = mergeContributionsAndCampaigns(contributions[0].contributions,campaigns)
					console.log("good shot:",finalResult);
					res.send(finalResult);
				}, function(err) {
					utilities.make_error(res,"API_EXCEPTION",err)
				})
			} else {
				res.send([]);
			}

		}
	})


}

exports.editCampaign = function(req,res) {
	console.log("id:", req.body.campaignId)
	console.log("entire edit:", req.body.campaign);
	campaignModel.Campaign
	.update({"_id":ObjectId(req.body.campaignId)},req.body.campaign, function(err,campaign) {
		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		}  else {
			res.send(200);
		}
	})


}
exports.requestDeletion = function(req,res) {



	campaignModel.Campaign
	.update({"_id":ObjectId(req.body.campaignId),"creator":req.body.userId},{$set:{"requestedDeletion":true}}, function(err,campaign) {
		if(err) {
			utilities.make_error(res,"API_EXCEPTION",err)
		}  else {

			res.send("done");
		}
	})


}





mergeContributionsAndCampaigns = function(contributions,campaigns) {

	for ( var i = 0; i <campaigns.length;i++) {

		_.find(contributions,function(o) {
			if (campaigns[i]._id.toString()== o.campaignId){

				campaigns[i].contribution = o;
			}
		})

	}

	return campaigns;


}

extractCampaignIds = function(objects) {

	var idArray = [];
	for ( var i = 0; i <objects.length;i++) {
		idArray.push(objects[i].campaignId)
	}
	return idArray;
}

getCampaignsByIds = function(campaignIds) {
	var deferred = q.defer()

	campaignIds = convertStringsToIDs(campaignIds);

	campaignModel.Campaign
	.find({"_id":{
		$in : campaignIds
	}})
	.lean()
	.exec(function(err,result) {

		if(err) {
			deferred.reject(err);
		} else {

			if(result.length == 0) {
				deferred.reject("Cant Find Campaigns")
			} else {
				deferred.resolve(result);
			}
		}


	})
	return deferred.promise;
}




convertStringsToIDs = function(ids) {

	for ( var i = 0; i < ids.length; i++) {
		ids[i] = ObjectId(ids[i])

	}
	return ids;
}

