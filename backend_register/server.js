const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, 'users.json');

// Helper – load users
const loadUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
};

// Helper – save users
const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// 🧪 Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API działa poprawnie ✅' });
});

// 📝 Rejestracja
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Brak danych' });

  const users = loadUsers();
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ error: 'Użytkownik już istnieje' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  saveUsers(users);

  res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });
});

// 🔑 Logowanie
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Nieprawidłowe hasło' });

  res.status(200).json({ message: 'Logowanie zakończone sukcesem' });
});

app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`);
});
