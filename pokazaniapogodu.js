import { getInitialCity } from './poiskgoroda.js';
export function pokazaniapogodu(  timeoutId , datalist , pokazatelDiv , input,  cells , BoxsinoptikaDiv){
const getLoaderHtml = (text = 'Загрузка погоды...') => `
    <div class="loader-container">
        <div class="spinner"></div>
        <span class="loader-text">${text}</span>
    </div>
`;
  async function getWeather(lat, lon, cells){
    BoxsinoptikaDiv.innerHTML = getLoaderHtml('Загрузка почасового прогноза...'); 
    cells.forEach(cell => {
            if (cell) {
                const infoDiv = cell.querySelector('.weather-info');
                if (infoDiv) infoDiv.innerHTML = '<p class="tempvlagvcells">⌛ Загрузка...</p>';
            }
        }); 
    try {
       const resp = await fetch( `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${lat}` +
  `&longitude=${lon}` +
  `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability` +
  `&hourly=precipitation_probability` +
  `&past_days=1` +
 `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
 `&hourly=precipitation_probability,temperature_2m` +
  `&timezone=auto`);
    if(!resp.ok){
        throw new Error(`HTTP error: ${resp.status}`);}
    const sinopt = await resp.json();
 const exactTime = sinopt.current.time;
const roundedTime = exactTime.substring(0, 13) + ":00";
const currentIndex = sinopt.hourly.time.indexOf(roundedTime);
const currentPrecipProb = sinopt.hourly.precipitation_probability[currentIndex];
const probMinus8 = sinopt.hourly.precipitation_probability[currentIndex - 8];
const probMinus4 = sinopt.hourly.precipitation_probability[currentIndex - 4];
const probPlus4 = sinopt.hourly.precipitation_probability[currentIndex + 4];
// Через 8 часов
const probPlus8 = sinopt.hourly.precipitation_probability[currentIndex + 8];
// Вывод в консоль для проверки:
const dailyDates = sinopt.daily.time; 
const dailyTempMin = sinopt.daily.temperature_2m_min;
const dailyTempMax = sinopt.daily.temperature_2m_max; // Макс. температура
const dailyPrecipProb = sinopt.daily.precipitation_probability_max; // Вероятность осадков в %
const dailyPrecipSum = sinopt.daily.precipitation_sum; // Количество осадков в мм
for (let i = 0; i < 7; i++) {
            const currentCell = cells[i];
             if (currentCell) {
                const weatherInfoDiv = currentCell.querySelector('.weather-info');
                if (weatherInfoDiv) {
                weatherInfoDiv.innerHTML = `
                <p class="tempvlagvcells">🌡️  ${dailyTempMin[i]}°C - ${dailyTempMax[i]}°C</p>
        <p class="tempvlagvcells">☔ ${dailyPrecipProb[i]}% (${dailyPrecipSum[i]} мм)</p>
                `; }
                currentCell.onclick = () => {
                        showHourlyWeather(sinopt, i, BoxsinoptikaDiv);};
              } }if (cells[1]) {
    cells[1].click();
}
//вчера
for (let i = 0 ; i < 24; i++ ){
const timeFormatted = i.toString().padStart(2, '0');
}
//сегодня
for (let i = 24 ; i < 48; i++ ){
    const timeFormatted = (i-24).toString().padStart(2, '0');
}
for (let i = 48 ; i < 72; i++ ){
    const timeFormatted = (i-48).toString().padStart(2, '0');
}
//ещё 4 дня
for (let dayStart = 72; dayStart < 168; dayStart += 24) {
    for (let i = dayStart; i < dayStart + 24; i += 4) {
        const timeFormatted = (i - dayStart).toString().padStart(2, '0');
    }
}
    return sinopt;
       }
       catch(error){
        console.error("Ошибка получения погоды:", error);
            // 3. ЕСЛИ ОШИБКА — убираем лоадер и показываем понятное сообщение
            BoxsinoptikaDiv.innerHTML = `
                <div style="color: #ef4444; text-align: center; padding: 20px;">
                    ⚠️ Не удалось загрузить данные погоды. Проверьте соединение с интернетом.
                </div>
            `;
       }
    }
 input.addEventListener('change', (event) => {
   const rawValue = event.target.value.trim();
 const options = datalist.querySelectorAll('option');
const selectedValue = rawValue ? rawValue[0].toUpperCase() + rawValue.slice(1) : '';
   const matchedOption = Array.from(options).find(
    opt => opt.value.trim().toLowerCase() === selectedValue.trim().toLowerCase()
);
    if (matchedOption) {
        const cityData = {
            name: matchedOption.value,
            latitude: matchedOption.dataset.lat,
            longitude: matchedOption.dataset.lon,
            country: matchedOption.dataset.country
        };
   pokazatelDiv.innerHTML = `
   <div class="pokazsjs">
   <h3 class="Pokazatelgorodavjs">Город ${cityData.name}</h3> <p class="Pokazatelstranuvjs">Страна ${cityData.country}</p>
   </div>`
   ;
    getWeather(matchedOption.dataset.lat, matchedOption.dataset.lon, cells)
}  else {
    }}); 
function showHourlyWeather(sinopt, dayIndex, BoxsinoptikaDiv) {
    const startIndex = dayIndex * 24;
    const endIndex = startIndex + 24;
    let hourlyHtml = '<div class="hourly-forecast-container">';
    for (let i = startIndex; i < endIndex; i++) {
        const timeString = sinopt.hourly.time[i].split('T')[1]; 
        const temp = sinopt.hourly.temperature_2m[i];
        const rainProb = sinopt.hourly.precipitation_probability[i];
        hourlyHtml += `
            <div class="hourly-item" id="hour-${i}">
                <span class="hourly-time">${timeString}</span><br>
                <span class="hourly-temp">🌡️ ${temp}°C</span>
                <span class="hourly-rain">☔ ${rainProb}%</span>
            </div>
        `;
    }
     const exactTime = sinopt.current.time;
     const date = exactTime.slice(0, -6);
     const time = exactTime.slice(-5);
    BoxsinoptikaDiv.innerHTML = hourlyHtml + `</div>
<div class="allblockofboxsinopt">
  <div><h3 class="lineofnow">Текущие данные:</h3></div>
  <div class="bottomlineinboxofsinopt" id="app">
    <div class="curenttem">
      <span class="current cdate">Текущая дата: ${date}</span><br>
      <span class="current ctime">Текущее время: ${time}</span><br>
      <span class="current ctemperature">Температура: ${sinopt.current.temperature_2m}°C</span><br>
      <span class="current cprecip">Вероятность осадков: ${sinopt.current.precipitation_probability}%</span>
    </div>`;
    let bottomlineinboxofsinoptdiv = document.getElementById("app")
    const bbb =
  ` <div class="circles-wrapper" id="twocircless"><div class="circle-container humidity-circle">
      <span class="n">Влажность:</span>
      <svg class="progress-ring" width="160" height="160">
        <circle class="pgrogress-ring__background" stroke="#e6e6e6" stroke-width="12" fill="transparent" r="70" cx="80" cy="80"/>
        <circle class="progress-ring__circle" stroke="#4f46e5" stroke-width="12" fill="transparent" r="70" cx="80" cy="80"/>
      </svg>
      <div class="percentage-text">0%</div>
    </div>
    <div class="circle-container wind-circle">
      <span class="n">Скорость ветра:</span>
      <svg class="progress-ring" width="160" height="160">
        <circle class="progress-ring__background" stroke="#e6e6e6" stroke-width="12" fill="transparent" r="70" cx="80" cy="80"/>
        <circle class="progress-ring__circle" stroke="#10b981" stroke-width="12" fill="transparent" r="70" cx="80" cy="80"/>
      </svg>
      <div class="percentage-text">0 m/s</div>
    </div>
  </div>
</div></div>`;
  bottomlineinboxofsinoptdiv.innerHTML += bbb;
function initProgressCircle(containerSelector, value, maxVal = 100, unit = '%') {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const circle = container.querySelector('.progress-ring__circle');
  const text = container.querySelector('.percentage-text');
  if (circle && text) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    // Нормализуем значение от 0 до maxVal
    const validValue = Math.min(Math.max(value, 0), maxVal);
    const percent = (validValue / maxVal) * 100;
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
    text.textContent = `${Math.round(validValue)}${unit}`;
  }
}
initProgressCircle('.humidity-circle', sinopt.current.relative_humidity_2m, 100, '%');
initProgressCircle('.wind-circle', sinopt.current.wind_speed_10m, 30, ' м/с');
    hourlyHtml += '</div>';
    const currentHour = Number(time.slice(0, 2));
const dl = (dayIndex * 24) + currentHour;
const dd = document.getElementById(`hour-${dl}`);
 const mobileQuery = window.matchMedia('(max-width: 850px)');
if (mobileQuery.matches) {
    if(dd){
   dd.scrollIntoView({
                behavior: 'instant',
                inline: 'center'
            });
     }}
      const bdls = document.querySelectorAll('.cell-wrapper');
 bdls.forEach(card => {
        card.addEventListener('click', () => {
            if (dd) { 
                dd.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                });
            }
        });
    });
}
(async () => {
        const cityData = await getInitialCity();
        if (cityData) {
            pokazatelDiv.innerHTML = `
                <div class="pokazsjs">
                    <h3 class="Pokazatelgorodavjs">Город ${cityData.name}</h3> 
                    <p class="Pokazatelstranuvjs">Страна ${cityData.country || ''}</p>
                </div>`;
            await getWeather(cityData.latitude, cityData.longitude, cells);
        }
    })();
}
        