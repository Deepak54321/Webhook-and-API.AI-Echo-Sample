'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));



restService.use(bodyParser.json());
function mymethod(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    var demo="Demo New";
    var action=req.get("result").get("action");	
	switch(action)
	       {
		       case "demo":
			        res.json({'speech': 'When',
              'displayText': 'When',
              'messages': 
              [
               {'title': 'Please choose one of the following options',
                'replies': ['Product Enquiry',
                            'Test Drive',
                            'Complaints',
                            'Yamaha News'],
                'type': 2}
              ],
              'source': 'dimwei.com'});
			       break;
			     case "price"
			       var request = require('request');
            request({
                url:'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/statewiseprice/getprice?product_profile_id=salutorxspcol&state_id=240'
            },function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    var responseCode=result.responseData;
                    var productPrice=responseCode.product_price;
                    var price=productPrice[0].price +'Rs';
                   // var webhookReply = 'Hello ' + userName + '! Welcome from the webhook.'

  // the most basic response
                res.status(200).json({
                source: 'webhook',
                speech: price,
                displayText: price
           });
                }
                else {
                    console(log.error());
                }
            });
			       break;
			        default:
			       console.log("abc");
	       }
			       
   }

restService.post('/echo', mymethod);

//restService.post('/echo',pprice);

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});




restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
