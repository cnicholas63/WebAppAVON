<?php
// Username & password removed
$servername = "localhost";
$username = "***";
$password = "***";
$database = "***";

//Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

//Check connection
if (!$conn) {
	die("Connection failed, cannot connect to the database: " . mysqli_connect_error());
}

// List data from Campaigns table
$sql = "SELECT * FROM Campaigns";
$result = mysqli_query($conn, $sql);

if(!$result) {
	print "Error: " . mysqli_error($result);
	die('Could not get data: ' . mysqli_error($result));
}

$campaigns = array();

if (mysqli_num_rows($result) > 0) {
	// output data of each row
	while($row = mysqli_fetch_assoc($result)) {
		$campaign = array(
			"idCampaign" => $row['idCampaign'],
			"campaignNo" => $row['campaign'],
			"startDate" => $row['startDate'],
			"endDate" => $row['endDate'],
			"currentCampaign" => $row['currentCampaign'],
			"notes" => $row['notes'],
		);
		$campaigns[] = $campaign; // Add the campaign to campaigns array
	}

	header('Content-Type: application/json;charset=utf-8');
	echo json_encode($campaigns); // return the json encoded data
}

mysqli_close($conn);
?>
