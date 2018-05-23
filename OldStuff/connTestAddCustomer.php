	<?php

	$surname = htmlspecialchars($_POST['surname']);
	$forename = htmlspecialchars($_POST['forename']);
	$house = htmlspecialchars($_POST['house']);
	$addr1 = htmlspecialchars($_POST['addr1']);
	$addr2 = htmlspecialchars($_POST['addr2']);
	$dropCode = htmlspecialchars($_POST['dropCode']);
	$phone = htmlspecialchars($_POST['phone']);
	$email = htmlspecialchars($_POST['email']);
	$regDate = htmlspecialchars($_POST['regDate']);
	$notes = htmlspecialchars($_POST['notes']);

	echo $forename . ', ' . $surname;

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
	$sql = "INSERT INTO Customers (isRep, surname, forename, house, addr1, addr2, dropCode, phone, email, registeredDate, notes)" .
					" VALUES(\"$isRep\", \"$surname\", \"$forename\", \"$house\", \"$addr1\", \"$addr2\", \"$dropCode\", \"$phone\", \"$email\", \"$regDate\", \"$notes\");";

	//echo '</b>Query String: ' . $sql . '</br>';

	$result = mysqli_query($conn, $sql); // Add customer

	if(!$result) {
		print 'Error: ' . mysqli_error($result);
		die('Could not get data: ' . mysqli_error());
	} else {
		print 'Customer added: ' . $surname . ' ' . $forename;
	}

	// $customers = array();
	//
	// if (mysqli_num_rows($result) > 0) {
	// 	// output data of each row
	//   while($row = mysqli_fetch_assoc($result)) {
	// 		$customer = array(
	// 			'idCustomer' => $row['idCustomer'],
	// 			'forename' => $row['forename'],
	// 			'surname' => $row['surname'],
	// 			'email' => $row['email'],
	// 		);
	// 		$customers[] = $customer; // Add the customer to customers array
	//  	}
	//
	// 	echo json_encode($customers); // return the json encoded data
	//
	// }

	mysqli_close($conn);


	?>
