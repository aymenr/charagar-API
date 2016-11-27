var userModel = require('../models/user.js');
var utilities = require('./helpers.js')

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