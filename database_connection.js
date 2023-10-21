const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname));


// MySQL database connection
const connection = mysql.createConnection({
  host: '107.180.1.16',
  port: '3306',
  user: 'fall2023team1',
  password: 'fall2023team1',
  database: 'fall2023team1',
});

// Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

//Open index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });


app.listen(8000); 
console.log("\nThe Web server is alive!!!\n" +
    "It's listening on http://127.0.0.1:8000 or http://localhost:8000");


module.exports = connection;
module.exports = app;