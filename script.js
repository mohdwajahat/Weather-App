const timeH = document.getElementById("time");
const dateH = document.getElementById("date");
const ampmH = document.getElementById("am-pm");
const currentWeatherItemsH = document.getElementById("current-weather-items");
const timeZoneH = document.getElementById("time-zone");
const countryH = document.getElementById("country");
const weatherForecastH = document.getElementById("weather-forecast");
const currentTempH = document.getElementById("current-temp");


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


setInterval(() =>{
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const date = time.getDate();
    const day = time.getDay();
    const month = time.getMonth();
    const hoursIn12Format = hour > 12 ? hour % 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeH.innerHTML = ( hoursIn12Format < 10 ? '0' + hoursIn12Format : hoursIn12Format ) + ':'  + ( minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateH.textContent = days[day] + ', ' + date + ' ' + months[month];  
},1000);



getWeatherData();

function getWeatherData(){
    navigator.geolocation.watchPosition((posititon) => {
        let {latitude,longitude} = posititon.coords;
        const API_KEY = '2a11c896534d88e8a84d47b615f8fc3b';
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data)
        });
    })
}

function showWeatherData(data){
    let {humidity,pressure,sunrise,sunset,wind_speed} = data.current;
    // console.log({humidity,pressure,sunrise,sunset,wind_speed})
    timeZoneH.textContent = data.timezone;
    countryH.textContent = data.lat + 'N' + ' ' + data.lon + 'E';

    currentWeatherItemsH.innerHTML = `<div class="weather-items">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-items">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-items">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-items">
            <div>sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-items">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>`;


    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempH.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-items">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastH.innerHTML = otherDayForcast;
}

