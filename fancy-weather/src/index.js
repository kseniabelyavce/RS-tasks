import './index.css';
import '../node_modules/leaflet/dist/leaflet.css';
// import 'leaflet';
import cloudy from './img/cloudy.jpg';
import fog from './img/fog.jpg';
import wind from './img/wind.jpg';
import snow from './img/snow.jpg';
import rain from './img/rain.jpg';
import sleet from './img/sleet.jpg';
import clearDay from './img/clear-day.jpg';
import clearNight from './img/clear-night.jpg';
import partlyCloudDay from './img/partly-cloudy-day.jpg';
import partlyCloudNight from './img/partly-cloudy-night.jpg';
import defaultImg from './img/defaultImg.jpg';
import circle from './img/Vector.png';
import { Skycons } from './skycons.js';

window.addEventListener('load', () => {
 
  let lat;
  let long;
  let uni;
  let icons = [
    'clear-day',
    'clear-night',
    'snow',
    'sleet',
    'rain',
    'wind',
    'fog',
    'partly-cloudy-day',
    'partly-cloudy-night',
    'cloudy'
  ];
  let latCord = document.querySelector('.latCord');
  let longCord = document.querySelector('.longCord');
  let location = document.querySelector('.location');
  let timeDate = document.querySelector('.timezone');
  let temperatureDegree = document.querySelector('.temperature-degree');
  let weatherIcon = document.querySelector('#icon1');
  let weatherParam = document.querySelector('.summary');
  let feelsLikeTemp = document.querySelector('.apparentTemperature');
  let windParam = document.querySelector('.windParam');
  let uvIdx = document.querySelector('.uv');
  let ferinheightBtn = document.getElementById('ferinheight-btn');
  let celciusBtn = document.getElementById('celcius-button');
  let language = document.getElementById('languages');
  let submitBtn = document.getElementById('submit');
  let form = document.getElementById('form');
  let cityInput = document.getElementById('cityInput');
  let currentMap = document.getElementById('map');

  document.querySelector('#circle').src = circle;

  document
    .querySelector('.img_change')
    .addEventListener('click', () =>
      setBackgroundImg(icons[Math.floor(icons.length * Math.random())])
    );

  form.addEventListener('submit', event => {
    const city = document.querySelector('#cityInput').value;
    const appKey = '9047f54c311f9d88d293868c8fde72f6';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const url = `${proxy}http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${appKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { lon, lat } = data.coord;
        console.log(data);
        getWeather(lon, lat, city);
      })
      .catch(err => console.log(err));

    event.preventDefault();
  });

  let L = require('leaflet');
        L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
        let map = L.map('map', {
          scrollWheelZoom: false
        });
        
  function getWeather(longVal, latValue, city) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        lat = city ? latValue : position.coords.latitude;
        long = city ? longVal : position.coords.longitude;
        latCord.textContent = `Latitude: ${lat.toFixed(2)}`;
        longCord.textContent = `Longitude: ${long.toFixed(2)}`;

        uni = 'ca';

        const proxy = 'https://cors-anywhere.herokuapp.com/'; //Remove CORPS
        const api = `${proxy}https://api.darksky.net/forecast/430fc6554c069ad646c240c2bdd53215/${lat},${long}?units=${uni}`;

        
        map.setView([lat, long], 11);
        let attribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        let tiles = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=P4VJ2FiQYgAsRPFdAiYC';
        let layer = L.tileLayer(tiles, {
          maxZoom: 18,
          attribution: attribution
        });
        layer.addTo(map);

      
       

        fetch(api)
          .then(response => {
            return response.json();
          })
          .then(data => {
            const {
              temperature,
              summary,
              apparentTemperature,
              icon,
              windSpeed,
              uvIndex
            } = data.currently;
            // Set DOM elements

            timeDate.textContent = getDateTime();
            location.textContent = city ? city : data.timezone;

            // Translate TO DO
            language.addEventListener('click', function() {
              longCord.textContent =
                language.value === 'RU'
                  ? `Долгота: ${long.toFixed(2)}`
                  : `Longitude ${long.toFixed(2)}`;
              latCord.textContent =
                language.value === 'RU'
                  ? `Широта: ${lat.toFixed(2)}`
                  : `Latitude: ${lat.toFixed(2)}`;
              cityInput.placeholder =
                language.value === 'RU'
                  ? 'Введите название города...'
                  : 'Enter your city...';
              submitBtn.textContent =
                language.value === 'RU' ? 'НАЙТИ' : 'SEARCH';
              weatherParam.textContent =
                language.value === 'RU' ? 'Ясно' : summary; // TO DO
              feelsLikeTemp.textContent =
                language.value === 'RU'
                  ? `Ощущается как: ${apparentTemperature}`
                  : `Feels like: ${apparentTemperature}`;
              windParam.textContent =
                language.value === 'RU'
                  ? `Ветер: ${windSpeed} км/ч`
                  : `Wind: ${windSpeed} km/h`;
              uvIdx.textContent =
                language.value === 'RU'
                  ? `УФ индекс: ${uvIndex}`
                  : `UV index: ${uvIndex}`;
              timeDate.textContent = getDateTime(language.value);
              location.textContent = data.timezone;
            });

            // Change backgorund-color and unit degree
            document
              .querySelector('.temp-btns')
              .addEventListener('click', checkDegree);
            let fahren = (temperature * 9) / 5 + 32;

            function checkDegree(e) {
              if (e.target.id === ferinheightBtn.id) {
                celciusBtn.classList.remove('degree-btn_active');
                e.target.classList.add('degree-btn_active');
                temperatureDegree.textContent = Math.floor(fahren);
              } else if (e.target.id === celciusBtn.id) {
                ferinheightBtn.classList.remove('degree-btn_active');
                celciusBtn.classList.add('degree-btn_active');
                temperatureDegree.textContent = Math.floor(temperature);
              }
            }

            temperatureDegree.textContent = Math.round(temperature);

            // Weather discription
            weatherParam.textContent = summary;
            feelsLikeTemp.textContent = `Feels like: ${apparentTemperature}`;
            windParam.textContent = `Wind: ${windSpeed} km/h`;
            uvIdx.textContent = `UV index: ${uvIndex}`;

            // Set icon and background
            setIcons(icon, weatherIcon);
            setBackgroundImg(icon);
          });
      });
    } else {
      throw new Error('Your location is not defined');
    }
  }
  if (!cityInput.value) {
    getWeather();
  }
});

function getDateTime(langVal) {
  const monthNames =
    langVal === 'RU'
      ? [
          'Янв',
          'Фев',
          'Мар',
          'Апр',
          'Май',
          'Июн',
          'Июл',
          'Авг',
          'Сен',
          'Окт',
          'Ноя',
          'Дек'
        ]
      : [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];
  const dayNames =
    langVal === 'RU'
      ? ['Вс', 'Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Суб']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date();
  return `${dayNames[d.getDay()]} ${d.getDate()} ${
    monthNames[d.getMonth()]
  } ${d.getHours()}:${d.getMinutes()}`;
}

function setIcons(icon, iconID) {
  const skycons = new Skycons({ color: '#FEE2E1' });
  const currentIcon = icon.replace(/-/g, '_').toUpperCase();

  skycons.remove(iconID);
  skycons.pause();
  return skycons.set(iconID, Skycons[currentIcon]);
}

function setBackgroundImg(icon) {
  switch (icon) {
    case 'clear-day':
      document.body.style.backgroundImage = `url(${clearDay})`;
      break;
    case 'clear-night':
      document.body.style.backgroundImage = `url(${clearNight})`;
      break;
    case 'rain':
      document.body.style.backgroundImage = `url(${rain})`;
      break;
    case 'snow':
      document.body.style.backgroundImage = `url(${snow})`;
      break;
    case 'sleet':
      document.body.style.backgroundImage = `url(${sleet})`;
      break;
    case 'wind':
      document.body.style.backgroundImage = `url(${wind})`;
      break;
    case 'fog':
      document.body.style.backgroundImage = `url(${fog})`;
      break;
    case 'cloudy':
      document.body.style.backgroundImage = `url(${cloudy})`;
      break;
    case 'partly-cloudy-day':
      document.body.style.backgroundImage = `url(${partlyCloudDay})`;
      break;
    case 'partly-cloudy-night':
      document.body.style.backgroundImage = `url(${partlyCloudNight})`;
      break;
    default:
      document.body.style.backgroundImage = `url(${defaultImg})`;
      break;
  }
}
