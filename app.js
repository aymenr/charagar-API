var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config.json');
var router = express.Router();
var app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//controllers
var index = require('./controllers/index.js');
var user = require('./controllers/user.js');
var campaign= require('./controllers/campaign.js');
var jwtauth = require('./controllers/jwtauth.js');
var auth = require('./controllers/auth.js');

var allowCrossDomain = function(req, res, next)
{
    var host = "http://";
    var origins = [
        host + "0.0.0.0:8800",
        host + "0.0.0.0:8000",
        host + "192.168.1.9:8800",
        host + "localhost:8800",
        host + "localhost:9000",
        host + "localhost:9001",
        host + "localhost:3000"
    ];

    if (typeof(req.headers.origin) !== 'undefined' &&
        (origins.indexOf(req.headers.origin) > -1 ||
            req.headers.origin.indexOf("chrome-extension") > -1
        )
    ) // found
    {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    else
    {
        res.header('Access-Control-Allow-Origin', "http://charagar.pk");
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method)
    {
        res.send(200);
    }
    else
    {
        next();
    }
}


app.use(allowCrossDomain);

app.all('/api/v1/*', [jwtauth]);

//routes
app.get('/', index.index);


// =========================LOGIN/SIGNUP=============================//
app.post('/loginUser', user.loginUser);
app.post('/signupUser',user.signupUser);
app.get('/api/v1/verifyToken', auth.verifyToken);

//==========================CAMPAIGN END POINTS======================//
app.get('/getLiveCampaigns',campaign.getLiveCampaigns);
app.get('/getPastCampaigns',campaign.getPastCampaigns);
app.get('/getGeneralFund',campaign.getGeneralFund)
app.get('/getZakaatFund',campaign.getZakaatFund)
app.get('/getAllCampaigns',campaign.getAllCampaigns);
app.post('/getCampaignsByCategory',campaign.getCampaignsByCategory);
app.get('/getCampaign/:campaignId',campaign.getCampaign);


app.post('/api/v1/getCampaignsForUser',campaign.getCampaignsForUser);
app.post('/api/v1/saveCampaign',campaign.saveCampaign);
app.post('/api/v1/getContributionsForUser',campaign.getContributionsForUser);

app.post('/api/v1/admin/editCampaign',campaign.editCampaign);


//=========================USER END POINTS=============================================//

app.get('/api/v1/user/getUserPersonalData/:userId', user.getUserPersonalData);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



app.set('view engine', 'jade');
mongoose.connect(config.dbPath);




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
