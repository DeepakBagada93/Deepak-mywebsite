<div class="tool-app tool-app--age" id="age-calculator-app">
    <div class="tool-config-grid">
        <div class="tool-config-card">
            <div class="tool-slider-group">
                <label for="birth-date" class="mono">DATE OF BIRTH</label>
                <input type="date" id="birth-date" class="tool-input mono" value="2000-01-01">
            </div>
            <div class="tool-slider-group">
                <label for="as-of-date" class="mono">AGE AS OF DATE</label>
                <input type="date" id="as-of-date" class="tool-input mono">
            </div>
            <button type="button" class="btn btn--primary" id="btn-calc-age">Calculate Age</button>
        </div>

        <div class="tool-ledger-card">
            <div class="tool-stat-card" style="background: transparent; border: none; padding: 0;">
                <span class="tool-stat-label">YOUR EXACT AGE</span>
                <span class="tool-stat-val" id="res-exact-age" style="font-size: 2.2rem; color: #34d399;">--</span>
            </div>

            <div class="tool-ledger-row">
                <span class="text-muted">Born On</span>
                <span class="mono" id="res-birth-day">--</span>
            </div>
            <div class="tool-ledger-row">
                <span class="text-muted">Next Birthday In</span>
                <span class="mono" id="res-next-bday">--</span>
            </div>
            <div class="tool-ledger-row">
                <span class="text-muted">Zodiac Sign</span>
                <span class="mono" id="res-zodiac">--</span>
            </div>
        </div>
    </div>

    <div class="tool-stats-bar">
        <div class="tool-stat-card">
            <span class="tool-stat-val" id="stat-total-months">0</span>
            <span class="tool-stat-label">Total Months</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-val" id="stat-total-weeks">0</span>
            <span class="tool-stat-label">Total Weeks</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-val" id="stat-total-days">0</span>
            <span class="tool-stat-label">Total Days</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-val" id="stat-total-hours">0</span>
            <span class="tool-stat-label">Total Hours</span>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const birthInput = document.getElementById('birth-date');
    const asOfInput = document.getElementById('as-of-date');
    const btnCalc = document.getElementById('btn-calc-age');

    const resExactAge = document.getElementById('res-exact-age');
    const resBirthDay = document.getElementById('res-birth-day');
    const resNextBday = document.getElementById('res-next-bday');
    const resZodiac = document.getElementById('res-zodiac');

    const statMonths = document.getElementById('stat-total-months');
    const statWeeks = document.getElementById('stat-total-weeks');
    const statDays = document.getElementById('stat-total-days');
    const statHours = document.getElementById('stat-total-hours');

    // Default today's date
    const today = new Date().toISOString().split('T')[0];
    asOfInput.value = today;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function getZodiac(day, month) {
        const zodiacs = [
            { sign: 'Capricorn ♑', d: 20, m: 1 },
            { sign: 'Aquarius ♒', d: 19, m: 2 },
            { sign: 'Pisces ♓', d: 20, m: 3 },
            { sign: 'Aries ♈', d: 20, m: 4 },
            { sign: 'Taurus ♉', d: 21, m: 5 },
            { sign: 'Gemini ♊', d: 21, m: 6 },
            { sign: 'Cancer ♋', d: 23, m: 7 },
            { sign: 'Leo ♌', d: 23, m: 8 },
            { sign: 'Virgo ♍', d: 23, m: 9 },
            { sign: 'Libra ♎', d: 23, m: 10 },
            { sign: 'Scorpio ♏', d: 22, m: 11 },
            { sign: 'Sagittarius ♐', d: 22, m: 12 },
            { sign: 'Capricorn ♑', d: 31, m: 12 }
        ];
        for (const z of zodiacs) {
            if (month < z.m || (month === z.m && day <= z.d)) {
                return z.sign;
            }
        }
        return 'Capricorn ♑';
    }

    function calculate() {
        if (!birthInput.value) return;
        const bdate = new Date(birthInput.value);
        const asOf = asOfInput.value ? new Date(asOfInput.value) : new Date();

        if (bdate > asOf) {
            resExactAge.textContent = 'Invalid Date Range';
            return;
        }

        let years = asOf.getFullYear() - bdate.getFullYear();
        let months = asOf.getMonth() - bdate.getMonth();
        let days = asOf.getDate() - bdate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        resExactAge.textContent = `${years}y ${months}m ${days}d`;
        resBirthDay.textContent = `${daysOfWeek[bdate.getDay()]}, ${bdate.toLocaleDateString()}`;

        // Zodiac
        resZodiac.textContent = getZodiac(bdate.getDate(), bdate.getMonth() + 1);

        // Next Birthday
        let nextBday = new Date(asOf.getFullYear(), bdate.getMonth(), bdate.getDate());
        if (nextBday < asOf) {
            nextBday.setFullYear(asOf.getFullYear() + 1);
        }
        const diffTime = nextBday - asOf;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        resNextBday.textContent = diffDays === 0 ? '🎉 Today is your birthday!' : `${diffDays} days left`;

        // Total durations
        const totalMs = asOf - bdate;
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = (years * 12) + months;
        const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

        statMonths.textContent = totalMonths.toLocaleString();
        statWeeks.textContent = totalWeeks.toLocaleString();
        statDays.textContent = totalDays.toLocaleString();
        statHours.textContent = totalHours.toLocaleString();
    }

    btnCalc.addEventListener('click', calculate);
    birthInput.addEventListener('change', calculate);
    asOfInput.addEventListener('change', calculate);

    calculate();
});
</script>
