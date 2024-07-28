function doGet(e) {
  if (e.parameter['page'] == 'ContactsPage') {
    // const contactsHtml = HtmlService.createTemplateFromFile('contacts');
    // contactsHtml.companyID = e.parameter['companyID']; // Pass the companyID from the URL parameter
    // return contactsHtml.evaluate();

    //  var htmlOutput =  HtmlService.createTemplateFromFile('contacts');
    // htmlOutput.companyID = e.parameter['companyID'];
    // return htmlOutput.evaluate(); 

      var pageName = e.parameter.pageName;
  var companyID = e.parameter.companyID;
  var template = HtmlService.createTemplateFromFile(pageName);
  
  template.companyID = companyID;
  
  return template.evaluate();
  }
  var html = HtmlService.createTemplateFromFile('login');
  html.message = '';
  return html.evaluate();
}


// function include(filename) {
//   return HtmlService.createHtmlOutputFromFile(filename).getContent();
// }

function include(filename, parameters) {
  var template = HtmlService.createTemplateFromFile(filename);
  if (parameters) {
    for (var key in parameters) {
      template[key] = parameters[key];
    }
  }
  return template.evaluate().getContent();
}

function getUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}
var z = (num, places) => String(num).padStart(places, '0');
const spreadsheetId = "1cyqtLgYB929AndsPqigqELHqSuAeh2bSEWDBi4I7Pkg";
let wss = SpreadsheetApp.openById(spreadsheetId);
var usersSheet = wss.getSheetByName("users");
var activeSheet = wss.getSheetByName("active");
var dealsSheet = wss.getSheetByName("deals");
var activityDealsSheet = wss.getSheetByName("activity deals");
var contactsSheet = wss.getSheetByName("contacts");
var companiesSheet = wss.getSheetByName("companies");
var leaderboardSheet = wss.getSheetByName("Leaderboard");

var pgi;
function doPost(e) {
  Logger.log(JSON.stringify(e));

  if (e.parameter.action === 'getCompaniesData') {
    return getCompaniesData();  // Call the function to get companies data
  }

  if(e.parameter.LoginButton == 'Login'){
    var username = e.parameter.username;
    var password = e.parameter.password;
    pgi = username;
    var vdate = vlogin(username, password);
    if(vdate.status == 'TRUE'){
      var html =  HtmlService.createTemplateFromFile('index');
      var nm = usersSheet.getDataRange().getValues();
      for(var i=1;i<nm.length;i++){
        if(username === nm[i][4]){
          var accv = nm[i][6];
          var nme = nm[i][7];
        }
      }
      html.username = username;
      html.message = nme;
      html.acc = accv;
      html.email = vdate.email;
      html.contact = vdate.contact;
      html.password = vdate.password;
      return html.evaluate();   
    }else{
      var html =  HtmlService.createTemplateFromFile('login');
      html.message = 'Failed to Login';
      return html.evaluate();     
    }
  }else if(e.parameter.LogoutButton == 'Logout'){
    louNow(e.parameter.username);
    var html =  HtmlService.createTemplateFromFile('login');
    html.message = 'Oops You are Log out.';
    return html.evaluate(); 
  }else if(e.parameter.Pcv == 'Pcv'){
    louNow(e.parameter.username);
    var html =  HtmlService.createTemplateFromFile('login');
    html.message = 'Access denied.';
    return html.evaluate(); 
  }else if(e.parameter.null == null){
    louNow(e.parameter.username);
    var html =  HtmlService.createTemplateFromFile('login');
    html.message = 'Login to continue...';
    return html.evaluate(); 
  }
}

function vlogin(username, password){
  var time = Utilities.formatDate(new Date(),"Asia/Kolkata", 'yyyy-MM-dd\'T\'HH:mm:ss');
  var clr =  activeSheet.getLastRow();
  var vlr =  usersSheet.getLastRow();
  var flag ='';
  for(var x =1;x<=clr; x++){
    if(activeSheet.getRange(x,3).getValue()==username&&username!=""){
    flag = 'TRUE';
    var email = usersSheet.getRange(x,10).getValue();
    var contact = usersSheet.getRange(x,9).getValue();
    activeSheet.getRange(x,5).setValue(time);
    }
  } 
  if( flag == ''){
    for(var i = 1;i<=vlr; i++){
      if(usersSheet.getRange(i,2).getValue()=="Yes"&&usersSheet.getRange(i,5).getValue()==username&&usersSheet.getRange(i,6).getValue()==password&& username!=""){
        flag = 'TRUE';
        var email = usersSheet.getRange(i,10).getValue();
        var contact = usersSheet.getRange(i,9).getValue();
        var v2 = usersSheet.getRange(i,4).getValue();
        var v3 = usersSheet.getRange(i,8).getValue();
        activeSheet.insertRowAfter(clr).appendRow([time,v2,username,v3]);
      }
    }
  }if(flag == ''){
    flag = 'FALSE'; 
  }
  return { status: flag, email: email, contact: contact, password: password };
};

function louNow(username){
  var clr =  activeSheet.getLastRow();
  for(var b = 1; b <=clr; b++){
    if(activeSheet.getRange(b, 3).getValue()==username){
      activeSheet.deleteRow(b);
    }
  }
};

function autoLout(){
  var clr =  activeSheet.getLastRow();
  for(var t = 1; t <= clr; t++){
    if(activeSheet.getRange(t, 1).getValue() < new Date(Date.now() - activeSheet.getRange(t,2).getValue()*60*1000)){
      activeSheet.deleteRow(t);
    }
  }
};

function getContactsData() {
  const data = contactsSheet.getDataRange().getValues();
  
  return data.slice(1);
}

// function getCompaniesData() {
//   const data = companiesSheet.getDataRange().getValues();
  
//   const companies = [];
//   for (let i = 1; i < data.length; i++) {
//     companies.push({
//       companyID: data[i][0],
//       companyDomain: data[i][1],
//       name: data[i][2],
//       phoneNumbers: data[i][3].split(','),
//       emails: data[i][4].split(','),
//       image: data[i][5] || "https://via.placeholder.com/100" 
//     });
//   }
  
//   var jsonOutput = ContentService.createTextOutput(JSON.stringify(companies));
//   jsonOutput.setMimeType(ContentService.MimeType.JSON);
//   return jsonOutput;
// }

function getCompaniesData() {
  const data = companiesSheet.getDataRange().getValues();
  
  return data.slice(1);
}

function updateUserProfile(name, username, email, contact, password) {
  var data = usersSheet.getLastRow();
  
  Logger.log('Data retrieved from sheet: ' + JSON.stringify(data)); // Log the retrieved data for debugging
  for (var i = 1; i <= data; i++) {
    Logger.log('Checking row: ' + i); // Log the current row being checked
    Logger.log('Checking row with ' + JSON.stringify(usersSheet.getRange(i,10).getValue()));
    if (usersSheet.getRange(i,5).getValue() === username) { // Assuming the email is in the third column (index 2)
      Logger.log('Match found at row: ' + (i)); // Log the matched row
      usersSheet.getRange(i, 8).setValue(name); // Assuming the name is in the first column (index 0)
      usersSheet.getRange(i, 6).setValue(password);
      usersSheet.getRange(i, 10).setValue(email); // Assuming the email is in the third column (index 2)
      usersSheet.getRange(i, 9).setValue(contact); // Assuming the phone number is in the fourth column (index 3)
      break;
    }
  }
  Logger.log('Update process completed'); // Log the completion of the update process
}

// function getContactsByCompany(companyID) {
//   const data = contactsSheet.getDataRange().getValues();
  
//   // Filter the data starting from the second row (index 1)
//   const filteredData = data.slice(1).filter(row => row[1] === companyID);
  
//   // Return the filtered data without headers
//   return filteredData;
// }


// function fetchCompanies() {
//   var url = getUrl() + '?action=getCompaniesData';

//   try {
//     var options = {
//   'headers': {
//     'Accept': 'application/json'
//   }
// };
// var response = UrlFetchApp.fetch(url, options);
//     var responseCode = response.getResponseCode();
//     var responseText = response.getContentText();

//     Logger.log('Response code: ' + responseCode);
//     Logger.log('Response text: ' + responseText);

//     if (responseCode === 200) {
//       // Directly log the parsed JSON
//       var companies = JSON.parse(responseText);
//       Logger.log('Fetched companies: ' + JSON.stringify(companies));
//       return companies;
//     } else {
//       throw new Error('HTTP error! status: ' + responseCode);
//     }
//   } catch (error) {
//     Logger.log('Could not fetch companies: ' + error.message);
//     Logger.log('Stack trace: ' + error.stack);
//     return [];
  // }
// }



//----CRUD DEALS
// function getDealsData() {
//   // Get all data from the sheet
//   let deal_data = dealsSheet.getDataRange().getValues();

//   // Log the first row of data (for testing)
//   console.log(deal_data[0]);

//   // Remove the first row from the data
//   let dataWithoutHeader = deal_data.slice(1);

//   // Log the data after removing the first row (for testing)
//   console.log(dataWithoutHeader);

//   // Return the data without the first row
//   return dataWithoutHeader;
// }

function getDealsData() {
  const data = dealsSheet.getDataRange().getValues();
  
  return data.slice(1);
}


function processForm(formObject) {
  if (formObject.RecId && checkID(formObject.RecId)) {
    updateData(getFormValues(formObject), getRangeByID(formObject.RecId));
  } else {
    appendData(getFormValues(formObject), 'Data!A1:I1');
  }
  
  return getDeals_Data();
}

function showForm() {
  const html = HtmlService.createHtmlOutputFromFile('deals_and_form')
      .setWidth(800)
      .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Deals and Form');
}

function deleteDeal(dealId) {
  const range = dealsSheet.getRange(1, 1, dealsSheet.getLastRow(), 1).getValues();
  for (let i = 0; i < range.length; i++) {
    if (range[i][0] === dealId) {
      dealsSheet.deleteRow(i + 1);
      break;
    }
  }
}

function getFormValues(formObject) {
  if (formObject.RecId && checkID(formObject.RecId)) {
    return [[
      formObject.RecId,
      formObject.company,
      formObject.pointOfContact,
      formObject.consumerType,
      formObject.creationDate,
      formObject.closeDate,
      formObject.amount,
      formObject.status
    ]];
  } else {
    return [[
      generateUUID(),
      formObject.company,
      formObject.pointOfContact,
      formObject.consumerType,
      formObject.creationDate,
      formObject.closeDate,
      formObject.amount,
      formObject.status
    ]];
  }
}

function generateUUID() {
  return Math.random().toString().substr(2, 6); // Generates a 6-digit UUID
}

function appendData(values, range) {
  const sheetRange = dealsSheet.getRange(range);
  sheetRange.offset(dealsSheet.getLastRow(), 0, values.length, values[0].length).setValues(values);
}

function checkID(id) {
  const ids = dealsSheet.getRange(1, 1, dealsSheet.getLastRow(), 1).getValues();
  return ids.some(row => row[0] === id);
}

function getRangeByID(id) {
  const range = dealsSheet.getRange(1, 1, dealsSheet.getLastRow(), 1).getValues();
  for (let i = 0; i < range.length; i++) {
    if (range[i][0] === id) {
      return `A${i + 1}:H${i + 1}`;
    }
  }
  return null;
}

//CRUD Contact
function updateContactData(contactID, updatedData) {
  const data = contactsSheet.getDataRange().getValues();

  // Find the row with the given contactID and update the data
  for (let i = 1; i < data.length; i++) { // Start from 1 to skip header row
    if (data[i][0] == contactID) {
      sheet.getRange(i + 1, 2, 1, updatedData.length).setValues([updatedData]);z
      break;
    }
  }
}

function getRowIndexByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}

/**  UPDATE DATA */
function updateData(values, startRow, endRow, sheetName) {
  var range = sheetName + "!A" + startRow + ":F" + endRow; // Adjust the column range (A:F) as needed
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
    valueInputOption: "RAW"
  });
}

function deleteData(id, sheetName){ 
  // Get the sheet ID based on the sheet name
  var spreadsheet = SpreadsheetApp.openById(globalVariables().spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var sheetId = sheet.getSheetId();
  
  var startIndex = getRowIndexByID(id);
  
  var deleteRange = {
                      "sheetId"     : sheetId,
                      "dimension"   : "ROWS",
                      "startIndex"  : startIndex,
                      "endIndex"    : startIndex+1
                    }
  
  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];
  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);
  
  return getAllData();
}

function getLeaderboard_Data() {
  // Get all data from the sheet
  const leaderboarddata = leaderboardSheet.getDataRange().getValues();
  console.log(leaderboarddata);
  leaderboarddata.shift(); // Remove header row
  console.log(leaderboarddata);
  return leaderboarddata;
}

function updateDealsData(values, startRow, endRow, sheetName) {
  var range = sheetName + "!A" + startRow + ":J" + endRow; // Adjust the column range (A:F) as needed
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
    valueInputOption: "RAW"
  });
}

function sortByDealsCount() {
  var range = leaderboardSheet.getRange('B2:J'); // Adjust the range as needed
  range.sort({ column: 9, ascending: false }); // Sort by Deals Count in descending order
}





