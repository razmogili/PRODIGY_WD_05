const API_KEY = '2117d7304bbeb5c59835e2fb4d0890e4';

async function getWeather(lat = null, lon = null) {
    const weatherInfo = document.getElementById('weatherInfo');
    const location = document.getElementById('location').value;
    let url;

    try {
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        } else if (location) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
        } else {
            throw new Error('Please enter a city name');
        }

        console.log('Fetching weather from:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data);

        if (data.cod && data.cod !== 200) {
            throw new Error(data.message || 'City not found');
        }

        if (!data.main || !data.weather) {
            throw new Error('Invalid data received from weather service');
        }

        const html = `
            <h2>${data.name}${data.sys && data.sys.country ? `, ${data.sys.country}` : ''}</h2>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <div class="description">${data.weather[0].description}</div>
            <div class="details">
                <div class="detail-item">
                    <div>Feels Like</div>
                    <div>${Math.round(data.main.feels_like)}°C</div>
                </div>
                <div class="detail-item">
                    <div>Humidity</div>
                    <div>${data.main.humidity}%</div>
                </div>
                <div class="detail-item">
                    <div>Wind Speed</div>
                    <div>${(data.wind && data.wind.speed) || 'N/A'} m/s</div>
                </div>
                <div class="detail-item">
                    <div>Pressure</div>
                    <div>${data.main.pressure} hPa</div>
                </div>
            </div>
        `;

        weatherInfo.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        weatherInfo.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Add event listener for Enter key
document.getElementById('location').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeather();
    }
});

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                document.getElementById('weatherInfo').innerHTML = `
                    <div class="error">Error getting location: ${error.message}</div>
                `;
            }
        );
    } else {
        document.getElementById('weatherInfo').innerHTML = `
            <div class="error">Geolocation is not supported by this browser.</div>
        `;
    }
}

// Initial call to get weather for a default city
window.onload = () => {
    document.getElementById('location').value = 'London';
    getWeather();
};