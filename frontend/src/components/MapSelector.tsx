// Purpose: Allows user to pick a GPS location from a map.
// How it works: Uses react-leaflet. A click event updates the parent component's state.

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon missing in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

// A helper component to listen for map clicks
const LocationMarker = ({ position, setPosition }: MapSelectorProps) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapSelector = ({ position, setPosition }: MapSelectorProps) => {
  // Default to New Delhi if no position is provided yet
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  useEffect(() => {
    // Try to get user's actual location if permitted
    if (!position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => setPosition([loc.coords.latitude, loc.coords.longitude]),
        (err) => console.log(err) // user denied location, stay at default
      );
    }
  }, []);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer 
        center={position || defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <p className="text-xs text-gray-500 mt-1 text-center">Click on the map to place the pin on your farm.</p>
    </div>
  );
};

export default MapSelector;
