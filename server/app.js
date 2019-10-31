const express = require('express');
const fs = require('fs');
const csv = require('csvtojson/v2');

const app = express();

const logCache = [];

app.use((req, res, next) => {
  var userAgent = req.headers['user-agent'].replace(',','');
  logCache.push(userAgent);

  var time = new Date().toISOString();
  logCache.push(time);

  var method = req.method;
  logCache.push(method);

  var url = req.url;
  logCache.push(url);

  var version = 'HTTP/' + req.httpVersion;
  logCache.push(version);

  var status = res.statusCode + '\n';
  logCache.push(status);

  var logCacheJ = logCache.join(',');
  console.log(logCacheJ);

  fs.appendFile('./log.csv', logCacheJ, (err) => {
    if (err) throw err;
    console.log('Visitor log data has been copied to the csv file');
  });

  function emptyCache() {
    logCache.length = 0;
  }
  emptyCache();

  next();
});

app.get('/', function( req, res) {
  res.status(200).send('Ok');
});

app.get('/logs', (req, res) => {
  csv()
    .fromFile('./log.csv')
    .then((obj)=>{
      res.json(obj);
  })
});

app.get('*', function( req, res){
  res.status(404).send('Sorry, no page was found at this address');
});

module.exports = app;
