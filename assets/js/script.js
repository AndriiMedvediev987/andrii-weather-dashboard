let apiKey = "51cd3f5cfa98adb5d8333005566e3035";
let inputCityEl = $('#inputCity');
let submitFormEL = $('#whether-form');
let cityNameEL = $('#inputCity');
let rootEl = $('#weather-card');
let cityListEl = $('#city-list');
let weatherCard;
let weatherGroup;
let cityName;
let cities = 'cities';
let cityNameClass = 'city-name';
let cityNames = [];

//storage section
let initStorage = function () {
    cityNames = JSON.parse(localStorage.getItem(cities)) || [];
}

let storeCity = function () {
    if (cityName && !cityNames.includes(cityName)) {
        cityNames.push(cityName);
        localStorage.setItem(cities, JSON.stringify(cityNames));
    }
    renderCityNames();
}

let renderCityNames = function () {
    cityListEl.empty();
    for (let i = 0; i < cityNames.length; i++) {
        let cityName = $('<button>');
        cityName.attr('type', 'button');
        cityName.addClass('btn');
        cityName.addClass('btn-secondary');
        cityName.addClass('city-name');
        cityName.text(cityNames[i]);
        cityListEl.append(cityName);
    }
}

//weather section
let addCardItem = function (parentItem, name, data, isCurrent) {

    let today = dayjs(data.dt_txt);
    const currentDate = today.format('DD/MM/YYYY');

    let currWeatherCard = $('<div>');
    currWeatherCard.addClass('card');
    currWeatherCard.addClass('m-2');

    let currWeatherCardBody = $('<div>');
    currWeatherCardBody.addClass('card-body');

    let currWeatherCardTitle = $('<h5>');
    currWeatherCardTitle.addClass('card-title');
    let iconcode = data.weather.length > 0 ? data.weather[0].icon : 0;
    let iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    let currWeatherCardIconDiv = $('<div>');
    let currWeatherCardIcon = $('<img>');
    currWeatherCardIcon.attr('src', iconurl);
    currWeatherCardIconDiv.append(currWeatherCardIconDiv);

    if (isCurrent) {
        currWeatherCardTitle.text(`${name} (${currentDate}) `);
        currWeatherCardTitle.append(currWeatherCardIcon);
    }
    else {
        currWeatherCardTitle.addClass('card-forecast');
        currWeatherCardTitle.text(`${currentDate}`);
        currWeatherCardBody.addClass('card-forecast');
    }
    currWeatherCardBody.append(currWeatherCardTitle);
    if (!isCurrent) {
        currWeatherCardBody.append(currWeatherCardIcon);
    }

    let currWeatherCardText1 = $('<p>');
    currWeatherCardText1.addClass('card-text');
    let temp = `Temp: ${data.main.temp}\u00B0F`;
    currWeatherCardText1.text(temp);
    currWeatherCardBody.append(currWeatherCardText1);

    let currWeatherCardText2 = $('<p>');
    currWeatherCardText2.addClass('card-text');
    currWeatherCardText2.text(`Wind: ${data.wind.speed} MPH`);
    currWeatherCardBody.append(currWeatherCardText2);

    let currWeatherCardText3 = $('<p>');
    currWeatherCardText3.addClass('card-text');
    currWeatherCardText3.text(`Humidity: ${data.main.humidity} %`);
    currWeatherCardBody.append(currWeatherCardText3);

    currWeatherCard.append(currWeatherCardBody);

    parentItem.append(currWeatherCard);
}

let addCurrentWeather = function (name, data) {
    let today = dayjs(data.dt_txt);
    const currentDate = today.format('DD/MM/YYYY');

    addCardItem(rootEl, name, data, true);

    let weatherForecastTitle = $('<h5>');
    weatherForecastTitle.addClass('m-2');

    weatherForecastTitle.text(`5-Day Forecast:`);
    rootEl.append(weatherForecastTitle);
    weatherGroup = $('<div>');
    weatherGroup.addClass('list-group');
    weatherGroup.addClass('list-group-horizontal');
    weatherGroup.addClass('justify-content-between');
    rootEl.append(weatherGroup);
}

let fillForecast = function (data) {
    addCardItem(weatherGroup, '', data, false);
}

let clearWeatherCard = function () {
    rootEl.empty();
}

let getApi = function (url) {
    fetch(url).then(function (response) {
        if (response.status === 200) {
        }
        return response.json();
    })
        .then(function (data) {
            if (data) {
                addCurrentWeather(cityName, data.list[0]);

                for (let i = 1; i < 6; i++) {
                    fillForecast(data.list[i]);
                }
            }
        });
}

let lat;
let lon;
function updateWeather(url) {
    fetch(url).then(function (response) {
        if (response.status === 200) {
        }
        return response.json();
    })
        .then(function (data) {
            if (data && data.length > 0) {
                lat = data[0].lat.toFixed(2);
                lon = data[0].lon.toFixed(2);
                return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
            }
        })
        .then(function (url) {
            getApi(url);
        });
}

// submit section
let getWeather = function (name) {
    clearWeatherCard();

    if (!name) {
        return; 
    }
    cityName = name;
    let cityConvert = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${5}&appid=${apiKey}`;
    storeCity();
    updateWeather(cityConvert);
}
function getWeatherFromButton(event) {
    event.preventDefault();
    getWeather($(event.currentTarget).text());
}

function handleWeatherSubmit(event) {
    event.preventDefault();
    getWeather(cityNameEL.val());
    cityNameEL.val('');
}

submitFormEL.on('submit', handleWeatherSubmit);
cityListEl.on('click', `.${cityNameClass}`, getWeatherFromButton);
initStorage();