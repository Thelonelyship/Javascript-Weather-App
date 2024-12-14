//! API for weather
const weather = {
  apiKey: "be1c55c3b1155ebf167a1ccb98597dee",

//! function to get the weather
getWeather(city) {
    this.getData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`,
      (data) => {
        this.displayWeather(data);
        this.getForecast(data.coord.lat, data.coord.lon);
      },
      "Can't find the weather. Try again."
    );
  },
//! get the upcoming weather
getForecast(lat, lon) {
    this.getData(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`,
      (data) => this.displayUpcomingForecast(data.list),
      "Forecast wasn't found. Try again."
    );
  },
//! Display or error
getData(url, onSuccess, errorMessage) {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(errorMessage);
        return response.json();
      })
      .then(onSuccess)
      .catch((error) => alert(error.message));
  },

//! How it's displayed
displayWeather(data) {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  document.querySelector(".city").innerText = name;
  document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
  document.querySelector(".description").innerText = description;
  document.querySelector(".temp").innerText = `${Math.floor(temp)}°C`;
  document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
  document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;

//! Background change based on weather
  this.setBackground(description);
},

//! Display upcoming forecast
displayUpcomingForecast(forecastList) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";

    forecastList.slice(0, 5).forEach((forecast) => {
      const { icon } = forecast.weather[0];
      const { temp } = forecast.main;
      const time = new Date(forecast.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const forecastpart = document.createElement("div");
      forecastpart.classList.add("forecast-item");
      forecastpart.innerHTML = `
        <div>${time}</div>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
        <div>${Math.floor(temp)}°C</div>
      `;
      forecastContainer.appendChild(forecastpart);
    });
  },
//! Search bar
  search() {
    const city = document.querySelector(".searchbar").value;
    if (city) this.getWeather(city);
  },
//! Background image settings
  setBackground(description) {
    let backgroundImage = '';
    if (description.includes("clear")) {
      backgroundImage = 'url("images/sun.jpg")';
    } else if (description.includes("few")) {
      backgroundImage = 'url("images/overcast.jpg")';
    } else if (description.includes("scattered")) {
      backgroundImage = 'url("images/scatteredclouds.jpg")';
    } else if (description.includes("broken")) {
      backgroundImage = 'url("images/brokenclouds.jpg")';
    } else if (description.includes("overcast")) {
      backgroundImage = 'url("images/brokenclouds.jpg")';
    } else if (description.includes("rain")) {
      backgroundImage = 'url("images/rain.jpg")';
    } else if (description.includes("snow")) {
      backgroundImage = 'url("images/snow.jpg")';
    } else if (description.includes("storm")) {
      backgroundImage = 'url("images/storm.jpg")';
    } else if (description.includes("fog")) {
      backgroundImage = 'url("images/mist.jpg")';
    }
//! Default to sunny image
    if (!backgroundImage) {
      backgroundImage = 'url("images/sun.jpg")';
    }
//! Set the background image
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
};

//! Search button
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".searchbar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") weather.search();
});

//! Default city as Newcastle... because Newcastle
weather.getWeather("Newcastle-Upon-Tyne");
