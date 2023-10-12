//creating the variables
let apiKey =config.MY_KEY;
let inputCity=document.querySelector('.search-bar');

let result=document.querySelector('.result');

let cityArray=[{
    cityName: '',
    forecast: [
        {
            date: '',
            icon: '',
            weather: '',
            temp: {
                min: '',
                max: ''
            }
        }
    ]
}];
//creating the function to call the API and display the data
cityArray.forEach((cities) => {
    let searchBtn=document.querySelector('.search-btn').addEventListener('click', search);
    async function search() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputCity.value}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const json = await response.json();
            console.log(json);

            let city = document.createElement('div');
            city.classList.add('city');
            result.appendChild(city);

            let now=document.createElement('div');
            now.classList.add('now');
            city.appendChild(now);

            let cityName = document.createElement('h3');
            cityName.classList.add('city-name');
            cityName.textContent = `${json.city.name}, ${json.city.country}`;
            now.appendChild(cityName);

            let today=document.createElement('div');
            today.classList.add('today');
            today.textContent=`Today`;
            now.appendChild(today);

            let weatherIcon = document.createElement('img');
            weatherIcon.classList.add('weather-icon');
            weatherIcon.src = `http://openweathermap.org/img/wn/${json.list[0].weather[0].icon}.png`;
            now.appendChild(weatherIcon);

            let weatherToday=document.createElement('div');
            weatherToday.classList.add('weather-today');
            weatherToday.textContent=`${json.list[0].weather[0].main}`;
            now.appendChild(weatherToday);

            let tempToday=document.createElement('div');
            tempToday.classList.add('temp-today');
            tempToday.textContent=`${Math.round(json.list[0].main.temp - 273.15)}°C`;
            now.appendChild(tempToday);

            let wind=document.createElement('div');
            wind.classList.add('wind');
            wind.textContent=`Wind: ${json.list[0].wind.speed} km/h`;
            now.appendChild(wind);

            
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

            const cityData = { 
                name: city.innerHTML,
            };

            const citiesString = localStorage.getItem('cities');
            let cities = [];
            if (citiesString) {
                cities = JSON.parse(citiesString);
            }
            cities.push(cityData);
            localStorage.setItem('cities', JSON.stringify(cities));

        } catch (error) {
            console.log('City not found', error);
            result.textContent = 'City not found';
        }
        console.log(cityArray);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const citiesString = localStorage.getItem('cities');
        if (citiesString) {
          const cities = JSON.parse(citiesString);
          const result = document.querySelector('.result');
          
          for (const cityData of cities) {
            let city = document.createElement('div');
            city.classList.add('city');
            result.appendChild(city);
      
            let cityName = document.createElement('h3');
            cityName.classList.add('city-name');
            cityName.innerHTML = cityData.name;
            city.appendChild(cityName);
          }
        }
    });
});

//clear storage
const clearStorage=document.querySelector('.clear-storage').addEventListener('click', clear);
function clear() {
    localStorage.clear();
    location.reload();
}


//dropdown de recherche -> risque d'être rapidement saturé mais intéressant à faire pour la technique
