import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Clock, MapPin, Phone } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const dropboxLocations = [
    {
      id: 1,
      name: 'Dropbox Klampis',
      address: 'Jl. Arief Rahman Hakim No.51, Surabaya',
      position: [-7.289497, 112.775919],
      schedule: 'Senin - Sabtu, 08:00 - 17:00',
      phone: '021-1234567',
      types: ['Plastik', 'Kertas', 'Logam']
    },
    {
      id: 2,
      name: 'Dropbox Manyar',
      address: 'Jl. Manyar Kertoarjo VI No.53, Surabaya',
      position: [-7.279433, 112.770134],
      schedule: 'Senin - Jumat, 09:00 - 16:00',
      phone: '021-7654321',
      types: ['Plastik', 'Kertas', 'Elektronik']
    },
    {
      id: 3,
      name: 'Dropbox Meer',
      address: 'Jl. Klampis Semolo Tim. V No.24, Surabaya',
      position: [-7.296477, 112.781758],
      schedule: 'Setiap Hari, 07:00 - 19:00',
      phone: '021-9876543',
      types: ['Plastik', 'Kertas', 'Logam', 'Kaca']
    }
  ]

  return (
    <div className="h-[calc(100vh-64px)] pb-20 md:pb-0">
      <div className="h-full flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-white p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Titik Dropbox Terdekat</h2>
          <div className="space-y-4">
            {dropboxLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedLocation?.id === location.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <h3 className="font-bold text-lg text-neutral-800 mb-2">{location.name}</h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary-600 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 mt-0.5 text-primary-600 flex-shrink-0" />
                    <span>{location.schedule}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 mt-0.5 text-primary-600 flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {location.types.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📅 Jadwal Pickup</h4>
            <p className="text-sm text-blue-800">
              Layanan pickup gratis tersedia setiap hari Rabu dan Sabtu untuk minimal 10 kg sampah. 
              Hubungi dropbox terdekat untuk jadwal pickup.
            </p>
          </div>
        </div>

        <div className="md:w-2/3 h-64 md:h-auto">
          <MapContainer
            center={[-7.285436, 112.774742]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {dropboxLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.position}
                eventHandlers={{
                  click: () => setSelectedLocation(location),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-neutral-600">{location.address}</p>
                    <p className="text-sm text-neutral-600 mt-1">{location.schedule}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
