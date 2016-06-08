var QueryStream = require('pg-query-stream');
var JSONStream = require('JSONStream');
var express = require('express');
var pg = require('pg');
var connectionString = 'postgres://user:password@host/dbname';
var client;
var server = express();

server.get('/packages', function(req, res) {
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      return res.sendStatus(500);
    }
    var query = new QueryStream('SELECT distinct on (name) name FROM repo_package ORDER BY name ASC;');
    var stream = client.query(query);
    stream.on('end', done);
    stream.on('err', function() {
      done();
      return res.sendStatus(500);
    });
    stream.pipe(JSONStream.stringify()).pipe(res);
  });
});

server.listen(process.env.PORT || 8000);
