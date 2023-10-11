//creating the variables
let apiKey =config.MY_KEY;
let inputCity=document.querySelector('.search-bar');
let searchBtn=document.querySelector('.search-btn').addEventListener('click', search);

//creating the function to call the API and display the data
async function search() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputCity.value}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const json = await response.json();
        console.log(json);

        let result=document.querySelector('.result');

        let city = document.createElement('div');
        city.classList.add('city');
        result.appendChild(city);

        let cityName = document.createElement('h3');
        cityName.classList.add('city-name');
        cityName.textContent = `${json.city.name}, ${json.city.country}`;
        city.appendChild(cityName);

        let forecast = document.createElement('div');
        forecast.classList.add('forecast');
        city.appendChild(forecast);

        for (let i = 0; i < json.list.length; i += 8) {
            let forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecast.appendChild(forecastItem);

            let forecastDate = document.createElement('div');
            forecastDate.classList.add('forecast-date');
            let dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
            forecastDate.textContent = new Date(json.list[i].dt * 1000).toLocaleDateString('en-US', dateOptions);
            forecastItem.appendChild(forecastDate);

            let forecastIcon = document.createElement('img');
            forecastIcon.classList.add('forecast-icon');
            forecastIcon.src = `http://openweathermap.org/img/wn/${json.list[i].weather[0].icon}.png`;
            forecastItem.appendChild(forecastIcon);

            let forecastWeather = document.createElement('div');
            forecastWeather.classList.add('forecast-weather');
            forecastWeather.textContent = `${json.list[i].weather[0].main}`;
            forecastItem.appendChild(forecastWeather); 

            let forecastTemp = document.createElement('div');
            forecastTemp.classList.add('forecast-temp');
            let temps = json.list.slice(i, i + 8).map(item => item.main.temp - 273.15);
            let minTemp = Math.min(...temps);
            let maxTemp = Math.max(...temps);
            forecastItem.appendChild(forecastTemp);
            let forecastTempMin = document.createElement('p');
            forecastTempMin.textContent = `Min: ${Math.round(minTemp)}°C`;
            forecastTemp.appendChild(forecastTempMin);
            let forecastTempMax = document.createElement('p'); 
            forecastTempMax.textContent = `Max: ${Math.round(maxTemp)}°C`;
            forecastTemp.appendChild(forecastTempMax);
        }

        //saving the city div in local storage
        localStorage.setItem('city', city.innerHTML);

    } catch (error) {
        console.log('City not found', error);
        result.textContent = 'City not found';
    }
}

//loading the city div from local storage
document.addEventListener('DOMContentLoaded', () => {
    const cityData = localStorage.getItem('city');
    const result = document.querySelector('.result');
    if (cityData) {
        result.innerHTML = cityData;
    }
});

