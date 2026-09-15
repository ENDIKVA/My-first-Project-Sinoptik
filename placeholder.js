function updatePlaceholder() {
  const input = document.getElementById('city-input');
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width < 500 &&  height < 1000) {
    input.placeholder = "Введите город:";
  } else if (width < 1) {
    input.placeholder = "Введите имя";
  } else {
    input.placeholder = "Например, Аланья ";
  }
}
// Запускаем при загрузке страницы и при изменении размера окна
window.addEventListener('resize', updatePlaceholder);
window.addEventListener('DOMContentLoaded', updatePlaceholder);