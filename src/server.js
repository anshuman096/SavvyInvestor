/**
 * A node server for the SavvyInvestor. 
 * URL routing and parameter defining done with
 * expressjs. Url encoding done using bodyParser
 *
 * @author: Anshuman Dikhit, Curran Bhatia
 */

//import {cons_key, cons_sec} from './pass';



var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('file-system');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var router = express.Router();

app.use(cors());

app.use('/api', router);

// A test api url route to confirm server functionality
router.get('/stock', function(req, res) {
		res.json([{message: 'Hello World', userid: 'adikhit'},
				{message: "Good Bye", userid: 'saumi'}]);
	}
);

/**
 * api url route for getting financial stock data from
 * Alpha Vantage. Currently alpha vantage data is stored locally
 * in a file in the local directory. Alpha Vantage api call was
 * made on postman. JSON data is collected modified and returned
 * in ideal format for visualization.
 *
 */
router.get('/company/:symbol/:dataType', function(req, res) {
	console.log('company symbol: ' + req.params.symbol);
	console.log('data type: ' + req.params.dataType);
	var filename = req.params.symbol.toLowerCase() + '.json';
	var filepath = './daily_time_series_compact/' + filename;

	var data;
	try {
		data = fs.readFileSync(filepath, 'utf-8');
	} catch(err) {
		throw err;
	}
	//fs.readFileSync(filepath, 'utf-8');
	var jsondata = JSON.parse(data);
	//console.log('company data: ' + JSON.jsondata);
	var stockdata = jsondata["Time Series (Daily)"];
	var companyData = {};
	var datasets = []; //chart datasets
	var dates = []; //chart labels

	var closingValueDict = {};
	var openingValueDict = {};
	initializeDict(closingValueDict, "Closing Values", "rgba(220, 0, 220, 0.2", "rgba(220, 0, 220, 1");
	initializeDict(openingValueDict, "Opening Values", "rgba(0, 220, 220, 0.2)", "rgba(220, 220, 220, 1");
	var openingValues = [];
	var closingValues = [];
	var result = [];
	for(var key in stockdata) {
		dates.push(key);
		openingValues.push(stockdata[key]["1. open"]);
		closingValues.push(stockdata[key]["4. close"]);
		result.push({date:key, opening:stockdata[key]["1. open"], closing:stockdata[key]["4. close"]});
	}
	openingValueDict["data"] = openingValues.reverse();
	closingValueDict["data"] = closingValues.reverse(); //first dataset JSON object created
	datasets.push(openingValueDict);
	datasets.push(closingValueDict);
	companyData["labels"] = dates.reverse();
	companyData["datasets"] = datasets;
	companyData["tableView"] = result;
	//console.log('company data results: ' + JSON.stringify(companyData));
	res.send(companyData);
});


router.route('/company/:symbol/twitter/', function(req, res) {
    request.get({
      url: 'https://api.twitter.com/1.1/search/tweets.json?q=%40twitterapi',
      oauth: {
        oauth_callback: "",
        consumer_key: 'OKmsjyeAnvvxPppoJSt5S557o',
        consumer_secret: '1LqgCGJr16OAdaIZqjHeP147omcdb9XqfKHRTuMW4NAZ9fgmUX'
      }
    }).then(result) (data => {
            
   		console.log("Hello, we made it here")

    });
});


     // function (err, r, body) {
     //  if (err) {
     //    return res.send(500, { message: err.message });
     //  }


      //

      //var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      //res.send(JSON.parse(jsonStr));
    //});
  //});

function initializeDict(dict, label, fillColor, lineColor) {
	dict["label"] = label;
	dict["fillColor"] = fillColor;
	dict["strokeColor"] = lineColor;
	dict["pointColor"] = lineColor;
	dict["pointStrokeColor"] = "#000";
	dict["pointHighlightFill"] = "#000";
	dict["pointHighlightStroke"] = lineColor;
}



var port = process.env.PORT || 3001;
var server = app.listen(port);
console.log("Web Server Up");

module.exports = app;
