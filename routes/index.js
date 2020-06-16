var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

let transporter = nodemailer.createTransport({
    host: "rycfod.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@rycfod.com", // generated ethereal user
      pass: "lumiessa92" // generated ethereal password
    }
  });

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rycfod Api' });
});

router.post('/send_email', function(req, res, next) {
  
  console.log(req.headers.host)
  //send mail with defined transport object
  let info = transporter.sendMail({
    from: '"RycFod.com" <info@rycfod.com>', // sender address
    to: "rycfod@gmail.com,info@rycfod.com,luis.92.m@gmail.com", // list of receivers
    subject: req.body.need, // Subject line
    text: req.body.name + " "+ req.body.surname + ". Email: "+req.body.email+"\n"+req.body.message // plain text body
    //html: "<b>Hello world?</b>" // html body
  }).then(function(info){
  	console.log("Message sent: %s", info.messageId);

  });

  res.sendStatus(200);
});


module.exports = router;