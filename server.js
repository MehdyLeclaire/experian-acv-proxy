// Experian report service proxy
// (c) Stefaan Vanderheyden 2016

var request = require('request');
var url = require('url');
var app = require('express')();
var expressWinston = require('express-winston');
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
var winston = require('winston');

app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: false,
          colorize: false
        })
      ]}));
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize: false
    })]
}));

app.listen(8080);

app.get('/', function (req, res) {
	var parsedUrl = url.parse(req.url,true);
	var vin = parsedUrl.query.vin;
    var cid = parsedUrl.query.cid;
    var sid = parsedUrl.query.sid;
    var password = parsedUrl.query.password;
    if (vin) {
		var level = parsedUrl.query.level ? parsedUrl.query.level : 'indicators';
		request.post(
			'http://www.experian.com/ais/servlets/VHRXML', { 
				form: {
					'vinlist': vin,
					'id': cid,
					'password': password,
					'level': level,
                    'sid': sid
				}
			}
		).pipe(res);
	} else {
		res.sendStatus(200);
	}
});

console.log("Server is listening to port 8080");