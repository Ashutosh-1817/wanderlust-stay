if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const { geocodeLocation } = require('../utils/geocode.js');

const dbUrl = process.env.ATLASDB_URL;

async function regeocodeAll() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to re-geocode`);

    for (const listing of listings) {
        const locationString = `${listing.location}, ${listing.country}`;
        const geometry = await geocodeLocation(locationString);
        listing.geometry = geometry;
        await listing.save();
        console.log(`✓ ${listing.title} → [${geometry.coordinates}]`);
        await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log("Done!");
    mongoose.connection.close();
}

regeocodeAll();