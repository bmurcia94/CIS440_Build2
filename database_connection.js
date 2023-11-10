// First steps to setting up Node.js HTTP web server
const { exec } = require('child_process');
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
var fileExtensions = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "text/javascript",
    ".jpeg": "image/jpeg",
    ".jpg":  "image/jpeg",
    ".png":  "image/png",
    ".otf":  "font/otf",
    ".avif": "image/avif",
    ".map":  "application/json",
    ".webp": "image/webp",
    ".ico":  "image/ico"
};

// Creates database connection variable
var con = mysql.createConnection({
    host: "107.180.1.16",
    port: "3306",
    user: "fall2023team1",
    password: "fall2023team1",
    database: "fall2023team1"
});
con.connect(); // Launches connection

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

     // New endpoint for fetching mentor details
     if (pathname === '/getMentorDetails' && request.method === 'GET') {
        var query = 'SELECT Mentor.mentorID, Mentor.colorType, User.userName, User.userEmail FROM Mentor INNER JOIN User ON Mentor.userID = User.userID';
        con.query(query, function(err, result) {
            if (err) {
                console.error('Error fetching mentor details:', err);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(result));
            }
        });
        return; // Prevent further processing
    }

    else if (pathname === '/getMenteeList' && request.method === 'GET') {
        const queryObject = url.parse(request.url, true).query;
        const userName = queryObject.userName;

        var myQuery = 'SELECT u.userFirst, u.userLast, u.userEmail FROM Mentee AS m JOIN User AS u ON m.userID = u.userID WHERE m.mentorID = 3';
        con.query(myQuery, [userName], function (err, result, fields) {
            if (err) {
                console.error('Error fetching mentee data:', err);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(result));
            }
        });
        return;
    }

    else if (pathname === '/addMentorToMentee' && request.method === 'POST') {
        let requestData = '';
        request.on('data', (chunk) => {
            requestData += chunk;
        });
    
        request.on('end', () => {
            const requestDataObject = JSON.parse(requestData);
    
            if (!requestDataObject.menteeID || !requestDataObject.mentorID) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'MenteeID and MentorID are required' }));
            } else {
               (() => {
                 const query = `
                    UPDATE Mentee 
                    SET mentorID = ?
                    WHERE menteeID = ?
                `;
                const values = [requestDataObject.mentorID, requestDataObject.menteeID];
    
                con.query(query, values, function (err, result) {
                    if (err) {
                        console.error('Error adding mentor to mentee:', err);
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                    } else {
                        response.writeHead(201, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ success: true, message: 'Mentor added to mentee' }));
                    }
                });
               })();
               return;
               (() => {
                 const query = `
                    UPDATE Requests 
                    SET mentorID = ?
                    WHERE menteeID = ?
                    `;
                    const values = [requestDataObject.mentorID, requestDataObject.menteeID];
        
                    con.query(query, values, function (err, result) {
                        if (err) {
                            console.error('Error adding mentor to mentee:', err);
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: true, message: 'Mentor added to mentee' }));
                        }
                    });
               })();
            }
        });
        return;
    }
    // Handle API endpoints
    if (request.url.startsWith('/getMenteeData') && request.method === 'GET') {
        const queryObject = url.parse(request.url, true).query;
        const userName = queryObject.userName;

        var myQuery = 'SELECT m.colorType, m.menteeID FROM Mentee m INNER JOIN User u ON m.userID = u.userID WHERE u.userName = ?';
        con.query(myQuery, [userName], function (err, result, fields) {
            if (err) {
                console.error('Error fetching mentee data:', err);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(result));
                console.log(JSON.stringify(result));
            }
        });
        return;
    }

    else if (request.method === 'POST' && request.url === '/rating_form') {
        let data = '';

        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            const formData = JSON.parse(data);
            const { userName, userRating} = formData;

            const myQuery = 'UPDATE Mentor m JOIN User u ON m.userID = u.userID SET m.mentorRating = ?, m.ratingCount = 1 WHERE u.userName = ?';
            con.query(myQuery, [userRating, userName], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                } else {
                    console.log('Data inserted successfully');
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ success: true, message: 'Data inserted successfully' }));
                }
            });
        });
        return;
    }

    if (request.method === 'POST' && request.url === '/submit_form') {
        let data = '';

        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            const formData = JSON.parse(data);
            const { userName, userPass, userEmail, userFirst, userLast, userCompany, userType } = formData;

            const myQuery = 'INSERT INTO User (userName, userPass, userEmail, userFirst, userLast, userCompany, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
            con.query(myQuery, [userName, userPass, userEmail, userFirst, userLast, userCompany, userType], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                } else {
                    console.log('Data inserted successfully');
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ success: true, message: 'Data inserted successfully' }));
                }
            });
        });
        return;
    }

    var base = "http://" + request.headers.host;
    var completeurl = new URL(request.url, base);
    var table = completeurl.searchParams.get("tableName");
    console.log(table)
    if (table === "User") {
        var myQuery = 'SELECT * FROM User';
        con.query(myQuery, function (err, result, fields) {
            if (err) {
                console.error('Error fetching data:', err);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(result));
            }
        });
        return;
    } else if (table === "Mentee") {
        var myQuery = 'SELECT * FROM Mentee';
        con.query(myQuery, function (err, result, fields) {
            if (err) {
                console.error('Error fetching data:', err);
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(result));
            }
        });
        return;
    }

    // ... other API endpoint handling ...

    // Serve static files as a fallback
    filename = (pathname === "/") ? "index.html" : path.join(process.cwd(), pathname);
    fs.access(filename, fs.F_OK, function(err) {
        if (!err) {
            var fileStream = fs.createReadStream(filename);
            var typeAttribute = fileExtensions[path.extname(filename)];
            response.writeHead(200, { 'Content-Type': typeAttribute });
            fileStream.pipe(response);
        } else {
            console.log('File does not exist: ' + filename);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('404 - File Not Found (' + filename + ')');
            response.end();
        }
    });
});

server.listen(8000);
console.log("The Web server is alive!!!\nIt's listening on http://127.0.0.1:8000 or http://localhost:8000");
