//51cd3f5cfa98adb5d8333005566e3035
let apiKey = "51cd3f5cfa98adb5d8333005566e3035";
let inputCityEl = $('#inputCity');
let submitFormEL = $('#whether-form');
let cityNameEL = $('#inputCity');
let rootEl = $('#weather-row');
let weatherCard;
let weatherGroup;
let addCardItem = function(parentItem, name, data, isCurrent){
    let today = dayjs(data.dt_txt);
    const currentDate = today.format('DD/MM/YYYY');

    let currWeatherCard = $('<div>');
    currWeatherCard.addClass('card');
    currWeatherCard.addClass('m-2');

    let currWeatherCardBody = $('<div>');
    currWeatherCardBody.addClass('card-body');

    let currWeatherCardTitle = $('<h5>');
    currWeatherCardTitle.addClass('card-title');
    if (isCurrent){
        currWeatherCardTitle.text(`${name} (${currentDate}) `);
    }
    else{
        currWeatherCardTitle.text(`${currentDate}`);
    }
    currWeatherCardBody.append(currWeatherCardTitle);

    let currWeatherCardText1 = $('<p>');
    currWeatherCardText1.addClass('card-text');
    currWeatherCardText1.text(`Temp: ${data.main.temp_kf}F`);
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

let addCurrentWeather = function(name, data){
    console.log(data);
    let today = dayjs(data.dt_txt);
    //dayjs.duration(data.dt, 'minutes').
    const currentDate = today.format('DD/MM/YYYY');
    // console.log(finalTime);
    // console.log(data.dt.format('MMM D, YYYY'));
    let weatherCard = $('<div>');
    weatherCard.addClass('col');

    addCardItem(weatherCard, name, data, true);

    let weatherForecastTitle = $('<h5>');
    weatherForecastTitle.addClass('m-2');

    weatherForecastTitle.text(`5-Day Forecast:`);
    weatherCard.append(weatherForecastTitle);
    weatherGroup = $('<div>');
    weatherGroup.addClass('list-group');
    weatherGroup.addClass('list-group-horizontal');

    weatherCard.append(weatherGroup);

    rootEl.append(weatherCard);

}
let fillForecast = function (data) {
    console.log(data);
    addCardItem(weatherGroup, '', data, false);
        // var waetherEl = $('<li>');

}
let getApi = function (url) {
    fetch(url).then(function (response) {
        if (response.status === 200) {
        }
        return response.json();
    })
        .then(function (data) {
            if (data) {
                console.log(data);
                addCurrentWeather(data.city.name, data.list[0]);

                for (let i = 1; i < 6; i++) {
                    fillForecast(data.list[i]);
                }
            }
        });
}

let lat;
let lon;
function getLatitude(url) {
    fetch(url).then(function (response) {
        if (response.status === 200) {
        }
        return response.json();
    })
        .then(function (data) {
            if (data && data.length > 0) {
                lat = data[0].lat.toFixed(2);
                lon = data[0].lon.toFixed(2);
                return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            }
        })
        .then(function (url1) {
            getApi(url1);
        });
}
async function handleWeatherSubmit(event) {
    event.preventDefault();
    let cityName = cityNameEL.val();
    let cityConvert = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${5}&appid=${apiKey}`;
    getLatitude(cityConvert);
}
submitFormEL.on('submit', handleWeatherSubmit);