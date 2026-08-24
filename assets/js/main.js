"use strict";


/* =====================================================
   WORLD CLOCK
===================================================== */

const defaultClocks = [
    {
        city: "Toronto",
        country: "Canada",
        timezone: "America/Toronto"
    },
    {
        city: "Singapore",
        country: "Singapore",
        timezone: "Asia/Singapore"
    },
    {
        city: "Dubai",
        country: "UAE",
        timezone: "Asia/Dubai"
    },
    {
        city: "New York",
        country: "USA",
        timezone: "America/New_York"
    }
];


const availableLocations = [

    {
        city: "Toronto",
        country: "Canada",
        timezone: "America/Toronto"
    },

    {
        city: "Vancouver",
        country: "Canada",
        timezone: "America/Vancouver"
    },

    {
        city: "New York",
        country: "USA",
        timezone: "America/New_York"
    },

    {
        city: "Los Angeles",
        country: "USA",
        timezone: "America/Los_Angeles"
    },

    {
        city: "Chicago",
        country: "USA",
        timezone: "America/Chicago"
    },

    {
        city: "London",
        country: "United Kingdom",
        timezone: "Europe/London"
    },

    {
        city: "Paris",
        country: "France",
        timezone: "Europe/Paris"
    },

    {
        city: "Dubai",
        country: "UAE",
        timezone: "Asia/Dubai"
    },

    {
        city: "Mumbai",
        country: "India",
        timezone: "Asia/Kolkata"
    },

    {
        city: "Singapore",
        country: "Singapore",
        timezone: "Asia/Singapore"
    },

    {
        city: "Tokyo",
        country: "Japan",
        timezone: "Asia/Tokyo"
    },

    {
        city: "Sydney",
        country: "Australia",
        timezone: "Australia/Sydney"
    },

    {
        city: "Melbourne",
        country: "Australia",
        timezone: "Australia/Melbourne"
    },

    {
        city: "Auckland",
        country: "New Zealand",
        timezone: "Pacific/Auckland"
    }

];


let activeClocks = [...defaultClocks];


const clockGrid =
    document.getElementById("clockGrid");


/* =====================================================
   FORMAT TIME
===================================================== */

function getTimeParts(timezone) {

    const now = new Date();

    const formatter =
        new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false
        });


    const parts =
        formatter.formatToParts(now);


    const result = {};

    parts.forEach(part => {

        if (part.type !== "literal") {
            result[part.type] = Number(part.value);
        }

    });


    return {
        hour: result.hour === 24 ? 0 : result.hour,
        minute: result.minute,
        second: result.second
    };
}


/* =====================================================
   CREATE CLOCK
===================================================== */

function createClock(location, index) {

    const card =
        document.createElement("div");

    card.className = "clock-card";

    card.dataset.index = index;


    card.innerHTML = `

        <div class="clock-city">
            ${location.city}
        </div>

        <div class="clock-country">
            ${location.country}
        </div>

        <div class="analog-clock">

            <span class="clock-number n12">12</span>
            <span class="clock-number n3">3</span>
            <span class="clock-number n6">6</span>
            <span class="clock-number n9">9</span>

            <div class="clock-hand hour-hand"></div>

            <div class="clock-hand minute-hand"></div>

            <div class="clock-hand second-hand"></div>

            <div class="clock-center"></div>

        </div>

        <div class="digital-time"></div>

        <div class="clock-date"></div>

    `;


    clockGrid.appendChild(card);

    updateClock(card, location);

}


/* =====================================================
   UPDATE CLOCK
===================================================== */

function updateClock(card, location) {

    const parts =
        getTimeParts(location.timezone);


    const hourAngle =
        ((parts.hour % 12) * 30) +
        (parts.minute * 0.5);


    const minuteAngle =
        parts.minute * 6 +
        parts.second * 0.1;


    const secondAngle =
        parts.second * 6;


    card.querySelector(".hour-hand")
        .style.transform =
        `translateX(-50%) rotate(${hourAngle}deg)`;


    card.querySelector(".minute-hand")
        .style.transform =
        `translateX(-50%) rotate(${minuteAngle}deg)`;


    card.querySelector(".second-hand")
        .style.transform =
        `translateX(-50%) rotate(${secondAngle}deg)`;


    const now = new Date();


    card.querySelector(".digital-time")
        .textContent =
        new Intl.DateTimeFormat("en-US", {
            timeZone: location.timezone,
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).format(now);


    card.querySelector(".clock-date")
        .textContent =
        new Intl.DateTimeFormat("en-US", {
            timeZone: location.timezone,
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(now);

}


/* =====================================================
   RENDER CLOCKS
===================================================== */

function renderClocks() {

    clockGrid.innerHTML = "";

    activeClocks.forEach((location, index) => {

        createClock(location, index);

    });

}


renderClocks();


/* =====================================================
   UPDATE ALL CLOCKS
===================================================== */

function updateAllClocks() {

    const cards =
        document.querySelectorAll(".clock-card");


    cards.forEach((card, index) => {

        const location =
            activeClocks[index];

        if (location) {
            updateClock(card, location);
        }

    });

}


setInterval(updateAllClocks, 1000);


/* =====================================================
   ADD LOCATION
===================================================== */

const addLocationButton =
    document.getElementById("addLocationButton");


addLocationButton.addEventListener(
    "click",
    showLocationModal
);


function showLocationModal() {

    const overlay =
        document.createElement("div");

    overlay.className =
        "location-overlay";


    overlay.innerHTML = `

        <div class="location-modal">

            <h3>
                Choose a location
            </h3>

            <div class="location-list">

                ${availableLocations.map(
                    (location, index) => `

                    <button
                        class="location-option"
                        data-location-index="${index}">

                        ${location.city},
                        ${location.country}

                    </button>

                `).join("")}

            </div>

            <button class="close-modal">
                Close
            </button>

        </div>

    `;


    document.body.appendChild(overlay);


    overlay.querySelectorAll(
        ".location-option"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.locationIndex
                    );


                const location =
                    availableLocations[index];


                /*
                   Keep maximum four clocks.
                   Replace the first clock.
                */

                if (activeClocks.length >= 4) {

                    activeClocks[0] =
                        location;

                } else {

                    activeClocks.push(
                        location
                    );

                }


                renderClocks();

                overlay.remove();

            }
        );

    });


    overlay.querySelector(
        ".close-modal"
    ).addEventListener(
        "click",
        () => overlay.remove()
    );


    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {
                overlay.remove();
            }

        }
    );

}


/* =====================================================
   TIMEZONE CONVERTER
===================================================== */

const fromTimezone =
    document.getElementById(
        "fromTimezone"
    );


const toTimezone =
    document.getElementById(
        "toTimezone"
    );


const conversionDate =
    document.getElementById(
        "conversionDate"
    );


const conversionTime =
    document.getElementById(
        "conversionTime"
    );


const convertButton =
    document.getElementById(
        "convertButton"
    );


const conversionResult =
    document.getElementById(
        "conversionResult"
    );


/* =====================================================
   CURRENT DATE / TIME
===================================================== */

function setCurrentDateTime() {

    const now = new Date();


    conversionDate.value =
        now.toISOString()
            .substring(0, 10);


    conversionTime.value =
        now.toTimeString()
            .substring(0, 5);

}


setCurrentDateTime();


/* =====================================================
   TIMEZONE OFFSET
===================================================== */

function getTimezoneOffset(
    timezone,
    date
) {

    const formatter =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: timezone,

                year: "numeric",
                month: "2-digit",
                day: "2-digit",

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",

                hourCycle: "h23"
            }
        );


    const parts =
        formatter.formatToParts(date);


    const values = {};


    parts.forEach(part => {

        if (part.type !== "literal") {
            values[part.type] =
                Number(part.value);
        }

    });


    const asUTC =
        Date.UTC(
            values.year,
            values.month - 1,
            values.day,
            values.hour,
            values.minute,
            values.second
        );


    return asUTC - date.getTime();

}


/* =====================================================
   CONVERT LOCAL TIME TO UTC
===================================================== */

function localTimeToUTC(
    dateString,
    timeString,
    timezone
) {

    const [
        year,
        month,
        day
    ] =
        dateString
            .split("-")
            .map(Number);


    const [
        hour,
        minute
    ] =
        timeString
            .split(":")
            .map(Number);


    /*
       Initial UTC guess.
    */

    let utc =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                0
            )
        );


    /*
       Apply timezone offset.
    */

    const offset =
        getTimezoneOffset(
            timezone,
            utc
        );


    utc =
        new Date(
            utc.getTime() - offset
        );


    /*
       Second pass handles DST boundaries
       more accurately.
    */

    const correctedOffset =
        getTimezoneOffset(
            timezone,
            utc
        );


    if (correctedOffset !== offset) {

        utc =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day,
                    hour,
                    minute,
                    0
                )
                - correctedOffset
            );

    }


    return utc;

}


/* =====================================================
   CONVERT TIME
===================================================== */

function convertTime() {

    if (
        !conversionDate.value ||
        !conversionTime.value
    ) {

        conversionResult.innerHTML =
            "Please select a date and time.";

        return;

    }


    const utcDate =
        localTimeToUTC(
            conversionDate.value,
            conversionTime.value,
            fromTimezone.value
        );


    const formatter =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    toTimezone.value,

                weekday: "long",

                month: "long",

                day: "numeric",

                year: "numeric",

                hour: "numeric",

                minute: "2-digit",

                hour12: true
            }
        );


    const result =
        formatter.format(utcDate);


    conversionResult.innerHTML = `

        <div>

            <strong>
                ${result}
            </strong>

            <span>
                Converted time
            </span>

        </div>

    `;

}


convertButton.addEventListener(
    "click",
    convertTime
);


/* =====================================================
   POPULAR CONVERSION BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".conversion-buttons button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                fromTimezone.value =
                    button.dataset.from;

                toTimezone.value =
                    button.dataset.to;


                convertTime();

            }
        );

    });


/* =====================================================
   SEARCH
===================================================== */

const tools = [

    {
        name: "Age Calculator",
        url: "tools/age-calculator/index.html"
    },

    {
        name: "Percentage Calculator",
        url: "tools/percentage-calculator/index.html"
    },

    {
        name: "BMI Calculator",
        url: "tools/bmi-calculator/index.html"
    },

    {
        name: "Date Calculator",
        url: "tools/date-calculator/index.html"
    },

    {
        name: "Time Zone Converter",
        url: "tools/time-zone-converter/index.html"
    },

     {
        name: "IST to EST",
        url: "tools/IST_EST/index.html"
    }

];


const searchInput =
    document.getElementById(
        "toolSearch"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


function performSearch() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    searchResults.innerHTML = "";


    if (!query) {
        return;
    }


    const matches =
        tools.filter(tool =>
            tool.name
                .toLowerCase()
                .includes(query)
        );


    if (matches.length === 0) {

        searchResults.innerHTML = `
            <div class="search-result-item">
                No matching tool found.
            </div>
        `;

        return;
    }


    matches.forEach(tool => {

        const link =
            document.createElement("a");

        link.href = tool.url;

        link.className =
            "search-result-item";

        link.textContent =
            tool.name;

        searchResults.appendChild(link);

    });

}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            performSearch();
        }

    }
);