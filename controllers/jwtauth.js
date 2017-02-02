var jwt = require('jwt-simple');
var config = require('../config/config.json');
var userModel = require('../models/user.js');
var utilities = require('./helpers.js')
var ObjectId = require('mongoose').Types.ObjectId;
var q = require('q');

module.exports = function(req, res, next) {
    // get token from request
    console.log("REQUESTRTTT:",req.body);
    var token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {

        try {
          var decoded = jwt.decode(token, config.secret);

          if (decoded.exp <= Date.now()){
            res.status(400);
            res.json({
                "status": 400,
                "message": "Token Expired"
            });
            return;
        }


        // Authorize the user to see if s/he can access our resources
        validateUser(decoded._id).then(function(user) {
            if (user) {

                console.log("REQUEST BODY:",req.body.userId, " TOKEN USERID:", user[0]._id);


                if ((req.url.indexOf('admin') >= 0 && user[0].accessLevel == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
                    console.log("IMPORTANT SHIT:", req.url);
                    if(req.url.indexOf('/api/v1/user/')>=0) {
                        console.log("HEY YOU");
                        if(req.body.userId == user[0]._id){
                            next()
                        } else {
                            res.status(403);
                            res.json({"status": 403,"message": "Not Authorized"});
                            return
                        }
                    } else {
                        next()
                    }

                } else {
                    res.status(403);
                    res.json({"status": 403,"message": "Not Authorized"});
                    return;
                }

            } else {
                // No user with this name exists, respond back with a 401
                res.status(401);
                res.json({  "status": 401,"message": "Invalid User"});
                return;
            }
        })

    } catch (err) {
        res.status(500);
        res.json({"status": 500,"message": "Oops something went wrong","error": err});
    }

} else {
    res.status(401);
    res.json({  "status": 401,  "message": "Unauthorized, Invalid Token"});
    return;
}
};



function validateUser(userId)
{
  var deferred = q.defer();

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

userModel.User
.find(
    { _id: new ObjectId(userId)}, userProjection)
.exec(function(err, result)
{
    if (err)
    {
        deferred.resolve(null);
    }
    else
    {
        if(result.length ==0)
        {
            deferred.resolve(null);
        } else
        {
            deferred.resolve(result);
        }

    }
});
return deferred.promise;
}
