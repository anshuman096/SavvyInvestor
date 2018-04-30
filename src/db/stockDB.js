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

const AccountSchema = new Schema({
	username: String,
	password : String
});

const CurrentAccountSchema = new Schema({
	username: String,
	password : String
});

const accountNewsSchema = new Schema({
	username: String,
	newsArr: [String]
});




const CachingDate = mongoose.model('cachingdate', CachingDateSchema);
const Interday = mongoose.model('interday', CachingInterdaySchema);
const Intraday = mongoose.model('intraday', CachingIntradaySchema);
const Account = mongoose.model('accounts', AccountSchema);

const CurrAcc = mongoose.model('current', CurrentAccountSchema);

const AccNews = mongoose.model('news', accountNewsSchema);








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


async function addAccNews(user, arr) {
	
	console.log("About to add News")
	

	var person = new AccNews({username: user, newsArr: arr})

	person.save(function(err){
		if (err) throw err;

		console.log("saved it")
	});
}


async function updateAccNews(user, arr) {
	
	console.log("About to update News")

	AccNews.findOneAndUpdate({username: user},{newsArr: arr}, function(err){
		if (err) throw err;

		console.log("up it")
	});

}

async function checkAccNews(user) {
	
	console.log("About to update News")

	return AccNews.find({username: user}, function(err, result){
		if (err) {
			console.log("hola")
		}

		
		return result;
	}).then(function (res1) {

		console.log(res1)
		return res1;
	});


	if (res.length != 0) {
		console.log("Reaches end")
		console.log(res.result)
		return true;
	}

	return false;

}

async function addCurrentAccount(user, pass) {
	
	console.log("About to update Accounts")
	

	var person = new CurrAcc({username: user, password: pass})

	person.save(function(err){
		if (err) throw err;

		console.log("saved it")
	});
}

async function logoutCurrentAccount(user, pass) {
	
	console.log("About to update Accounts")
	console.log(user)
	console.log(pass)
	


	CurrAcc.find({username: user, password: pass}).remove().exec(function(err){
		if (err) throw err;

		console.log("removed it")
	});
}

async function checkCurrentAccount() {
	
	console.log("About to update Accounts")
	


	return CurrAcc.find( function(err, result){
		if (err) {
			console.log("hola")
		}

		
		return result;
	}).then(function (res1) {

		//console.log(res1)
		return res1;
	});


	if (res.length != 0) {
		console.log("Reaches end")
		console.log(res.result)
		return true;
	}

	return false;
}


/**
 * Adds account
 * @param {[type]} user [description]
 * @param {[type]} pass [description]
 */
async function addAccount(user, pass) {
	
	console.log("About to update Accounts")
	

	var person = new Account({username: user, password: pass})

	person.save(function(err){
		if (err) throw err;

		console.log("saved it")
	});
}

/**
 * Deletes account
 * @param  {[type]} user [description]
 * @param  {[type]} pass [description]
 * @return {[type]}      [description]
 */
async function deleteAccount(user, pass) {
	
	console.log("About to update Accounts")
	console.log(user)
	console.log(pass)
	


	Account.find({username: user, password: pass}).remove().exec(function(err){
		if (err) throw err;

		console.log("removed it")
	});
}


/*
	Checks whether there is an existing account
 */
async function existingAccount(user, pass) {
	
	console.log("Checking Accounts")
	


	return Account.find({username: user, password: pass}, function(err, result){
		if (err) {
			console.log("hola")
		}

		
		return result;
	}).then(function (res1) {

		console.log(res1)
		return res1;
	});


	if (res.length != 0) {
		console.log(user)
		console.log(pass)
		console.log("Reaches end")
		console.log(res.result)
		return true;
	}

	return false;


}

/**
 * This function returns the latest timestamp associated
 * with the passed in stockName
 *
 * @stockName: the name of the company 
 */
async function getCachingDate(stockName) {
	console.log("enters here 6")
	let result = await CachingDate.find({name: stockName}, function (err, docs) {

		if (docs.length != 0)
			console.log("GET DATE " + docs[0].date);		
	});


	if (result.length != 0) {
		return result[0].date;
	}

	return null;
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

module.exports.addAccount = addAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.existingAccount = existingAccount;

module.exports.addCurrentAccount = addCurrentAccount;
module.exports.logoutCurrentAccount = logoutCurrentAccount;
module.exports.checkCurrentAccount = checkCurrentAccount;
module.exports.addAccNews = addAccNews;
module.exports.updateAccNews = updateAccNews;
module.exports.checkAccNews = checkAccNews;


