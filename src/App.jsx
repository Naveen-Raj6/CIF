import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

function App() {
  const [country, setCountry] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch country info
  const fetchCountry = async (name) => {
    if (!name) return;

    try {
      setError("");
      setData(null);

      const res = await fetch(
        `https://restcountries.com/v3.1/name/${name}?fullText=true`
      );

      if (!res.ok) throw new Error("Country not found");

      const result = await res.json();
      setData(result[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Enter key
  const handleKey = (e) => {
    if (e.key === "Enter") fetchCountry(country);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-6 transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🌍 Country Finder</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-300 dark:bg-gray-700"
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400"/> : <MoonIcon className="w-6 h-6 text-gray-800"/>}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter country name..."
          className="px-4 py-2 rounded-lg flex-1"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={() => fetchCountry(country)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={data.flags.svg}
              alt={data.name.common}
              className="w-48 rounded shadow mx-auto"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{data.name.common}</h2>
              <p><strong>Capital:</strong> {data.capital?.[0] || "N/A"}</p>
              <p><strong>Region:</strong> {data.region}</p>
              <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
              <p><strong>Languages:</strong> {Object.values(data.languages || {}).join(", ")}</p>
              <p><strong>Currencies:</strong> {Object.values(data.currencies || {}).map(cur => cur.name).join(", ")}</p>
            </div>
          </div>

          {/* Map */}
          {data.latlng && (
            <div className="mt-6 h-96 w-full rounded overflow-hidden">
              <MapContainer center={data.latlng} zoom={5} className="h-full w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={data.latlng}>
                  <Popup>{data.name.common}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
