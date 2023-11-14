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

const connection_data = {
    host: "107.180.1.16",
    port: "3306",
    user: "fall2023team1",
    password: "fall2023team1",
    database: "fall2023team1"
};

// Creates database connection variable
var con = mysql.createConnection(connection_data);
con.connect(); // Launches connection

function setConnectionError() {
    //on error, reconnect
    con.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            con = mysql.createConnection(connection_data);
            con.connect(); // Launches connection
            setConnectionError(); // Re-sets connection error handling
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

setConnectionError();

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
        console.log(queryObject);
        //const userName = sessionStorage.getItem("mentorID");
        const userName = queryObject.userName;

        var myQuery = 'SELECT u.userFirst, u.userLast, u.userEmail FROM Mentee AS m JOIN User AS u ON m.userID = u.userID WHERE m.mentorID = 5';
        con.query(myQuery, function (err, result, fields) {
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
                    INSERT INTO Requests (requesteeMenteeID, mentorRequested)
                    VALUES (${requestDataObject.menteeID}, ${requestDataObject.mentorID})
                    ON DUPLICATE KEY UPDATE
                    mentorRequested = VALUES(mentorRequested);
                    `;
                    const values = [requestDataObject.menteeID, requestDataObject.mentorID];

                    con.query(query, values, function (err, result) {
                        if (err) {
                            console.error('Error adding request to table:', err);
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: true, message: 'request successfully' }));
                        }
                    });
                })();
            }
        });
        return;
    }
    // Handle API endpoints
    if (request.url.startsWith('/getRequests')) {
        const id = request.url.split('?id=')[1]
        if (!id) {
            response.writeHead(400, { 'Content-Type': 'text/html' });
            response.end(JSON.stringify({ success: false, message: 'no id request'}));
            return;
        }
        const query = `SELECT * FROM Requests WHERE mentorRequested = ${id};`
        con.query(query, (error, result)=>{
            if (error){
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(result));
        })
        return;
    }
    
    if(request.url.startsWith('/acceptRequest')){
        //delete the request and then change the mentor number on the mentee to the mentor id
        //client: fetch(`/${accept ? "acceptMentee" : "rejectMentee"}?menteeID=${menteeID}&mentorID=${c}`)
        const queryObject = url.parse(request.url, true).query;
        const menteeID = queryObject.menteeID;
        const mentorID = queryObject.mentorID;
        if (!menteeID || !mentorID) {
            response.writeHead(400, { 'Content-Type': 'text/html' });
            response.end(JSON.stringify({ success: false, message: 'no id request'}));
            return;
        }
        
        const query = `DELETE FROM Requests WHERE requesteeMenteeID = ${menteeID} AND mentorRequested = ${mentorID};`
        
        con.query(query, (error, result)=>{
            if (error){
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(result));
        });
        
        const query2 = `UPDATE Mentee SET mentorID = ${mentorID} WHERE menteeID = ${menteeID};`
        con.query(query2, (error, result)=>{
            if (error){
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(result));
        });
        
        return;
    } else if(request.url.startsWith('/rejectRequest')){
        //just delete the request
        const queryObject = url.parse(request.url, true).query;
        const menteeID = queryObject.menteeID;
        const mentorID = queryObject.mentorID;
        
        if (!menteeID || !mentorID) {
            response.writeHead(400, { 'Content-Type': 'text/html' });
            response.end(JSON.stringify({ success: false, message: 'no id request'}));
            return;
        }
        
        const query = `DELETE FROM Requests WHERE requesteeMenteeID = ${menteeID} AND mentorRequested = ${mentorID};`
        
        con.query(query, (error, result)=>{
            if (error){
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(result));
        });
        
        return;
    }
    

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

    if (request.method === 'POST' && request.url === '/rating') {
        let data = '';

        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            const formData = JSON.parse(data);
            const { userRating, userName} = formData;

            const myQuery = 'UPDATE Mentor m JOIN User u ON u.userID=m.userID SET m.totalRating = m.totalRating + ?, m.ratingCount = m.ratingCount + 1 WHERE  u.userName = ?';
            con.query(myQuery, [userRating, userName], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ success: false, message: 'An error occurred' }));
                } else {
                    console.log('Data inserted successfully');

                    const myQuery2 = 'UPDATE Mentor m JOIN User u ON u.userID=m.userID SET m.mentorRating = (m.totalRating/m.ratingCount) WHERE  u.userName = ?';        con.query(myQuery2, [userName], (secondErr, secondResult) => {
                        if (secondErr) {
                            // Handle error for the second query
                            console.error('Error inserting data for second query:', secondErr);
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: false, message: 'An error occurred in the second query' }));
                        } else {
                            // Second query successful
                            console.log('Data inserted successfully for second query');
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ success: true, message: 'Data inserted successfully' }));
                }
            });
        }});
       
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
    } else if (table === "Mentor") {
        var myQuery = 'SELECT * FROM Mentor';
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
