const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

var connection = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '00000012000Pp',
  database : 'foods',
});

console.log(connection)
module.exports = connection;