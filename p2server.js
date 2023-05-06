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
function logRequestBody(req, res, next) {
  console.log('Request body:', req.body);
  next();
}
app.use(logRequestBody);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/////





app.post('/start', async (req, res) => {
  try {
    console.log("start");
    // Generate a new endpoint
    const userid=nanoid();
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '20001216',
      database: 'p2db'
    });
    var sql = `INSERT INTO users 
                (
                  timestamp,userID
                )
                VALUES
                (
                    ?, ?
                )`;
    const time = getTime(new Date());
    connection.query(sql, [time,userid], function (err, data) {
      if (err) {
          // some error occured
          console.log(err);
          res.status(500).send("Error inserting data");
      } else {
          console.log("inserted");
          res.status(200).send(userid);
      }
      connection.end(); 
    });
    
    // Send the endpoint value as a response to the client
  } catch (error) {
    console.error(error);
  }
});
app.post('/getGPS',(req,res)=>{
  const {speed,time,userid,lat,lng} = req.body;
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20001216',
    database: 'p2db'
  });
  console.log("getGPS");
  var sql = `INSERT INTO points 
              (
                speed,timestamp,userID,lat,lng
              )
              VALUES
              (
                  ?, ?, ?, ?, ?
              )`;
  connection.query(sql, [speed,time,userid,lat,lng], function (err, data) {
    if (err) {
        // some error occured
        console.log(err);
        res.status(500).send("Error inserting data");
    } else {
        console.log("inserted");
        res.status(200).send("Inserted");
    }
    connection.end(); 
  });
});

app.post('/feedbybounds',(req,res)=>{
  console.log("feedbybounds");
  const {w,e,n,s}=req.body;
  
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20001216',
    database: 'p2db'
  });//WHERE lng > ? and lng < ? and lat < ? and lat > ?
  connection.query(`SELECT * FROM points  ORDER BY userID , timestamp ASC`, [w,e,n,s], function (err, result, fields) {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving GPS location data');
    } else {
      // Send the GPS location data as a response to the client
      console.log("locations sent");
      res.status(200).send(result);
      //console.log(result);
    }

    connection.end(); 
  });

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
