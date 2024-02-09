var express = require('express');
var marked = require('marked');
var fs= require('fs');

var app = express();

app.get('/',function(req, res){
    fs.readFile('test.md', 'utf-8', function(err,data){
        if (err){
            return console.log(err);
        }
        var html = marked(data);
        res.send(html);
    });


});

app.listen(3000, function(){
    console.log('http://localhost:3000 is ON!!');
});