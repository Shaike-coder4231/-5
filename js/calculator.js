// Получаем элементы
        const basePriceInput = document.getElementById('basePrice');
        const durationInput = document.getElementById('duration');
        const sessionsInput = document.getElementById('sessions');
        const tariffSelect = document.getElementById('tariff');
        const totalPriceElement = document.getElementById('totalPrice');
        const calculationDetailsElement = document.getElementById('calculationDetails');

        // Функция форматирования числа с пробелами (1 000 000)
        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }

        // Основная функция расчета
        function calculateTotal() {
            // Получаем значения
            const basePrice = parseFloat(basePriceInput.value) || 0;
            const duration = parseFloat(durationInput.value) || 0;
            const sessions = parseFloat(sessionsInput.value) || 0;
            const tariff = parseFloat(tariffSelect.value) || 1;

            // Рассчитываем
            const pricePerSession = basePrice * duration;
            const totalWithoutTariff = pricePerSession * sessions;
            const totalWithTariff = totalWithoutTariff * tariff;

            // Определяем название тарифа
            let tariffName = '';
            switch(tariff) {
                case 1.0: tariffName = 'Выгодный'; break;
                case 1.2: tariffName = 'Комфортный'; break;
                case 1.5: tariffName = 'Усиленный'; break;
            }

            // Обновляем итоговую сумму с анимацией
            animateValue(totalPriceElement, parseInt(totalPriceElement.textContent.replace(/\s/g, '')), Math.round(totalWithTariff), 300);

            // Обновляем детали расчета
            calculationDetailsElement.innerHTML = `
                <div class="detail-row">
                    <span>Цена за минуту:</span>
                    <span>${formatNumber(basePrice)} ₽</span>
                </div>
                <div class="detail-row">
                    <span>Продолжительность:</span>
                    <span>${duration} мин</span>
                </div>
                <div class="detail-row">
                    <span>Стоимость занятия:</span>
                    <span>${formatNumber(pricePerSession)} ₽</span>
                </div>
                <div class="detail-row">
                    <span>Количество занятий:</span>
                    <span>× ${sessions}</span>
                </div>
                <div class="detail-row">
                    <span>Без тарифа:</span>
                    <span>${formatNumber(totalWithoutTariff)} ₽</span>
                </div>
                <div class="detail-row">
                    <span>Тариф "${tariffName}":</span>
                    <span>×${tariff}</span>
                </div>
                <div class="detail-row total">
                    <span>ИТОГО:</span>
                    <span>${formatNumber(Math.round(totalWithTariff))} ₽</span>
                </div>
            `;
        }

        // Функция анимации числа
        function animateValue(element, start, end, duration) {
            const range = end - start;
            const minTimer = 50;
            let stepTime = Math.abs(Math.floor(duration / (range / 100)));
            stepTime = Math.max(stepTime, minTimer);
            
            let startTime = new Date().getTime();
            let endTime = startTime + duration;
            let timer;
            
            function run() {
                let now = new Date().getTime();
                let remaining = Math.max((endTime - now) / duration, 0);
                let value = Math.round(end - (remaining * range));
                element.innerHTML = formatNumber(value) + '<span class="result-currency">₽</span>';
                if (value == end) {
                    clearInterval(timer);
                }
            }
            
            timer = setInterval(run, stepTime);
            run();
        }

        // Добавляем слушатели событий на все поля
        basePriceInput.addEventListener('input', calculateTotal);
        durationInput.addEventListener('input', calculateTotal);
        sessionsInput.addEventListener('input', calculateTotal);
        tariffSelect.addEventListener('change', calculateTotal);

        // Первоначальный расчет при загрузке
        calculateTotal();

