var express = require('express'),
    cons = require('consolidate'),
    randomString = require('randomstring'),
    app = express(),
    counter = 0,
    pageIds = [];

app.set('views', __dirname + '/views');
app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.render('index', {pageIds: pageIds});
});

app.get('/pages/:pageId', function(req, res, next) {
  var pageId = req.params.pageId;

  if (pageIds.indexOf(pageId) >= 0) {
    res.render('generated', {pageId: pageId});
  } else {
    res.status(404);
    res.render('error404');
  }
});

app.get('/error', function(req, res, next) {
  res.render('error404');
});

app.post('/', function(req, res, next) {
  var pageId = randomString.generate(8);
  pageIds.push(pageId);
  res.end(pageId);
});

app.get('/cache/cache.manifest', function(req, res, next) {
  res.set('Content-Type', 'text/cache-manifest');
  res.set('cache-control', 'no-cache, max-age=0');
  res.set('Expires', Date.now());
  res.render('cache/cache', {pageIds: pageIds});
});

app.post('/tick', function(req, res, next) {
  counter++;
  res.status(200)
     .send(counter.toString());
});

app.listen(3000);
