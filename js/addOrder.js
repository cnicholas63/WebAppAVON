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


  var $customer = JSON.parse(localStorage.getItem("customer"));


  console.log($customer);
  console.log("surname = " + $customer.idCustomer);
  console.log("surname = " + $customer.idCustomer);

  populateCustomerForm($customer);



  // Populate customer form
  function populateCustomerForm(customer) {
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

    // Validate the date and return YYYY/MM/DD
  function dateToSQL(dateString) {
    if(dateString == "")
      return "";

    var month = dateString.slice(0, 2);
    var day =   dateString.slice(3, 5);
    var year =  dateString.slice(-4);

    return (year + "/" + month + "/" + day);
  }

  // Validate the date and return DD/MM/YYYY from YYYY/MM/DD
  function dateFromSQL(dateString) {
    if(dateString == "")
      return "";

    var month = dateString.slice(5, 7);
    var day =   dateString.slice(-2);
    var year =  dateString.slice(0, 4);

    return (day + "/" + month + "/" + year);
  }

});
