'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));



restService.use(bodyParser.json());

restService.post('/echo', function (req, res) {
    //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    //var demo="Demo New";
	if(req.body.result.action=="demo")
	{
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
	}
	 if(req.body.result.action=='demo1')
  {
   var request = require('request');
            request({
                url:'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/statewiseprice/getprice?product_profile_id=salutorxspcol&state_id=240'
            },function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    var responseCode=result.responseData;
                    var productPrice=responseCode.product_price;
                    var price=productPrice[0].price +'Rs';
			        res.json({'speech': 'price',
              'displayText': 'price',
              'messages': 
              [
		      {
                   'type':0,
                   'speech':price
               },
                {'title': 'Please provide your feedback',
                'replies': ['Feedback'],
                'type': 2}],
              ],
              'source': 'dimwei.com'});
                }
                else {
                    console(log.error());
                }
            });
   
 
  }
	if(req.body.result.action=='demo2')
  {
    
     var pincode=110005;

            var StateId='';
            var CityId='';
            var City='';
            var State='';
            var Country='';
            var lat='';
            var lng='';
            var State_Name='';
            var City_Name='';
            var address='';
            var stateF='';
            var dealerId='';
            var address_components='';
            var message='';

            var request = require('request');
            //1
            request({
                url:'https://maps.googleapis.com/maps/api/geocode/json?address='+pincode+'&key=AIzaSyD_YqB4d_-xKcmNP9jJCiPkJYDS8J3f6pI'
            },function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    var Results = result.results;
                    for (var i = 0; i < Results.length; i++)
                    {
                        address = Results[i].formatted_address;
                        address_components = Results[i].address_components;
                        var len = address_components.length;
                        var gemotry = Results[i].geometry;
                        var location = gemotry.location;
                        lat = location.lat;
                        lng = location.lng;
                        for (var j = 0; j < address_components.length; j++) {
                            if (j == len - 3) {
                                City = address_components[j].long_name;
                            }
                            else if (j == len - 2) {
                                State = address_components[j].long_name;
                            }
                            else if (j == len - 1) {
                                Country = address_components[j].long_name;
                            }
                        }
                    }
                    console.log("State %s",State);
                    console.log("City %s",City);
                    console.log("Country %s",Country);
                   
                    var view = State + City + Country + 'Hi now you can get your dealers' + lat + lng;
                    //2
                    request({
                        url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/state'
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var res = JSON.parse(body);
                            var responseData = res.responseData;
                            var states = responseData.states;

                            for (var i = 0; i < states.length; i++) {
                                if (states[i].state_name === State) {
                                    StateId = states[i].profile_id;
                                    State_Name = states[i].state_name;

                                }

                            }
                            var reply2 = [
                                {
                                    "content_type": "text",
                                    "title": "Restart",
                                    "payload": "Restart"
                                }
                            ];
                            console.log("State Id %s",StateId);
                            if(StateId=='') {
                                sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply2);
                            }

                            //sendTextMessage(sender,StateId);
                            //3
                            request({
                                url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/city?profile_id=' + StateId
                            }, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var result = JSON.parse(body);
                                    var responsData = result.responseData;
                                    var citites = responsData.cities;
                                    for (var i = 0; i < citites.length; i++) {

                                        if (citites[i].city_name == City) {
                                            CityId = citites[i].city_profile_id;
                                        }
                                    }
                                    console.log("City Id %s",CityId);
                                    var reply3 = [
                                        {
                                            "content_type": "text",
                                            "title": "Restart",
                                            "payload": "Restart"
                                        }
                                    ];
                                    if(CityId=='') {
                                        //sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply3);
                                    }

                                  
                                    request({
                                        url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/search?type=sales&profile_id=' + StateId + '&city_profile_id=' + CityId
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            var result = JSON.parse(body);
                                            var resData = result.responseData;
                                            var dealers = resData.dealers;
                                            dealerId=dealers[0].dealer_name;
                                            var dealer_name = dealers[0].dealer_name;
                                            var dealer_add = dealers[0].dealer_address;
                                            var dealer_Mob = dealers[0].sales_manager_mobile;
                                            var text1 = dealer_name + dealer_add + dealer_Mob;
                                            
                                            console.log("Dealer information %s",text1);
                                            //if(text1!='') {
         	        res.json({'speech': 'price',
              'displayText': 'text1',
              'messages': 
              [
		      {
                   'type':0,
                   'speech':price
               },
                {'title': 'Please provide your feedback',
                'replies': ['Feedback'],
                'type': 2}],
              ],
              'source': 'dimwei.com'});
                }
                                    //}
                                           
                                            //sendTextMessage(sender,text1);
                                        }
                                        else {
                                            console(log.error());
                                        }
                                    });
                                   

                                }
                                else {
                                    console(log.error());
                                }
                            });
                        }
                        else {
                            console(log.error());
                        }
                    });

                }
                else {
                    console(log.error());

                }

            });
  }
			       
   });

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
