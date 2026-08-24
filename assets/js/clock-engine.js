function initClockEngine(defaultLeftTz = "Asia/Kolkata", defaultRightTz = "America/Los_Angeles") {
    const selectLeft = document.getElementById("tzLeft");
    const selectRight = document.getElementById("tzRight");

    if (selectLeft && defaultLeftTz) selectLeft.value = defaultLeftTz;
    if (selectRight && defaultRightTz) selectRight.value = defaultRightTz;

    function getTimeData(tz) {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        }).format(now);

        const tzName = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
            .formatToParts(now).find(p => p.type === 'timeZoneName').value;

        const dayStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(now).toUpperCase();
        const dateStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(now);

        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
        }).formatToParts(now);

        const hours = parseInt(parts.find(p => p.type === 'hour').value, 10);
        const minutes = parseInt(parts.find(p => p.type === 'minute').value, 10);
        const seconds = parseInt(parts.find(p => p.type === 'second').value, 10);
        const isoDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now);

        return { timeStr, tzName, dayStr, dateStr, hours, minutes, seconds, isoDate };
    }

    function renderClock(prefix, data) {
        if (document.getElementById(`${prefix}Day`)) document.getElementById(`${prefix}Day`).innerText = data.dayStr;
        if (document.getElementById(`${prefix}Date`)) document.getElementById(`${prefix}Date`).innerText = data.dateStr;
        if (document.getElementById(`${prefix}Digital`)) document.getElementById(`${prefix}Digital`).innerText = data.timeStr;
        if (document.getElementById(`${prefix}Badge`)) document.getElementById(`${prefix}Badge`).innerText = data.tzName;

        // Rotate Analog Hands
        const secDeg = (data.seconds / 60) * 360;
        const minDeg = ((data.minutes + data.seconds / 60) / 60) * 360;
        const hourDeg = (((data.hours % 12) + data.minutes / 60) / 12) * 360;

        const secHand = document.getElementById(`${prefix}SecHand`);
        const minHand = document.getElementById(`${prefix}MinHand`);
        const hourHand = document.getElementById(`${prefix}HourHand`);

        if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
        if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
        if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
    }

    function update() {
        const leftTz = selectLeft ? selectLeft.value : defaultLeftTz;
        const rightTz = selectRight ? selectRight.value : defaultRightTz;

        const left = getTimeData(leftTz);
        const right = getTimeData(rightTz);

        renderClock('left', left);
        renderClock('right', right);

        const badge = document.getElementById('diffBadge');
        if (badge) {
            const leftMins = (left.hours * 60) + left.minutes;
            const rightMins = (right.hours * 60) + right.minutes;
            const dayDiff = Math.round((new Date(right.isoDate) - new Date(left.isoDate)) / (1000 * 60 * 60 * 24));

            let diffMins = (rightMins - leftMins) + (dayDiff * 1440);
            const absMins = Math.abs(diffMins);
            const hDiff = Math.floor(absMins / 60);
            const mDiff = absMins % 60;

            let gapText = "";
            if (hDiff > 0) gapText += `${hDiff}h `;
            if (mDiff > 0) gapText += `${mDiff}m `;
            if (diffMins === 0) gapText = "Same Time";
            else gapText += diffMins > 0 ? "Ahead" : "Behind";

            badge.innerText = gapText;
        }
    }

    setInterval(update, 1000);
    update();

    if (selectLeft) selectLeft.addEventListener("change", update);
    if (selectRight) selectRight.addEventListener("change", update);
}