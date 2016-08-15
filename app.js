var express = require('express')
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var jade = require('jade')
var bodyParser = require('body-parser')
var app = express();

var url = 'mongodb://localhost:27017/tasks';

var publicFolder = __dirname + '/public';

var _tasks = [];
var counter=0;

MongoClient.connect(url, function(err, db) {

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(bodyParser.urlencoded({ extended: false }))
	app.use( express.static(publicFolder) )

	app.get('/tasks', function(req,res) {

		showTasks(db,function( data ) {

			var _tasksList = data.filter(function(item,i){
		       return  item.completed===false
		 	});

			res.render('tasks', {
				title: "Todo List",
				tasks: _tasksList
			});
		});
	})

	app.post('/tasks', function(req,res) {
		if ( !req.body || !req.body.name ) res.send ("error!");
		var nameTask = req.body.name;
		var dateFormat = require('dateformat');
	    var now = new Date();
	    var day = dateFormat(now, "isoDateTime");
	    day = day.substring(0, 19);
	    day = day.replace(/[-]/gi,'/');
	    day = day.replace(/[T]/gi,' ');
	    day = "(Created at:" +day+")";

		var newTask = {
			name: nameTask,
			day: day,
			completed: false
		}

		insertTasks(db, newTask,function( data ) {
        		db.close();
		});
		res.redirect('/tasks')
	})

	app.get('/completed', function(req,res) {
		showTasks(db,function( data ) {
			var _tasksList = data.filter(function(item,i){
		       return  item.completed===true
		 	});

			res.render('completed', {
				title: "Completed",
				completed: _tasksList
			});
		});

	})



	app.put('/tasks', function(req,res) {
		var idToCompleted = req.query.id;
		console.log(idToCompleted);

		updateTasks(db,idToCompleted,function( data ) {
			res.redirect('/tasks');
		});


		res.end();
	})

	app.delete('/tasks', function(req,res) {
		var idToRemove = req.query.id;

		removeElement(db,idToRemove,function( data ) {
			res.redirect('/tasks');
		});

		res.end();
	})

	app.listen(3000, function() {
		console.log("Listening on port 3000");
	})

  //db.close();
});

function insertTasks(db,newTask, callback) {
  // Get the documents collection
  var collection = db.collection('tasks');

  // Find some documents
  collection.insert(newTask);

}

function showTasks(db, callback) {
  // Get the documents collection
  var collection = db.collection('tasks');

  // Find some documents
  collection.find().toArray(function(err, docs) {
    callback(docs);
  });
}

function removeElement(db,idToRemove, callback){

	var collection = db.collection('tasks');

	collection.deleteOne({_id:ObjectID(idToRemove)});
}

function updateTasks(db,idToUpdate, callback){

	var collection = db.collection('tasks');

	collection.update(
    { _id: ObjectID(idToUpdate) },
    {
        $set: { completed: true }
    }
);
}