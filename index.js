var express = require('express');
var marked = require('marked');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/',function(req, res){
    res.send(`
    <form action="/markdown" method="POST">
        <textarea name="markdown" rows="10" cols="30"></textarea>
        <button type="submit">Submit</button>
    </form>
    `);
});

app.post('/markdown',function(req,res){
    var markdown =req.body.markdown;
    var html = marked(markdown);
    res.send(html);
});

app.listen(3000, function(){
    console.log('http://localhost:3000 is ON!!');
});