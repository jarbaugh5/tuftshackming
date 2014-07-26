var express = require('express');
var path = require('path');

var app = express();

app.get('/', function (req, res) {
	res.render('index.jade');
});

app.use("/", express.static(path.join(__dirname)));

app.listen(9000);