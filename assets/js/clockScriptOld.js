/**
 * Created by andy on 19/11/14.
 */

//var startTime = document.getElementById("startTime");
var lunchStartTime = document.getElementById(lunchStartTime);
var lunchEndTime = document.getElementById(lunchEndTime);
var endTime = document.getElementById(endTime);
var rate = document.getElementById(rate);
//var ratepsec = 0.00277777777;// = rate.innerText
//var ratepsec = 0.27
var ratepsec = 0.00105277777;
var minWage = 0.00105277777;
var date = new Date();
var mhVal;


var total = document.getElementById("money-count");

setInterval(function(){
    var startTime = gid("start-time").value.split(":");
    //alert("raw: " + startTime + ", st = " + startTime[0] + "," + startTime[1]);
    alert("startTime: " + new Date(0, 0, 0, startTime[0], startTime[1], 0, 0));
    var before = new Date(startTime);
    startTime.innerText = "12:30";
    alert("before: " + before + " after: " + new Date(startTime));

    updateTicker();
}, 1000);

function updateTicker()
{
    "use strict";
    total.innerHTML = tick();//update();
//    moneyCount.value = "5";
}

function update()
{
    "use strict";
    // check current time falls within (start and start lunch), and (end lunch and end)

    // Convert the user's text to a Date object
    var userDate = new Date(gid("startTime"));

    if(isNaN(userDate.valueOf()))
    {
        // User entered invalid date
        alert("Invalid date");
        return;
    }
    return format(parseFloat(removeCurrency(total.innerText)));
}

function format(amount)
{
    "use strict";
    if (!(typeof amount === "number"))
        return -1;

    var result = (+amount + ratepsec);

    alert("amount: " + +amount + " ratepsec: " + +ratepsec + " result: " + +result
        + "\n type of everything\namount: " + typeof amount + " ratepsec: " + typeof ratepsec + " result: " + typeof result);
    if (ratepsec <= minWage) return toCurrency(result.toFixed(2));

    // start counting the smaller values
    result = result.toFixed(5);

    //ratepsec <= minWage ? 5 : 2);
    var index = result.indexOf(".");

//    if (index === -1) return result;

    index = index + 2;
    //return "<mark class=\"overflowText\">" + result + "</mark>";
    if (index >= result.length) return result;

    alert("result: " + result + "\ngraying out from index: " + (index + 1) + " to " + (result.length - 1) + "\nwhich is: "
        + result.substring(index+1) +
    "\nwhere final result: " + result);

    return toCurrency(
            result.substring(0, index + 1)
            + "<mark class=\"overflowText\">"
            + result.substring(index+1)
            + "</mark></p>");

    //return "£" + (amount + ratepsec).toFixed(2);
}

function tick()
{
    "use strict";
    var now = new Date();

    if (isMorning(now))
        return toCurrency(morningTotal(now));
    if (isAfternoon(now))
        return toCurrency(morningTotal(startTime) + afternoonTotal(now));
    return "I DON'T KNOWW";
    /*
        if isMorning()
            total = morningTotal(now)
        else isAfternoon()
            total = morningTotal(startTime) + afternoonTotal(now)
     */
    // return '£' +
    // if morning
    // set total to now -
}

function isMorning(now)
{
    "use strict";
    //var now = new Date();
    //var comparer = new Date();

    return (startTime.getTime() < now.getTime() && now.getTime() < lunchStartTime)
   // return true;
}

function isAfternoon(now)
{
    "use strict";
//    var now = new Date();
    return (lunchEndTime.getTime() < now.getTime && now.getTime() < endTime);
}

function morningTotal(now)
{
    "use strict";
    return (lunchStartTime - (now < lunchStartTime ? now : startTime)) / 60 * rate;
}

function afternoonTotal(now)
{
    "use strict";
    return (endTime - (now > lunchEndTime ? now : lunchEndTime)) / 60 * rate;
}

function toCurrency(amount)
{
    "use strict";
    // do some locale stuff here
    return "£" + amount;
}

function formatCurrency(amount)
{
    "use strict";

    alert("amount is: " + amount);
    return;
    var integerPart = Math.floor(amount).toString().split('');

    var fractionalPart = (amount % 1) * 100;
    //var fractionalPart = (Math.round((amount%1)*100)/100).toString().split('.')[1];

    alert("integer part" + integerPart + "\\t fractional part: " + fractionalPart);
    if(typeof fractionalPart == 'undefined'){
        fractionalPart = '00';
    }else if(fractionalPart.length == 1){
        fractionalPart = fractionalPart + '0';
    }

    var str = '';

    for(var i = integerPart.length - 1; i >= 0; i--){
        str += integerPart.splice(0,1);
        if(i%3 == 0 && i != 0) str += ',';
    }
    return '£' + str + '.' + fractionalPart;
}

function validateValues()
{
    "use strict";
    return true;
}

function removeCurrency(cur)
{
    "use strict";
    return cur.replace(/[£,]+/g,"");
}

function gid(id)
{
    "use strict";
    return document.getElementById(id);
}
