const express = require('express')
const app = express()
const port = 3000
const { nanoid } = require('nanoid');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));
app.use(bodyParser.json());
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Add this line
  next();
});
*/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

/////





app.get('/start', async (req, res) => {
  try {
    // Generate a new endpoint
    const endpoint = nanoid();

    // Create a new connection to the MySQL database
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '20001216',
      database: 'p2db'
    });


    // Insert the endpoint into the 'endpoints' table
   
    var sql = `INSERT INTO activeusers 
            (
              timestamp, endpoint,active
            )
            VALUES
            (
                ?, ?, ?
            )`;
const time=new Date().toISOString();
    connection.query(sql, [time, endpoint,1], function (err, data) {
      if (err) {
          // some error occured
          console.log(err);
      } else {
          console.log("inserted");
      }
    });
    createUserEndpoint(endpoint);
    // Send the endpoint value as a response to the client
    return res.send({ endpoint });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error generating endpoint' });
  }
});
app.post('/start', (req, res) => {
  //console.log(req)
  endpoint=req.body['storedEndpoint'];
  createUserEndpoint(endpoint);
  return res.status(200).send({ message:"successfully retrieved user" });
});
function createUserEndpoint(userEndpoint) {
  console.log(userEndpoint);
  app.post(`/${userEndpoint}`, (req, res) => {
    console.log(req);
    const {time, latitude, longitude} = req.body;
    // Handle the POST request for this endpoint here
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '20001216',
      database: 'p2db'
    });
    var sql = `INSERT INTO locations 
    (
      timestamp, endpoint,lat,lng
    )
    VALUES
    (
        ?, ?, ?, ?
    )`;
    
    connection.query(sql, [time,userEndpoint,latitude,longitude], function (err, data) {
    if (err) {
      // some error occured
      console.log(err);
    } else {
      console.log(time,userEndpoint,latitude,longitude);
    }
    });

    // Insert the endpoint into the 'endpoints' table
    connection.query(sql, [time, userEndpoint, latitude, longitude], function (err, data) {
      if (err) {
        // some error occurred
        console.log(err);
      } else {
        // Insert the endpoint into the 'endpoints' table
        connection.query(`SELECT * FROM locations WHERE endpoint = ?`, [userEndpoint], function (err, result, fields) {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error retrieving GPS location data' });
          }
    
          // Send the GPS location data as a response to the client
          console.log("locations sent");
          return res.status(200).send({ locationdata: result });
        });
      }
    });
    

    connection.query(sql, [new Date(), endpoint,1], function (err, data) {
      if (err) {
          // some error occured
          console.log(err);
      } else {
          console.log("inserted");
      }
    });
  });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
