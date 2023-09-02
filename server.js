const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(cors());

app.get('/api/activities', async (req, res) => {
    const API_KEY = process.env.RECDOTGOV_API_KEY;
    const offset = req.query.offset || 0;

    try {
        const response = await fetch(`https://ridb.recreation.gov/api/v1/activities?limit=50&offset=${offset}&apikey=${API_KEY}`);
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching activity data', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});