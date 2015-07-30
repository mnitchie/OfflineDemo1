var express = require('express'),
    app;

app = express()
        .use(express.static(__dirname + '/public'))
        .listen(3000);
