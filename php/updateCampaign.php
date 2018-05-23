	<?php
	$campID = htmlspecialchars($_POST['idCampaign']);
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

	// Compile SQL containing campaign details
	$sql = "UPDATE Campaigns SET campaign=\"$campaignNo\", startDate=\"$startDate\", endDate=\"$endDate\", currentCampaign=\"$isCurrent\", notes=\"$notes\"" . " WHERE idCampaign = \"$campID\"";

	echo $sql;

	$result = mysqli_query($conn, $sql); // Add campaign

	if(!$result) {
		print 'Error: ' . mysqli_error($result);
		die('Could not get data: ' . mysqli_error());
	} else {
		echo $custID; // Return the ID of the updated record
	}

	mysqli_close($conn);
?>
