// Import required packages
const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://dasrahul0103:bw5qHN2s7yYO2Wnj@cluster0.b0ctqez.mongodb.net/BlackCoffer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const BlackCoffer = mongoose.model('BlackCoffer', {}, "BlackCoffer");

app.get('/api/averageIntensityPerCountry', async (req, res) => {
    try {
        const data = await BlackCoffer.find({});
        const reduced = data.reduce(function (m, doc) {
            if (!m[doc.get('country')]) {
                m[doc.get('country')] = { country: doc.get('country'), intensity: doc.get('intensity'), count: 1 };
                return m;
            }
            m[doc.get('country')].intensity += doc.get('intensity');
            m[doc.get('country')].count += 1;
            return m;
        }, {});
        const result = Object.keys(reduced).map(function (k) {
            const item = reduced[k];
            return {
                country: item.country,
                intensity: item.intensity / item.count,
            }
        })
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
