	<?php
	$custID = htmlspecialchars($_POST['idCustomer']);
	$surname = htmlspecialchars($_POST['surname']);
	$forename = htmlspecialchars($_POST['forename']);
	$house = htmlspecialchars($_POST['house']);
	$addr1 = htmlspecialchars($_POST['addr1']);
	$addr2 = htmlspecialchars($_POST['addr2']);
	$dropCode = htmlspecialchars($_POST['dropCode']);
	$phone = htmlspecialchars($_POST['phone']);
	$email = htmlspecialchars($_POST['email']);
	$regDate = htmlspecialchars($_POST['registeredDate']);
	$isRep = htmlspecialchars($_POST['isRep']);
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

	// Compile SQL containing customer details
	$sql = "UPDATE Customers SET surname=\"$surname\", forename=\"$forename\", house=\"$house\", addr1=\"$addr1\", addr2=\"$addr2\", dropCode=\"$dropCode\", phone=\"$phone\", email=\"$email\", registeredDate=\"$regDate\", isRep=\"$isRep\", notes=\"$notes\"" .
		" WHERE idCustomer = \"$custID\"";

	$result = mysqli_query($conn, $sql); // Add customer

	if(!$result) {
		print 'Error: ' . mysqli_error($result);
		die('Could not get data: ' . mysqli_error());
	} else {
		echo $custID; // Return the ID of the updated record
	}

	mysqli_close($conn);
?>
