const axios = require('axios');

async function geocodeLocation(locationString) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        locationString
    )}&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    try {
        const response = await axios.get(url);
        const features = response.data.features;

        if (!features || features.length === 0) {
            return { type: "Point", coordinates: [0, 0] };
        }

        const [lng, lat] = features[0].geometry.coordinates;
        return { type: "Point", coordinates: [lng, lat] };
    } catch (err) {
        console.log("Geocoding failed:", err.message);
        return { type: "Point", coordinates: [0, 0] };
    }
}

module.exports = { geocodeLocation };