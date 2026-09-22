const app = require('../src/server.js');
const http = require('http');

const server = http.createServer(app);
server.listen(3002, async () => {
  console.log('Testing endpoints...');
  try {
    // 1. System info
    const sysRes = await fetch('http://localhost:3002/api/system-info');
    const sysData = await sysRes.json();
    console.log('System Info OK:', sysData.appName);

    // 2. Bookmarks
    const bmRes = await fetch('http://localhost:3002/api/bookmarks');
    const bmData = await bmRes.json();
    console.log('Bookmarks OK:', bmData.length, 'items');

    // 3. Add Bookmark
    const addRes = await fetch('http://localhost:3002/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Test', url: 'https://test.com' })
    });
    const addData = await addRes.json();
    console.log('Add Bookmark OK:', addData.title);

    // 4. History
    const histRes = await fetch('http://localhost:3002/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://test.com', title: 'Test' })
    });
    const histData = await histRes.json();
    console.log('History OK:', histData.success);

    console.log('ALL API TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('API Test Failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
