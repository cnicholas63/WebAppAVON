<?php
  // Username & password removed
	$servername = 'localhost';
	$username = '***';
	$password = '***';
	$database = '***';

	$idCampaign = htmlspecialchars($_POST['idCampaign']);

	//Create connection
	$conn = mysqli_connect($servername, $username, $password, $database);

	//Check connection
	if (!$conn) {
		die('Connection failed, cannot connect to the database: ' . mysqli_connect_error());
	}

	// Compile SQL containing customer details
	$sql = "DELETE FROM Campaigns WHERE idCampaign = $idCampaign;";

	$result = mysqli_query($conn, $sql); // Add customer
	
	if(!$result) {
		echo 'Error: ' . mysqli_error($conn);
		die(' Could not delete campaign: $idCampaign. ');
	} 
		
	echo $idCampaign; // Return the ID of the deleted record

	mysqli_close($conn); // Close connection
?>
