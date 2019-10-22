/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function onEdit(e) {
  const { oldValue } = e;
  const newValue = e.value;
  Logger.log(`this si oldvalue${oldValue}`);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetName();
  const actualSheetName = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getName();

  const { range } = e;
  const row = range.getRow();

  const column = range.getColumn();
  Logger.log(`current column is ${column}`);
  const taskValue = SpreadsheetApp.getActiveSheet()
    .getRange(row, 1)
    .getValue();
  if (column === 1 && oldValue === undefined && newValue !== '') {
    const value = `New Task ${newValue} has been added!`;
  } else if (column === 1 && oldValue !== '') {
    const value = `Task name has been updated to ${newValue} from ${oldValue}.`;
  } else if (column === 2) {
    if (oldValue === undefined) {
      const value = `In task ${taskValue}, ${newValue} task description has been added. `;
    } else {
      const value = `In task ${taskValue} task description has been changed from ${oldValue} to ${newValue}`;
    }
  } else if (column === 3) {
    const value = ` ${newValue} is now responsible for the  ${taskValue}.`;
  } else if (column === 4) {
    if (oldValue === undefined || oldValue === 'dd/mm/yyyy') {
      const value = `New deadline for ${taskValue} is set to ${newValue}.`;
    } else {
      const value = `New deadline for ${taskValue} has been changed from ${oldValue} to ${newValue}.`;
    }
  } else if (column === 5) {
    if (newValue === 'Yes') {
      const value = `${taskValue}, has now been completed`;
    } else {
      const value = `${taskValue} is not complete yet`;
    }
  } else if (column === 6) {
    const value = `Comment for the  task ${taskValue} has been updated with ${newValue}.`;
  }

  const competedColumn = SpreadsheetApp.getActiveSheet()
    .getRange(row, 1)
    .getValue();
  if (column === 8 && newValue === 'submit') {
    sendToSlack(value, taskValue, oldValue, newValue, actualSheetName);
  } else {
    return false;
  }
}

// function to send message to Slack
function sendToSlack(value, taskValue, oldValue, newValue, actualSheetName) {
  if (actualSheetName === "Jesse's Business Trips") {
    const spreadSheetUrl =
      'https://docs.google.com/spreadsheets/d/1uL_kn3idnaFDpDMyblHu5sEamyxGrhEJ9PYyPmnCNcM/edit#gid=105282263';
  } else {
    const spreadSheetUrl =
      'https://docs.google.com/spreadsheets/d/1uL_kn3idnaFDpDMyblHu5sEamyxGrhEJ9PYyPmnCNcM/edit#gid=1860252655';
  }

  // custom slack webhook
  // change the XXXXX's to your own slack webhook. Get it from:
  // https://my.slack.com/services/new/incoming-webhook/
  const url = 'https://hooks.slack.com/services/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';
  const sonUrl =
    'https://docs.google.com/spreadsheets/d/1uL_kn3idnaFDpDMyblHu5sEamyxGrhEJ9PYyPmnCNcM/edit#gid=1860252655';
  const jesseUrl =
    'https://docs.google.com/spreadsheets/d/1uL_kn3idnaFDpDMyblHu5sEamyxGrhEJ9PYyPmnCNcM/edit#gid=105282263';
  if (oldValue === undefined || oldValue === 'dd/mm/yyyy') {
    const payload = {
      channel: '#general',
      username: 'from spreadsteet',
      text: ` ${value} in ${actualSheetName}. Please Take A look.\n ${spreadSheetUrl}.`,
    };
  } else {
    const payload = {
      channel: '#general',
      username: 'from spreadsteet',
      text: ` ${value} in ${actualSheetName}. Value changed from ${oldValue} ==> ${newValue}. Please Take A look.\n ${spreadSheetUrl}.`,
    };
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };

  return UrlFetchApp.fetch(url, options);
}
