const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
mongoose.connect('mongodb://localhost:27017/zomato')
    .then(() => {
        console.log("Connected to MongoDB");

        const restaurantSchema = new mongoose.Schema({
            'Restaurant ID': { type: Number },
            'Restaurant Name': { type: String },
            'Country Code': { type: Number },
            City: { type: String },
            Address: { type: String },
            Locality: { type: String },
            'Locality Verbose': { type: String },
            Longitude: { type: Number },
            Latitude: { type: Number },
            Cuisines: { type: String },
            'Average Cost For Two': { type: Number },
            Currency: { type: String },
            'Has Table Booking': { type: String },
            'Has Online Delivery': { type: String },
            'Is Delivering Now': { type: String },
            'Switch To Order Menu': { type: String },
            'Price Range': { type: Number },
            'Aggregate Rating': { type: Number },
            'Rating Color': { type: String },
            'Rating Text': { type: String },
            Votes: { type: Number }
        });
        app.use(cors()); 
        app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
        const Restaurant = mongoose.model('zomato', restaurantSchema);

        app.get('/api/restaurants/:id', async (req, res) => {
            try {
                const restaurant = await Restaurant.findOne({ 'Restaurant ID': req.params.id });
                if (restaurant) {
                    res.json(restaurant);
                } else {
                    res.status(404).send("Restaurant not found");
                }
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.get('/api/restaurants', async (req, res) => {
            const { skip = 0, limit = 20 } = req.query;
            try {
                const restaurants = await Restaurant.find().skip(parseInt(skip)).limit(parseInt(limit));
                res.json(restaurants);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    })
    .catch(err => {
        console.error("Could not connect to MongoDB...", err);
        process.exit(1); 
    });
