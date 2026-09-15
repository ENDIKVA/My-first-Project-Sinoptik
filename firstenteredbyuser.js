export function firstentered() {
const savedCity = localStorage.getItem('lastCity');
  if (savedCity) {
  } else {
    const defaultCity = 'Киев'; 
    localStorage.setItem('lastCity', defaultCity);
}}
