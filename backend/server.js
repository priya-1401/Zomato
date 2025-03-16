require('dotenv').config(); // Load .env file

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Enable CORS (Allow requests from frontend)
app.use(cors({ origin: "*" })); 
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
    _id: mongoose.Schema.Types.ObjectId,
    "Restaurant ID": { type: Number, required: true },  // Match exact field names
    "Restaurant Name": { type: String, required: true },
    "Country Code": { type: Number },
    "City": { type: String },
    "Address": { type: String },
    "Locality": { type: String },
    "Locality Verbose": { type: String },
    "Longitude": { type: Number },
    "Latitude": { type: Number },
    "Cuisines": { type: String },
    "Average Cost for two": { type: Number },
    "Currency": { type: String },
    "Has Table booking": { type: String }, // "Yes" or "No"
    "Has Online delivery": { type: String },
    "Is delivering now": { type: String },
    "Switch to order menu": { type: String },
    "Price range": { type: Number },
    "Aggregate rating": { type: Number },
    "Rating color": { type: String },
    "Rating text": { type: String },
    "Votes": { type: Number }
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
        console.log("🔍 Searching for Restaurant ID:", restaurantId);

        if (isNaN(restaurantId)) {
            return res.status(400).json({ error: "Invalid Restaurant ID" });
        }

        const restaurant = await Restaurant.findOne({ "Restaurant ID": restaurantId });

        if (!restaurant) {
            console.log("❌ Restaurant not found:", restaurantId);
            return res.status(404).json({ error: "Restaurant not found" });
        }

        console.log("✅ Found Restaurant:", restaurant);
        res.json(restaurant);
    } catch (error) {
        console.error("❌ Error fetching restaurant:", error);
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
