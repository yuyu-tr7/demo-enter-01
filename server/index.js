const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Simple hardcoded login
const USERS = [{ username: 'admin', password: 'password' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true, token: 'demo-token', username });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
