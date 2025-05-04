const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import tras
const dataRoutes = require('./routes/data'); // tylko to

// Endpointy
app.use('/api/data', dataRoutes);

// Testowy endpoint
app.get('/', (req, res) => {
    res.send('Backend działa poprawnie!');
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer backendu działa na http://localhost:${PORT}`);
});
