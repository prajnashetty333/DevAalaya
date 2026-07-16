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
      <div className="section-header text-center mb-10">
        <h2 className="serif text-4xl mb-3 text-[#FFD700]">Explore Temples on Map</h2>
        <p className="sans text-[#FAF3E0]/80">Click on markers to discover the geographical spread of this style.</p>
      </div>
      
      <div className="map-container-wrapper glass-card p-4">
        <MapContainer 
          center={mapData.center} 
          zoom={mapData.zoom} 
          scrollWheelZoom={false}
          className="leaflet-container-rounded"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
