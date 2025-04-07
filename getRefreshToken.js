const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = '60730614984-j9f2599fqdqhn8ddgvsobqah2vknv2i7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  prompt: 'consent'
});

console.log('\n🔗 Authorize this app by visiting this URL:\n');
console.log(authUrl);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n📋 Paste the code from the URL here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Your refresh token is:\n');
    console.log(tokens.refresh_token);
  } catch (err) {
    console.error('❌ Error retrieving access token', err);
  } finally {
    rl.close();
  }
});



