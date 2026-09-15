export function days7(datesContainer) {
    const baseDate = new Date();
const cellsArray = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + (i - 1));
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long' });
        const dayDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
         const isToday = i === 1 ? '<span class="today-label">(сегодня)</span>' : '';
        const cell = document.createElement('div');
        cell.className = 'cell-wrapper';
        cell.innerHTML = `
            <div class="cell">
                <div class="dayname">${dayName}</div>
                <div class="daydate">${dayDate}<br><span class="labeltoday">${isToday}</span></div>
                <div class="weather-info"></div>
            </div>
        `;
        cell.addEventListener('click', () => {
            datesContainer.querySelectorAll('.cell-wrapper').forEach(el => {
                el.classList.remove('sos');
            });
            cell.classList.add('sos');
        });
        datesContainer.appendChild(cell);
        cellsArray.push(cell);
    }
    return cellsArray;
}