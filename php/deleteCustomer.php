	<?php
		// Username & password removed
	$servername = 'localhost';
	$username = '***';
	$password = '***';
	$database = '***';

	// console.log("Hello");
	$idCustomer = htmlspecialchars($_POST['idCustomer']);

	//Create connection
	$conn = mysqli_connect($servername, $username, $password, $database);

	//Check connection
	if (!$conn) {
		die('Connection failed, cannot connect to the database: ' . mysqli_connect_error());
	}

	// Compile SQL containing customer details
	$sql = "DELETE FROM Customers WHERE idCustomer = $idCustomer;";

	// echo( "Sql: ". $sql);

	$result = mysqli_query($conn, $sql); // Run SQL to delete customer
	// echo "Result: " . $result;

	if(!$result) {
		print 'Error: ' . mysqli_error($result);
		die('Could not delete customer: ' . mysqli_error());
	} 
		
	echo $idCustomer; // Return the ID of the deleted record
	
	mysqli_close($conn);
?>
