const [lng, lat] = listingCoordinates;

const map = L.map("map").setView([lat, lng], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
}).addTo(map);

// Privacy circle replacing the exact marker — popup preserved by binding it to the circle instead
L.circle([lat, lng], {
    radius: 1000,
    color: "#fe424d",
    fillColor: "#fe424d",
    fillOpacity: 0.15,
    weight: 1.5,
})
    .addTo(map)
    .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
    .openPopup();