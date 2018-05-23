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

// List data from Customers table
$sql = "SELECT * FROM Customers";
$result = mysqli_query($conn, $sql);

if(!$result) {
	print "Error: " . mysqli_error($result);
	die('Could not get data: ' . mysqli_error($result));
}

$customers = array();

if (mysqli_num_rows($result) > 0) {
	// output data of each row
	while($row = mysqli_fetch_assoc($result)) {
		$customer = array(
			"idCustomer" => $row['idCustomer'],
			"forename" => $row['forename'],
			"surname" => $row['surname'],
			"house" => $row['house'],
			"addr1" => $row['addr1'],
			"addr2" => $row['addr2'],
			"dropCode" => $row['dropCode'],
			"phone" => $row['phone'],
			"email" => $row['email'],
			"registeredDate" => $row['registeredDate'],
			"isRep" => $row['isRep'],
			"notes" => $row['notes'],
		);
		$customers[] = $customer; // Add the customer to customers array
	}

	header('Content-Type: application/json;charset=utf-8');
	echo json_encode($customers); // return the json encoded data
}

mysqli_close($conn);
?>
