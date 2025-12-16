require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (index.html, script.js, style.css, etc.)
app.use(express.static(path.join(__dirname)));

// Proxy endpoint for weather API
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    
    if (!city) {
        return res.status(400).json({ cod: 400, error: 'Missing city parameter' });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        
        if (!apiKey) {
            console.error('OPENWEATHER_API_KEY not set in .env');
            return res.status(500).json({ cod: 500, error: 'Server configuration error' });
        }

        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const response = await axios.get(url, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric'
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Weather API error:', err.message);
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || 'Error fetching weather data';
        res.status(status).json({ cod: status, message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
