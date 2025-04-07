const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://undergroundp.github.io'
}));

const PORT = process.env.PORT || 3000;


// === 🔑 Replace with your actual credentials ===
const CLIENT_ID = '60730614984-j9f2599fqdqhn8ddgvsobqah2vknv2i7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//09gIYA9eS4xaiCgYIARAAGAkSNgF-L9Irw4EA10SsduU_JDegPsdixEU0T_7-7z8DStBdNqEC-LV0In3oNKcL3UOlZ5WsNzmlPw';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// === 📅 API to get upcoming events ===
app.get('/events', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (err) {
    console.error('❌ Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
