// Populate customer form with supplied record
$(function() {
  // Cache the DOM
  var $idCustomer = $('#custID');
  var $surname = $('#surname');
  var $forename = $('#forename');
  var $house = $('#house');
  var $addr1 = $('#addr1');
  var $addr2 = $('#addr2');
  var $dropCode = $('#dropCode');
  var $phone = $('#phone');
  var $email = $('#email');
  var $registeredDate = $('#regDate');
  var $isRep = $('#isRep');
  var $notes = $('#notes');

  var $editMode = false; // Is the form in edit mode
  var custTable = $('#custTableBody');
  var customers;
  var selectedCustomer = 0; // The index of the selected customer within the customers table

  populateCustomerTable(); // Populate customer table with existing records

  // Add customer to databse
  $('#btnAddCustomer').on('click', function() {

    var customer = getCustomerFromForm();
    if(customer == null) // Error in form so don't process
      return;


    // Post the record and reset custFrom
    $.ajax({
      type: 'POST',
      url : "./php/addCustomer.php", //Target URL for JSON file
      data: customer,
      success: function(newCustomerId) {
        customer["idCustomer"] = newCustomerId.trim(); // Get the new customer's ID
        customers.push(customer); // Add customer to customers
        appendCustomerTable(customer);
        updateRecordCount();

        // Clear the form
        $('.custForm')[0].reset(); // Reset the form ready for new customer
      },
      error: function(newCustomer) {
        alert(">Error saving customer<");
      }
    });
  });


  // Request all customers from the database and populate into table
  function populateCustomerTable() {
    // Get records from database
    $.ajax({
      type: 'GET',
      url: './php/getAllCustomers.php',
      datatype: 'json',
      success: function(cust) {
        customers = cust;
        console.log(customers);
        $.each(customers, function(rowIndex, cust) {
          appendCustomerTable(cust);
        });

        // Update the customer count
        updateRecordCount();

      },
      error: function(customers) {
        alert(">Error retrieving customer list<");
      }
    });
  }
  

  // Add a customer to the end of the customer table
  function appendCustomerTable(cust) {
    var row = $("<tr/>").addClass('rowHover');

    $.each(cust, function(colIndex, field) {
      row.append($("<td/>").text(field));
    });

    custTable.append(row); // append the customer to the customers table
  }


  // Update a row in customer table
  function updateCustomerTable(customer) {
    var tdata = $('#custTableBody tr').eq(selectedCustomer)[0].cells;

    var fields = [
      customers[selectedCustomer].idCustomer,
      customers[selectedCustomer].surname,
      customers[selectedCustomer].forename,
      customers[selectedCustomer].house,
      customers[selectedCustomer].addr1,
      customers[selectedCustomer].addr2,
      customers[selectedCustomer].dropCode,
      customers[selectedCustomer].phone,
      customers[selectedCustomer].email,
      dateFromSQL(customers[selectedCustomer].registeredDate),
      customers[selectedCustomer].isRep,
      customers[selectedCustomer].notes
    ];




    $.each(tdata, function(index, data) {
      data.innerHTML = fields[index];

    });
    var x = 0;
  }


  // Update record count form field
  function updateRecordCount() {
    $('#customerCount').val(customers.length);
  }


  // Customer table row clicked handler
  $('#custTableBody').on('click', 'tr', function(){
    // populate customer form with selected record
    selectedCustomer = $(this).index(); // Get the index of the selected customer
    populateCustomerForm(customers[selectedCustomer]);

    // Put the form into edit mode
    editMode = true;
    $('#btnUpdateCustomer').prop("disabled", false); // Enable Update button
    $('#btnAddCustomer').prop("disabled", true); // Disable Add button
    $('#btnDeleteCustomer').prop("disabled", false); // Enable Update button
    $('#btnAddOrder').prop("disabled", false); // Enable Add Order button
  });


  // Read and validate customer details before returning customer object
  function getCustomerFromForm() {
    var customer = {
      idCustomer: parseInt($idCustomer.val()), // NaN for empty field
      surname: $surname.val(),
      forename: $forename.val(),
      house: $house.val(),
      addr1: $addr1.val(),
      addr2: $addr2.val(),
      dropCode: $dropCode.val(),
      phone: $phone.val(),
      email: $email.val(),
      registeredDate: dateToSQL($registeredDate.val()),
      isRep: ($isRep.prop('checked') ? "Y" : "N"),
      notes: $notes.val(),
    };

    if(customer['surname'] == '' && customer['forename'] == '') {
      alert("Please complete Surname and Forename fields");
      return null; // Indicate error situation
    }

    if(customer['registeredDate'] == '') {
      alert("Please complete the Registered Date.");
      return null;
    }

    return customer;
  }


  // Populate customer form
  function populateCustomerForm(customer) {
    console.log("Argument number = " + arguments.length);
    console.log("Customer received: " + customer.surname);
    $('#custID').val(customer.idCustomer);
    $('#surname').val(customer.surname);
    $('#forename').val(customer.forename);
    $('#house').val(customer.house);
    $('#addr1').val(customer.addr1);
    $('#addr2').val(customer.addr2);
    $('#dropCode').val(customer.dropCode);
    $('#phone').val(customer.phone);
    $('#email').val(customer.email);
    $('#regDate').val(dateFromSQL(customer.registeredDate));
    $('#isRep').prop("checked", (customer.isRep == 'Y' ? true : false));
    $('#isRep').val(customer.isRep);
    $('#notes').val(customer.notes);
  }


  /*
  * Reset button clicked
  */
  $('#btnReset').on('click', function() {
    defaultButtons(); // reset button states to default
  });


  /*
  * Delete customer:
  * Deletes record from database
  * Deletes record from customers array
  * Removes entry from customers table */
  $('#btnDeleteCustomer').on('click', function() {
    if(!confirm("Delete Customer?"))
      return;

    var customerID = {idCustomer: $idCustomer.val()}; // Get customer id from table

    $.ajax({ // Remove customer from database
      type: 'POST',
      url: './php/deleteCustomer.php',
      data: customerID,
      datatype: 'json',
      success: function(idCust) {
        var index;
        idCust = idCust.trim();
        // Remove customer from customers array
        $.each(customers, function(rowIndex, cust) {
          if(idCust == cust.idCustomer)
            index = rowIndex; // Record the index of the deleted record
        });

        customers.splice(index, 1); // Remove deleted customer from customers
        
        // Remove deleted customer from customer table
        $('#custTableBody tr').eq(index).remove();
        selectedCustomer = -1; // Customer no longer exists
        $('.custForm').trigger("reset"); // Reset the customer form
        updateRecordCount();

      },
      error: function(customers) {
        alert(">Error deleting customer<");
      }
    });

    defaultButtons(); // Return to default buttons
  });


  /* 
  * Update the selected customer
  * Get form data
  * Update database record
  * Update customer in customer list table
  */
  $('#btnUpdateCustomer').on('click', function() {
    
    var customer = getCustomerFromForm();
    
    if(customer == null) 
      return;

    customers[selectedCustomer] = customer; // Update customer in array
    
    console.log(customer);
    // Post the record and reset custFrom
    $.ajax({
      type: 'POST',
      url : "./php/updateCustomer.php", //Target URL for JSON file
      data: customer,
      success: function(customerID) {
        console.log(customerID);
        alert("Customer updated " + customer["surname"] + " " + customer["forename"]);
        
        updateCustomerTable(customer);
        // Update record in customer table


        // Clear the form
        //$('.custForm')[0].reset(); // Reset the form ready for new customer
      },
      error: function(newCustomer) {
        alert(">Error saving customer<");
      }
    });

  });

  /* 
  * Add Order button clickedf
  * Store customer ID and surname in local storage
  * Open orderForm.html in this window
  */
  $('#btnAddOrder').on('click', function() {
    var customer = getCustomerFromForm();

    localStorage.setItem("customer", JSON.stringify(customer));

    var url = "addOrderForm.html";
    window.open(url, '_self'); // Open the page in this window

  });



  function defaultButtons() {
    $('#btnUpdateCustomer').prop("disabled", true); // Disable Update button
    $('#btnAddCustomer').prop("disabled", false); // Enable Add button
    $('#btnDeleteCustomer').prop("disabled", true); // Disable Delete button
    $('#btnAddOrder').prop("disabled", true); // Enable Add Order button
  }

  // Validate the date and return YYYY/MM/DD
  function dateToSQL(dateString) {
    if(dateString == "")
      return "";

    var month = dateString.slice(0, 2);
    var day =   dateString.slice(3, 5);
    var year =  dateString.slice(-4);

    return (year + "/" + month + "/" + day);
  }

  // Validate the date and return DD/MM/YYYY
  function dateFromSQL(dateString) {
    if(dateString == "")
      return "";

    var month = dateString.slice(5, 7);
    var day =   dateString.slice(-2);
    var year =  dateString.slice(0, 4);

    return (day + "/" + month + "/" + year);
  }
});
