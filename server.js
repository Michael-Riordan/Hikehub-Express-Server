const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors({
    origin: ['https://master--lustrous-bubblegum-27de96.netlify.app', 'http://192.168.0.59:5173', 'http://localhost:5173', 'https://lustrous-bubblegum-27de96.netlify.app'],
    optionsSuccessStatus: 200,
}));

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
        console.error('Error fetching location via coordinates', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/geocoding', async (req, res) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const address = req.query.address;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching location via address', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/activities', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/activities?&api_key=${API_KEY}`);
        const jsonResponse = await response.json();

        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching activity data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/NationalParks', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const stateCode = req.query.stateCode;

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${API_KEY}`)
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching National Parks data', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/api/AllNationalParks', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const startCount = req.query.startCount;
    
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?start=${startCount}&api_key=${API_KEY}`);
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching All National Parks', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/api/visitorCenters', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const parkCode = req.query.parkCode;
    const parkCodeQuery = `parkCode=${parkCode}`

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?${parkCodeQuery}&api_key=${API_KEY}`);
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching visitor centers', error);
        res.status(500).json({error: 'Internal server error.'});
    }
})

app.get('/api/NationalParkGeoJson', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const parkCode = req.query.parkCode;

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/mapdata/parkboundaries/${parkCode}?api_key=${API_KEY}`);
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error('Error fetching National Park GeoJSON');
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/api/NatParkThingsToDo', async (req, res) => {
    const API_KEY = process.env.DATADOTGOV_API_KEY;
    const parkCode = req.query.parkCode;

    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/thingstodo?parkCode=${parkCode}&api_key=${API_KEY}`)
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    } catch (error) {
        console.error(`Error fetching Things to Do in ${parkCode}`);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});