var express = require('express');
var router = express.Router();
var Client = require('ftp');
var replace = require('replace-in-file');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/indexapi', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var filename = req.body.indexname;
  var c = new Client();
   c.on('ready', function() {
    c.put('IndexTest.html', '/public_html/espia.spyshopmiami.com/HtmlForTesting/'+filename.replace(" ","-")+'.html', function(err) {
		if (err) throw err;
		const options = {
			files: 'indexados.html',
			from: '<!--%$AutoIndex%$-->',
			to: '<!--%$AutoIndex%$--> \n<a href="HtmlForTesting/'+filename.replace(" ","-")+'.html" target="_blank"><font size=4>'+filename+'</font></a>\n<br>\n',
		};

		const results = replace(options).then(results => {
			console.log('Replacement results:', results);
			c.put('indexados.html', '/public_html/espia.spyshopmiami.com/indexados.html', function(err) {
				if (err) throw err;
				c.end();
				res.redirect('/done');
		    });
		})
		.catch(error => {
			console.error('Error occurred:', error);
		});
      	
    });

  });
   c.connect({
  	host: "192.232.253.193",
  	port: 21,
  	user: "spyshopmiami",
  	password: "Spy2018/*-"
  });
});


router.get('/done', function(req, res, next) {
	res.render('done');
})
router.get('/testftp', function(req, res, next) {

  var c = new Client();
   c.on('ready', function() {
    c.list('/public_html/espia.spyshopmiami.com/HtmlForTesting',function(err, list) {

      if (err) throw err;
      res.render('index', { title: 'Express' });
      console.dir(list);
      c.end();
    });
  });
   c.connect({
  	host: "192.232.253.193",
  	port: 21,
  	user: "spyshopmiami",
  	password: "Spy2018/*-"
  });
});

router.get('/testputftp', function(req, res, next) {

  var c = new Client();
   c.on('ready', function() {
    c.put('IndexTest.html', '/public_html/espia.spyshopmiami.com/HtmlForTesting/IndexTest.html', function(err) {
      if (err) throw err;
      res.render('index', { title: 'Page Done upload' });
      c.put('indexados.html', '/public_html/espia.spyshopmiami.com/indexados.html', function(err) {
	      if (err) throw err;
	      res.render('index', { title: 'Page Done upload' });
	      c.end();
	    });
    });

  });
   c.connect({
  	host: "192.232.253.193",
  	port: 21,
  	user: "spyshopmiami",
  	password: "Spy2018/*-"
  });
});

module.exports = router;
