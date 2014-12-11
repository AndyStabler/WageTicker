/**
 * Created by Andy Stabler on 10/12/14.
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

Ticker.prototype.rateValue = function(){
    "use strict";
    var rateVal = removeCurrency(this.rate.value);
    return isNaN(rateVal) ? 0.00 : +rateVal;
};
Ticker.prototype.startTime = function(){
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.start.value)[0], splitOnColon(this.start.value)[1]);
};
Ticker.prototype.lunchStartTime = function(){
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.lunchStart.value)[0], splitOnColon(this.lunchStart.value)[1]);
};
Ticker.prototype.lunchEndTime= function(){
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.lunchEnd.value)[0], splitOnColon(this.lunchEnd.value)[1]);
};
Ticker.prototype.endTime = function(){
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), splitOnColon(this.end.value)[0], splitOnColon(this.end.value)[1]);
};

Ticker.prototype.isMorning = function (now) {
    "use strict";
    if (!this.startTime().isValid() || !this.lunchStartTime().isValid()) return false;

    var st = this.startTime();
    var lst = this.lunchStartTime();

    return this.startTime() < now && now < this.lunchStartTime();
   // return (this.start < now && now < this.lunchStart);
};

Ticker.prototype.isAfternoon = function (now) {
    "use strict";
    //var lunchEndTime = new Date(this.lunchEnd.value);
   // var endTime= new Date(this.lunchEnd.value);

    if (!this.lunchEndTime().isValid() || !this.endTime().isValid()) return false;

    var et = this.endTime();
    var leti = this.lunchEndTime();

    var lbn = this.lunchEndTime() < now;
    var nbe = now < this.endTime;
    return this.lunchEndTime() < now && now < this.endTime();
    //return (this.lunchEnd < now && now < this.end);
};

/**
 * returns the current total earned for the morning. If current time is morning, returns the total earned for the morning
 * so far.
 */
Ticker.prototype.morningTotal = function (now) {
    "use strict";
    if (!this.startTime().isValid() ||
        !this.lunchStartTime().isValid()) return this.total;

    if (now < this.startTime()) return 0;
    if (now >= this.lunchStartTime()) return (this.lunchStartTime() - this.startTime()) * this.msRate();

    return (this.total = (now - this.startTime()) * this.msRate());

    //if (now < this.start) return 0;
    //// Morning's over
    //if (now >= this.lunchStart) return (this.lunchStart - this.start) * this.msRate();
    //
    //return (this.total = (now - this.start) * this.msRate());
    //
    //// Day hasn't started yet - easy tiger.
    //if (now < this.start) return 0;
    //// Morning's over
    //if (now >= this.lunchStart) return (this.lunchStart - this.start) * this.msRate();
    //
    //return this.total = (now - this.start) * this.msRate();
};

/**
 * Returns the total earned for the afternoon. If current time is afternoon, returns the total earned for the afternoon
 * so far
 */
Ticker.prototype.afternoonTotal = function (now) {
    "use strict";
    if (!this.lunchEndTime().isValid() ||
        !this.endTime().isValid()) return this.total;

    if (now < this.lunchEndTime()) return 0;
    if (now >= this.endTime()) return (this.endTime() - this.lunchEnd) * this.msRate();

    return (now - this.lunchEndTime()) * this.msRate();
    //// Afternoon hasn't started yet
    //if (now < this.lunchEnd) return 0;
    //// Day's over - enjoy your hard earned money
    //if (now >= this.end) return (this.end - this.lunchEnd) * this.msRate();
    //// Afternoon in progress
    //return (now - this.lunchEnd) * this.msRate();
};

Ticker.prototype.msRate = function(){return this.rateValue() / 60.0 / 60.0 / 1000.0};

Ticker.prototype.tick = function(){
    "use strict";
    var now = new Date();
    // not earning atm - return current total
    if (!this.isMorning(now) && !this.isAfternoon(now)) return this.total;

    //var morningTotal = this.morningTotal(now);
    if (this.isMorning(now))
        return this.morningTotal(now);
    return this.morningTotal(now) + this.afternoonTotal(now);
};

function removeCurrency(cur)
{
    "use strict";
    return cur.replace(/[£$€,]+/g,"");
}

function splitOnColon(inStr)
{
    "use strict";
    var re = (inStr + '').split(":");
    return re;//inStr.split(":");
}


/**
 * <a href="http://stackoverflow.com/a/12372720/3380056">SO Link</a>
 */
Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};

$(document).ready ( function() {
    "use strict"
    $('#start-time').timepicker();
    $('#lunch-start-time').timepicker();
    $('#lunch-end-time').timepicker();
    $('#end-time').timepicker();

    //var x = setInterval(function(){alert(Date.now());}, 1000);
    var rate = document.getElementById("hourly-rate");//10.00;
    //var now = new Date();
    var startTime = document.getElementById("start-time");//new Date(now.getFullYear(), 11, 11, 9);
    var lunchStart = document.getElementById("lunch-start-time");//new Date(now.getFullYear(), 11, 11, 12);
    var lunchEnd = document.getElementById("lunch-end-time");//new Date(now.getFullYear(), 11, 11, 12, 30);
    var endTime = document.getElementById("end-time");//new Date(now.getFullYear(), 11, 11, 17);
    var ticker = new Ticker(rate, startTime, lunchStart, lunchEnd, endTime);

    // update the total every second
    setInterval(function(){
        document.getElementById("money-count").innerText = "£" + parseFloat(ticker.tick()).toFixed(2);
    }, 1000);
})