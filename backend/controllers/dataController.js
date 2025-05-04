const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Ścieżka do folderu scraper (względem backendu)
const scraperBasePath = path.join(__dirname, '..', '..', 'scraper');

exports.getCsvData = (req, res) => {
    const { season, filename } = req.params;
    const filePath = path.join(scraperBasePath, season, filename);

    // Sprawdzenie czy plik istnieje
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Plik nie istnieje.' });
    }

    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv({ separator: ',' })) // Jeśli masz inne separatory np. ';' zmienimy
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Błąd podczas czytania pliku.' });
        });
};
