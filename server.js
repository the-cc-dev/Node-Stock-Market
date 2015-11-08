var express = require('express'), app = express();
var request = require('bhttp');
var readline = require('readline');
var pg = require('pg');
var rl = readline.createInterface(process.stdin, process.stdout);

var dbConfig = require('knex')({
    client: 'postgresql',
    connection: {
        host: '127.0.0.1',
        user: 'test',
        password: '',
        database: 'NSM',
        charset: 'UTF8'
    }
});

var knex = require('knex')(dbConfig);

var bookshelf = require('bookshelf')(knex);

var Portfolio = bookshelf.Model.extend({
    tableName: 'stocks',
});

var formatQuery = require('./format-query');
var formatData = require('./format-data');

rl.setPrompt('›› ');
rl.prompt();

rl.on('line', function(line) {
    var query = formatQuery(line);
    request.get(query, {}, function(error, response) {
        if (error) console.log('Exec error: ' + error);
        var data = formatData(response.body.toString());
        console.log(data);
        rl.prompt();
    });
});

var server = app.listen(6446, function () {
    console.log('Server running on port: 6446');
});