$(function(){
  var custTable = $('#custTableBody');
  var customers;

  // Request all customers from the database and populate into table
  $.ajax({
    type: 'GET',
    url: 'getAllCustomers.php',
    datatype: 'json',
    success: function(cust) {
      customers = cust;
      console.log(customers);
      $.each(customers, function(rowIndex, cust) {
        var row = $("<tr/>").addClass('rowHover');
        $.each(cust, function(colIndex, field) {
          row.append($("<td/>").text(field));
        });
        custTable.append(row);
      });
    },
    error: function(customers) {
      alert(">Error retrieving customer list<");
    }

  });

  // Row clicked handler
  $('#custTableBody').on('click', 'tr', function(){
      alert('You clicked row '+ ($(this).index() + 1) + " " + $(this)[0].cells[0].innerHTML + " " + $(this)[0].cells[2].innerHTML);
      $.post("viewCustomerForm.html", { custID: $(this)[0].cells[0].innerHTML} );

      // populate customer form with selected record
      //$custID.innerHTML = $(this)[0].cells[0].innerHTML;
      $.getScript('js/addCustomer.js', function () {
        populateCustomerForm(customers[$(this).index()]);
      });


      //window.open("/JeniAvon/addCustomerForm.html", "_self");
  });

});
