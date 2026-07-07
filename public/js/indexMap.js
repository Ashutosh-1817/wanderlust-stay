function initListingsMap() {
    const map = L.map("listings-map").setView([20.5937, 78.9629], 5);
    window.listingsMapInstance = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    const markers = L.markerClusterGroup();

    mapListings.forEach(listing => {
        if (!listing.coordinates || listing.coordinates.length !== 2) {
            return;
        }
        const [lng, lat] = listing.coordinates;
        const priceIcon = L.divIcon({
            className: "price-marker",
            html: `&#8377;${listing.price}`,
            iconSize: [60, 28],
        });
        const marker = L.marker([lat, lng], { icon: priceIcon });
        marker.bindPopup(`
            <div class="listing-popup">
                <p class="listing-popup-title">${listing.title}</p>
                <p class="listing-popup-price">&#8377;${listing.price} <span>/ night</span></p>
                <a href="/listings/${listing.id}" class="listing-popup-btn">View listing</a>
            </div>
        `);
        markers.addLayer(marker);
    });

    map.addLayer(markers);
}