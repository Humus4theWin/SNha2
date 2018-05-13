var express = require("express");
var bodyParser 	= require('body-parser');
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId; 
var app = express();
var db;

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  if (err) return console.log(err)
  db = client.db('SN')
  app.listen(8080, () => {
  console.log('listening on 8080')
  })
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());



app.get("/todos", (req, res) => {
	var cursor = db.collection('ToDos').find()
	cursor.toArray(function(err, results) {
	res.send(results)
	})
})

app.delete('/todos', (req, res) => {
	console.log(req.body)
	db.collection('ToDos').findOneAndDelete({"_id":  ObjectId(req.body._id)},
	(err, result) => {
    if (err) return res.send(500, err)
	res.send({message: 'ok'})
  })
})

app.put("/todos",(req, res) => {
	console.log(req.body)
	
	db.collection('ToDos')
  .findOneAndUpdate({"_id":  ObjectId(req.body._id)}, {
    $set: {
      task: req.body.task,
      stat: req.body.stat,
      date: req.body.date
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
	
	

})

app.post('/todos', function (req, res) {
	//console.log(req.body)
	db.collection('ToDos').save(req.body, (err, result) => {if (err) return console.log(err)})
    console.log('saved to database')	
	redirectMain(res)
});



app.use(express.static('./public')); 

app.get('*', function (req, res) {redirectMain(res)});

function redirectMain(res){
	res.writeHead(301,
	{Location: '/main.html'}
	);
	res.end();
}