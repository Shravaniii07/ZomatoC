/**
 * Simple Get Directions JavaScript
 * Opens Google Maps with restaurant location
 */

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    setupDirectionsButton();
});

/**
 * Setup Get Directions button
 */
function setupDirectionsButton() {
    // Find the Get Directions button
    var directionsBtn = document.getElementById('get-directions-btn');
    
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            openDirections();
        });
    }
}

/**
 * Open Google Maps with restaurant location
 */
function openDirections() {
    // Get restaurant address or coordinates from data attribute
    var address = document.body.getAttribute('data-restaurant-address');
    var coordinates = document.body.getAttribute('data-restaurant-coords');
    
    var mapsUrl = '';
    
    // Use coordinates if available, otherwise use address
    if (coordinates) {
        // Format: "lat,lng" or "18.5204,73.8567"
        mapsUrl = 'https://www.google.com/maps?q=' + coordinates;
    } else if (address) {
        // Use address
        mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    } else {
        // Fallback: try to get from location text on page
        var locationElement = document.querySelector('.resto-stats h2');
        if (locationElement) {
            var locationText = locationElement.textContent;
            // Remove emoji and clean text
            var cleanAddress = locationText.replace('📍', '').trim();
            mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cleanAddress);
        } else {
            // Default to Pune if nothing found
            mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Pune';
        }
    }
    
    // Open in new tab
    window.open(mapsUrl, '_blank');
}
