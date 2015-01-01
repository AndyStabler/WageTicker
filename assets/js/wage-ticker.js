/**
 * Calculates the total earned for the day, based on current time and hours worked.
 *
 * @param rate element containing the hourly rate
 * @param start element containing the start time
 * @param lunchStart element containing the lunch start time
 * @param lunchEnd element containing the lunch end time
 * @param end element containing the end time
 * @constructor
 */
function Ticker(rate, start, lunchStart, lunchEnd, end) {
    "use strict";
    this.rate = rate;
    this.start = start;
    this.lunchStart = lunchStart;
    this.lunchEnd = lunchEnd;
    this.end = end;
    this.total = 0.00;
}

Ticker.prototype.getRateValue = function () {
    "use strict";
    // user might have put some currency character in the rate string
    var rateVal = removeCurrency(this.rate.val());
    return isNaN(rateVal) ? 0.00 : +rateVal;
};
Ticker.prototype.getStartTime = function () {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.start.val())[0], splitOnColon(this.start.val())[1]);
};
Ticker.prototype.getLunchStartTime = function () {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.lunchStart.val())[0], splitOnColon(this.lunchStart.val())[1]);
};
Ticker.prototype.getLunchEndTime = function () {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.lunchEnd.val())[0], splitOnColon(this.lunchEnd.val())[1]);
};
Ticker.prototype.getEndTime = function () {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.end.val())[0], splitOnColon(this.end.val())[1]);
};

Ticker.prototype.isMorning = function (now) {
    "use strict";
    if (!this.getStartTime().isValid() || !this.getLunchStartTime().isValid() || !this.checkTimes()) return false;

    return this.getStartTime() <= now && now < this.getLunchStartTime();
};

Ticker.prototype.isAfternoon = function (now) {
    "use strict";
    if (!this.getLunchEndTime().isValid() || !this.getEndTime().isValid() || !this.checkTimes()) return false;

    return this.getLunchEndTime() <= now && now < this.getEndTime();
};

/**
 * Returns the current total earned for the morning. If current time is morning, returns the total earned for the morning
 * so far.
 */
Ticker.prototype.getMorningTotal = function (now) {
    "use strict";
    // validation - if any times needed are invalid return the previous total
    if (!this.getStartTime().isValid() || !this.getLunchStartTime().isValid() || !this.checkTimes()) return this.total;

    // current time before start time - no money's been earned
    if (now < this.getStartTime()) return 0;
    // morning's over, return morning total - difference between lunch start and start time multiplied by the rate
    if (now >= this.getLunchStartTime()) return (this.getLunchStartTime() - this.getStartTime()) * this.msRate();
    // morning is in progress
    return (now - this.getStartTime()) * this.msRate();
};

/**
 * Returns the total earned for the afternoon. If current time is afternoon, returns the total earned for the afternoon
 * so far
 */
Ticker.prototype.afternoonTotal = function (now) {
    "use strict";
    // validation - if any times needed are invalid return the previous total
    if (!this.getLunchEndTime().isValid() || !this.getEndTime().isValid() || !this.checkTimes()) return this.total;

    // current time before afternoon start time - no money earned for afternoon
    if (now < this.getLunchEndTime()) return 0;
    // day's over - return the difference between the end time and lunch end multiplied by rate
    if (now >= this.getEndTime()) return (this.getEndTime() - this.getLunchEndTime) * this.msRate();
    // afternoon is in progress
    return (now - this.getLunchEndTime()) * this.msRate();
};

/**
 * Calculates the ms rate based on the hourly rate
 * @returns {number}
 */
Ticker.prototype.msRate = function () {
    return this.getRateValue() / 60.0 / 60.0 / 1000.0
};


/**
 * Validates times make sense - i.e. start time before end time
 * @returns {boolean}
 */
Ticker.prototype.checkTimes = function () {
    "use strict";
    // lunch time is optional
    return this.getStartTime() < this.getLunchStartTime() &&
        this.getLunchStartTime() <= this.getLunchEndTime() &&
        this.getLunchEndTime() < this.getEndTime();
};

/**
 * Calculates the current total earned based on the rate and current time
 * @returns {number} total earned so far
 */
Ticker.prototype.tick = function () {
    "use strict";
    var now = new Date();
    // before work
    if (now < this.getStartTime()) return 0.00;
    // after work
    if (now >= this.getEndTime())
        return this.total = (
        (this.getLunchStartTime() - this.getStartTime())
        +
        (this.getEndTime() - this.getLunchEndTime()))
        * this.msRate();
    // on lunch
    if (!this.isMorning(now) && !this.isAfternoon(now))
        return this.total = (this.getLunchStartTime() - this.getStartTime()) * this.msRate();

    // is morning - return current total
    if (this.isMorning(now)) return this.total = this.getMorningTotal(now);
    // is afternoon - return current total
    return this.total = this.getMorningTotal(now) + this.afternoonTotal(now);
};


/**
 * Removes the currency symbols and commas from a string
 * @param cur string which may have the unwanted characters
 * @returns {XML|string|void} new string that doesn't have unwanted characters
 */
function removeCurrency(cur) {
    "use strict";
    return cur.replace(/[£$€,]+/g, "");
}

/**
 * Splits string into array based on a colon - used when extracting hours and minutes from time string
 * @param inStr
 * @returns {Array}
 */
function splitOnColon(inStr) {
    "use strict";
    return (inStr + '').split(":");
}

/**
 * Checks if a date object is valid by doing an isNan check on the object's time
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
};

function formatTime(inputElement) {
    "use strict";
    if (/^\d+$/.test(inputElement.val()))
        inputElement.val(inputElement.val() + ":00");
}

$(document).ready(function () {
    "use strict"
    // highlight input boxes when they're selected - user most likely wants to change the original values
    $('input[type=text], input[type=number]').on("click", function () {
        $(this).select();
    });

    var hourlyRate = $('#hourly-rate');
    var startTime = $('#start-time');
    var lunchStart = $('#lunch-start-time');
    var lunchEnd = $('#lunch-end-time');
    var endTime = $('#end-time');

    startTime.timepicker().blur(function () {
        formatTime($(this))
    });
    lunchStart.timepicker().blur(function () {
        formatTime($(this))
    });
    lunchEnd.timepicker().blur(function () {
        formatTime($(this))
    });
    endTime.timepicker().blur(function () {
        formatTime($(this))
    });

    var ticker = new Ticker(hourlyRate, startTime, lunchStart, lunchEnd, endTime);

    // update the total every second
    setInterval(function () {
        if (!ticker.checkTimes() || ticker.getRateValue() <= 0.00)
            $("#money-count").removeClass("money-count-valid").addClass("money-count-invalid").text("£0.00");
        else
            $("#money-count").removeClass("money-count-invalid").addClass("money-count-valid").text("£" + parseFloat(ticker.tick()).toFixed(2));
    }, 1000);
});