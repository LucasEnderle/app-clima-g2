const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

let searchInputBox = document.getElementById('input-box');
let searchButton = document.getElementById('search-button');

searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
});

searchButton.addEventListener('click', () => {
    getWeatherReport(searchInputBox.value);
});

function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => {
            return weather.json();
        }).then(showWeatherReport);
}

function showWeatherReport(weather) {
    let city_code = weather.cod;
    if(city_code === '400'){ 
        swal("Input vazio", "Por favor insira uma cidade", "error");
        reset();
    } else if(city_code === '404'){
        swal("Input inválido", "Cidade não encontrada", "warning");
        reset();
    } else {
        let op = document.getElementById('weather-body');
        op.style.display = 'block';
        let todayDate = new Date();
        let parent = document.getElementById('parent');
        let weather_body = document.getElementById('weather-body');
        weather_body.innerHTML =
            `
        <div class="location-deatils">
            <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date" id="date"> ${dateManage(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
            <div class="weather" id="weather"> ${translateWeather(weather.weather[0].main)} <i class="${getIconClass(weather.weather[0].main)}"></i>  </div>
            <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
            <div id="updated_on">Atualizado as ${getTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
            <div class="basic">Sensação térmica ${weather.main.feels_like}&deg;C | Humidade ${weather.main.humidity}%  <br> Pressão atmosférica ${weather.main.pressure} mb | Vento ${(weather.wind.speed * 3.6).toFixed(1)} km/h</div>
        </div>
        `;
        parent.append(weather_body);
        changeBg(weather.weather[0].main);
        reset();
    }
}

function translateWeather(status) {
    const translations = {
        "Clear": "Céu Limpo",
        "Clouds": "Nublado",
        "Rain": "Chuva",
        "Snow": "Neve",
        "Drizzle": "Garoa",
        "Thunderstorm": "Trovoada",
        "Mist": "Névoa",
        "Haze": "Neblina",
        "Fog": "Nevoeiro",
        "Sunny": "Ensolarado"
    };
    return translations[status] || status;
}

function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

function dateManage(dateArg) {
    let days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}) , ${year}`
}

function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(assets/clouds.jpg)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(assets/rainy.jpg)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(assets/clear.jpg)';
    } else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(assets/snow.jpg)';
    } else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(assets/sunny.jpg)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(assets/thunderstorm.jpg)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(assets/drizzle.jpg)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog') {
        document.body.style.backgroundImage = 'url(assets/mist.jpg)';
    } else {
        document.body.style.backgroundImage = 'url(assets/bg.jpg)';
    }
}

function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}

function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
