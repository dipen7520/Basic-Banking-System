var express = require("express"),
    path = require("path");
var app = express();
var http = require('http');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BankingSystem', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected...");
});

// console.log(path.join(__dirname,"/public"));
const staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send("hello..");
});
app.get('/getUsers', function (req, res) {
    db.collection('customer').find({}).toArray(function (err, customer) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(customer);
        }
    });
});
app.post('/insertUser', function (req, res) {
    var jsonData = JSON.parse(req.body.mydata);

    db.collection('transaction').insertOne(jsonData, function (err, records) {
        if (err) {
            console.log(err);
        }
        else {
            res.end('User saved');
        }
    })
});
app.put('/updateUser', function (req, res) {
    var jsonDataUpdate = JSON.parse(req.body.updatedata);
    var FromId = { email: jsonDataUpdate.idFrom };
    var ToId = { email: jsonDataUpdate.idTo };
    var Frombalance = { $set: { balance: jsonDataUpdate.blFrom } };
    var Tobalance = { $set: { balance: jsonDataUpdate.blTo } };

    db.collection('customer').updateOne(FromId, Frombalance, function (err, records) {
        if (err) {
            console.log(err);
        }
        else {
            db.collection('customer').updateOne(ToId, Tobalance, function (err, records) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.end('User Updated');
                }
            })
        }
    })
});
app.get('/getHistory', function (req, res) {
    db.collection('transaction').find({}).toArray(function (err, history) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(history);
        }
    });
});
http.createServer(app).listen(2803)