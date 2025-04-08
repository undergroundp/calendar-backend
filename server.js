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
    const calendarIds = [
      'primary',
      'b1aa2462fec41240303550b155f90c1bfe7d46ca1e8df1c4b29d014cc0a7f878@group.calendar.google.com'  // ⬅️ Replace this
    ];

    const allEvents = [];

    for (const calendarId of calendarIds) {
      const response = await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime',
      });

      allEvents.push(...(response.data.items || []));
    }

    // Optional: sort events by start time across calendars
    allEvents.sort((a, b) => {
      const aTime = new Date(a.start.dateTime || a.start.date);
      const bTime = new Date(b.start.dateTime || b.start.date);
      return aTime - bTime;
    });

    res.json(allEvents);
  } catch (err) {
    console.error('❌ Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
