/**
 * Created by andy on 25/05/15.
 */

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

    var currency = $('#select-currency');
    var hourlyRate = $('#hourly-rate');
    var startTime = $('#start-time');
    var lunchStart = $('#lunch-start-time');
    var lunchEnd = $('#lunch-end-time');
    var endTime = $('#end-time');

    currency.change(function () {
        update(ticker)
    });
    hourlyRate.keyup(function () {
        update(ticker)
    });
    startTime.timepicker().blur(function () {
        formatTime($(this));
        update(ticker);
    });
    lunchStart.timepicker().blur(function () {
        formatTime($(this));
        update(ticker);
    });
    lunchEnd.timepicker().blur(function () {
        formatTime($(this));
        update(ticker);
    });
    endTime.timepicker().blur(function () {
        formatTime($(this));
        update(ticker);
    });

    var ticker = new Ticker(currency, hourlyRate, startTime, lunchStart, lunchEnd, endTime);

    // update the total every second
    setInterval(function () {
        update(ticker);
    }, 1000);
});

function update(ticker) {
    "use strict";
    if (!ticker.checkTimes() || ticker.getRateValue() <= 0.00) {
        ticker.total = 0;
        $("#money-count")
            .removeClass("money-count-valid")
            .addClass("money-count-invalid")
            .text(ticker.formatTotal());
    }
    else {
        ticker.tick();
        $("#money-count")
            .removeClass("money-count-invalid")
            .addClass("money-count-valid")
            .text(ticker.formatTotal());
    }
}