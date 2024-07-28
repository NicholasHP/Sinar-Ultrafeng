function doGet(e) {
  Logger.log(JSON.stringify(e));
  if (!e.parameter.page) {
    // When no specific page requested, return the form page
    return HtmlService.createTemplateFromFile('funnelPage').evaluate();
  }
  // Serve the requested page
  return HtmlService.createTemplateFromFile(e.parameter.page).evaluate();
}

function saveLead(data) {
  try {
    const spreadsheetId = "1cyqtLgYB929AndsPqigqELHqSuAeh2bSEWDBi4I7Pkg"; // Replace with your actual spreadsheet ID
    const sheetName = "Sales Funnel Management";
    let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow(["Name", "Email", "Phone", "Status", "Next Action Date", "Notes"]);
    }

    sheet.appendRow([data.name, data.email, data.phone, data.status, data.actionDate, data.notes]);
    
    sendFollowUpEmail(data.email, data.name);
    scheduleSalesCall(data.name, data.phone, data.actionDate);
    
    return "Lead saved and follow-up email sent!";
  } catch (e) {
    Logger.log(e.toString());
    return "Error: " + e.toString();
  }
}

function getAllLeads() {
  const spreadsheetId = "1cyqtLgYB929AndsPqigqELHqSuAeh2bSEWDBi4I7Pkg"; // Replace with your actual spreadsheet ID
  const sheetName = "Sales Funnel Management";
  let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    return {status: "error", message: "Sheet not found."};
  }
  
  const data = sheet.getDataRange().getValues();
  return {status: "success", data: data};
}

function sendFollowUpEmail(email, name) {
  const subject = `Follow-up with ${name}`;
  const body = `Dear ${name},\n\nThank you for your interest. We will follow up with you soon.\n\nBest regards,\nSales Team`;
  GmailApp.sendEmail(email, subject, body);
}

function scheduleSalesCall(name, phone, actionDate) {
  const calendar = CalendarApp.getDefaultCalendar();
  calendar.createEvent(`Call with ${name}`,
    new Date(actionDate),
    new Date(new Date(actionDate).getTime() + 30 * 60 * 1000),
    {description: `Phone: ${phone}`});
}
