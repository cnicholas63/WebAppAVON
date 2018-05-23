// Populate campaign form with supplied record
$(function() {
  // Cache the DOM
  var $idCampaign = $('#campaignID');
  var $campaignNo = $('#campaignNo');
  var $forename = $('#forename');
  var $startDate = $('#startDate');
  var $endDate = $('#endDate');
  var $isCurrent = $('#isCurrent');
  var $notes = $('#notes');
  var campTable = $('#campTableBody');
  var campaigns;
  var selectedCampaign = 0; // The index of the selected campaign within the campaigns table
  var $editMode = false; // Is the form in edit mode


  populateCampaignTable(); // Populate campaign table with existing records

  // Add campaign to databse
  $('#btnAddCampaign').on('click', function() {

    var campaign = getCampaignFromForm();
    if(campaign == null) // Error in form so don't process
      return;

    campaign.startDate =dateToSQL(campaign.startDate); // Put date into YYYY/MM/DD format
    campaign.endDate =dateToSQL(campaign.endDate);

    // Post the record and reset campaignFrom
    $.ajax({
      type: 'POST',
      url : "./php/addCampaign.php", //Target URL for JSON file
      data: campaign,
      success: function(newCampaignID) {
        if(isNaN(parseInt(newCampaignID))) { // Campaign number already exists
          alert("Campaign number: " + campaign.campaignNo + " already exists, please ammend.");
          return;
        }

        campaign['idCampaign'] = newCampaignID.trim(); // Get the new campaign's ID
        campaigns.push(campaign); // Add campaign to campaigns

        campaign.startDate =dateFromSQL(campaign.startDate); // Put dates back to DD/MM/YYYY before adding to table
        campaign.endDate =dateFromSQL(campaign.endDate);

        appendCampaignTable(campaign);
        updateRecordCount();

        // Clear the form
        $('.campaignForm')[0].reset(); // Reset the form ready for new campaign
        console.log("Campaign added: " + campaign.idCampaign);
      },

      error: function(newCampaignID) {
        alert(">Error saving campaign<");
      }
    });
  });


  // Request all campaigns from the database and populate into table
  function populateCampaignTable() {
    // Get records from database
    $.ajax({
      type: 'GET',
      url: './php/getAllCampaigns.php',
      datatype: 'json',
      success: function(camps) {
        campaigns = camps;
        console.log(campaigns);
        $.each(campaigns, function(rowIndex, camp) {
          camp.startDate = dateFromSQL(camp.startDate); // Date from SQL YYYY/MM/DD
          camp.endDate = dateFromSQL(camp.endDate); // Date from SQL YYYY/MM/DD

          appendCampaignTable(camp);
        });

        // Update the campaign count
        updateRecordCount();

      },
      error: function(campaigns) {
        alert(">Error retrieving campaigns list<");
      }
    });
  }
  

  // Add a campaign to the end of the campaign table
  function appendCampaignTable(camp) {
    var row = $("<tr/>").addClass('rowHover');

    $.each(camp, function(colIndex, field) {
      row.append($("<td/>").text(field));
    });

    campTable.append(row); // append the campaign to the campaigns table
  }


  // Update a row in campaign table
  function updateCampaignTable(campaign) {
    var tdata = $('#campTableBody tr').eq(selectedCampaign)[0].cells;

    var fields = [
      campaigns[selectedCampaign].idCampaign,
      campaigns[selectedCampaign].campaignNo,
      campaigns[selectedCampaign].startDate,
      campaigns[selectedCampaign].endDate,
      campaigns[selectedCampaign].isCurrent,
      campaigns[selectedCampaign].notes
    ];

    $.each(tdata, function(index, data) {
      data.innerHTML = fields[index];

    });
    var x = 0;
  }


  // Update record count form field
  function updateRecordCount() {
    $('#campaignCount').val(campaigns.length);
  }


  // Campaign table row clicked handler
  $('#campTableBody').on('click', 'tr', function(){
    // populate campaign form with selected record
    selectedCampaign = $(this).index(); // Get the index of the selected campaign
    populateCampaignForm(campaigns[selectedCampaign]);

    // Put the form into edit mode
    editMode = true;
    $('#btnUpdateCampaign').prop("disabled", false); // Enable Update button
    $('#btnAddCampaign').prop("disabled", true); // Disable Add button
    $('#btnDeleteCampaign').prop("disabled", false); // Enable Update button
    $('#btnAddOrder').prop("disabled", false); // Enable Add Order button
  });


  // Read and validate campaign details before returning campaign object
  function getCampaignFromForm() {
    var campaign = {
      idCampaign: parseInt($idCampaign.val()),
      campaignNo: parseInt($campaignNo.val()), // NaN for empty field
      startDate: $startDate.val(),
      endDate: $endDate.val(),
      isCurrent: ($isCurrent.prop('checked') ? "Y" : "N"),
      notes: $notes.val(),
    };

    if(isNaN(campaign.campaignNo)) {
      alert("Please enter a campaign number");
      return null; // Indicate error situation
    }
    
    if(campaign.startDate == '' || campaign.endDate == '') {
      alert("Please complete the start and end dates.");
      return null;
    }
    
    return campaign;
  }


  // Populate campaign form
  function populateCampaignForm(campaign) {
    console.log("Argument number = " + arguments.length);
    console.log("Campaign received: " + campaign.campaignNo);
    $('#campaignID').val(campaign.idCampaign);
    $('#campaignNo').val(campaign.campaignNo);
    $('#startDate').val(campaign.startDate);
    $('#endDate').val(campaign.endDate); 
    $('#isCurrent').prop("checked", (campaign.isCurrent == 'Y' ? true : false));
    $('#notes').val(campaign.notes);
  }


  /*
  * Reset button clicked
  */
  $('#btnReset').on('click', function() {
    defaultButtons(); // reset button states to default
  });


  /*
  * Delete campaign:
  * Deletes record from database
  * Deletes record from campaigns array
  * Removes entry from campaigns table */
  $('#btnDeleteCampaign').on('click', function() {
    if(!confirm("Delete Campaign?"))
      return;

    var campaignID = {idCampaign: $idCampaign.val()}; // Get campaign id from table

    $.ajax({ // Remove campaign from database
      type: 'POST',
      url: './php/deleteCampaign.php',
      data: campaignID,
      datatype: 'json',
      success: function(idCampaign) {
        var index;
        idCampaign = idCampaign.trim();
        // Remove campaign from campaigns array
        $.each(campaigns, function(rowIndex, camp) {
          if(idCampaign == camp.idCampaign) 
            index = rowIndex; // Record the index of the deleted record
        });

        campaigns.splice(index, 1); // Remove the campaign from the campaigns array
        $('#campTableBody tr').eq(index).remove(); // Remove campaign from campaign table

        selectedCampaign = -1; // Campaign no longer exists
        $('.campForm').trigger("reset"); // Reset the campaign form
        updateRecordCount();
      },
      error: function(campaigns) {
        alert(">Error deleting campaign<");
        return;
      }
    });

    // Clear the form
    $('.campaignForm')[0].reset(); // Reset the form ready for new campaign
    defaultButtons(); // Return to default buttons
  });


  /* 
  * Update the selected campaign
  * Get form data
  * Update database record
  * Update campaign in campaign list table
  */
  $('#btnUpdateCampaign').on('click', function() {
    
    var campaign = getCampaignFromForm();
    
    if(campaign == null) 
      return;

    // Update the campaigns array 
    campaigns[selectedCampaign].campaignNo = campaign.campaignNo;
    campaigns[selectedCampaign].startDate = campaign.startDate;
    campaigns[selectedCampaign].endDate = campaign.endDate;
    campaigns[selectedCampaign].isCurrent = campaign.isCurrent;
    campaigns[selectedCampaign].notes = campaign.notes;
    
    //console.log(campaign);
    // Post the record and reset campFrom
    campaign.startDate=dateToSQL(campaign.startDate); // Put date into YYYY/MM/DD format
    campaign.endDate=dateToSQL(campaign.endDate);

    // Write updated campaign to database
    $.ajax({
      type: 'POST',
      url : "./php/updateCampaign.php", //Target URL for JSON file
      data: campaign,
      success: function(campaignID) {
        console.log(campaignID);
        alert("Campaign updated " + campaign["idCampaign"] + " " + campaign["campaignNo"]);
        
        updateCampaignTable(campaigns[selectedCampaign]); // Repopulate table with updated record
      },
      error: function(newCampaign) {
        alert(">Error updating campaign<");
      }
    });

  });

  /* 
  * Add Order button clicked
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
    $('#btnUpdateCampaign').prop("disabled", true); // Disable Update button
    $('#btnAddCampaign').prop("disabled", false); // Enable Add button
    $('#btnDeleteCampaign').prop("disabled", true); // Disable Delete button
  //  $('#btnAddCampaign').prop("disabled", true); // Enable Add Order button
  }

  // Validate the date and return YYYY/MM/DD
  function dateToSQL(dateString) {
    if(dateString == "")
      return "";

    var day =   dateString.slice(0, 2);
    var month = dateString.slice(3, 5);    
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
