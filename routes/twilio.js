var express = require('express');
var fs = require('fs');
var router = express.Router();


const accountSid = 'AC545f0044e6571b19f7625bf2581768d0';
const authToken = 'ea4f61f63e610de3af3d9cd3b5b42fa7';
var twilio = require('twilio');

var client = new twilio(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const twiml = new VoiceResponse();


router.post('/conference', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  console.log("conference");
  const twiml = new VoiceResponse();

	
  // Start with a <Dial> verb
  const dial = twiml.dial();
  // If the caller is our MODERATOR, then start the conference when they
  // join and end the conference when they leave
  dial.conference('786-597-0865_786-441-3942', {
	  startConferenceOnEnter: false,
	});

  

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});


// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post('/voice', (request, response) => {
	console.log("123");
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    action: 'http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/gather',
  });
  gather.say('Please press 1 for sales.');

  // If the user doesn't enter input, loop
  twiml.redirect('http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/voice');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create a route that will handle <Gather> input
router.post('/gather', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  

  if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1':
        twiml.say('You selected sales. Good for you!');
       	twiml.redirect('http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/call-second');
        break;
      case '2':
        twiml.say('You need support. We will help!');
        break;
      default:
        twiml.say("Sorry, I don't understand that choice.");
        //twiml.redirect('/voice');
        twiml.redirect('http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/voice');
        break;
    }
  } else {
    // If no input was sent, redirect to the /voice route
    //twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});


router.get('/call-second',  secondCaller);
router.post('/call-second',  secondCaller);

router.get('/goodbye',  goodBye);
router.post('/goodbye',  goodBye);


function secondCaller(req, res) {
	console.log("calling second user");
	const response = new twilio.twiml.VoiceResponse();
	response.say("Connecting you.");
	
	client.calls
      .create({
         url: 'https://rycfod.com/gather.xml',
         to: '+17865970865',
         from: '786-422-9143'
       })
      .then(function(call){
      	console.log(call.sid);

      } ).catch(function(error){
			console.log(error)
		});

	const dial = response.dial();
	dial.conference('786-597-0865_786-441-3942', {
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
    });
    response.hangup();
	//response.redirect('http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/goodbye');
	res.set('Content-Type', 'text/xml');
	return res.send(response.toString());
}

function goodBye(req, res) {
	console.log("Good Bye");
	const response = new twilio.twiml.VoiceResponse();
	response.say("Thank you for using Call Congress! " +
               "Your voice makes a difference. Goodbye.");
	response.hangup();
	res.set('Content-Type', 'text/xml');
	res.send(response.toString());
}


router.get('/validation', function(req, res, next) {
  client.validationRequests
  .create({friendlyName: 'Luis Miguel Escalante', phoneNumber: '+17864413942'})
  .then(validation_request => console.log(validation_request)).catch(error => console.log(error));  
})


router.get('/validated', function(req, res, next) {
  client.outgoingCallerIds.list({limit: 20})
  .then(outgoingCallerIds => outgoingCallerIds.forEach(o => console.log(o.sid)));
})


router.get('/call', function(req, res, next) {
  console.log("tew")

  // client.messages.create({
  //     body: 'Hello from the pc',
  //     to: '+17863269459',  // Text this number
  //     from: '+17864229143' // From a valid Twilio number
  // })
  // .then(function(message){
  //  console.log("test")
  // }).catch(function(error){
  //  console.log(error)    
  // });
  
  

      client.calls
      .create({
         url: 'https://rycfod.com/gather.xml',
         to: '+17864413942',
         from: "17864413942"
         //from: '786-422-9143'
       })
      .then(function(call){
        console.log(call.sid);

      } ).catch(function(error){
      console.log(error)
  });

      

// const VoiceResponse = require('twilio').twiml.VoiceResponse;


// const response = new VoiceResponse();
// const dial = response.dial();
// dial.number({
//     statusCallbackEvent: 'initiated ringing answered completed',
//     statusCallback: 'http://c-73-57-37-156.hsd1.fl.comcast.net:8081/twilio/gather',
//     statusCallbackMethod: 'POST'
// }, '+17864413942');


    
  // client.calls
  //       .create({
  //          url: 'xml/gather.xml',
  //          to: '+17864413942',
  //          from: '+17864229143'
  //        })
  //       .then(call => console.log(call.sid)).catch(function(error){
  //      console.log(error)
  //    });;

});


router.get('/sms', function(req, res, next) {
  console.log("tew")

  client.messages.create({
      body: 'Hello from the pc',
      to: '+17864413942',  // Text this number
      from: '+17864229143' // From a valid Twilio number
  })
  .then(function(message){
   console.log("test")
  }).catch(function(error){
   console.log(error)    
  });
  
});

module.exports = router;