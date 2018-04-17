const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/stocks');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const CachingDate = new Schema({
	name: String,
	date: Date
});

const CachingDateModel = mongoose.model('cachingDate', CachingDate);

CachingDateModel.create({name: "GOOGL", date:"04/10/2018"});