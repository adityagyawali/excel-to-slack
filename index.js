/* eslint-disable*/

// highlights the row that is just edited
function onEdit(event) {
  var { range } = event;
  const row = range.getRow();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange(`A${row}:H${row}`);
  sheet.setActiveRange(range);
}

// get the url of the current spreadsheet
function getSheetUrl() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const ss = SS.getActiveSheet();
  let url = '';
  url += SS.getUrl();
  url += '#gid=';
  url += ss.getSheetId();
  return url;
}


//
function spreadSheetToSlack() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const currentSheet = sheet.getName();
  var currentSheetUrl = getSheetUrl();
  const values = sheet.getDataRange().getValues();

  if (currentSheet === 'High Level Overview') {
    for (var i = 0; i < values.length; i++) {
      if (values[i][9] === 'Yes') {
        var task = values[i][0];
        var taskDescription = values[i][1];
        var owner = values[i][2];
        var responsible = values[i][3];
        var awaiting_action = values[i][4];
        var status = values[i][5];
        var priority = values[i][6];
        var deadline = values[i][7];
        var path_to_material = values[i][8];
        var currentSheetUrl = getSheetUrl();
        sendToSlack(
          task,
          taskDescription,
          owner,
          responsible,
          awaiting_action,
          status,
          deadline,
          priority,
          path_to_material,
          currentSheet,
          '',
          '',
          currentSheetUrl
        );
      }
    }
  } else {
    for (var i = 0; i < values.length; i++) {
      if (values[i][7] === 'Yes') {
        var task = values[i][0];
        var taskDescription = values[i][1];
        var responsible = values[i][2];
        var deadline = values[i][3];
        const completed = values[i][4];
        const comments = values[i][5];
        sendToSlack(
          task,
          taskDescription,
          owner,
          responsible,
          awaiting_action,
          status,
          deadline,
          priority,
          path_to_material,
          currentSheet,
          completed,
          comments,
          currentSheetUrl
        );
      }
    }
  }
}

// function to send message to Slack
function sendToSlack(
  task,
  taskDescription,
  owner,
  responsible,
  awaiting_action,
  status,
  deadline,
  priority,
  path_to_material,
  currentSheet,
  completed,
  comments,
  currentSheetUrl
) {
  // custom slack webhook
  // change the XXXXX's to your own slack webhook. Get it from:
  // https://my.slack.com/services/new/incoming-webhook/
  const url = 'https://hooks.slack.com/services/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';
  if (completed === 'Yes') {
    var payload = {
      channel: '#spreadsheet-message',
      username: 'Operations Team',
      icon_emoji: ':rocket:',
      text: ` \`${task}\` in \`${currentSheet}\` is now complete. Take A look.\n ${currentSheetUrl}.`,
    };
  } else {
    var payload = {
      channel: '#spreadsheet-message',
      username: 'Operations Team',
      icon_emoji: ':rocket:',
      text: `There has been update to \`${task}\` in  \`${currentSheet}\`, which \`${responsible}\` is responsible for. The deadline is \`${deadline}\`. The task descriptions are: \n${taskDescription}. \n Take a look: \n ${currentSheetUrl}.`,
    };
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };

  return UrlFetchApp.fetch(url, options);
}
