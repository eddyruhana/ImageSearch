//Requirements for mongoose and schema
const Schema = mongoose.Schema;
const searchTermSchema = new Schema(
	{
		searchVal:	String,
		searchDate: Date
	},
	{timeStamp: true}
);
//Connects model and collection
const ModelClass = mongoose.model('searchTerm', searchTermSchema);

module.exports = ModelClass;
