/**
 * Module dependencies.
 * Vishesh
*/

var findByAttr = function(array, attr, value) {
  for(var i = 0; i < array.length; i++) {
    if(array[i][attr] === value) {
      return array[i];
    }
  }
  return -1;
}

var findIndexByAttr = function(array, attr, value) {
  for(var i = 0; i < array.length; i++) {
    if(array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var partials = require('express-partials');
var fs = require('fs');

var data = require('./data.json');

// //This code lets us test on local, or use heroku properly.
// var settings;
// if(fs.existsSync('./settings.js')){
//   settings = require('./settings.js');
// }else{
//   settings = {};
// }

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'public'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.engine('html', handlebars());
app.use(express.cookieParser());
app.use(express.session({secret: 'pink unicornians'}));
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){ res.render('index.html')});
app.get('/plans/:name', function(req, res) {
  var plan = findByAttr(data.plans, "name", req.params.name);
  if (plan == -1) { res.send(404);}
  res.json(plan);
});

app.post('/plans/:name', function(req, res) {
  var path = req.params.path;
  var tosave = req.body;
  var plan = findByAttr(data.plans, "name", req.params.name);
  if (plan == -1) {
    data.plans.append(tosave);
  } else {
    plan.title = tosave.title;
    plan.name = tosave.name;
    plan.features = tosave.features;
  }

  res.send(200);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


















