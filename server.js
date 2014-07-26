var express = require('express');
var path = require('path');

var app = express();

app.get('/', function (req, res) {
	res.render('index.jade');
});

app.use("/", express.static(path.join(__dirname)));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});