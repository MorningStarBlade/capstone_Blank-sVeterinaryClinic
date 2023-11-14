<?php
  $servername = "Regular";
  $username = "localhost";
  $password = "mysql";

  // Connection
  $conn = new mysqli ($servername, $username, $password);

  // For checking if connection is good or not
  if ($conn->connect_error){
    die("Connection Failed: " . $conn->connect_error);
  }
  echo "Connected successfully.";

?>