$(function() {
  //var $custTable = $('#customer_table'); // Cache the DOM

  var $surname = $('#surname');
  var $forename = $('#forename');
  var $house = $('#house');
  var $addr1 = $('#addr1');
  var $addr2 = $('#addr2');
  var $dropCode = $('#dropCode');
  var $phone = $('#phone');
  var $email = $('#email');
  var $regDate = $('#regDate');
  //var $isRep = $('#isRep').attr('checked');
  var $notes = $('#notes');

  $('#btnAddCustomer').on('click', function() {

    var customer = {
      surname: $surname.val(),
      forename: $forename.val(),
      house: $house.val(),
      addr1: $addr1.val(),
      addr2: $addr2.val(),
      dropCode: $dropCode.val(),
      phone: $phone.val(),
      email: $email.val(),
      regDate: checkDate($regDate.val()),
      notes: $notes.val(),
    };

    console.log("Date = " + $regDate.val());
    console.log("regDate: " + customer['regDate']);

    $.ajax({
      type: 'POST',
      url : "connTestAddCustomer.php", //Target URL for JSON file
      data: customer,
      success: function(newCustomer) {
        alert("Customer Added:" + newCustomer);
      },
      error: function(newCustomer) {
        alert(">Error saving customer<");
      }
    });
  });

  // Validate the date
  function checkDate(dateString) {
    var month = dateString.slice(0, 2);
    var day =   dateString.slice(3, 5);
    var year =  dateString.slice(-4);

    return (year + "/" + month + "/" + day);

  }

});
