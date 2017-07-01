//Get Requirements and instatiate some of them
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

const Bing = require('node-bing-api')({accKey: 'db63791f74064c3ca3a65570902162f5'});
const searchTerm = require('./models/searchTerm');
app.use(bodyParser.json());
app.use(cors());


//Connect to Mongoose
mongoose.connect('mongodb://localhost/searchTerms' || process.env.MONGODB_URI)
var db = mongoose.connection;

//Get All search terms from the database
app.get('/api/recentsearchs', (req, res, next)=>{
searchTerm.find({}, (err, data)=>
	{
		res.json(data);
	});
});

//Get call with required and not required params to do a search for an image
app.get('/api/imagesearch/:searchVal*', (req, res, next)=>{

	var { searchVal } = req.params;
	var { offset } = req.query;

var data = new searchTerm({
	searchVal,
	searchDate: new Date()
});	

	//Save to searchTerm collection
	data.save(err =>{
		if(err){
			res.send('Error Saving to database');
		}
		//res.json(data);
	});
	var searchOffset;
//Does offset exist
if(offset){
	if(offset==1){
		offset=0;
		searchOffset = 1;
	}
	else if(offset>1){
		searchOffset = offset + 1;
	}
}

Bing.images(searchVal, {
	top: (10 * searchOffset), 
	skip: (10 * offset)
}, function(error, rez, body){
	var bingData=[];

	for(var i=0; i<10; i++){
		bingData.push({
			url: body.value[i].webSearchUrl,
			snippet: body.value[i].name,
			thumbnail: body.value[i].thumbnailUrl,
			context: body.value[i].hostPageDisplayUrl
		});
	}
	res.json(bingData);
});


});



app.listen(3000 || process.env.PORT, ()=>{
	console.log('Server is Running...');
});