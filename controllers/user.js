var userModel = require('../models/user.js');
var utilities = require('./helpers.js')
var ObjectId = require('mongoose').Types.ObjectId;
var q = require('q');
var _ = require('lodash-node');

/*--------------------------------------------
Login / Signup
--------------------------------------------*/

var userProjection=
{
    password:0,
    city:0,
    country:0,
    phone:0
};

exports.loginUser = function(req, res)
{
    var userEmail = "";
    if (req.body.email)
        userEmail = req.body.email.toLowerCase();
    console.log(userEmail);

    userModel.User
        .findOne(
        {
            email: userEmail,
            password: req.body.password
        },
        userProjection)
        .lean()
        .exec(function(err, result)
        {
            if (err)
            {
                utilities.make_error(res, 'API_EXCEPTION', err.message);
            }
            if (!result)
            {
                 utilities.make_error(res, 'NOT_EXISTS', "Incorrect email or password");
            }
            else
            {
                res.send(result);
            };
        })

}

exports.getUserPersonalData = function(req, res)
{
    var userProjection = {
        password:0,
        _id:0,
        campaigns:0
    }
    var id = req.params.userId;
    userModel.User
        .find(
        { _id: new ObjectId(id)}, userProjection)
        .exec(function(err, result)
        {
            if (err)
            {
                utilities.make_error(res, 'API_EXCEPTION', err.message);
            }
            else
            {
                res.send(result);
            }
        });
}

exports.getUserCampaigns = function(req, res)
{

    var userProjection = {
        campaigns:1,
        _id:0
    }
    var id = req.params.userId;
    userModel.User
        .find(
        { _id: new ObjectId(id)}, userProjection)
        .exec(function(err, result)
        {
            if (err)
            {
                utilities.make_error(res, 'API_EXCEPTION', err.message);
            }
            else
            {
                res.send(result);
            }
        });
}

exports.signupUser = function(req, res)
{

    userModel.User
        .findOne(
        {
            "email": req.body.email.toLowerCase()
        })
        .lean()
        .exec(function(err, result)
        {
            if (err)
            {
                 utilities.make_error(res, "API_EXCEPTION", err.message);
            }
            else
            {
                if (result)
                {
                    utilities.make_error(res,"CANNOT_CREATE","You have already signed up. Login Instead")
                }
                else
                {
                    var userData = {
                        email: req.body.email.toLowerCase(),
                        userName: req.body.userName,
                        password: req.body.password,
                        phone: req.body.phone,
                        city: req.body.city,
                        country: req.body.country
                    };
                    performUserSignup(userData, res);
                }
            }
        });
}


function performUserSignup(userData, res)
{
    userData.signupDate = Date.now();


    // create new
    createUserAccount(userData).then(function(newUser)
    {
        res.send(newUser.toJSON());
    }, function(errRes)
    {

        utilities.make_error(res, 'API_EXCEPTION',errRes.message);
    });

}

function createUserAccount(userData)
{
    var deferred = q.defer();


    var user = new userModel.User(userData);
    console.log("SAVING:", userData, JSON.stringify(user));

    user.save(function(err, response)
    {
        if (err)
        {
            console.log("ERROR:", err);
            deferred.reject(err);

        }
        else
        {
            deferred.resolve(response);
        }
    });
    return deferred.promise;
}


exports.addCampaign = function(req, res)
{

    var userId = ObjectId(req.body.userId);
    var date = Date.now();

    userModel.User.findByIdAndUpdate(
        userId,
        {
            $push:
            {
                "campaigns":
                {
                    "name": req.body.name,
                    "goal": req.body.goal,
                    "description": req.body.description,
                    "campaignImage": "placeholder.jpeg",
                    "campaignStartDate": date
                }
            }
        },
        {
            safe: true,
            upsert: true
        },
        function(err, model)
        {
            if (err)
            {
                utilities.make_error(res, 'API_EXCEPTION',err.message);
            }
            else
            {
                res.send(200);
            }
        }
    );
}
