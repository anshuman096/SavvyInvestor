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
//const apiKey2 = key.apiKey2;
const newsKey = '84687c79606f4ca1888dbd0d0976b481';

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
router.get('/company/:symbol/:dataType', async (req, res) => {
	console.log('company symbol: ' + req.params.symbol);
	console.log('data type: ' + req.params.dataType);
	//get current date and compare to cacheDate
	var result = {};
	try {
			var now = new Date();
			let lastUpdated = await DB.getCachingDate(req.params.symbol);
			//console.log('lastUpdate for CSCO: ' + lastUpdated);
			if(lastUpdated == null) {
				console.log('insert data for ' + req.params.symbol);
				let interdayData = await getFreshData(req.params.symbol, 'interday');
				let intradayData = await getFreshData(req.params.symbol, 'intraday');
				insertDataToCache(req.params.symbol, now, interdayData, intradayData);
				if(req.params.dataType == 'interday')
					result = interdayData;
				else
					result = intradayData;
			} else {
				if(req.params.dataType == 'interday') {
					if (now.getFullYear() == lastUpdated.getFullYear() &&
						now.getMonth() == lastUpdated.getMonth() &&
						now.getDate() == lastUpdated.getDate()) {
							console.log('DATA FROM CACHE: AS FRESH');
							uResult = await DB.getInterdayData(req.params.symbol);
							result = JSON.parse(uResult);
					} else {
						console.log('STALE DATA or NO DATA IN CACHE: GET FRESH');
						let callData = await getFreshData(req.params.symbol, req.params.dataType);
						updateInterdayCache(req.params.symbol, callData);
						result = callData;
					}
				} else if(req.params.dataType == 'intraday') {
					if (now.getHours() == lastUpdated.getHours() &&
						now.getMinutes() <= lastUpdated.getMinutes() + 15) {
							console.log('DATA FROM CACHE: AS FRESH');
							uResult = await DB.getIntraDayData(req.params.symbol);
							result = JSON.parse(uResult);
					} else {
						console.log('STALE DATA or NO DATA IN CACHE: GET FRESH');
						let callData = await getFreshData(req.params.symbol, req.params.dataType);
						updateIntradayCache(req.params.symbol, callData);
						result = callData;
					}
				}
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

	      console.log("NEWS REACHES HERE");
	      console.log(response.data['articles']);
	      console.log("NEWS REACHES HERE 2");

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
		
		axios.get('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=' + req.params.currency +'&market=USD&apikey=' + apiKey)  
	    .then((response) => {

	      console.log("BITCOIN REACHES HERE");
	      console.log(response.data['Meta Data']);
	      console.log("BITCOIN REACHES HERE 2");

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
async function getFreshData(symbol, dataType) {
	// get raw data from AlphaVantage
	let data = await getDataFromAlphaVantage(symbol, dataType);

	// process data
	var jsondata = data;
	//console.log('company data: ' + JSON.jsondata);
	var stockdata;
	if(dataType == 'interday')
		stockdata = jsondata["Time Series (Daily)"];
	else if(dataType == 'intraday')
		stockdata = jsondata["Time Series (15min)"];
	let companyData = processStockDataEx(stockdata)
	return companyData;
}

function processStockDataEx(stockdata) {
	var pResult = [];
    var tResult = [];
    var companyData = {};
    var period = 10;
    var startIndex = 0;
    var lastIndex = 0;
    for(var key in stockdata) {
        var openingVal = Number(stockdata[key]["1. open"]);
        var closingVal = Number(stockdata[key]["4. close"]);
        var avgVal = closingVal;

        if (startIndex + period > lastIndex) {
            lastIndex = lastIndex + 1;
            avgVal = openingVal;
            pResult.push({name: key, 'Opening Values': openingVal, 'Closing Values': closingVal });
            tResult.push({date:key, opening:openingVal.toString(), closing:closingVal.toString()});
        } else {
            sum = 0;
            for (var i = startIndex; i < lastIndex; i++) {
                    sum = sum + pResult[i]['Opening Values'];
            }
            avgVal = sum / period;
            startIndex = startIndex + 1;
            lastIndex = lastIndex + 1;
            pResult.push({name: key, 'Opening Values': openingVal, 'Closing Values': closingVal, 'Average Value': avgVal});
            tResult.push({date:key, opening:openingVal.toString(), closing:closingVal.toString(), average:avgVal.toString()});
        }
        //var avgVal = (openingVal + closingVal)/2;
    }
    companyData["datasets"] = pResult;
    companyData["tableView"] = tResult;
    return companyData;
}



/**
 * Based off the given symbol, this function
 * generates the Alpha Vantage url and passes it
 * into the actual calling function.
 *
 * @symbol: The company symbol
 */
async function getDataFromAlphaVantage(symbol, dataType) {
	var url = ''
	if(dataType == 'interday')
		url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&outputsize=50&apikey=' + apiKey;
	else if(dataType == 'intraday')
		url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=15min&apikey=' + apiKey;
	let data = await getData(url);
    console.log('FROM ALPHAVANTAGE' + JSON.stringify(data));
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

function insertDataToCache(symbol, timestamp, interday, intraday) {
	//insert records into db
	DB.insertDate(symbol, timestamp);
	DB.insertInterDayData(symbol, JSON.stringify(interday));
	DB.insertIntraDayData(symbol, JSON.stringify(intraday));
}


function updateInterdayCache(symbol, data) {
	// update cache
	DB.updateDate(symbol);
	DB.updateInterdayData(symbol, JSON.stringify(data));
	console.log('server -> interdaydata: ' + JSON.stringify(data));
} 


function updateIntradayCache(symbol, data) {
	// update cache
	DB.updateDate(symbol);
	DB.updateIntraDayData(symbol, JSON.stringify(data));
	console.log('server -> intradaydata: ' + JSON.stringify(data));
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
