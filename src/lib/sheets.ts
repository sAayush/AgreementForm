import { google } from 'googleapis';

/**
 * Appends a row of form data to the configured Google Sheet.
 *
 * The Google Sheet should have headers matching the keys in formData,
 * plus a 'Timestamp' and 'Signed' column.
 *
 * Required env vars:
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 * - GOOGLE_SHEET_ID
 */
export async function appendToSheet(formData: Record<string, string>) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    console.warn(
      '[Google Sheets] Missing credentials — skipping sheet append. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local'
    );
    return;
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const timestamp = new Date().toISOString();

  // Build the row: Timestamp, Full Name, Email, Phone, Course, Student ID, Date, Signed
  const row = [
    timestamp,
    formData.fullName || '',
    formData.email || '',
    formData.phone || '',
    formData.course || '',
    formData.studentId || '',
    formData.date || '',
    'Yes',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}
