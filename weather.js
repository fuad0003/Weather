document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'befe3c0568b5d3b3c1335543950b2cbe';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Coordinates for Dhaka
    const latitude = 23.8103;
    const longitude = 90.4125;

    const weatherList = document.getElementById('weather-list');

    // Fetch weather data from OpenWeatherMap API
    fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Extract and display the 7-day forecast
            const dailyForecasts = getDailyForecasts(data.list);
            dailyForecasts.forEach(forecast => {
                const date = new Date(forecast.dt * 1000); // Convert timestamp to milliseconds
                const highTemp = Math.round(forecast.main.temp_max - 273.15); // Convert temperature to Celsius
                const lowTemp = Math.round(forecast.main.temp_min - 273.15); // Convert temperature to Celsius
                const weatherDescription = forecast.weather[0].description;
                const weatherIcon = getWeatherIcon(forecast.weather[0].icon);

                const weatherCard = document.createElement('div');
                weatherCard.classList.add('weather-card');

                weatherCard.innerHTML = `
                    <h3>${getDayOfWeek(date.getDay())}</h3>
                    <p>Highest Temperature: ${highTemp}°C</p>
                    <p>Lowest Temperature: ${lowTemp}°C</p>
                    <img class="weather-icon" src="${weatherIcon}" alt="${weatherDescription}">
                    <p>${weatherDescription}</p>
                `;

                weatherList.appendChild(weatherCard);
            });
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

// Helper function to get daily forecasts
function getDailyForecasts(forecastList) {
    const dailyForecasts = {};

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString(); // Convert timestamp to date string

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                maxTemp: forecast.main.temp_max,
                minTemp: forecast.main.temp_min,
                weather: forecast.weather[0].description,
                icon: forecast.weather[0].icon
            };
        } else {
            if (forecast.main.temp_max > dailyForecasts[date].maxTemp) {
                dailyForecasts[date].maxTemp = forecast.main.temp_max;
            }
            if (forecast.main.temp_min < dailyForecasts[date].minTemp) {
                dailyForecasts[date].minTemp = forecast.main.temp_min;
            }
        }
    });

    return Object.entries(dailyForecasts).map(([date, forecast]) => ({
        dt: new Date(date),
        main: {
            temp_max: forecast.maxTemp,
            temp_min: forecast.minTemp
        },
        weather: [{ description: forecast.weather, icon: forecast.icon }]
    }));
}

// Helper function to get the URL of the weather icon
function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

// Helper function to get the day of the week in sequential order
function getDayOfWeek(dayIndex) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nextDayIndex = (dayIndex + 1) % 7; // Calculate the next day in sequence
    return daysOfWeek[nextDayIndex];
}
