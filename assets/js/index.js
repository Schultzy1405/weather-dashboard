const searchedEl = document.getElementById('searched-cities')
const apiKey = "99b67b87f3d860e85ba5376b8b4fd812";

const getWeatherInfo = function () {
    const city = document.getElementById('city').value;
    const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(geocodingUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const lat = data.coord.lat;
                    const lon = data.coord.lon;
                    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

                    fetch(queryURL)
                        .then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {
                                    // Display the 5-day forecast
                                    displayForecast(weatherData);

                                    // Display the single day forecast
                                    const singleDayData = weatherData.list[0]; // Assuming the first item is for the single day
                                    displaySingleDayWeather(singleDayData);
                                });
                            }
                        });
                });
            }
        });
};

document.getElementById('search-btn').addEventListener('click', function() {
    getWeatherInfo();
});

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Group weather data by day
    const dailyForecast = {};
    forecastData.list.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayKey = date.toDateString(); // Group by date ignoring time

        if (!dailyForecast[dayKey]) {
            dailyForecast[dayKey] = {
                tempSum: 0,
                weatherDescriptions: []
            };
        }

        dailyForecast[dayKey].tempSum += day.main.temp;
        dailyForecast[dayKey].weatherDescriptions.push(day.weather[0].description);
    });

    // Display the 5-day forecast
    Object.keys(dailyForecast).forEach(dayKey => {
        const dayData = dailyForecast[dayKey];
        const averageTemp = dayData.tempSum / 8; // 8 data points per day
        const weatherDescription = dayData.weatherDescriptions[0]; // Assume the same description for the day
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h4>${new Date(dayKey).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
            <p>Average Temperature: ${averageTemp.toFixed(2)} F </p>
            <p>Weather: ${weatherDescription}</p>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

function displaySingleDayWeather(dayData) {
    const yourCityContainer = document.getElementById('your-single-city');
    yourCityContainer.innerHTML = '';

    const date = new Date(dayData.dt * 1000);
    const weatherDescription = dayData.weather[0].description;
    const temperature = dayData.main.temp;

    const singleDayElement = document.createElement('div');
    singleDayElement.classList.add('single-day-forecast');
    singleDayElement.innerHTML = `
        <h4>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h4>
        <p>Temperature: ${temperature.toFixed(2)} F</p>
        <p>Weather: ${weatherDescription}</p>
    `;

    yourCityContainer.appendChild(singleDayElement);
}