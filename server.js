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
var fs = require('fs');

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
app.set('views', path.join(__dirname, 'www', 'templates'));

app.use(express.cookieParser());
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){ res.render('index.html')});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


















