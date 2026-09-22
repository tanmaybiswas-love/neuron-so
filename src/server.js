const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for bookmarks and history
let bookmarks = [
  { id: '1', title: 'Google', url: 'https://www.google.com', icon: '🔍' },
  { id: '2', title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' },
  { id: '3', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { id: '4', title: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' }
];

let historyLog = [];

// API: Proxy endpoint to help load websites inside iframe if requested
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target URL', details: err.message });
  }
});

// API: Get system info
app.get('/api/system-info', (req, res) => {
  res.json({
    appName: 'Neuron Chrome Space',
    version: '1.0.0',
    platform: process.platform,
    nodeVersion: process.version,
    uptime: process.uptime()
  });
});

// API: Bookmarks
app.get('/api/bookmarks', (req, res) => {
  res.json(bookmarks);
});

app.post('/api/bookmarks', (req, res) => {
  const { title, url, icon } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  const newBookmark = {
    id: Date.now().toString(),
    title: title || url,
    url,
    icon: icon || '🌐'
  };
  bookmarks.push(newBookmark);
  res.status(201).json(newBookmark);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  bookmarks = bookmarks.filter(b => b.id !== id);
  res.json({ success: true });
});

// API: History
app.get('/api/history', (req, res) => {
  res.json(historyLog);
});

app.post('/api/history', (req, res) => {
  const { url, title } = req.body;
  if (url) {
    historyLog.unshift({
      id: Date.now().toString(),
      url,
      title: title || url,
      visitedAt: new Date().toISOString()
    });
    if (historyLog.length > 100) historyLog.pop();
  }
  res.status(201).json({ success: true });
});

app.delete('/api/history', (req, res) => {
  historyLog = [];
  res.json({ success: true });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Neuron Chrome Space running on http://localhost:${PORT}`);
  });
}

module.exports = app;
