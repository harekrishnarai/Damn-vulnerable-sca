var express = require('express');
var marked = require('marked');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Resume Builder</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100">
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold text-center mb-8">Make Your Resume in Markdown Format Here</h1>
                <form action="/markdown" method="POST" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div class="mb-4">
                        <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input type="text" id="fullName" name="fullName" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Enter your full name" required>
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" id="email" name="email" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Enter your email address" required>
                    </div>
                    <div class="mb-4">
                        <label for="markdownResume" class="block text-gray-700 text-sm font-bold mb-2">Your Markdown Resume</label>
                        <textarea id="markdownResume" name="markdownResume" rows="6" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Enter your resume in Markdown format" required></textarea>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/markdown', function (req, res) {
    var fullName = req.body.fullName;
    var email = req.body.email;
    var markdownResume = req.body.markdownResume;
    
    // Process the markdown resume here
    
    var htmlResume = marked(markdownResume); // Convert Markdown to HTML
    
    var htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Resume</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100">
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold text-center mb-8">Markdown Resume</h1>
                <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div class="markdown">${htmlResume}</div> <!-- Render HTML content -->
                </div>
            </div>
        </body>
        </html>
    `;
    
    res.send(htmlResponse);
});


app.listen(3000, function () {
    console.log('http://localhost:3000 is ON!!');
});
