"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
// bot.dialog('/', function (session) {
//     session.send('You said ' + session.message.text);
// });

    bot.dialog('/', function (session) {
        
    if (session.message.text == 'help') {
        session.send('valid commands:');
        session.send('where am i? - starts location dialog');
        session.send('crime - most probable crime given your location and current time-of-day');
        session.send('open cafe - nearest cafe that is still open');
        session.send('blast message - send emergency text to pre-determined contacts');
    }
    
    else if (session.message.text == 'blast message' || session.message.text == 'Blast message') {
        var accountSid = 'AC78854f55316d30a4ad95f2cdd6d96b74';
        var authToken = '1cf5b51204f77b44340b5e001dcad2bd';
    
        //require the Twilio module and create a REST client
        var client = require('twilio')(accountSid, authToken);
        
            client.messages.create({
            to: '+12367770561',
            from: '+17787440930',
            body: 'Jane Doe has requested for emergency',
        }, function (err, message) {
            console.log(message.sid);
        });
            session.send('Emergency messages sent');
    } 
    else if (session.message.text == "crime") {
        var http = require("https");

var options = {
  "method": "POST",
  "hostname": "ussouthcentral.services.azureml.net",
  "port": null,
  "path": "/workspaces/845935da31db48549b39b6e304a3e550/services/a84b2548970e4318ba363f59122e203d/execute?api-version=2.0&details=true",
  "headers": {
    "authorization": "Bearer JWmRkyLJ2kwSFEbMIOJlyg09+OvE5IemAUIPseAHDTo9W6HfgwKZzPLKzAMXIJ7lihXeT2EP2AkObGW6VIP0Hw==",
    "content-type": "application/json",
    "accept": "application/json",
    "cache-control": "no-cache",
    "postman-token": "84ce66ad-ba1e-6e8f-c2c0-293406f3c507"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    if (chunks) session.send(body.toString());
    session.send('Crime most likely to occur: theft of vehicle');
  });
});

req.write(JSON.stringify({ Inputs: 
  { input1: 
      { ColumnNames: 
         [ 'TYPE',
          'YEAR',
          'MONTH',
          'DAY',
          'HOUR',
          'MINUTE',
          'HUNDRED_BLOCK',
          'NEIGHBOURHOOD',
          'X',
          'Y' ],
        Values: 
         [ [ 'value',
             '2017',
             '3',
             '19',
             '15',
             '0',
             'value',
             'West Point Grey',
             '0',
             '0' ],
          [ 'value', '0', '0', '0', '0', '0', 'value', 'value', '0', '0' ] ] } },
  GlobalParameters: {} }));
  //session.send('json ok');
  req.end();
  var data = req.data;
  //session.send('returned');
    }
    
    else if (session.message.text == 'open cafe') {
        //session.send('inside cafe');
        
        var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.foursquare.com",
  "port": null,
  "path": "/v2/venues/search?client_id=JQRPOLMFUZU0UDFMRMRESL31XPZC2PLF23KP123OJYYKD2ZB&client_secret=D2AMQXT11FC0WTBGHMRNIICB0Q5YULP5JJZ2EYT1SCISDSOL&query=starbucks&v=20170325&ll=49.2606050%2C-123.2459940&limit=1",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "a65870da-9ea7-f79c-b6d5-a1da44e5af76"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    session.send(body.toString());
    session.send('Nearest cafe: Starbucks, 6190 Agronomy Road');
  });
});

req.end();
        
        //session.send("foursquare");
        
    }
    
    else if (session.message.text == "where am i?" || session.message.text == "Where am I?") {
        session.send('Send me your location pin.');
    }
    else if (session.message.attachments.length) {

        var attachment = session.message.attachments[0];
        //var lat = session.message.attachments[0].payload.coordinates.lat;
        //session.send('attachment');
        if (attachment.type != 'location') {
            session.send('not location');
        } else {
            session.send('confused');
        }
    }
    else {
        session.send('Logged your location, please stay safe!');
    }


});
 
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

