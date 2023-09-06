const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(cors());

app.get('/api/geolocation', async (req, res) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const coordinates = req.query.coordinates;
    const coordinatesObject = JSON.parse(decodeURIComponent(coordinates));
    const latitude = coordinatesObject.latitude;
    const longitude = coordinatesObject.longitude;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`);
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching location', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

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

app.get('/api/recAreas', async (req, res) => {
    const API_KEY = process.env.RECDOTGOV_API_KEY;
    const coordinates = req.query.coordinates;
    const coordinatesObject = JSON.parse(decodeURIComponent(coordinates));
    const latitude = coordinatesObject.latitude;
    const longitude = coordinatesObject.longitude;

    try {
        const response = await fetch(`https://ridb.recreation.gov/api/v1/recareas?limit=50&offset=0&latitude=${latitude}&longitude=${longitude}&apikey=${API_KEY}`);
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching recArea data', error);
        res.status(500).json({ error: 'Internal server error.'});
    }
})

app.get('/api/recAreaImg', async (req, res) => {
    const API_KEY = process.env.RECDOTGOV_API_KEY;
    const idQuery = req.query.id;

    try {
        const response = await fetch (`https://ridb.recreation.gov/api/v1/recareas/${idQuery}/media?limit=50&offset=0&apikey=${API_KEY}`)
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching Rec Area Images', error);
        res.status(500).json( {error: 'Internal server error.'});
    }
})

app.get('/api/NationalParks', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const stateCode = req.query.stateCode;

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${API_KEY}`)
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching National Parks data', error);
        res.status(500).json({ error: 'Internal server error.'});
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});