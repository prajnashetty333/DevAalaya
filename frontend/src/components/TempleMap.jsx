import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TempleMap = ({ mapData }) => {
  if (!mapData) return null;

  return (
    <div className="temple-map-section animate-fade-in">
      <div className="section-header center">
        <h2 className="serif">Explore Temples on Map</h2>
        <p className="sans">Click on markers to discover the geographical spread of this style.</p>
      </div>
      
      <div className="map-container-wrapper white-card">
        <MapContainer 
          center={mapData.center} 
          zoom={mapData.zoom} 
          scrollWheelZoom={false}
          className="leaflet-container-rounded"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapData.temples.map((temple, idx) => (
            <Marker key={idx} position={[temple.lat, temple.lng]}>
              <Popup>
                <div className="map-popup-content">
                  <h4 className="serif">{temple.name}</h4>
                  <span className="state-tag">{temple.state}</span>
                  <p className="sans">{temple.note}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TempleMap;
