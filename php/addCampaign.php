<?php

	$campaignNo = htmlspecialchars($_POST['campaignNo']);
	$startDate = htmlspecialchars($_POST['startDate']);
	$endDate = htmlspecialchars($_POST['endDate']);
	$isCurrent = htmlspecialchars($_POST['isCurrent']);
	$notes = htmlspecialchars($_POST['notes']);

	// Username & password removed
	$servername = 'localhost';
	$username = '***';
	$password = '***';
	$database = '***';

	//Create connection
	$conn = mysqli_connect($servername, $username, $password, $database);

	//Check connection
	if (!$conn) {
		die('Connection failed, cannot connect to the database: ' . mysqli_connect_error());
	}

	// Check if campaign number already exists
	$sql = "SELECT campaign FROM Campaigns WHERE campaign = " . $campaignNo . ";";

	// echo "SQL: " . $sql;
	
	$result = mysqli_query($conn, $sql); // Check for existing campaign

	if(!$result) {
		echo "Error checking for exiting campaign." . mysqli_error($conn);
		die('Error checking for exiting campaign.' . mysqli_error($conn));
	} else {
		if($result->num_rows > 0) {// Record already exists
			echo "Already exists";
			mysqli_close($conn);
			return;
		}
	}


	// Record does not exist - add it
	$sql = "INSERT INTO Campaigns (campaign, startDate, endDate, currentCampaign, notes)" .
		" VALUES(\"$campaignNo\", \"$startDate\", \"$endDate\", \"$isCurrent\", \"$notes\");";

	// echo "SQL: " . $sql;

	$result = mysqli_query($conn, $sql); // Add the record


	if(!$result) {
		echo 'Error: ' . mysqli_error($conn);
		die('Could not add campaing: ' . mysqli_error($conn));
	} else {
		echo $conn->insert_id; // Return the ID of the newly inserted record
	}

	mysqli_close($conn);
?>
