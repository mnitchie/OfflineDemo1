var express = require('express'),
    counter = 0,
    app;

app = express().use(express.static(__dirname + '/public'));

app.post('/tick', function(req, resp, next) {
  counter++;
  resp.status(200)
      .send(counter.toString());
});

app.listen(3000);
