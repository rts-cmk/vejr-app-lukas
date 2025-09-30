import { useState, useEffect } from "react";

const APIKey = "13d9b8eacbed874e2086c98137747253";

function App() {
  const [by, setBy] = useState("Roskilde"); // gemmer byen
  const [coords, setCoords] = useState(null); // gemmer lat/lon
  const [weather, setWeather] = useState(null); // gemmer vejrdata
  const [forcast, setForcast] = useState(null); // gemmer vejrdata

  // Hent koordinater når "by" ændrer sig

  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${by}&appid=${APIKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.length > 0) {
          setCoords({ lat: data[0].lat, lon: data[0].lon });
        } else {
          setCoords(null);
          setWeather(null);
        }
      })
      .catch((error) => console.error("Fejl i geo fetch:", error));
  }, [by]); // <- kører igen hver gang "by" ændrer sig

  // Når coords er sat, hent vejrudsigten
  useEffect(() => {
    if (coords) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&lang=da&units=metric&appid=${APIKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setWeather(data);
        })
        .catch((error) => console.error("Fejl i weather fetch:", error));
    }
  }, [coords]);

  useEffect(() => {
    if (coords) {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${coords.lat}&lon=${coords.lon}&appid=${APIKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setForcast(data);
        })
        .catch((error) => console.error("Fejl i weather forcast:", error));
    }
  }, [coords]);

  return (
    <div>
      {/* Input styret af state */}
      <input
        type="text"
        className="input-by"
        value={by}
        onChange={(e) => setBy(e.target.value)} // opdaterer state
        placeholder="Skriv en by..."
      />

      {weather ? (
        <div className="weather-container">
          <section className="weather-sec">
            <h1>{weather.name}</h1>
            <p className="temp">
              Temperatur: {weather.main.temp.toFixed(1)} °C
            </p>
            <p className="temp-felt">
              Føles som: {weather.main.feels_like.toFixed(1)} °C
            </p>
            <p className="temp-des">
              Beskrivelse: {weather.weather[0].description}
            </p>
          </section>
        </div>
      ) : (
        <p>Indtast en by for at se vejret...</p>
      )}
    </div>
  );
}

export default App;
