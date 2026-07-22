/**
 * GREEN CITY MISSION — Google Apps Script Backend
 * คนเซ็นทรัล เปลี่ยนเมือง เปลี่ยนโลก
 *
 * วิธีใช้:
 * 1) แก้ SPREADSHEET_ID หากต้องการใช้ไฟล์ Google Sheets อื่น
 * 2) กด Run ฟังก์ชัน setupSheets หนึ่งครั้ง และอนุญาตสิทธิ์
 * 3) Deploy > New deployment > Web app
 * 4) Execute as: Me / Who has access: Anyone
 * 5) คัดลอก URL /exec ไปใส่ใน config.js
 */

const SPREADSHEET_ID = '1022Y-CM9ZmL3G1iDKffRCSVBpKY7eNZUC3jGbrOnNBE';
const TIMEZONE = 'Asia/Bangkok';
const SHEETS = {
  PLAYERS: 'GreenCity_Players',
  CHOICES: 'GreenCity_Choices',
  RESULTS: 'GreenCity_Results',
  ERRORS: 'GreenCity_Errors'
};

const HEADERS = {
  PLAYERS: ['Event ID','Session ID','Registered At','ชื่อ','นามสกุล','รหัสพนักงาน','สาขา','เบอร์โทร The1','Game','Received At'],
  CHOICES: ['Event ID','Session ID','รอบ','ประเภทการตัดสินใจ','Choice ID','ชื่อโครงการ/ตัวเลือก','ค่าใช้จ่าย','งบคงเหลือ','ความสุข','ขยะ','มลพิษ','พื้นที่สีเขียว','พลังงานสะอาด','Effects JSON','Game','Received At'],
  RESULTS: ['Event ID','Session ID','คะแนนรวม','ระดับ','งบคงเหลือ','รอบที่เล่น','ความสุขสุดท้าย','ขยะสุดท้าย','มลพิษสุดท้าย','พื้นที่สีเขียวสุดท้าย','พลังงานสะอาดสุดท้าย','โครงการที่เลือก','Game','Finished At','Received At'],
  ERRORS: ['Received At','Event ID','Action','Message','Payload JSON']
};

function doGet() {
  return json_({ ok: true, service: 'Green City Mission API', timestamp: new Date().toISOString() });
}

function doPost(e) {
  const receivedAt = new Date();
  let payload = {};
  try {
    payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(payload.action || '').trim();
    if (!action) throw new Error('Missing action');

    setupSheets();
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      if (isDuplicateEvent_(payload.eventId)) {
        return json_({ ok: true, duplicate: true, message: 'Event already recorded' });
      }

      if (action === 'register') savePlayer_(payload, receivedAt);
      else if (action === 'choice') saveChoice_(payload, receivedAt);
      else if (action === 'result') saveResult_(payload, receivedAt);
      else throw new Error('Unknown action: ' + action);

      markEvent_(payload.eventId);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true, action: action, receivedAt: receivedAt.toISOString() });
  } catch (error) {
    logError_(receivedAt, payload, error);
    return json_({ ok: false, message: error && error.message ? error.message : String(error) });
  }
}

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureSheet_(ss, SHEETS.PLAYERS, HEADERS.PLAYERS);
  ensureSheet_(ss, SHEETS.CHOICES, HEADERS.CHOICES);
  ensureSheet_(ss, SHEETS.RESULTS, HEADERS.RESULTS);
  ensureSheet_(ss, SHEETS.ERRORS, HEADERS.ERRORS);
  return 'Green City Mission sheets are ready';
}

function savePlayer_(p, receivedAt) {
  append_(SHEETS.PLAYERS, [
    p.eventId || '', p.sessionId || '', p.registeredAt || p.sentAt || '', p.firstName || '', p.surname || '',
    p.employeeId || '', p.branch || '', p.phone || '', p.game || 'Green City Mission', formatDate_(receivedAt)
  ]);
}

function saveChoice_(p, receivedAt) {
  const m = p.metrics || {};
  append_(SHEETS.CHOICES, [
    p.eventId || '', p.sessionId || '', number_(p.round), p.choiceType || '', p.choiceId || '', p.choiceTitle || '',
    number_(p.cost), number_(p.budgetAfter), number_(m.happiness), number_(m.waste), number_(m.pollution),
    number_(m.green), number_(m.energy), JSON.stringify(p.effects || {}), p.game || 'Green City Mission', formatDate_(receivedAt)
  ]);
}

function saveResult_(p, receivedAt) {
  const m = p.metrics || {};
  append_(SHEETS.RESULTS, [
    p.eventId || '', p.sessionId || '', number_(p.score), p.rank || '', number_(p.budgetRemaining), number_(p.roundsCompleted),
    number_(m.happiness), number_(m.waste), number_(m.pollution), number_(m.green), number_(m.energy),
    Array.isArray(p.projects) ? p.projects.join(' | ') : String(p.projects || ''), p.game || 'Green City Mission', p.sentAt || '', formatDate_(receivedAt)
  ]);
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const current = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('|') !== headers.join('|')) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0d6b4b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  }
  return sh;
}

function append_(sheetName, row) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(sheetName);
  sh.appendRow(row);
}

function isDuplicateEvent_(eventId) {
  if (!eventId) return false;
  return CacheService.getScriptCache().get('event:' + eventId) === '1';
}

function markEvent_(eventId) {
  if (!eventId) return;
  CacheService.getScriptCache().put('event:' + eventId, '1', 21600);
}

function logError_(date, payload, error) {
  try {
    setupSheets();
    append_(SHEETS.ERRORS, [formatDate_(date), payload.eventId || '', payload.action || '', error.message || String(error), JSON.stringify(payload)]);
  } catch (_) {}
}

function number_(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatDate_(date) {
  return Utilities.formatDate(date || new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
