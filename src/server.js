/**
 * A node server for the SavvyInvestor. 
 * URL routing and parameter defining done with
 * expressjs. Url encoding done using bodyParser
 *
 * @author: Anshuman Dikhit, Curran Bhatia
 */




var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('file-system');
var DB = require('./db/stockDB');
var key = require('./keys');




const fetch = require('node-fetch');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const apiKey = key.apiKey;
const apiKey2 = key.apiKey2;
const newsKey = key.newsKey;

const axios = require("axios");



var router = express.Router();

app.use(cors());

app.use('/api', router);


/**
 * api url route for getting financial stock data from
 * Alpha Vantage. Currently alpha vantage data is stored inside
 * 3 tables on a MongoDB database. The first table uses the company
 * symbol and the current timestamp as its key. The database is updated
 * each time the current timestamp and the timestamp on the company symbol
 * do not line up. This keeps the data as close to live as possible.
 *
 */
router.get('/company/:symbol', async (req, res) => {
	console.log('company symbol 2: ' + req.params.symbol);
	//console.log('data type: ' + req.params.dataType);
	//get current date and compare to cacheDate
	var result = {};
	try {
			var now = new Date();
			let lastUpdated = await DB.getCachingDate(req.params.symbol);

			if (lastUpdated != null &&  
				now.getFullYear() == lastUpdated.getFullYear() &&
				now.getMonth() == lastUpdated.getMonth() &&
				now.getDate() == lastUpdated.getDate()) {

				console.log("server.js DATE " + lastUpdated);
				console.log('DATA FROM CACHE: AS FRESH');
				uResult = await DB.getInterdayData(req.params.symbol);
				result = JSON.parse(uResult);
				
			} else {
				console.log('STALE DATA or NO DATA IN CACHE: GET FRESH');
				let callData = await getFreshDataAndUpdateCache(req.params.symbol);
				result = callData;
			}
	} catch(err) {
		console.log("company symbol reached error")
		result = {};
	}
	res.json(result);
});



router.get('/news/:searchTerm', function(req, res) {
		
		axios.get('https://newsapi.org/v2/everything?q=' + req.params.searchTerm+ '&sortBy=popularity&apiKey=' + newsKey)  
	    .then((response) => {

	      console.log("REACHES HERE")
	      console.log(response.data['articles'])
	      console.log("REACHES HERE")

	      res.send(response.data)
	      

	      this.setState({
	        isLoading: false,
	        //meta: response.data['Meta Data'],

	      }, function(){
	      		//res.send(res.json(this.state.meta))

	      });


	    })
	    .catch(function(error) {
	      console.log("THIS DOES NOT WORK")


	    }); 


	}
);

/**
 * This function will route data from alpha advantage regarding crypto currency intra day values
 * 
 * @param  req
 * @param  res
 * @return json data
 */
router.get('/coin/:currency', function(req, res) {
		
		axios.get('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=' + req.params.currency +'&market=USD&apikey=' + apiKey2)  
	    .then((response) => {

	      console.log("REACHES HERE")
	      console.log(response.data['Meta Data'])
	      console.log("REACHES HERE")

	      var coinData = {}

	      coinData['meta'] = response.data['Meta Data']
	      coinData['time data'] = response.data['Time Series (Digital Currency Intraday)']


	      // This is the response that is sent
	      res.send(res.json(coinData))

	      this.setState({
	        isLoading: false,
	        meta: response.data['Meta Data'],

	      }, function(){
	      		//res.send(res.json(this.state.meta))

	      });


	    })
	    .catch(function(error) {
	      console.log("THIS DOES NOT WORK")


	    }); 


	}
);

/**
 * API Call that will add a user account
 */
router.get('/account/add/:account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		DB.addAccount(acc[0], acc[1]);

		
		res.send(JSON.stringify({}))

	}
);


/**
 * API Call that will delete a user account
 */
router.get('/account/delete/:account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		DB.deleteAccount(acc[0], acc[1]);

		
		res.send(JSON.stringify({}))

	}
);


/**
 * API Call that will login
 */
router.get('/current/add/:account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		DB.addCurrentAccount(acc[0], acc[1]);

		
		res.send(JSON.stringify({}))

	}
);




/**
 * API Call that will logout
 */
router.get('/current/logout/:account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		DB.logoutCurrentAccount(acc[0], acc[1]);

		
		res.send(JSON.stringify({}))

	}
);

/**
 * API Call that will check current login session
 */
router.get('/current/logged', function( req, res) {
		
		console.log("entered here logged")

		DB.checkCurrentAccount().then(function (response) {
			console.log("here")
			console.log(response)
			res.send(JSON.stringify({"answer":response}))
		});

		//res.send(JSON.stringify({"answer":"response"}))

	}
);


router.get('/current/news/add/:news', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.news.split('+');

		console.log("%s, %s, %s ", acc[0], acc[1], acc[2])

		DB.addAccNews(acc[0], acc)


		//DB.addCurrentAccount(acc[0], acc[1],);

		
		res.send(JSON.stringify({}))

	}
);

router.get('/current/news/update/:news', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.news.split('+');

		console.log("%s, %s, %s ", acc[0], acc[1], acc[2])

		DB.updateAccNews(acc[0], acc)


		//DB.addCurrentAccount(acc[0], acc[1],);

		
		res.send(JSON.stringify({}))

	}
);

router.get('/current/news/receive/:user', function(req, res) {
		
		
		console.log("Entering mongo")


		DB.checkAccNews(req.params.user).then(function (response) {
			console.log(response)
			res.send(JSON.stringify({"answer":response}))
		});


		//DB.addCurrentAccount(acc[0], acc[1],);

		

	}
);

/**
 * API Call that will validate a user account
 */
router.get('/account/check/:account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		//DB.existingAccount(acc[0], acc[1]);


		DB.existingAccount(acc[0], acc[1]).then(function (response) {
			console.log(response)
			res.send(JSON.stringify({"answer":response}))
		});
		

		

	}
);

router.get('/session/account', function(req, res) {
		
		
		console.log("Entering mongo")
		var acc = req.params.account.split('+');


		//DB.existingAccount(acc[0], acc[1]);


		DB.existingAccount(acc[0], acc[1]).then(function (response) {
			console.log(response)
			res.send(JSON.stringify({"answer":response}))
		});
		

		

	}
);


/**
 * This function is called when the time stamp for the 
 * given symbol is different from the current time stamp.
 * This function makes an API call to alpha vantage to get 
 * the latest raw version of the data, returns it here for 
 * cooking and modification, then stores it back into the database
 * under it's respective symbol.
 *
 * @symbol: the symbol of the company whose timestamp and stock we
 * 			are checking.
 */
async function getFreshDataAndUpdateCache(symbol) {
	// get raw data from AlphaVantage
	let data = await getDataFromAlphaVantage(symbol);

	// process data
	var jsondata = data;
	//console.log('company data: ' + JSON.jsondata);
	var stockdata = jsondata["Time Series (Daily)"];
	var companyData = {};
	var datasets = []; //chart datasets
	var dates = []; //chart labels

	var closingValueDict = {};
	var openingValueDict = {};
	var averageValueDict = {};
	initializeDict(closingValueDict, "Closing Values", "rgba(220, 0, 220, 0.2", "rgba(220, 0, 220, 1");
	initializeDict(openingValueDict, "Opening Values", "rgba(0, 220, 220, 0.2)", "rgba(220, 220, 220, 1");
	initializeDict(averageValueDict, "Average Value", "rgba(220, 220, 0, 0.2)", "rgba(220, 220, 0, 1");
	var openingValues = [];
	var closingValues = [];
	var averageValues = [];
	var result = [];
	for(var key in stockdata) {
		dates.push(key);
		var openingVal = Number(stockdata[key]["1. open"]);
		var closingVal = Number(stockdata[key]["4. close"]);
		var avgVal = (openingVal + closingVal)/2;
		openingValues.push(openingVal.toString());
		closingValues.push(closingVal.toString());
		averageValues.push(avgVal.toString());
		result.push({date:key, opening:openingVal.toString(), closing:closingVal.toString(), average:avgVal.toString()});
	}
	openingValueDict["data"] = openingValues.reverse();
	closingValueDict["data"] = closingValues.reverse(); 
	averageValueDict["data"] = averageValues.reverse();
	datasets.push(openingValueDict);
	datasets.push(closingValueDict);
	datasets.push(averageValueDict);
	companyData["labels"] = dates.reverse();
	companyData["datasets"] = datasets;
	companyData["tableView"] = result;

	// update cache and return from cache
	DB.updateDate(symbol);
	DB.updateInterdayData(symbol, JSON.stringify(companyData));
	console.log('server -> data: ' + JSON.stringify(companyData));
	return companyData;
}

/**
 * Based off the given symbol, this function
 * generates the Alpha Vantage url and passes it
 * into the actual calling function.
 *
 * @symbol: The company symbol
 */
async function getDataFromAlphaVantage(symbol) {
	var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&outputsize=compact&apikey=' + apiKey;
	let data = await getData(url);
    console.log('FROM ALPHAVANTAGE' + data);
    return data;
}

/**
 * Based off of the url passed to this function,
 * this function tries to make a GET call to Alpha Vantage
 * and returns that data back to it's caller function.
 *
 *@url: the Alpha Vantage url
 */
async function getData(url) {
    result = {};
    try {
        console.log("Utils --> URL " + url);
        let response = await fetch(url);
        console.log("Utils --> " + response);
        let responseJson = await response.json();
        console.log("Utils --> URL " + responseJson);
        result =  responseJson;
    } catch(err) {
        console.log("Utils --> URL err catch: " + responseJson);
    }
    return result;
}


/**
 * A helper function to initialize each dataset dictionary
 * with the respective color values needed to render the 
 * LineChart.
 *
 * @dict: The dataset dictionary to update
 * @label: The label of the data within this dataset dictionary
 * @fillColor: fillColor for the chart
 * @lineColor: lineColor for the chart
 */
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
