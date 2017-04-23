var express = require('express');
var app = express();

// set our port
var port = process.env.PORT || 3000;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port, function () {
    console.log('App is running on port ' + port);
});
