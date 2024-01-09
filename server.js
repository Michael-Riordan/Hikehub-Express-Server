const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(express.json());

/*
--imports for imageDownloader endpoint
const fs = require('fs');
const path = require('path');
const https = require('https');
*/ 

app.use(cors({
    origin: ['https://master--lustrous-bubblegum-27de96.netlify.app', 'http://192.168.0.59:5173', 'http://localhost:5173', 'https://lustrous-bubblegum-27de96.netlify.app', 'https://wanderamerica.netlify.app', 'https://master--wanderamerica.netlify.app'],
    optionsSuccessStatus: 200,
}));


AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: 'us-west-1'
})


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

app.get('/api/parkImages', async (req, res) => {

    const s3 = new AWS.S3();

    const params = {
        Bucket: 'wanderamerica',
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error fetching S3 contents:', err);
        } else {
            console.log('S3 Contents:', data.Contents);
            res.json(data.Contents);
        }
    });

})

/*
//below code is used to download and store image files in an images folder (later uploaded to s3)
const folderName = 'images';
app.post('/api/imageDownloader', async (req, res) => {
    const  { urls } = req.body;

    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    downloadWithConcurrency(10, urls);
})

const downloadImage = async (url, destination) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const filename = `${destination}/${url.substring(url.lastIndexOf('/') + 1)}`;
        fs.writeFileSync(filename, Buffer.from(buffer));
        console.log(`Downloaded ${url}`);
    } catch (error) {
        console.error(`Error downloading ${url}: ${error.message}`);
    }
};

const downloadWithConcurrency = async (maxConcurrency = 10, urls) => {
    const imageChunks = Array.from({length: Math.ceil(urls.length / maxConcurrency) }, (_, index) => 
        urls.slice(index * maxConcurrency, (index + 1) * maxConcurrency)
    );

    for (const chunk of imageChunks) {
        await Promise.all(chunk.map(url => downloadImage(url, 'images')))
    }
};
*/


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});