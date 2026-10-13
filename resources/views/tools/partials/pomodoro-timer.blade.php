<div class="tool-app tool-app--pomodoro" id="pomodoro-app" style="text-align:center;">
    <div class="tool-controls-row" style="justify-content:center;">
        <button type="button" class="pill-btn pill-btn--sm is-active" data-min="25">Focus 25</button>
        <button type="button" class="pill-btn pill-btn--sm" data-min="5">Break 5</button>
        <button type="button" class="pill-btn pill-btn--sm" data-min="15">Long 15</button>
        <button type="button" class="pill-btn pill-btn--sm" data-min="50">Deep 50</button>
    </div>
    <div class="mono" id="pomo-time" style="font-size:4.5rem;font-weight:700;letter-spacing:-0.02em;margin:20px 0 4px;">25:00</div>
    <p class="mono text-muted" id="pomo-label" style="font-size:0.85rem;">Ready — press Start</p>
    <div class="tool-actions" style="justify-content:center;margin-top:16px;">
        <button type="button" class="btn btn--solid" id="pomo-toggle">Start →</button>
        <button type="button" class="btn btn--outline" id="pomo-reset">Reset</button>
    </div>
    <p class="mono text-muted" style="font-size:0.8rem;margin-top:16px;">Completed sessions: <strong id="pomo-sessions">0</strong></p>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const timeEl = document.getElementById('pomo-time');
    const label = document.getElementById('pomo-label');
    const toggle = document.getElementById('pomo-toggle');
    const resetBtn = document.getElementById('pomo-reset');
    const sessionsEl = document.getElementById('pomo-sessions');
    const presets = document.querySelectorAll('#pomodoro-app [data-min]');
    let total = 25 * 60, left = total, timer = null, sessions = 0;
    function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    function paint() { timeEl.textContent = fmt(left); document.title = fmt(left) + ' · Pomodoro'; }
    function beep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 880; o.type = 'sine';
            g.gain.setValueAtTime(0.001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            o.start(); o.stop(ctx.currentTime + 0.65);
        } catch {}
    }
    function stop(silent) {
        clearInterval(timer); timer = null;
        toggle.textContent = 'Start →';
        if (!silent) label.textContent = 'Paused at ' + fmt(left);
    }
    toggle.addEventListener('click', () => {
        if (timer) { stop(); return; }
        if (left <= 0) left = total;
        label.textContent = 'Focusing — stay with it';
        toggle.textContent = 'Pause';
        timer = setInterval(() => {
            left--;
            paint();
            if (left <= 0) {
                stop(true);
                sessions++; sessionsEl.textContent = String(sessions);
                label.textContent = 'Done — take a breath. Sessions: ' + sessions;
                toggle.textContent = 'Start Again →';
                beep();
            }
        }, 1000);
    });
    resetBtn.addEventListener('click', () => { stop(true); left = total; paint(); label.textContent = 'Ready — press Start'; });
    presets.forEach(p => p.addEventListener('click', () => {
        presets.forEach(q => q.classList.remove('is-active'));
        p.classList.add('is-active');
        stop(true);
        total = parseInt(p.dataset.min, 10) * 60; left = total;
        paint(); label.textContent = 'Ready — ' + p.dataset.min + ' min session';
    }));
    paint();
});
</script>
