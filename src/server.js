
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

router.get('/stock', function(req, res) {
		res.json([{message: 'Hello World', userid: 'adikhit'},
				{message: "Good Bye", userid: 'saumi'}]);
	}
);

router.get('/company/:symbol/:dataType', function(req, res) {
	console.log('company symbol: ' + req.params.symbol);
	console.log('data type: ' + req.params.dataType);
	var filename = req.params.symbol.toLowerCase() + '.json';
	var filepath = './daily_time_series_compact/' + filename;

	var data = fs.readFileSync(filepath, 'utf-8');
	var jsondata = JSON.parse(data);
	//console.log('company data: ' + JSON.jsondata);
	var stockdata = jsondata["Time Series (Daily)"];
	var companyData = {};
	var datasets = []; //chart datasets
	var dates = []; //chart labels

	var closingValueDict = {};
	closingValueDict["label"] = "Closing Values";
	closingValueDict["fillColor"] = "rgba(220,220,220,0.2)";
	closingValueDict["strokeColor"] = "rgba(220,220,220,1)";
	closingValueDict["pointColor"] = "rgba(220,220,220,1)";
	closingValueDict["pointStrokeColor"] = "#fff";
	closingValueDict["pointHighlightFill"] = "#fff";
	closingValueDict["pointHighlightStroke"] = "rgba(220,220,220,1)";
	var closingValues = [];
	var result = [];
	for(var key in stockdata) {
		dates.push(key);
		closingValues.push(stockdata[key]["4. close"]);
		result.push({date:key, closing:stockdata[key]["4. close"]});
	}
	closingValueDict["data"] = closingValues; //first dataset JSON object created
	datasets.push(closingValueDict);
	companyData["labels"] = dates;
	companyData["datasets"] = datasets;
	companyData["tableView"] = result;
	console.log('company data results: ' + JSON.stringify(companyData));
	res.send(companyData);
});



var port = process.env.PORT || 3001;
var server = app.listen(port);
console.log("Web Server Up");

module.exports = app;
