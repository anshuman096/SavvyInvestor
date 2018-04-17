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
const fetch = require('node-fetch');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const apiKey = 'IXCH6QB9M98DE4LC';


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
	console.log('company symbol: ' + req.params.symbol);
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
		result = {};
	}
	res.json(result);
});


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
