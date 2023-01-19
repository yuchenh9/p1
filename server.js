var express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
var cors = require("cors");
var path = require('path');
const port = 8080;
var app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
var mysql = require("mysql2");
//const dbConfig = require("../config/db.config.js");
var connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '20001216',
    database: 'foods'
});
console.log(connection);
// simple route
//app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/
app.use(express.static(path.join(__dirname, './app2/build')));
app.use(express.static(path.join(__dirname, './public')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//WHERE FoodDescription LIKE '%tomato%'
app.get('/tabledata/', function (req, res) {
    const decodedcondition=(req.query.condition).toString().replaceAll('%20',' ').replaceAll('%27','"');
    console.log(decodedcondition)
    connection.query(`SELECT * FROM ${req.query.table} ${decodedcondition}`, function (err, querryres) {
        if (err) {
            console.log("error: ", err);
            res.send(err);
            return;
        }
        res.send(querryres);
    });
});
app.get('/showtablecolumns',function (req,res) {
    let table = req.query.table;

    connection.query(`SHOW columns from ${table}`, function (err, querryres) {
        if (err) {
            console.log("error: ", err);
            res.send(err);
            return;
        }
        res.send(querryres);
    });
});
app.get('/showtables',function (req,res) {
    
    connection.query("SHOW tables", function (err, querryres) {
        if (err) {
            console.log("error: ", err);
            res.send(err);
            return;
        }
        res.send(querryres);
    });
});

/*
app.get("/",(req, res)=> {
  res.sendFile(__dirname + '/public/a.html');
});
*/
//require("./app/routes/tutorial.routes.js")(app);
// set port, listen for requests
var PORT = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })