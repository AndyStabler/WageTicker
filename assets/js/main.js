/**
 * Created by andy on 25/05/15.
 */

$(window).resize(function () {
    // Resizing the window causes the background colour on details panel
    // to disappear/flicker. Hiding then showing forces a repaint, which solves the issue. Weird...
    $('html').hide().show(0);
});

// highlight input boxes when they're selected - user most likely wants to change the original values
$('input').on("click", function () {
    $(this).select();
});

// when the currencies div is clicked, toggle the available currencies div
$('#currencies').on('click', function () {
    $('#available-currencies').toggle();
});

$('#available-currencies').children().on('click', function (e) {
    "use strict";
    $('#selected-currency').text($(e.target).text());
    update(ticker);
});

$('#details-toggle').on('click', function (e) {
    "use strict";
    var details = $('#details-panel');
    var detailsToggle = $('#details-toggle');
    if (details.is(':visible')) {
        details.hide();
        detailsToggle.css('left', '0');
        detailsToggle.removeClass('details-toggle-max');
        document.body.style.backgroundColor = 'white';
    } else {
        details.show();
        detailsToggle.addClass('details-toggle-max');
    }
});

// when we click anywhere on the document, and the available currencies div is visible, hide it.
$(document).on('click', function (e) {
    var availableCurs = $("#available-currencies");
    if (availableCurs.is(":visible") && $(e.target).closest("#currencies").length <= 0)
        availableCurs.hide();
});

var currency = $('#selected-currency');
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

//update the total every second
setInterval(function () {
    update(ticker);
}, 1000);

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

function formatTime(inputElement) {
    "use strict";
    if (/^\d+$/.test(inputElement.val()))
        inputElement.val(inputElement.val() + ":00");
}