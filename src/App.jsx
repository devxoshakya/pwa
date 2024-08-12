import React, { useState } from 'react';

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [distance, setDistance] = useState(null);

  const getLocation = () => {
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      alert('Geolocation requires a secure context (HTTPS) or running on localhost.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Vibrate for 700ms
          if (navigator.vibrate) {
            navigator.vibrate(700);
          }

          // Trigger a push notification
          if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/service-worker.js')
              .then((registration) => {
                registration.showNotification('Location Detected', {
                  body: `Latitude: ${latitude}, Longitude: ${longitude}`,
                  vibrate: [100, 50, 100],
                  icon: 'icon.png', // Optional icon
                });
              })
              .catch((error) => console.log('Service Worker registration failed:', error));
          } else {
            console.log('Push notifications are not supported by your browser.');
          }
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const calculateDistance = () => {
    if (location.latitude && location.longitude) {
      const R = 6371e3; // Earth radius in meters
      const lat1 = location.latitude * (Math.PI / 180);
      const lon1 = location.longitude * (Math.PI / 180);
      const lat2 = 28.9825833 * (Math.PI / 180);
      const lon2 = 77.7339473 * (Math.PI / 180);

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in meters

      setDistance(distance / 1000); // Convert to kilometers
    } else {
      alert('Please get your current location first.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <button
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Get Current Location
      </button>
      <button
        onClick={calculateDistance}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Mere ghar se tumhara distance kya hai?
      </button>
      {location.latitude && location.longitude && (
        <div className="ml-4 mt-4 text-lg">
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
      {distance !== null && (
        <div className="mt-4 text-lg">
          <p> {distance.toFixed(2)} km itna haii </p>
        </div>
      )}
    </div>
  );
}

export default App;
