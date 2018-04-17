const mongoose = require('mongoose');

const dbHandle = mongoose.connect('mongodb://localhost/stocks');

const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

const CachingDateSchema = new Schema({
	name: String,
	date : Date
});

const CachingInterdaySchema = new Schema({
	name: String,
	data : String
});

const CachingIntradaySchema = new Schema({
	name: String,
	data : String
});

const CachingDate = mongoose.model('cachingdate', CachingDateSchema);
const Interday = mongoose.model('interday', CachingInterdaySchema);
const Intraday = mongoose.model('intraday', CachingIntradaySchema);


/**
 * This function returns the current date in
 * mm/dd/yy format
 *
 */
function GetFormattedDate() {
    var todayTime = new Date();
    var month = todayTime .getMonth() + 1;
    var day = todayTime .getDate();
    var year = todayTime .getFullYear();
    var res =  month + "/" + day + "/" + year;
	console.log("Date to Update " + res);
	return res;
}

/**
 * This function returns the latest timestamp associated
 * with the passed in stockName
 *
 * @stockName: the name of the company 
 */
async function getCachingDate(stockName) {
	let result = await CachingDate.find({name: stockName}, function (err, docs) {
		if (docs.length != 0)
			console.log("GET DATE " + docs[0].date);		
	});
	return result[0].date;
}

/**
 * This function is only called when there is a difference between
 * the timestamps. This will update the date of the given company
 *
 * @stockName: the name of the company
 */
async function updateDate(stockName) {
	cacheDate = GetFormattedDate();
	let resultDate = CachingDate.update(
		{ "name": stockName },
		{ "$set": { "date": cacheDate } },
			function (err, raw) {
			if (err) {
				console.log('Error log: ' + err)
			} else {
				console.log("Token updated: " + raw);
			}
	});
	console.log("Done with Update");
}

/**
 * Similar to the getCacheDate function, this simply returns the InterDay data
 * stored for a company, if any.
 *
 * @stockNAme: the name of the company
 */
async function getInterdayData(stockName) {
	let result = await Interday.find({name: stockName}, function (err, docs) {
		if (docs.length != 0)
			console.log("GET INTERDATA");
	});
	return result[0].data;
}

/**
 * Similar to the updateCacheDate function, this simply updates the InterDay data
 * stored for a company, if any.
 *
 * @stockNAme: the name of the company
 */
async function updateInterdayData(stockName, data) {
	let uData = Interday.update(
		{ "name": stockName },
		{ "$set": { "data": data } },
			function (err, raw) {
				if (err)
					console.log('Error log: ' + err);
				else
					console.log("Token updated: " + raw);
			}
	);
	console.log("Done with Interday Update");
}


/**
 * Similar to the getCacheDate function, this simply returns the Intraday data
 * stored for a company, if any.
 *
 * @stockNAme: the name of the company
 */
async function getIntraDayData(stockName) {
	let result = await Intraday.find({name: stockName}, function (err, docs) {
		if(docs.length != 0)
			console.log("GET INTRADATA");
	});
	return result[0].data; 
}

/**
 * Similar to the updateCacheDate function, this simply updates the Intraday data
 * stored for a company, if any.
 *
 * @stockNAme: the name of the company
 */
async function updateIntraData(stockName, data) {
	let uData = Intraday.update(
		{ "name": stockName },
		{ "$set": {"data": data} },
			function (err, raw) {
				if(err) 
					console.log('Error log: ' + err);
				else 
					console.log('Token updated: ' + raw);
			}
	);
	console.log("Done with IntraDay Update");
}

module.exports.getCachingDate = getCachingDate;
module.exports.updateDate = updateDate;
module.exports.getInterdayData = getInterdayData;
module.exports.updateInterdayData = updateInterdayData;
module.exports.getIntraDayData = getIntraDayData;
module.exports.updateIntraData = updateIntraData;
