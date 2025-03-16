require('dotenv').config(); // Load .env file

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Enable CORS (Allow requests from frontend)
app.use(cors({
    origin: 'https://zomato-main-axei9e8xw-priya-dwaras-projects.vercel.app', // Replace with your frontend URL
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json()); // Parse JSON requests

// ✅ Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch(err => {
    console.error("❌ Could not connect to MongoDB:", err);
    process.exit(1);
});

// ✅ Define Schema & Model
const restaurantSchema = new mongoose.Schema({
    restaurant_id: { type: Number, required: true },
    name: { type: String, required: true },
    country_code: { type: Number },
    city: { type: String },
    address: { type: String },
    locality: { type: String },
    locality_verbose: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    cuisines: { type: String },
    average_cost_for_two: { type: Number },
    currency: { type: String },
    has_table_booking: { type: Boolean },
    has_online_delivery: { type: Boolean },
    is_delivering_now: { type: Boolean },
    switch_to_order_menu: { type: Boolean },
    price_range: { type: Number },
    aggregate_rating: { type: Number },
    rating_color: { type: String },
    rating_text: { type: String },
    votes: { type: Number }
}, { collection: "zomato" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// ✅ Serve the frontend at "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// 🔹 Get a single restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.id); 

        if (isNaN(restaurantId)) {
            return res.status(400).json({ error: "Invalid Restaurant ID" });
        }

        const restaurant = await Restaurant.findOne({ restaurant_id: restaurantId });

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 Get all restaurants with pagination
app.get('/api/restaurants', async (req, res) => {
    try {
        const { skip = 0, limit = 20 } = req.query;
        const restaurants = await Restaurant.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
