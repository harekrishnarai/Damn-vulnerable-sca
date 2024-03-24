
const marked = require('marked');
const bodyParser = require('body-parser');
const ip= require('ip');
const http = require('http');
const express = require('express');
const path = require('path'); // Add this line

const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: true }));

marked.setOptions({
    renderer: new marked.Renderer(),
    sanitize: true,
    mangle: false
  });
  


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});
app.get('/markdown', function (req, res) {
    res.sendFile(__dirname + '/templates/markdown.html');
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

app.get('/checkip', function(req, res) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Check IP</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <!-- Font Awesome for sand timer icon -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
        <style>
            /* Loading indicator styles */
            .loading-container {
                width: 100px;
                height: 100px;
                position: relative;
                margin: 0 auto;
            }
    
            .sand-timer-icon {
                font-size: 60px;
                color: #1a202c;
                position: absolute;
                top: 20px;
                left: 20px;
                animation: sand-timer-rotation 2s linear infinite;
            }
    
            @keyframes sand-timer-rotation {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
    
            .error-message {
                color: #e53e3e;
                font-size: 0.75rem;
                margin-top: 0.25rem;
            }
        </style>
    </head>
    <body class="bg-gray-100">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-center mb-8">Check IP</h1>
            <form id="checkIpForm" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <div class="mb-4">
                    <label for="ip" class="block text-gray-700 text-sm font-bold mb-2">Enter IP Address</label>
                    <input type="text" id="ip" name="ip" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Enter IP address" required>
                    <div id="errorMessage" class="error-message"></div>
                </div>
                <div id="loadingContainer" class="loading-container hidden">
                    <i class="fas fa-hourglass-half sand-timer-icon"></i>
                </div>
                <div id="responseMessage" class="text-red-500 mb-4"></div>
                <div class="text-center">
                    <button type="button" onclick="checkIp()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Check IP</button>
                </div>
            </form>
        </div>
        <script>
            function checkIp() {
                var ip = document.getElementById('ip').value;
                var errorMessage = document.getElementById('errorMessage');
                if (ip.trim() === '') {
                    errorMessage.textContent = 'Please enter an IP address.';
                    document.getElementById('responseMessage').innerHTML = ''; // Clear previous response
                    return;
                }
                errorMessage.textContent = ''; // Clear previous error message
                document.getElementById('responseMessage').innerHTML = ''; // Clear previous response
                document.getElementById('loadingContainer').classList.remove('hidden');
                setTimeout(function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/checkip');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onload = function() {
                        document.getElementById('loadingContainer').classList.add('hidden');
                        if (xhr.status === 200) {
                            document.getElementById('responseMessage').innerHTML = xhr.responseText;
                        } else {
                            console.error('Request failed. Status: ' + xhr.status);
                        }
                    };
                    xhr.send('ip=' + encodeURIComponent(ip));
                }, 1000); // Delay for 1 second
            }
    
            // Prevent form submission on Enter key press
            document.getElementById('checkIpForm').addEventListener('submit', function(event) {
                event.preventDefault();
                checkIp();
            });
        </script>
    </body>
    </html>
    
    `);
});

// Handling POST request to process the form submission
app.post('/checkip', function (req, res) {
    var my_ip = req.body.ip;
    var responseMessage = '';

    // Check if the IP is public
    if (ip.isPublic(my_ip)) {
        responseMessage = `${my_ip} is public.`;
        fetch("http://" + my_ip + "/index.html")
        .then(response => response.text()) // Convert response to text
        .then(html => {
            responseMessage = html;
         // Set responseMessage to the contents of index.html
         console.log(html); // Optional: Log the HTML content
        })
        .catch(error => {
            responseMessage = "Error fetching index.html: " + error;
            console.error(error); // Log the error
        });
    } else if (ip.isPrivate(my_ip)) {
        // If private, display a message indicating it's a private IP
        responseMessage = `${my_ip} is private.`;
    } else {
        // If the IP is neither public nor private, display an error message
        responseMessage = `Invalid IP address ${my_ip}`;
    }

    res.send(responseMessage);
});



app.listen(3000, function () {
    console.log(`
    ........................................................................................................................
    ........................................................................................................................
    ........................................................................................................................
    ................................................,,::;;;++*******+++;;::,,...............................................
    ...............................,+??+,..,,:;+?%SS##@@#####SSSSSSS#####@@@##S%?+;:,,..,+??;...............................
    ...............................;@@@@S*;*#@@##S%?***++++++++++++++++++++**?%S##@@S*;?S@@@@;..............................
    ...............................+#%S###%??;;++++;;;;+*?+,,;?*,,;+,,+;:+*;;*++++;+??S###S%@;..............................
    ...........................:*%+?S+S#%*?%%?+;*??:.;;.;*,,:.+*.,,.,.+,,,;.:???*;+?%%?*S#%*#**%+:..........................
    .......................,;?S@@S;S%+%#S:.:?%%*:;*+.;;,;;,;+;:+:++*+:+,*:..+?+::?%%?:.;SS?+S%+S@@S*;,......................
    ....................,;%#@#%*;;:#?;?SS+..,?%??;:;;+++*++***+++++*++****++*:,;?*S?,.,+#S?;%S:;;*%#@#?;,...................
    ...................:#@#?+;;+**:S%:?S#+...:#***+::;??%%SSS#######SSS%%??;:;+?*?S:..,*#S?:S%:**+;;+%@@S,..................
    ...................%@#;++*****:?S,*%#%:..,%#;?+*+;+S@@@@@@@@@@@@@@@@@S+;+*+?;#?,..;S#%+:#*;*+***+;;@@*..................
    ..................:@@*;*******++#:;%#%;,.:%#:+*???*;%@####SSSSS###@@?;*??**+:#%:.,;S#%;;@;+::+****:?@#,.................
    ..................?@#:****:+*?*:#?:%#%:,,+#%:*?%S#@S??*+;;;;;;;;;+**?#@#S%?*:S#+,,:%#?:%%:+:;;;****;@@*.................
    .................:#@?;**+;+++*;??#++#S;,:*@*;%#@@#%+:,,,,,,,,,,,,,,,;+%@@@S%;?@*:,;SS;*S*+++::;;**?:%@S,................
    .................*@@;*?*:+*??;?@S*S+*#S+;+##%#@@?;,,:::;;;;;;;;;;;;::,,;?@@#%#S+;+SS+*S*#@*+*;,:+*?++@@;................
    .................S@%:?*;:++*;?@@@#*%?*S##S#@@@S+:::;;;;;;;;;;;;;;;;;;;:::*S@@@#S##%*%%?#@@@*+*:::;??:#@%................
    ................:@@*+?+:::*++@@@@@@%%%%%S#@@@S+::;;+++++++++++++++++++;;::+S@@@#S%%%%%@@@@@@+*;;;++?;?@#,...............
    ................*@@;**;;:+*;#@@@@@@@@S%SSS#@S+::;;++******?????*****++;;;::+S@#S%S%S@@@@@@@@S:?+,:+?*;@@+...............
    ................S@S:?+++;*;?@#@@#@@#@@@#S%@#*:,,,:;+*???%%%%%%%%%??**+;:,,,:*#@%S#@@@@@@#@##@*+*::;+?:S@%...............
    ...............:@@?;?:+;;*;@@###@#@#@@@@@?#*:,:;;+***?%SSSSSSSSSS%%?*+++;::,:*#?@@@@#@@#@###@#;?;:+*?;?@#,..............
    ...............+@@+**;;;*;?@@@S?@S%@##@@S%S;+%SS###SS%SSSSSSSSSSSSS%SSS##SS?+;S%#@@##@%S@?S@@@*+*;::***@@;..............
    ...............?@#;*+;;;?;#@@@S*%S*%@##@%S?+S@@@S;*@#SSSSS%%%%%%SSSS#@*:%@@@S+%SS@##@?*S%?S@@@S;?;++**+@@*..............
    ...............%@#:*;;:**;##SS#SS@@S#@@@SS%+S####SS@@SS%%?*****??%SS@@SS####S+%SS@@@#S@#SS#SS##;?;;++?;@@%..............
    ...............S@S;?+*+?++S?***%?#@@##@@#%S+*S%*%##@@S%**+++;++++*%S@@@#%*%S++S%@@@##@@S?**+*%S;*+;++?;#@S..............
    ..............,#@%;????SSS########@@@#S@@%S*;?S%%%%SS%*+*;;:::;+++*%SS%%%%S*:*SS@@S#@@@########SS%????;#@S..............
    ..............,#@%;???S@S*?*?*?*+S@@@@#@@@%S+:;+*??%S*:?S*+;;;+?S*:*S%?**+;:+S%@@##@@@@%+??*?*?*S@%???;S@S,...,.........
    ..............,#@S;??S@?;;?*?+?*:%@S##%#@@#%S*;+**%#*,:%@#S???S#@?:,*#%**+;?#S@@@S%##S@?:*****%;;?@S??;#@S..............
    ...............S@S:????%?????????S@SSS%%S@@#SSS%%%#@+.,:+S@@@@@%+:,.+@#%%%SS%#@@S%%SSS@S?????????%%%??;#@S..............
    ...............%@#;??%S@@########@@@@@%S@@@#?#@@###@S;,...;S@S;...,;S@##@@@#*#@@@SS@@@@@########@@S%??;@@%..............
    ...............?@@+*%S@@#%*****?%#@@@@@@@@S+##%S#@@@@S*;;+?SSS?+;;*S@@@@#S?#S*@@@@@@@@@@S%**+??%#@@S%*+@@*..............
    ...............;@@?;%?%#@########@@@@@@S%**S#%*?%S#@@@@@@#?+;+?#@@@@@@#S%?*?@??S?++;+*S@########@#%?%+?@@;..............
    ...............,#@S:%*;?S+#@@@@@SS####%%%?#@S%%%%S##%?%%#@@@#@@@@@@@##S%%%%S#@?SS*:::,,*S#@@@@#+S?;+%:S@#,..............
    ................?@@+*?:+%+*@@@@%SS%%%%%SSSSSSSS##@#?;:,,:+#@@@@@@###SSS##SSSSSS#@#?+++++%*#@@@*+%;;**;@@?...............
    ................:@@%;%+:??;#@@@%#?..,,,,,::;;++*?S@@?;;;::+#SSSSSS%%%%??**+;;;:*#@#??%?%#%%@@#;?*;;?;%@@;...............
    .................%@@+**;+?+?@@@SSS..%#%%%??*++;::+#@?**++++S@*;;::,,,,:::;;++*?%#@@#S###@%S@@?+%+;**+@@%................
    .................;@@#;?++??;#@@#%#,.%#+;;;+++*%@SS#@SS%??%%#@**?%%%%%%%%##SSS#S*?%S@@@@#S?@@#;%?;+?;#@@:................
    ..................?@@%+%**%+*@@@%@+,*@+,,,,,:*%+::+#@##SS##@S??*?%*+++++%#???*+***%@#SS@?#@@**?+*%;%@@?.................
    ..................,S@@S%%SS%;%@@%@%,:#%;;;:*??*;,,,*#@@##@@#%*++++??*+*+%S;*****??%@+:?@?@@%+%S%%SS@@#,.................
    ...................:#@#%?+?#%*@@S%@;:?@*:::;:,,++,,,;?%##?+?@%+++++*??*?S?*****???#S:;#%S@@*%#%*?%#@#:..................
    ....................;@S;;;;%#S#@@S@S;;#S;::::,;::;;:::,:*;:?%%%?*****?#?+****????%@+:?@S@@#S#%;;;;S@;...................
    .....................;#S++;;%#S%?*%@%;+#S;::;?:,:;:,;+;+:::+*?S%??%?**#%*???????%@?:*@S*?%S#%;;;+S#;....................
    ......................;##*++++++++?S@%;+#S?++*??;::;:,,:,,+%##%?***?%S%?%%%S%%%S@?;*@#?++++++++*##:.....................
    .......................:S@?+++++++?%S@%++S#*:,:**+*:,,,,::,,:*S@#S?%@?****??%S##*;*@#%?+++++++?@S:......................
    .........................*@S*+**+**??S@#*+?#%+::;;*+;;;;+?%%???****#S*??????%#%++%@#%?*++**+*S@*,.......................
    ..........................:S@%%%?***??%#@%**S#%+::::::+:;+?%%%%??*%@?%%%%%%#S*+?#@S??****%%%@S:.........................
    ...........................,*#@@#%?***?%S##%**%S%*;::*:::,,,:+S#S%S#???%S#S?*?S@#%?***?%#@@#+,..........................
    .............................,*#@@#S%**??%S@#%**%SS?*+::::;?SS%??%SS#SSS%**?S@#%??**?S#@@#*,............................
    ...............................,*#@@@#%?????S##S???%SS?*;:::;SS##S%S#S?*?%##S%????%#@@@S*,..............................
    .................................,;%@@@@#S%???%S##S%??%SSS%*+S##SS%???%###%???%%#@@@@%;,................................
    ....................................:*S@@@@#S%%??%S##S%???%S%S%???%S###S%??%S#@@@@S*:...................................
    .......................................:+%#@@@@#S%%?%SS###S%%%SS###S%%%%S##@@@@S*:......................................
    ..........................................,;?S#@@@@#S%%%%%S###SS%%%%S#@@@@@#?+,.........................................
    ..............................................,;*%S@@@@@#SS%%%SS##@@@@#S?+:,............................................
    ..................................................,,;*?S#@@@@@@@#S%*+:,.................................................
    ........................................................,:;+**;:,.......................................................
    ........................................................................................................................
    ........................................................................................................................
    ........................................................................................................................
    ........................................................................................................................
    Go to http://localhost:8000 to see the app in action.
    `);
});
