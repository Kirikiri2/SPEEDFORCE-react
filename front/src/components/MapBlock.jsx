import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Красный маркер
delete L.Icon.Default.prototype._getIconUrl;
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Компонент для передачи рефа карты
function MapWithRef({ markers, mapRef }) {
  const map = useMap();
  if (mapRef) mapRef.current = map;

  return null;
}

export default function MapBlock({ markers, mapRef }) {
  if (!markers || markers.length === 0) return null;

  const avgLat = markers.reduce((sum, m) => sum + m.position[0], 0) / markers.length;
  const avgLng = markers.reduce((sum, m) => sum + m.position[1], 0) / markers.length;
  const center = [avgLat, avgLng];

  return (
    <div className="w-full h-[500px] sm:h-[400px] xs:h-[350px] my-10"> {/* адаптивная высота */}
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full min-w-[300px]"  // минимальная ширина для маленьких экранов
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={redIcon}>
            <Popup className='font-semibold text-[14px]'>{marker.title}</Popup>
          </Marker>
        ))}
        <MapWithRef markers={markers} mapRef={mapRef} />
      </MapContainer>
    </div>
  );
}
