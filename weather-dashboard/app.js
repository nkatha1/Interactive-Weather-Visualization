// Elements
const cityInput = document.getElementById('city-input');
const getWeatherButton = document.getElementById('get-weather');
const cityDisplay = document.getElementById('city');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const weatherChartCanvas = document.getElementById('weatherChart').getContext('2d');
const loadingIndicator = document.getElementById('loading');

// API Key (replace with your own API key from OpenWeatherMap)
const apiKey = 'a0e7e1aaa424b418d7e9ef61dad11706';  // Replace with your OpenWeatherMap API key

// Chart.js Setup
let weatherChart = new Chart(weatherChartCanvas, {
    type: 'line',
    data: {
        labels: [], // Time/Date
        datasets: [{
            label: 'Temperature (°C)',
            data: [], // Temperature data
            borderColor: '#FF5733',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Limit the chart data to 20 points to avoid clutter
const maxDataPoints = 20;

// Get Weather Function
const getWeather = async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    // Show loading indicator
    loadingIndicator.style.display = 'block';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if the city is found (API returns cod 200 for successful requests)
        if (data.cod !== 200) {
            alert("City not found.");
            return;
        }

        // Update UI with weather info
        cityDisplay.innerText = `City: ${data.name}`;
        temperatureDisplay.innerText = `Temperature: ${data.main.temp}°C`;
        humidityDisplay.innerText = `Humidity: ${data.main.humidity}%`;

        // Update the chart
        weatherChart.data.labels.push(new Date().toLocaleTimeString());
        weatherChart.data.datasets[0].data.push(data.main.temp);

        // Limit the data to a maximum of 20 points
        if (weatherChart.data.labels.length > maxDataPoints) {
            weatherChart.data.labels.shift();  // Remove the first label
            weatherChart.data.datasets[0].data.shift();  // Remove the first data point
        }

        weatherChart.update();
    } catch (error) {
        alert("Failed to fetch data.");
        console.error(error);  // Log any error that occurs during the fetch request
    } finally {
        // Hide loading indicator after data is fetched or if an error occurs
        loadingIndicator.style.display = 'none';
    }
};

// Add event listener to button
getWeatherButton.addEventListener('click', getWeather);
