const [lng, lat] = listingCoordinates;

const map = L.map("map").setView([lat, lng], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
}).addTo(map);

L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
    .openPopup();