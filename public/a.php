<?php
  // declare database variables
  // change to the information relevant
  // to your database
  $username = "root";
  $password = "00000012000Pp";  
  $host = "127.0.0.1";
  $database="foods";
 
  // connect to database
  $server = mysql_connect($host, $username, $password);
  $connection = mysql_select_db($database, $server);
 
  // perform query
  // change the query to one relevant to your database
  $myquery = "
    SELECT  * FROM  `data`
    ";
  $query = mysql_query($myquery);
 
  if ( ! $query ) {
    echo mysql_error();
    die;
  }
 
  // encode data to json format
  echo json_encode($data);  
 
  // close connection
  mysql_close($server);
?>