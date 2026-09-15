export async function getInitialCity() {
    const savedCity = localStorage.getItem('lastCity') || 'Киев';
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(savedCity)}&language=ru&count=1`);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0]; 
        }
    } catch (error) {
        console.error("Ошибка при автозагрузке города:", error);
    }
    return null;
}
  export async function poiskgoroda (input,datalist, timeoutId){
    input.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    clearTimeout(timeoutId);
    if (query.length < 2) {
        datalist.innerHTML = '';
        return;
    }
    timeoutId = setTimeout(async () => {
       try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&language=ru&count=5`);
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
            const data = await response.json();
            datalist.innerHTML = '';
            if (data.results) {
                data.results.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.name; 
                    option.dataset.lat = city.latitude;
                    option.dataset.lon = city.longitude;
                    option.dataset.country = city.country || '';
                    datalist.appendChild(option);
                   localStorage.setItem('lastCity', query);
                });
            }
        } catch (error) {
            console.error('Ошибка при поиске городов:', error);
        }
    }, 500);
});
}
