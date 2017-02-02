var userModel = require('../models/user.js');
var utilities = require('./helpers.js')
var ObjectId = require('mongoose').Types.ObjectId;
var q = require('q');
var _ = require('lodash-node');
var config = require('../config/config.json');
var jwt = require('jwt-simple');


exports.loginUser = function(req, res)
{
    var userProjection=
    {
        password:0,
        city:0,
        country:0,
        phone:0,
        signupDate:0,
        campaigns:0,
        contributions:0
    };

    var userEmail = "";

    if (req.body.email)
        userEmail = req.body.email.toLowerCase();

    userModel.User
    .findOne(
    {
        email: userEmail,
        password: req.body.password
    },userProjection)
    .lean()
    .exec(function(err, result)
    {
        if (err)
        {
            utilities.make_error(res, 'API_EXCEPTION', err.message);
        } else {

            if (!result)
            {
             utilities.make_error(res, 'NOT_EXISTS', "Incorrect email or password");
         } else
         {

            res.json(generateToken(result));
        };
    }
})
}

function generateToken(user) {

    var payload = {
        name: user.name,
        email: user.email,
        accessLevel: user.accessLevel,
        _id: user._id,
        expires:expiresIn(1)
    };

    var token = jwt.encode(payload, config.secret);

    return {
        token: token,
        expires: payload.expires,
        user: user
    };
}


function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
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
            } else
            {
                var userData = {
                    email: req.body.email.toLowerCase(),
                    name: req.body.name,
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
    user.save(function(err, response)
    {
        if (err)
        {
            deferred.reject(err);
        }
        else
        {
            deferred.resolve(response);
        }
    });
    return deferred.promise;
}


exports.getUserPersonalData = function(req, res)
{
    var userProjection = {
        password:0,
        _id:0,
        campaigns:0,
        contributions:0
    }
    // console.log("HEADER:",req.header);
    userModel.User
    .find(
        { _id: new ObjectId(req.body.userId)}, userProjection)
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
