var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var db;


// app.get('/', (req, res)=>{
//   res.send('hello world');
// });

// app.get("/some",(req,resp)=>{
// 	resp.send("<h1> this is head</h1>");
// 	resp.statusMessage = "finbe";

// })
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
	db.collection('quotes').find().toArray((err, result) => {
		if (err) return console.log(err)
		// renders index.ejs
		res.render('index.ejs', { quotes: result })
	})
})

app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('saved to database');
		res.redirect('/');
	})
})

app.put('/quotes', (req, res) => {
	db.collection('quotes')
		.findOneAndUpdate({ name: 'Yoda' }, {
			$set: {
				name: req.body.name,
				quote: req.body.quote
			}
		}, {
			sort: { _id: -1 },
			upsert: true
		}, (err, result) => {
			if (err) return res.send(err)
			res.send(result)
		})
})

app.delete('/quotes', (req, res) => {
	db.collection('quotes').findOneAndDelete({ name: req.body.name },
		(err, result) => {
			if (err) return res.send(500, err);
			res.send('A darth vadar quote got deleted');
		})
})


MongoClient.connect('mongodb://root:root@ds129189.mlab.com:29189/blog_test', (err, database) => {
	if (err) return console.log(err)
	db = database;
	app.listen(3000, () => {
		console.log('listening on 3000')
	})
})